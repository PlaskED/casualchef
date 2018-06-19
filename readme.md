# CasualChef

A fullstack project for sharing, discussing and rating cooking receipts. ReactJS + Redux is used as front-end to consume a flask rest-api backend. MySQL is the database of choice for this project. Authentication is handled with hashed passwords and passlib. The backend implements both token authentication and username/password via Authentication headers. SQLAlchemy for connecting flask to the mysql database. The database of choice is a relational database because of the various relationships needed between objects.

## Stack
* ReactJS + Redux
* Materialize
* Flask (SQLAlchemy ORM)
* MySQL

## Installing
To setup the project run the script

```
bash install.sh
```
You might be prompted to set root password for mysql when running the script. The root user and password is later needed for configuring the flask app, you may use your own mysql user if you wish but.

Create an mysql database and name it "db". Now open "instance/config.py" and edit the variables to match your database. This config variables overrides the one in config.py that resides in root dir. It's also ignored by .gitignore so your sensitive information will be kept local.

## Working in the virtual environment
While not needed, I recommend creating a virtualenv to isolate package dependencies for pip3.
```
virtualenv /clone-git-dir
```
To enter virtual environment, stand in root of cloned directory and use the command
```
source bin/activate
```
Install or update pip3 packages with

```
pip3 install -r requirements.txt
```
Leave the virtual environment with
```
deactivate
```

## Tests
Tests to ensure the backend is working can be run with
```
python3 tests.py
```
The tests is a bunch of requests to the backend that ensures endpoints behave as expected.

## Running the backend server
Ensure you are standing in root.

Then run the app with

```
python3 run.py
```

## Running the frontend server
Standing in /casualchef_react

First install all dependencies with

```
npm install
```

Now you can run the front-end react server with

```
npm start
```