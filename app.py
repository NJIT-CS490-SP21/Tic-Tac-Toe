"""
This module contains all socket event handlers and database transaction handler
"""
import os
import json
import importlib
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

APP = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)
# pylint: disable=wrong-import-position
import models

importlib.reload(models)
DB.create_all()
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
#from models import Person

CORS_APP = CORS(APP, resources={r"/*": {"origins": "*"}})

SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


def get_user_data(username):
    """
    This method is to get model Player by username
    @param username
    """
    # pylint: disable=no-member
    all_players = DB.session.query(models.Player)
    user_data = all_players.filter_by(username=username).first()
    print(type(user_data))
    return user_data


def update_score(winner, loser):
    """
    This method is to update score of users in database
    @param winner: username of winner
    @param loser: username of loser
    """
    winner_data = get_user_data(winner)
    loser_data = get_user_data(loser)
    winner_data.score += 1
    loser_data.score -= 1
    # pylint: disable=no-member
    DB.session.commit()


def add_user(username):
    """
    This method is to add new user to database
    @param username
    """
    # pylint: disable=no-member
    all_players = DB.session.query(models.Player)
    #Check if username is already exists:
    if bool(all_players.filter_by(username=username).first()):
        print("Username exists")
    else:
        new_user = models.Player(username=username, score=100)
        DB.session.add(new_user)
        DB.session.commit()
    updated_players = models.Player.query.all()
    users = []
    for person in updated_players:
        users.append(person.username)
    return users


def get_player_board():
    """
    This method is to query the list of all users in database
    @return: a dictionary of users and scores
    """
    # pylint: disable=no-member
    all_players = DB.session.query(models.Player).order_by(
        models.Player.score.desc())
    users = []
    scores = []

    for person in all_players:
        users.append(person.username)
        scores.append(person.score)
    return {'users': users, 'scores': scores}


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """
    This method is to route the path to the app's index file
    """
    return send_from_directory('./build', filename)


USER_LIST = {}
PLAYER = "X"
WINNER = ""
LOSER = ""


@SOCKETIO.on('connect')
def on_connect():
    """
    This method is to run when a client connect from this Socket
    """
    print("User connected!")


@SOCKETIO.on('disconnect')
def on_disconnect():
    """
    This method is to run socket when a client disconnect from this Socket
    """
    print('User disconnected!')


def get_user_by_value(value):
    """
    This method is to get username based on value X or O
    @param value: X or O
    @return: username
    """
    key_list = list(USER_LIST.keys())
    val_list = list(USER_LIST.values())

    position = val_list.index(value)
    return key_list[position]


@SOCKETIO.on('login')
def on_login(data):
    """
    This method is to run socket when a client successfully log in
    """
    # pylint: disable=global-statement
    global PLAYER
    global USER_LIST
    PLAYER = "X"
    #USER_LIST = data['userList']
    USER_LIST = update_user_list(data['newUser'], data['role'],
                                 data['userList'])
    add_user(data['newUser'])
    SOCKETIO.emit('player_board', get_player_board())
    SOCKETIO.emit('login', data, broadcast=True, include_self=False)


@SOCKETIO.on('start')
def on_start():
    """
    This method is to emit an event to start the game
    """
    SOCKETIO.emit('start', broadcast=True)


def update_user_list(username, role, user_list):
    """
    This method is to update role for username
    """
    user_list[username] = role
    return user_list


def is_turn(value, curr_player, user_list):
    """
    This method is to validate if it is the current user's turn to play
    """
    if len(user_list) < 2 or value != curr_player or value == "Spectator":
        return False
    return True


@SOCKETIO.on('validate')
def on_validate(data):
    """
    This method is to validate if it is the current user's turn to play
    """
    # pylint: disable=global-statement
    value = data['value']
    global PLAYER
    global USER_LIST
    if len(USER_LIST) < 2 or value != PLAYER or value == "Spectator":
        data['isTurn'] = False
        SOCKETIO.emit('validate', data, broadcast=True, include_self=True)
    else:
        data['isTurn'] = True
        SOCKETIO.emit('validate', data, broadcast=True, include_self=True)


@SOCKETIO.on('go')
def on_go(value):
    """
    This method is to update the value of the current turn
    """
    # pylint: disable=global-statement
    global PLAYER
    if value == "X":
        PLAYER = "O"
    else:
        PLAYER = "X"


def set_game_result(winner, winner_value):
    """
    This method is to set the username for winner and loser
    """
    if winner_value == "X":
        loser = get_user_by_value("O")
    else:
        loser = get_user_by_value("X")
    return {'winner': winner, 'loser': loser}


@SOCKETIO.on('win')
def on_win(value):
    """
    This method is to update values when there is a winner
    """
    # pylint: disable=global-statement
    global WINNER
    global LOSER

    data = {}
    data['value'] = value
    WINNER = get_user_by_value(value)
    result = set_game_result(WINNER, value)
    #WINNER = result['winner']
    LOSER = result['loser']
    data['winner'] = WINNER

    SOCKETIO.emit('win', data)


@SOCKETIO.on('full')
def on_full():
    """
    This method is to emit an event to let users know the board is full
    """
    SOCKETIO.emit('full', broadcast=True, include_self=False)


@SOCKETIO.on('reset')
def on_reset(data):
    """
    This method is to reset the game
    """
    # pylint: disable=global-statement
    global PLAYER
    PLAYER = "X"
    print(data)
    update_score(WINNER, LOSER)
    SOCKETIO.emit('player_board', get_player_board())
    SOCKETIO.emit('reset', broadcast=True, include_self=False)


@SOCKETIO.on('update')
def on_update(
        data):  # data is whatever arg you pass in your emit call on client
    """
    This method is to update the data
    """
    #print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('update', data, broadcast=True, include_self=False)


# pylint: disable=invalid-envvar-default
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
