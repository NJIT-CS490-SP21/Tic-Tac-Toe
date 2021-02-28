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


## Known Problems
<Placeholder>

## Future Features
<Placeholder>

## Technical Issues
- I had difficulty with updating my data throughout different browsers, specifically the board and user list. Both of them were updated in the triggered browser but not the rest. I fixed it by placing the setState(State) in every event received on the client side </br>
How I solved it: 

    # Example
    # socket.on('update', (data) => {
        /.../
        const updatedBoard = data.board;    
        setBoard(updatedBoard);   
    });
    
- I was not able to disallow specific users from playing if it is not their turn. However, I figured that in order to to that, the implementation has to be done by the backend to keep track of the turns. I set up an event in the server side to validate each time the user asks if they can make a move. </br>
The flow is: onClick handler => client: emit the validate event => server: validate the turn and emit a boolean in the validate event => client: receive the validate event and tell the user whether to move



