const { App } = require("@slack/bolt");
const WebPageTest = require("webpagetest");
const slackHelpers = require("./utils/slackHelpers");
const wptHelpers = require("./utils/wptHelpers");
const connectDB = require("./config/db.js");
const colors = require("colors");
const orgAuth = require("./config/auth/store_user_org_install");
const workspaceAuth = require("./config/auth/store_user_workspace_install");
const dbQuery = require("./config/find_user");

require("dotenv").config();

//WPT config
let WPT_API_KEY;
let channel_temp_id;

let options = {
  firstViewOnly: true,
  runs: 1,
  location: "ec2-us-east-1:Chrome",
  connectivity: "4G",
  pollResults: 5,
  //timeout: 240, //Could be activated later
};

const devEnvCheck = process.env.ENVIRONMENT === "DEVELOPMENT";

if (devEnvCheck !== true) connectDB();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: devEnvCheck == true ? process.env.SLACK_BOT_TOKEN : undefined, //for development
  signingSecret: process.env.SLACK_SIGNING_SECRET, //for production
  clientId: devEnvCheck == false ? process.env.SLACK_CLIENT_ID : undefined, //for production
  clientSecret: devEnvCheck == false ? process.env.SLACK_CLIENT_SECRET : undefined,
  stateSecret: devEnvCheck == false ? "my-state-secret" : undefined,
  redirectUri: `${process.env.HOST_URI}/slack/oauth_redirect`,
  scopes: ["commands", "chat:write"],
  installerOptions: {
    redirectUriPath: "/slack/oauth_redirect", // and here!,
  },
  installationStore: {
    storeInstallation: async (installation) => {
      if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
        return orgAuth.saveUserOrgInstall(installation);
      }
      if (installation.team !== undefined) {
        return workspaceAuth.saveUserWorkspaceInstall(installation);
      }
      throw new Error("Failed saving installation data to installationStore");
    },
    fetchInstallation: async (installQuery) => {
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        return dbQuery.findUser(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        return dbQuery.findUser(installQuery.teamId);
      }
      throw new Error("Failed fetching installation");
    },
    deleteInstallation: async (installQuery) => {
      console.log("This part is not handeled yet");
    },
  },
});

// Test Modal
app.command("/webpagetest", async ({ ack, body, client, logger }) => {
  await ack();

  channel_temp_id = body.channel_id;

  function validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      value
    );
  }

  const wpt = new WebPageTest("www.webpagetest.org", "WPT_API_KEY"); // Your WPT API Key
  const locationsResult = await wptHelpers.getLocations(wpt, options);
  const allLocations = locationsResult.result.response.data.location;

  try {
    if (!validateUrl(body.text)) {
      return await client.chat.postMessage({
        text: "Response from WPT",
        channel: body.channel_id,
        blocks: slackHelpers.errorBlock("400", "Please enter a valid URL"),
      });
    }
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: slackHelpers.dialogView(allLocations, body.text, WPT_API_KEY, body.channel_id),
    });
  } catch (error) {
    logger.error(error);
  }
});

// Key Update Modal
app.command("/updatekey", async ({ ack, body, client, logger }) => {
  await ack();

  channel_temp_id = body.channel_id;

  WPT_API_KEY = body.text; //updating the key

  try {
    await client.chat.postMessage({
      channel: body.channel_id,
      text: body.text,
      blocks: slackHelpers.keyUpdateBlock(body.channel_id),
    });
  } catch (error) {
    if (error.error)
      await client.chat.postMessage({
        text: "Response from WPT",
        channel: channel_temp_id,
        blocks: slackHelpers.errorBlock(error.error.code, error.error.message),
      });
    else
      await client.chat.postMessage({
        text: "Response from WPT",
        channel: channel_temp_id,
        blocks: slackHelpers.errorBlock(error.statusCode, error.statusText),
      });
  }
});

// Submitting Test
app.view("SUBMIT_TEST", async ({ ack, payload, client }) => {
  await ack();

  try {
    const { values } = payload.state;
    let url;
    if (values.key) WPT_API_KEY = values.key.key.value;
    const blocks = payload.blocks;
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

    const wpt = new WebPageTest("www.webpagetest.org", WPT_API_KEY); // Your WPT API Key
    const wptPromise = wptHelpers.runTest(wpt, url, options);
    await client.chat.postMessage({
      text: "Response from WPT",
      channel: channel_temp_id,
      blocks: slackHelpers.testSubmissionBlock(url),
    });

    const wptResult = await wptPromise;
    const wptResultLink = wptResult.result.data.summary;
    const waterfallLink = wptResult.result.data.median.firstView.images.waterfall;

    await client.chat.postMessage({
      text: "Response from WPT",
      channel: channel_temp_id,
      blocks: slackHelpers.wptResponseBlock(url, wptResultLink, waterfallLink),
    });
  } catch (error) {
    console.log(error);
    if (error.error)
      await client.chat.postMessage({
        text: "Response from WPT",
        channel: channel_temp_id,
        blocks: slackHelpers.errorBlock(error.error.code, error.error.message),
      });
    else
      await client.chat.postMessage({
        text: "Response from WPT",
        channel: channel_temp_id,
        blocks: slackHelpers.errorBlock(error.statusCode, error.statusText),
      });
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);

  if (process.env.ENVIRONMENT === "DEVELOPMENT") {
    console.log("⚡️ Webpagetest Slack app is running!");
  }
})();
