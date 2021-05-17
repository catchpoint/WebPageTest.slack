## WebPageTest and Slack Integration

### Steps for Integration	

#### 1. Setting up a node-server.
* Clone this repository.
* Update the wpt-api-key and slack token in default.json of config.
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

![image](https://user-images.githubusercontent.com/31168643/118532366-81f71b80-b764-11eb-87f0-3470169374fc.png)


* **Choose the app type as "From Scratch"**

![image](https://user-images.githubusercontent.com/31168643/118532675-dac6b400-b764-11eb-988e-63fddadf79d4.png)

* **Once the slack app is created, go to features tab of the application added and add the following : -**

	* **Bot User OAuth Token**

![image](https://user-images.githubusercontent.com/31168643/118533215-70fada00-b765-11eb-95f5-55a542c2b9f8.png)
	
* **Scope To Bot Token**
	

![image](https://user-images.githubusercontent.com/31168643/118533359-9c7dc480-b765-11eb-9667-aedf21122502.png)
	
* **Slash Command, make sure to add api path of triggering slack URL modal. (https://ngrokUrl/api/slack/webpagetest)**

![image](https://user-images.githubusercontent.com/31168643/118534207-99370880-b766-11eb-984a-c6d9424c2be9.png)

![image](https://user-images.githubusercontent.com/31168643/118534222-9d632600-b766-11eb-9342-21120d219e99.png)


* **Next is adding a interactivity URL, any interactions with modals or interactive components are sent to this URL. Add the second APIs URL to post the message once response from WPT is fetched. (https://ngrokUrl/api/slack/interactions)**

![image](https://user-images.githubusercontent.com/31168643/118534296-af44c900-b766-11eb-97ad-3c3821438579.png)


#### Note : - Once you have added the slash command and interactivity URL, you might be asked to reinstall your app, please do it to make changes applicable on your app.

![image](https://user-images.githubusercontent.com/31168643/118534369-c7b4e380-b766-11eb-8f0b-fdfbf7611a54.png)


#### 4. Run the command on slack
* **Next step is to check our command on slack, start by typing webpagetest, you should see a recommendation of webpagetest as below.**

![image](https://user-images.githubusercontent.com/31168643/118534505-f03cdd80-b766-11eb-8aef-7b6a5fa42c8b.png)

* **Above command should open a modal like below**

![image](https://user-images.githubusercontent.com/31168643/118534606-0d71ac00-b767-11eb-9054-aaf8dedd0aa2.png)


* **Enter the values as required and submit, once the request is submitted successfully, an example response like below is posted on the required channel**

![image](https://user-images.githubusercontent.com/31168643/118534667-1c585e80-b767-11eb-9cdd-f259e24aced8.png)

### Note : - You can skip some steps accordingly if you already have a slack app or want to integrate in your current node project.


	
	
	
	
	
	



