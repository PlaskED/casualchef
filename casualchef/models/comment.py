from casualchef.dbapp import db as db
import time

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipe = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
    text = db.Column(db.String(512), nullable=False)
    popularity = db.Column(db.Integer)
    voters = db.Column(db.Integer)
    published = db.Column(db.DateTime())

    votes = db.relationship("Vote", backref="Comment", 
                            cascade="all, delete-orphan", lazy="noload")

    def __repr__(self):
        return '<Comment %r>' % self.id

    def to_json(self):
        return {'id':self.id, 'author':self.author,
                'recipe':self.recipe, 'text':self.text,
                'popularity':self.popularity, 'voters':self.voters,
                'published':self.published.strftime('%Y-%m-%d %H:%M:%S')}

    def gets_vote(self, vote_object):
        self.votes.append(vote_object)
        self.voters += 1
        self.popularity += 1 if vote_object.good else -1

    def vote_changes(self, vote_object, new_vote):
        if vote_object.good != new_vote:
            self.popularity += 2 if new_vote else -2
        vote_object.good = new_vote

    def recalculate_popularity(self):
        """Worst case method to fall back on if needed"""
        self.voters = 0
        for x in self.votes:
            self.voters += 1
            if x.good:
                self.popularity += 1
            else:
                self.popularity -= 1
