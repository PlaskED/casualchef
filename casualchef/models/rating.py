from casualchef.dbapp import db as db

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rater = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipe = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Rating %r>' % self.id

    def to_json(self):
        return {'id':self.id, 'rater':self.rater,
                'recipe':self.recipe, 'rating':self.rating}
