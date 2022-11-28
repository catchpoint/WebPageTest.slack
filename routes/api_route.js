const express = require("express");
const router = express.Router();
const { WebClient } = require("@slack/web-api");
const WebPageTest = require("webpagetest");
const wptHelpers = require("../utils/wptHelpers");
const slackHelpers = require("../utils/slackHelpers");

require("dotenv").config();

const token = process.env.SLACK_TOKEN; // Your Slack Token
const wpt = new WebPageTest("www.webpagetest.org", process.env.WPT_API_KEY); // Your WPT API Key

let options = {
  firstViewOnly: true,
  runs: 1,
  location: "ec2-us-east-1:Chrome",
  connectivity: "4G",
  pollResults: 5,
  timeout: 240,
};

// Initialize
const web = new WebClient(token);
router.post("/slack/webpagetest", async (req, res) => {
  const { trigger_id, channel_id, text } = req.body;
  res.status(200).send("");
  const locationsResult = await wptHelpers.getLocations(wpt, options);
  const allLocations = locationsResult.result.response.data.location;
  await web.views.open({
    trigger_id: trigger_id,
    channel_id: channel_id,
    view: slackHelpers.dialogView(allLocations, text, channel_id),
  });
});

router.post("/slack/interactions", async (req, res) => {
  let payload;
  try {
    res.status(200).send("");
    payload = JSON.parse(req.body.payload);
    if (payload.type === "view_submission") {
      const { values } = payload.view.state;
      let url;
      const blocks = payload.view.blocks;
      if (values.url) url = values.url.url.value;
      else {
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i].block_id == "url") {
            url = blocks[i].text.text;
          }
        }
      }

      options.location = values.location.location.selected_option.value;
      options.connectivity = values.connectivity.connectivity.selected_option.value;
      options.emulateMobile = values.emulateMobile.emulateMobile.selected_option.value == "true" ? true : false;
      options.device = values.mobiledevice.mobiledevice.selected_option.value;

      // const wptPromise = wptHelpers.runTest(wpt, url, options);
      await web.chat.postMessage({
        text: "Response from WPT",
        channel: payload.view.callback_id,
        blocks: slackHelpers.testSubmissionBlock(url),
      });

      const wptResult = await wptPromise;
      const wptResultLink = wptResult.result.data.summary;
      const waterfallLink = wptResult.result.data.median.firstView.images.waterfall;

      await web.chat.postMessage({
        text: "Response from WPT",
        channel: payload.view.callback_id,
        blocks: slackHelpers.wptResponseBlock(url, wptResultLink, waterfallLink),
      });
    }
  } catch (error) {
    if (error.error)
      await web.chat.postMessage({
        text: "Response from WPT",
        channel: payload.view.callback_id,
        blocks: slackHelpers.errorBlock(error.error.code, error.error.message),
      });
    else
      await web.chat.postMessage({
        text: "Response from WPT",
        channel: payload.view.callback_id,
        blocks: slackHelpers.errorBlock(error.statusCode, error.statusText),
      });
  }
});
module.exports = router;
