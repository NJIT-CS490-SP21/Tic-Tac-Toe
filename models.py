"""
Module contains Player model for database
"""
from app import DB

# pylint: disable=no-member
class Player(DB.Model):
    """
    Player class to contain information about player
    """
    # pylint: disable=too-few-public-methods
    __table_args__ = {'extend_existing': True}
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    score = DB.Column(DB.Integer, nullable=False)

    def __repr__(self):
        return '<Test %r>' % self.username
