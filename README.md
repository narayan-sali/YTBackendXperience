# Joyful backend 
 This is the backend project using nodejs,expressjs and mongodb
Here's a step-by-step documentation on how to set up a professional backend

Install VS Code (Visual Studio Code):
------------------

Download and install Visual Studio Code, a popular code editor, on your local system.

Install Node.js:
------------------
Install Node.js on your local system, which is required for running JavaScript on the server side. You can download it from the official Node.js website.

Open Visual Studio Code:
------------------
Launch Visual Studio Code to begin working on your project.

Configure Git:
------------------
Set up Git integration in Visual Studio Code if not already configured.

Create a Git Repository:
------------------
Use Git to create a repository for your project with the name "nasa-backend."

Create Project Structure:
------------------
Inside your project directory, create a folder named "Public."
Inside the "Public" folder, create another folder called "temp."
In the "temp" folder, create a file named .gitkeep.

Create .gitignore File:
------------------
Create a file named .gitignore to specify which files or directories should be excluded from version control. You can generate a suitable .gitignore file by searching for "gitignore generator" in your web browser. For example, you can generate one for Node.js projects.

Create .env File:

Create a file named .env for storing environment variables and sensitive information.

Create Source Code Folder:
------------------------------------
Create a folder named "src" to organize your source code.

Inside the "src" Folder:

Open the terminal and navigate to the "src" directory.

Create Key Project Files:
------------------
Inside the "src" directory, create the following key files:
app.js
constants.js
index.js

Update package.json:

Open your project's package.json file and ensure it includes the "type" field set to "module."

Install Nodemon:
------------------
In the terminal, install Nodemon as a development dependency using the following command:
css
Copy code
npm i -D nodemon


Update package.json for Development:

Update the "scripts" section in the package.json file to include a "dev" script that uses Nodemon to run your application. For example:
json
Copy code
"scripts": {
  "dev": "nodemon src/index.js"
}


Create Project Structure:
------------------
In the terminal, navigate to your project directory and create the following folders:
controllers
db
middlewares
models
routes
utils

Code Formatting with Prettier:
------------------
To maintain code formatting consistency, use the Prettier extension.
In your project's root directory, install Prettier as a development dependency:
css
Copy code
npm i -D prettier


Create .prettierrc File:

Create a file named .prettierrc in your project's root directory and configure Prettier with your desired settings. For example:
json
Copy code
{
  "singleQuote": false,
  "bracketSpacing": true,
  "tabWidth": 2,
  "semi": true,
  "trailingComma": "es5"
}


Create .prettierignore File:

Create a file named .prettierignore in your project's root directory to specify which files and directories should be excluded from Prettier formatting. For example:
bash
Copy code
/.vscode
*.env
.env
.env.*
/node_modules
/dist


With these steps, you'll have a well-structured backend project  set up and ready for development in a professional manner.


1. Create an Account and Log In
-------------------------------
Go to the MongoDB Atlas website: https://www.mongodb.com/cloud/atlas/register.
Click the "Sign Up" or "Try Free" button to create your MongoDB Atlas account.
Fill in the required information and follow the registration process.
Once your account is created, log in using your credentials.
2. Create a Project
---------------------------------------------
After logging in, you'll be on the MongoDB Atlas dashboard.
Click on the "Projects" link on the left sidebar.
Click the "New Project" button and give your project a name, such as "Project_name."
Click "Next" and confirm the project settings.
3. Deploy a Database
---------------------------------------------
In your project, click on the "Clusters" link in the left sidebar.
Click the "Build a Cluster" button.
Select a cloud provider (e.g., AWS) and a region (e.g., Mumbai).
Under "Cluster Tier," select the "M0" tier which is the free tier.
Customize any additional settings as needed and click "Create Cluster."
MongoDB Atlas will start creating your cluster. This may take a few minutes.
4. Get Database Connection Strings
-----------------------------------------------------
Once your cluster is created and running, click on the "CONNECT" button.

In the "Connect to Cluster" dialog, choose "Connect Your Application."

Choose your driver (e.g., Node.js, Python, Java).

You will see a connection string that you can use in your application code. It will look something like this:

bash
Copy code
mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority
Replace <username> and <password> with the credentials you set up.

5. Configure IP Whitelisting
---------------------------------------------------
To connect to your database, you need to whitelist your IP address or allow connections from any IP address (0.0.0.0/0).
In the MongoDB Atlas dashboard, click on "Network Access" in the left sidebar.
Click the "Add IP Address" button.
Choose "Add Your Current IP Address" to whitelist your current IP address, or specify "0.0.0.0/0" to allow connections from any IP.
Confirm your changes.
Now, you have successfully created a MongoDB Atlas account, created a project, deployed a database cluster, obtained connection strings, and configured IP access. You can use the provided connection string in your application to connect to your MongoDB database.
 

Adding npm packages 
------------------------------
insert 
npm i mongooose express dotenv