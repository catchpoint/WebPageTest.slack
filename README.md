<p align="center"><img src="https://docs.webpagetest.org/img/wpt-navy-logo.png" alt="WebPageTest Logo" /></p>
<p align="center"><a href="https://docs.webpagetest.org/api/integrations/#officially-supported-integrations">Learn about more WebPageTest API Integrations in our docs</a></p>

# WebPageTest Slack Bot
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](/LICENSE)

The WebPageTest Slack bot lets you run tests against WebPageTest from within Slack. Once the tests are complete, a copy of the waterfall and a link to the full results will be posted in your Slack channel, helping you to easily troubleshoot and diagnose performance issues directly from your Slack development channels.

**Features:**
- Run WebPageTest from within Slack, and get the results posted back automatically.
- Full access to WebPageTest's 30+ test locations.

## Installing the Slack Bot

### 1. Creating the Slack App
1. [Create a Slack app](https://api.slack.com/apps/new) for your workspace and choose "From Scratch" for the application type.

![A screenshot showing the application type dialog for a new Slack app](https://user-images.githubusercontent.com/66536/120535887-22764e00-c3a9-11eb-8a91-5bccd4edb849.png)

2. Set the App Name (might we suggest the simple, yet accurate, "WebPageTest") and make sure you've selected the workspace you want to add the application to.

![A screenshot showing the App Name and workspace selection](https://user-images.githubusercontent.com/66536/120536167-72edab80-c3a9-11eb-9565-c32574443ef6.png)

3. Next, you need to get the Slack token to be referenced in the Node server that will handle all the testing. Navigate to the "OAuth and Permissions" page (found in the sidebar of the Slack navigation). Before you Install the application to the workspace, you'll need to set the Bot Token Scope to "chat:write".

![Screen Shot 2021-06-02 at 1 58 19 PM](https://user-images.githubusercontent.com/66536/120537313-c14f7a00-c3aa-11eb-8c50-d51562b59091.png)

4. After you've set the Bot Token scope, click "Install to Workspace". The application will be installed and you'll be provided with an oAuth Token for the bot. Copy this somewhere safe as you'll need it when you setup the Node server.

![token-blurred](https://user-images.githubusercontent.com/66536/120537513-ffe53480-c3aa-11eb-807a-f507ff750acb.png)

### 2. Setting up the Node Server
The logic that submits tests to WebPageTest and returns the results back to Slack is handled by a Node server that you'll need to have running somewhere that Slack can access. Here's how to get that running.

1. Clone this repository to the location you want to run the Node server from and run `npm install` to install all the dependencies.
```bash
npm install
```

2. Update `.env` with [an WebPageTest API Key](https://app.webpagetest.org/ui/entry/wpt/signup?enableSub=true&utm_source=docs&utm_medium=github&utm_campaign=slackbot&utm_content=account) and the Slack token you copied earlier.

3. Run `npm start` to start the server.

```bash
npm start
```

If you get response like "Express server running on port 5000", server has been successfully setup. If your node server is publicly accessible, you're good to move on with the final configuration of the Slack bot. If it's not, [you can use ngrok to make the server accessible](#optional-use-ngrok-to-make-the-server-publicly-accessible).

### 3. Final configuration of Slack Bot
The Node server provides two API endpoints used to handle requests.

- The "/api/slack/webpagetest" path will be used for slash commands in Slack to trigger tests.
- The "/api/slack/interactions" path will be used to process the response from WebPageTest and post the results back to Slack.

The final step is to use set the Slack bot to use these URL's. 

1. Navigate to the "Slash Commands" page for your application (found in the sidebar of the Slack navigation) and "Create a New Command" with the following settings:

- **Command:** /webpagetest
- **Request URL:** The full URL for the "/api/slack/webpagetest" endpoint of your server.
- **Short Description:** Runs WebPageTest
- **Usage Hint:** [url to test]

![Screen Shot 2021-06-02 at 2 56 20 PM](https://user-images.githubusercontent.com/66536/120544133-b39df280-c3b2-11eb-8646-3bbd74f9101f.png)

2. Navigate to the "Interactivity & Shortcuts" page for your application (found in the sidebar of the Slack navigation), enable Interactivity, and then provide the full URL to the "/api/slack/interactions" endpoint for your server.

![Screen Shot 2021-06-02 at 4 09 03 PM](https://user-images.githubusercontent.com/66536/120552522-f82e8b80-c3bc-11eb-90d0-6b3b3721044d.png)

_Once you have added the slash command and interactivity URL, you might be asked to reinstall your app, please do it to apply the necessary changes for your app._

5. Finally, in Slack, you'll need to add WebPageTest to the channel you want to be able to run tests from. You can do this by starting to type "add apps", selecting "Add apps to this channel", then clicking "Install" next to the WebPageTest application.

<img width="668" alt="Screen Shot 2021-06-03 at 10 33 02 AM" src="https://user-images.githubusercontent.com/66536/120671600-29f43080-c457-11eb-966a-01f575ef2aa5.png">

6. **Optional** You can also set a custom app icon for the app by navigating to the "Basic Information" page for your application (found in the sidebar of the Slack navigation) and adding the icon under "Display Information". We've provided [an icon for you in the repository that you can use](https://github.com/WebPageTest/webpagetest-slack/blob/master/webpagetest.png).

![Screen Shot 2021-06-03 at 10 29 07 AM](https://user-images.githubusercontent.com/66536/120671651-36788900-c457-11eb-8e65-9c758fde991a.png)

## Running the Slack Bot
With the server running and the Slack application configured, you're ready to start testing!

1. Type /webpagetest in Slack. You should see a box recommending the WebPageTest app.

<img width="398" alt="Screen Shot 2021-06-03 at 10 29 49 AM" src="https://user-images.githubusercontent.com/66536/120671667-3bd5d380-c457-11eb-8cc6-c6e40de534f2.png">

2. Add the URL you want to test and press enter. For example:

`/webpagetest https://webpagetest.org`

3. A modal box will be displayed letting you customize the test by selecting a WebPageTest testing location and browser, a connectivity profile, and (optionally) mobile emulation.

<img width="517" alt="Screen Shot 2021-06-03 at 10 32 16 AM" src="https://user-images.githubusercontent.com/66536/120671798-59a33880-c457-11eb-944a-2d105e052dc0.png">


4. After you hit "Submit", the WebPageTest application will first post a message letting you know the test has been submitted. Once the test is complete, the WebPageTest app will add another message with a thumbnail of the waterfall and a link to the full WebPageTest results.

<img width="669" alt="Screen Shot 2021-06-03 at 10 30 17 AM" src="https://user-images.githubusercontent.com/66536/120671728-498b5900-c457-11eb-93f7-a04e7632c81d.png">

## Optional: Use ngrok to make the server publicly accessible
By default, the Node server runs on port 5000 on localhost. You can use ngrok to make the server accessible to the Slack servers if your Node server is not already publicly accessible.

1. Install and start [ngrok](https://ngrok.com/download)
2. After installing ngrok run "ngrok http 5000"
```bash
ngrok http 5000
```
4. This creates a tunnel and returns a public URL for accessing the server.

From here, the steps for [configuring the app are the same](#3-final-configuration-of-slack-bot).

---
<p align="center"><a href="https://docs.webpagetest.org/api/integrations/#officially-supported-integrations">Learn about more WebPageTest API Integrations in our docs</a></p>
