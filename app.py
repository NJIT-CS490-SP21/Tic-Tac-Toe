import os
import json
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import importlib

load_dotenv(find_dotenv())

app = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

import models
importlib.reload(models)
db.create_all()
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

def update_score(winner, loser):
    all_players = db.session.query(models.Test)

    winner_data = all_players.filter_by(username=winner).first()
    loser_data = all_players.filter_by(username=loser).first()
    
    winner_data.score += 1
    loser_data.score -= 1
    db.session.commit()

def get_player_board():
    all_players = db.session.query(models.Test).order_by(models.Test.score.desc())
    users = []
    scores = []
    
    for p in all_players:
        users.append(p.username)
        scores.append(p.score)
        
    
    print("Server")
    print(users)
    return {'users': users, 'scores': scores}
    
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
    global player
    global user_list
    player = "X"
    user_list = data['userList']
    
    all_players = db.session.query(models.Test)
    
    #Check if username is already exists:
    if bool(all_players.filter_by(username=data['newUser']).first()):
        print("Username exists")
    else:
        new_user = models.Test(username=data['newUser'], score=100)
        db.session.add(new_user)
        db.session.commit()

    socketio.emit('player_board', get_player_board())
    
    socketio.emit('login',  data, broadcast=True, include_self=False)

@socketio.on('start')
def on_start(): 
    socketio.emit('start', broadcast=True)
    
@socketio.on('validate')
def on_validate(data): 
    value = data['value']
    box_id = data['id']
    board = data['board']
    
    global player
    global user_list
    
    if len(user_list) < 2 or value != player or value == "Spectator":
        data['isTurn'] = False
        socketio.emit('validate', data, broadcast=True, include_self=True)
    else:
        data['isTurn'] = True
        socketio.emit('validate', data, broadcast=True,  include_self=True)

@socketio.on('go')
def on_go(value): 
    global player
    if (value == "X"):
        player = "O"
    else:
        player = "X"

global winner
global loser 

@socketio.on('win')
def on_win(value): 
    global winner
    global loser 
    
    data = {}
    data['value'] = value
    winner = get_user_by_value(value)
    
    if value == "X":
        loser = get_user_by_value("O")
    else:
        loser = get_user_by_value("X")
        
    data['winner'] = winner

    socketio.emit('win', data)
    

@socketio.on('full')
def on_full(): 
    socketio.emit('full', broadcast=True, include_self=False)

@socketio.on('reset')
def on_reset(data): 
    print("reset")
    global player
    player = "X"
    print(data)
    update_score(winner, loser)
    socketio.emit('player_board', get_player_board())
    socketio.emit('reset', broadcast=True, include_self=False)
    

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