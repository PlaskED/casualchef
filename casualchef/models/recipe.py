from casualchef.dbapp import db as db
import time

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(64), nullable = False)
    description = db.Column(db.String(256), nullable = False)
    ingredients = db.Column(db.String(256), nullable = False)
    guide = db.Column(db.String(2048), nullable = False)
    picture_url = db.Column(db.String(256), nullable = False)
    rating = db.Column(db.Integer)
    raters = db.Column(db.Integer)
    published = db.Column(db.DateTime())

    categories = db.relationship("CategoryRecipe", backref="Recipe",
                                 cascade="all, delete-orphan", lazy="joined")
    ratings = db.relationship("Rating", backref="Recipe",
                                 cascade="all, delete-orphan", lazy="noload")
    comments = db.relationship("Comment", backref="Recipe",
                               cascade="all, delete-orphan", lazy="noload")

    def gets_rating(self, rating_object):
        self.ratings.append(rating_object)
        self.rating += rating_object.rating
        self.raters += 1
        
    def rating_changes(self, rating_object, new_rating):
        self.rating -= rating_object.rating
        rating_object.rating = new_rating
        rating_object.modified = True
        self.rating += new_rating

    def get_average_rating(self):
        if self.raters == 0:
            return self.raters
        return self.rating/self.raters

    def recalculate_rating(self):
        """Worst case method to fall back on if needed"""
        self.rating = sum([x.rating for x in self.ratings])

    def __repr__(self):
        return '<Recipe %r>' % self.name

    def to_json(self):
        return {'id':self.id, 'author':self.author,
                'name':self.name, 'description':self.description,
                'ingredients':self.ingredients, 'guide':self.guide,
                'picture_url':self.picture_url, 'rating':self.rating,
                'raters':self.raters,
                'published':self.published.strftime('%Y-%m-%d %H:%M:%S'),
                'categories': [c.category for c in self.categories]}
