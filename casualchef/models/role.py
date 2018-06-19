from casualchef.dbapp import db as db

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    description = db.Column(db.String(128))

    def __repr__(self):
        return '<Role %r>' % self.name

    def to_json(self):
        return {'id':self.id, 'name':self.name,
                'description':self.description}
