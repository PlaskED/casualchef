from casualchef.dbapp import db as db

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)

    category_recipes = db.relationship("CategoryRecipe", backref="Category", 
                                       cascade="all, delete-orphan", lazy="noload")

    def __repr__(self):
        return '<Category %r>' % self.name

    def to_json(self):
        return {'id':self.id, 'name':self.name}
