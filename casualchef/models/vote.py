from casualchef.dbapp import db as db

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    voter = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comment = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=False)
    good = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return '<Vote %r>' % self.id

    def to_json(self):
        return {'id':self.id, 'voter':self.voter,
                'comment':self.comment, 'good':self.good}
