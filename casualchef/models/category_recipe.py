from casualchef.dbapp import db as db

class CategoryRecipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    recipe = db.Column(db.Integer, db.ForeignKey('recipe.id'))
    category = db.Column(db.Integer, db.ForeignKey('category.id'))

    def __repr__(self):
        return '<CategoryRecipe %r>' % self.id

    def to_json(self):
        return {'id':self.id, 'recipe':self.recipe, 'category':self.category}
