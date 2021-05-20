## WebPageTest and Slack Integration

### Steps for Integration	

#### 1. Setting up a node-server.
* Clone this repository.
* Update the wpt_api_key, slack_token and channel_id in default.json of config.
* Run "npm install" to install all dependencies.

```bash
$ npm install
```

* Run "npm start" to start the node-server.

```bash
$ npm start
```

* If you get response like "Express server running on port 5000", server has been successfully setup. You can just add the required APIs and their dependencies if you already have a node-server running.
* There are currently two APIs to serve requests
	* To trigger slack modal on command execution. This path will be used for slash commands in slack (/api/slack/webpagetest)
	* To generate the response coming from webpagetest as view and post on slack. This path will be used for interactivity URL (/api/slack/integrations)
	
#### Note :- By default the node-server runs on port 5000 on localhost and is not to be accessible by slack servers, we can achieve this by running ngrok against port 5000. You can skip the below step if you have publicly accessible node-server.

#### 2. Making locally running node-server publicly accessible
* Install and start [ngrok](https://ngrok.com/download)
* After installing ngrok run "ngrok http 5000"
* This creates a tunnel and returns public URL which forwards request to localhost:5000, on which our node-server is running.
* Now our node-server is publicly accessible by the URLs returned by ngrok.

#### 3. Configuring slack app

* **Create a slack app for your workspace.**

![image](https://user-images.githubusercontent.com/31168643/118680453-5e8fa780-b81c-11eb-89c9-0ac2f24129b1.png)


* **Choose the app type as "From Scratch"**

![image](https://user-images.githubusercontent.com/31168643/118680814-ad3d4180-b81c-11eb-81d7-b93f47cc94d3.png)

* **Once the slack app is created, go to features tab of the application added and add the following : -**

	* **Bot User OAuth Token**

![image](https://user-images.githubusercontent.com/31168643/118681458-38b6d280-b81d-11eb-9854-599be05c2900.png)
	
* **Scope To Bot Token**
	

![image](https://user-images.githubusercontent.com/31168643/118681682-66038080-b81d-11eb-9592-d3b9f4106e5c.png)
	
* **Slash Command, make sure to add api path of triggering slack URL modal. (https://ngrokUrl/api/slack/webpagetest)**

![image](https://user-images.githubusercontent.com/31168643/118681835-86333f80-b81d-11eb-9d60-d03799795160.png)

![image](https://user-images.githubusercontent.com/31168643/118682029-b24ec080-b81d-11eb-9545-c8d96014e84b.png)


* **Next is adding a interactivity URL, any interactions with modals or interactive components are sent to this URL. Add the second APIs URL to post the message once response from WPT is fetched. (https://ngrokUrl/api/slack/interactions)**

![image](https://user-images.githubusercontent.com/31168643/118682126-c8f51780-b81d-11eb-8975-b397dd3f21f5.png)


#### Note : - Once you have added the slash command and interactivity URL, you might be asked to reinstall your app, please do it to make changes applicable on your app.

![image](https://user-images.githubusercontent.com/31168643/118682199-da3e2400-b81d-11eb-93b1-66f0ac401cc0.png)


#### 4. Run the command on slack
* **Next step is to check our command on slack, start by typing webpagetest, you should see a recommendation of webpagetest as below.**

![image](https://user-images.githubusercontent.com/31168643/118682354-fe016a00-b81d-11eb-9825-61a35a64a7dc.png)

* **Above command should open a modal like below**

![image](https://user-images.githubusercontent.com/31168643/118682409-0b1e5900-b81e-11eb-8c4a-d178b57248a7.png)


* **Enter the values as required and submit, once the request is submitted successfully, an example response like below is posted on the required channel**

![image](https://user-images.githubusercontent.com/31168643/118682454-17a2b180-b81e-11eb-92fa-74b87c1d875d.png)

#### Note : - You can skip some steps accordingly if you already have a slack app or want to integrate in your current node project.


	
	
	
	
	
	



