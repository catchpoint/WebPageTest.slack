# WebPageTest and Slack Integration

## Steps for Integration


	
	• Setting up a node-server
		○ Import the code.
		○ Update the wpt-api-key and slack token in default.json of config.
		○ Run "npm install" to install all dependencies
		○ Run "npm start" to start the node-server.
		○ There are currently 2 apis to serve requests from slack
			§ One to trigger slack modal (/api/slack/webpagetest)
			§ One to create the response from wpt as view and post on slack (/api/slack/interactions)
      
	• By default the node-server runs on port 5000 on localhost but needs to be accessible by slack servers, we can achieve this by running ngrok against port 5000
		○ Install ngrok
		○ After installing ngrok run "ngrok http 5000"
		○ This creates a tunnel and returns public URL which forwards request to localhost:5000, on which our node-server is running.
    
	• Create a slack app for your workspace 
	
			![image](https://user-images.githubusercontent.com/31168643/118529033-aea93400-b760-11eb-95f9-42f8d763e4cd.png)

	
		○ Choose the app type as "From Scratch"
	 
   ![image](https://user-images.githubusercontent.com/31168643/118529129-c8e31200-b760-11eb-9a9f-131e89a58b36.png)

			
	
		○ Once the slack app is created, go to features tab of the application added and add the following : - 
		
			§ Bot User Oauth Token
	
			![image](https://user-images.githubusercontent.com/31168643/118529317-034caf00-b761-11eb-8825-b08f0828b3e5.png)

	
			§ Scope to Bot Token
		
			![image](https://user-images.githubusercontent.com/31168643/118529338-09db2680-b761-11eb-83b8-70a44881566e.png)

	
			§ Slash Command, make sure to add api path of triggering slack URL modal. (https://ngrokUrl/api/slack/webpagetest)
	
		
      ![image](https://user-images.githubusercontent.com/31168643/118529351-0e074400-b761-11eb-94f2-132b0f692f31.png)

      ![image](https://user-images.githubusercontent.com/31168643/118529412-1d868d00-b761-11eb-87aa-a39a21ce4427.png)

		
			§ Next is adding a interactivity URL, any interactions with modals or interactive components are sent to this URL. Add the second APIs URL to post the message once response from WPT is fetched. (https://ngrokUrl/api/slack/interactions)
	
      ![image](https://user-images.githubusercontent.com/31168643/118529452-24ad9b00-b761-11eb-8b12-2c65928bec60.png)

			
	
		○ Note : - Once you have added the slash command and interactivity URL, you might be asked to reinstall your app, please do it to make changes applicable on your app.

			![image](https://user-images.githubusercontent.com/31168643/118529464-28d9b880-b761-11eb-8d07-4af590f942c7.png)


	• Next step is to check our command on slack, start by typing webpagetest, you should see a recommendation of webpagetest as below.
	
			
		![image](https://user-images.githubusercontent.com/31168643/118529483-2f683000-b761-11eb-8a06-7eeb4e437703.png)

		
		○ Above command should open a modal like below
	
		![image](https://user-images.githubusercontent.com/31168643/118529502-32fbb700-b761-11eb-9691-222d42275e86.png)

		
	
		○ Enter the values as required and submit, once the request is submitted successfully, an example response like below is posted on the required channel

    ![image](https://user-images.githubusercontent.com/31168643/118529513-38590180-b761-11eb-837e-687d7d6da0bf.png)

			
