const express = require('express')
const router = express.Router()
const { WebClient } = require('@slack/web-api');
const WebPageTest = require("webpagetest");
const helpers = require('../helpFunc');
const config = require('config');

const token = config.slack_token;
const wpt = new WebPageTest('www.webpagetest.org',config.wpt_api_key);

let options = {
  "firstViewOnly": true,
  "runs": 1,
  "location": 'ec2-us-east-1:Chrome',
  "connectivity": '4G',
  "pollResults": 5,
  "timeout": 240
}

// Initialize
const web = new WebClient(token);
router.post('/slack/webpagetest', async (req, res) => {
  const { trigger_id, channel_id } = req.body;
  res.status(200).send('');
  console.log("trigger ID :-",req.body)
  let locationsResult = await helpers.getLocations(wpt,options);
  const allLocations = locationsResult.result.response.data.location;
    await web.views.open({
      trigger_id: trigger_id,
      channel_id: channel_id,
      view: helpers.getDialogView(allLocations),
    });
});

router.post('/slack/interactions', async (req, res) => {

  try {

    res.status(200).send('');
    const payload = JSON.parse(req.body.payload);
    console.log("payload :-",payload)
    if (payload.type === 'view_submission' && payload.view.callback_id === 'webpagetest') {

      const { values } = payload.view.state;
      const url = values.url.url.value;

      options.location = values.location.location.selected_option.value;
      options.connectivity = values.connectivity.connectivity.selected_option.value;
      options.emulateMobile = values.emulateMobile.emulateMobile.selected_option.value == 'true' ? true : false;

      await web.chat.postMessage({
        text: 'Response from WPT',
        channel: 'C0211K9JTS9',
        blocks: [
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "plain_text",
              "text": "Test successfully submitted for "+url,
              "emoji": true
            }
          },
          {
            "type": "divider"
          }
        ]

      })

      let wptResult = await helpers.runTest(wpt, url, options);
      let wptResultLink = wptResult.result.data.summary;
      let waterfallLink = wptResult.result.data.median.firstView.images.waterfall;
      await web.chat.postMessage({
        text: 'Response from WPT',
        channel: 'C0211K9JTS9',
        blocks: helpers.getBlockResult(url,wptResultLink,waterfallLink)
      });
    }
  } catch (error) {

    console.log("error :-",error)
    await web.chat.postMessage({
      text: 'Response from WPT',
      channel: 'C0211K9JTS9',
      blocks: [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "Error while submitting test",
            "emoji": true
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Status Code : -  " + error.statusCode,
            "emoji": true
          }
        },
        {
          "type": "section",
          "text": {
            "type": "plain_text",
            "text": "Status Text : -  " + error.statusText,
            "emoji": true
          }
        }
      ]

    })
  }

});
module.exports = router;