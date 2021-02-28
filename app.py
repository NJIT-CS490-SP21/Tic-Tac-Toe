import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

import json

app = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
#from models import Person

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

global user_list
user_list = {}
global player 
player = "X"

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    
    print("User connected!")
# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')
    
def get_user_by_value(value):
    key_list = list(user_list.keys())
    val_list = list(user_list.values())
 
    # print key with val
    position = val_list.index(value)
    return key_list[position]
 

@socketio.on('login')
def on_login(data):
    user_list = data['userList']
    socketio.emit('login',  data, broadcast=True, include_self=False)
    
# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('validate')
def on_validate(data): 
    value = data['value']
    box_id = data['id']
    board = data['board']
    
    
    global player
    
    if value != player or value == "Spectator":
        socketio.emit('validate',  {'isTurn': False, 'id':box_id, 'value': value, "board":board} ,  include_self=True)
    else:
        socketio.emit('validate',  {'isTurn': True, 'id': box_id, 'value': value, "board":board} ,  include_self=True)
        if player == "X":
            player = "O"
        else:
            player = "X"
        
        
@socketio.on('go')
def on_go(user): 
    
    print(user)
    print(type(user))
    
    
    #socketio.emit('go',  {'currPlayer': player} , broadcast=True, include_self=True)


@socketio.on('update')
def on_update(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('update',  data, broadcast=True, include_self=False)


# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)