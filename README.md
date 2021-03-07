# Flask and create-react-app

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup

    # Clone the code repository
    git clone https://github.com/NJIT-CS490-SP21/project1-tn224.git

    # Install required Python packages
    pip install -r requirements.txt
    
    # Run "echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local" in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku
1. heroku create --buildpack heroku/python
2. heroku buildpacks:add --index 1 heroku/nodejs
3. git push heroku {your_branch_name}:main
4. heroku addons:create heroku-postgresql:hobby-dev
5. Run heroku config in terminal and see the value for DATABASE_URL in the output. Copy paste that value (looks like 'postgress://...').
6. Create a .env file and add set our var DATABASE_URL. Run touch .env && echo "DATABASE_URL='copy-paste-database-url-here'" > .env.
7. Start your app (python app.py, npm run start in other terminal).
8. Open 2 new tabs with console open.

## Check it out here - Sample heroku web app
https://dry-beyond-09920.herokuapp.com

## Future Features
- Prevent user from logging in if username input is empty. I will do conditional checking in the onClick function for the Login Button and have an alert displayed on the screen if the input is empty
- Implement a history of moves so for all users to see. I will have another state variable in either Board.js or App.js to keep track of past moves and use socket to update the list across all users.
- Have an alert displayed out in the screen when an user attempts a move but it is not their turn. This feature can be implemented by having the backend doing the validation and emit an event to only the triggered browser with the attempted user. In the backend, one property in the even should be eliminated: broadcast=True.

## Technical Issues
- I ran into this error in my app,py: “AttributeError: module 'models' has no attribute 'Person'” </br>
How I solved it: </br>
> In app.py: add import importlib  and after the line import models , add this line importlib.reload(Person) </br>
I found this solution on Python’s official documents about modules: https://docs.python.org/3/tutorial/modules.html
- Player Board is not sorted on the client side even though the query correctly return sorted results by score. The reason I found is that I use the dictionary/object data structure for the playerBoard state in PlayerBoard.js. When I iterate the playerBoard, I used Object.keys which return a sorted list of keys and map their values, instead of the initial board sorted by score.
How I solve it: </br>
    > On the server side: the player_board event will return 2 arrays of users and scores which are created by the query. 
    > On the client side: I iterate through the 2 array by indexes and return the rows.
