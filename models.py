from app import DB


class Player(DB.Model):
    __table_args__ = {'extend_existing': True}
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    score = DB.Column(DB.Integer, nullable=False)

    def __repr__(self):
        return '<Test %r>' % self.username


class Test(DB.Model):
    __table_args__ = {'extend_existing': True}
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    score = DB.Column(DB.Integer, nullable=False)

    def __repr__(self):
        return '<Test %r>' % self.username
