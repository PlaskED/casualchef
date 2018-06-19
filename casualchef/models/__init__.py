from casualchef.dbapp import app as app
from casualchef.dbapp import db as db

roles_users = db.Table(
   'roles_users',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer, db.ForeignKey('role.id'))
)

from casualchef.models.role import Role as Role
from casualchef.models.user import User as User
from casualchef.models.recipe import Recipe as Recipe
from casualchef.models.category_recipe import CategoryRecipe as CategoryRecipe
from casualchef.models.category import Category as Category
from casualchef.models.rating import Rating as Rating
from casualchef.models.vote import Vote as Vote
from casualchef.models.comment import Comment as Comment
