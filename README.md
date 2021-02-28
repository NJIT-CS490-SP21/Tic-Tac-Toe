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

## Future Features
- Prevent user from logging in if username input is empty. I will do conditional checking in the onClick function for the Login Button and have an alert displayed on the screen if the input is empty
- Implement bootstrap into the frontend in order to save time on feature enhancements in CSS. I currently have the CDN set up in the render header in App.js but it not working. 
- Implement a history of moves so for all users to see. I will have another state variable in either Board.js or App.js to keep track of past moves and use socket to update the list across all users.
- Have an alert displayed out in the screen when an user attempts a move but it is not their turn. This feature can be implemented by having the backend doing the validation and emit an event to only the triggered browser with the attempted user. In the backend, one property in the even should be eliminated: broadcast=True.

## Technical Issues
- I had difficulty with updating my data throughout different browsers, specifically the board and user list. Both of them were updated in the triggered browser but not the rest. I fixed it by placing the setState(State) in every event received on the client side </br>

    Example </br>
    socket.on('update', (data) => {
        /.../
        const updatedBoard = data.board;    
        setBoard(updatedBoard);   
    });
    
- I was not able to disallow specific users from playing if it is not their turn. However, I figured that in order to to that, the implementation has to be done by the backend to keep track of the turns. I set up an event in the server side to validate each time the user asks if they can make a move. </br>
The flow is: onClick handler => client: emit the validate event => server: validate the turn and emit a boolean in the validate event => client: receive the validate event and tell the user whether to move



