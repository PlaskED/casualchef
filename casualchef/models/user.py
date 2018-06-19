from casualchef.dbapp import db as db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, nullable=False)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    last_login_time = db.Column(db.DateTime())
    current_login_time = db.Column(db.DateTime())
    last_login_ip = db.Column(db.String(64))
    current_login_ip = db.Column(db.String(64))
    login_attempts = db.Column(db.Integer)
    cooking_points = db.Column(db.Integer)
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())

    roles = db.relationship(
        'Role',
        secondary='roles_users',
        backref=db.backref('users', lazy='dynamic'),
    )

    comments = db.relationship("Comment", backref="User",
                               cascade="all, delete-orphan", lazy="noload")
    ratings = db.relationship("Rating", backref="User",
                              cascade="all, delete-orphan", lazy="noload")
    recipes = db.relationship("Recipe", backref="User", 
                              cascade="all, delete-orphan", lazy="noload")

    def gets_comment(self):
        self.cooking_points += 3
    
    def loses_comment(self):
        self.cooking_points -= 3
        
    def comment_get_vote(self, good):
        self.cooking_points += 5 if good else -5

    def comment_votes_change(self, curr_vote, new_vote):
        if curr_vote != new_vote:
            self.cooking_points += 10 if new_vote else -10

    def gives_rating(self):
        self.cooking_points += 1

    def gives_vote(self, upvote):
        self.cooking_points += 1 if upvote else -1

    def changes_vote(self, curr_vote, new_vote):
        if curr_vote != new_vote:
            self.cooking_points += 2 if new_vote else -2

    def deletes_comment(self, popularity):
        if popularity > 0:
            self.cooking_points -= popularity*5
        else:
            self.cooking_points += popularity*5
    
    def deletes_recipe(self, recipe_rating):
        self.cooking_points -= recipe_rating
        
    def recalculate_points(self):
        """Worst case method to fall back on if needed"""
        pass
        #self.cooking_points = 0
        #self.cooking_points += sum([x.rating for x in self.ratings])

    def __repr__(self):
        return '<User %r>' % self.username

    def to_json(self):
        return {'id':self.id, 'email':self.email,
                'username':self.username, 
                'cooking_points':self.cooking_points}
