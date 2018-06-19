from casualchef.dbapp import db as db

class Roles_Users(db.Model):
    id = db.Column(db.Integer, db.ForeignKey())
