from casualchef import models, errorhelper
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
import time

from sqlalchemy import desc

def commitResponse(session, res, query_object=None):
    "Commits session and returns JSON response"""
    try:
        session.commit()
        if query_object is not None:
            res['data'] = query_object.to_json()
        else: #No query_object means deletion
            res['data'] = 'deletion ok'
    except:
        session.rollback()
    finally:
        return res

def currentTime():
    return time.strftime('%Y-%m-%d %H:%M:%S')

def getCategoryById(cid):
    return models.Category.query.get(cid)

def getCategoryByName(_name):
    return models.Category.query.filter_by(name=_name).first()

def getCommentById(cid):
    return models.Comment.query.get(cid)

def getRecipeName(rid):
    return models.Recipe.query.get(rid).name

def getAllCategories(index):
    categories = models.Category.query\
                    .filter(models.Category.id > index)\
                    .order_by(models.Category.id)\
                    .limit(10)
    return categories

def getUserComments(uid, index):
    base_comments = models.Comment.query\
                        .filter_by(author=uid)\
                        .filter(models.Comment.id > index)\
                        .order_by(models.Comment.id)\
                        .limit(10)
    comments = []
    for c in base_comments:
        c = c.to_json()
        del c['author']
        c['recipe'] = {'id': c['recipe'], 'name': getRecipeName(c['recipe'])}
        comments.append(c)
    return comments

def getCategoryRecipes(cid, index):
    base_recipes = models.Recipe.query\
                        .join(models.Recipe.categories, aliased=True)\
                        .filter_by(category=cid)\
                        .filter(models.Recipe.id > index)\
                        .order_by(models.Recipe.id)\
                        .limit(10)
    recipes = []
    for r in base_recipes:
        r = r.to_json()
        author = getUser(r['author']).to_json()
        r['author'] = {'id': author['id'], 'name': author['username']}
        del r['ingredients']
        del r['guide']
        r['categories'] = [getCategoryById(c).to_json() for c in r['categories']]
        recipes.append(r)
    return recipes

def getUserRecipes(uid, index):
    base_recipes = models.Recipe.query\
                        .filter_by(author=uid)\
                        .filter(models.Recipe.id > index)\
                        .order_by(models.Recipe.id)\
                        .limit(10)
    recipes = []
    for r in base_recipes:
        r = r.to_json()
        del r['author']
        del r['ingredients']
        del r['guide']
        r['categories'] = [getCategoryById(c).to_json() for c in r['categories']]
        recipes.append(r)
    return recipes

def getCommentVotes(cid):
    return models.Vote.query.filter_by(comment=cid).all()

def getRecipeComments(rid, index):
    base_comments = models.Comment.query\
                        .filter_by(recipe=rid)\
                        .filter(models.Comment.id > index)\
                        .order_by(models.Comment.id)\
                        .limit(10)
    comments = []
    for c in base_comments:
        c = c.to_json()
        author = getUser(c['author']).to_json()
        c['author'] = {'id': author['id'], 'name': author['username']}
        comments.append(c)
    return comments

def getTopCooks():
    return models.User.query.order_by(desc(models.User.cooking_points)).limit(10)

def getUser(uid):
    return models.User.query.get(uid)

def getTopRecipes(index):
    base_recipes = models.Recipe.query\
                        .filter(models.Recipe.id > index)\
                        .order_by(desc(models.Recipe.rating)).limit(5)
    recipes = []
    for r in base_recipes:
        r = r.to_json()
        author = getUser(r['author']).to_json()
        r['categories'] = [getCategoryById(c).to_json() for c in r['categories']]
        r['author'] = {'id': author['id'], 'name': author['username']}
        recipes.append(r)
    return recipes

def getRecipe(rid):
    recipe = models.Recipe.query.get(rid)
    recipe = recipe.to_json()
    author = getUser(recipe['author']).to_json()
    recipe['categories'] = [getCategoryById(c).to_json() for c in recipe['categories']]
    recipe['author'] = {'id': author['id'], 'name': author['username']}
    return recipe

def getUserByEmail(_email):
    return models.User.query.filter_by(email=_email).first()

def getUserByName(_username):
    return models.User.query.filter_by(username=_username).first()

def getUserByToken(token):
    s = Serializer(models.app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except SignatureExpired:
        return None #valid but expired token
    except BadSignature:
        return None #invalid token
    
    return getUser(data['id'])

def userExists(_username, _email):
    return getUserByName(_username) is not None \
        or getUserByEmail(_email) is not None

def getRole(rid):
    return models.Role.query.get(rid)

def createRole(obj):
    role_object = models.Role(
        name=obj['name'],
        description=obj['description']
    )
    models.db.session.add(role_object)
    return commitResponse(models.db.session, {}, role_object)

def addRoleToUser(user, role):
    user.roles.append(role)

def hashPassword(user, password):
    user.password_hash = pwd_context.hash(password)
    
def verifyPassword(user, password):
    return pwd_context.verify(password, user.password_hash)

def generateAuthToken(user, expiration = 600):
    s = Serializer(models.app.config['SECRET_KEY'], expires_in = expiration)
    return s.dumps({ 'id': user.id }) #Token id is same as user id

def createUser(obj):
    if userExists(obj['username'], obj['email']):
        return errorhelper.generateError('username or password already exist', 400)

    user_object = models.User(
        email=obj['email'],
        username=obj['username'],
        cooking_points = 0
    )
    hashPassword(user_object, obj['password'])
    addRoleToUser(user_object, getRole(1))
    models.db.session.add(user_object)

    return commitResponse(models.db.session, {}, user_object)

def createRecipe(obj):
   # ingredients = ''
    #for i in obj['ingredients']:
       # name += ('name' in i) ? +
            
       # "{}, {}, {}".format(i['name'], i['amount'], i['unit'])
    recipe_object = models.Recipe(
        author=obj['author'],
        name=obj['name'],
        description=obj['description'],
        #A bit hacky. Should store ingredients in database models.
        ingredients=' | '.join(["{}, {}, {}".format(i['name'], i['amount'], i['unit'])\
                     for i in obj['ingredients']]),
        guide=obj['guide'],
        picture_url=obj['picture_url'],
        rating=0,
        raters=0,
        published=currentTime()
    )

    user = getUser(obj['author'])
    if user is None:
        return errorhelper.generateError("user doesn't exist", 400)

    user.recipes.append(recipe_object)
        
    for category_name in obj['categories']:
        category_name = category_name.lower()
        exist_category = getCategoryByName(category_name)
        cr = models.CategoryRecipe()

        if exist_category is not None:
            exist_category.category_recipes.append(cr)
            recipe_object.categories.append(cr)
        else:
            new_category = models.Category(name=category_name)
            new_category.category_recipes.append(cr)

        recipe_object.categories.append(cr)

    res = commitResponse(models.db.session, {}, recipe_object)
    user = user.to_json()
    res['data']['categories'] = [getCategoryById(c).to_json() for c in res['data']['categories']]
    res['data']['author'] = {'id': user['id'], 'name': user['username']}
    return res
        

def createComment(obj):
    recipe_object = models.Recipe.query.get(obj['recipe'])
    if recipe_object is None:
        return errorhelper.generateError("recipe doesn't exist", 400)

    user = getUser(obj['author'])
    if user is None:
        return errorhelper.generateError("user doesn't exist", 400)

    recipe_author = getUser(recipe_object.author)
    if recipe_author is None:
        return errorhelper.generateError("recipe author doesn't exist", 400)

    comment_object = models.Comment(
        author=obj['author'], 
        recipe=obj['recipe'],
        text=obj['text'],
        popularity=0,
        voters=0,
        published=currentTime()
    )

    recipe_object.comments.append(comment_object)
    recipe_author.gets_comment()

    return commitResponse(models.db.session, {}, comment_object)

def deleteUser(uid):
    user_object = models.user_datastore.get_user(uid)
    if user_object is None:
        return generateError("user doesn't exist", 400)

    models.user_datastore.delete_user(user_object)

    return commitResponse(models.db.session, {})

def deleteRecipe(obj):
    recipe_object = models.Recipe.query.get(obj['id'])
    if recipe_object is None:
        return errorhelper.generateError("recipe doesn't exist", 400)

    recipe_author = getUser(recipe_object.author)
    if recipe_author is None:
        return errorhelper.generateError("recipe author doesn't exist", 400)

    recipe_author.deletes_recipe(recipe_object.rating)
    models.db.session.delete(recipe_object)
    
    return commitResponse(models.db.session, {})

def deleteComment(obj):
    comment_object = getCommentById(obj['id'])
    if comment_object is None:
        return errorhelper.generateError("comment doesn't exist", 400)
    
    recipe_object = getRecipe(comment_object.recipe)
    if recipe_object is None:
        return errorhelper.generateError("recipe doesn't exist", 400)
        
    recipe_author = getUser(recipe_object.author)
    if recipe_author is None:
        return errorhelper.generateError("recipe author doesn't exist", 400)

    user = getUser(obj['author'])
    if user is None:
        return errorhelper.generateError("user doesn't exist", 400)

    recipe_author.loses_comment()
    user.deletes_comment(comment_object.popularity)

    models.db.session.delete(comment_object)
    
    return commitResponse(models.db.session, {})

def voteComment(obj):
    comment_object = getCommentById(obj['comment'])
    if comment_object is None:
        return errorhelper.generateError("comment doesn't exist", 400)
        
    comment_author = getUser(comment_object.author)
    if comment_author is None:
        return errorhelper.generateError("comment author doesn't exist", 400)

    user = getUser(obj['voter'])
    if user is None:
        return errorhelper.generateError("user doesn't exist", 400)

    vote_object = models.Vote.query.filter_by(voter=obj['voter'],
                                       comment=obj['comment']).first()

    old_vote = 'new'
    if vote_object is None:
        vote_object = models.Vote(
            voter=obj['voter'], 
            comment=obj['comment'],
            good=obj['good']
        )
        
        user.gives_vote(vote_object.good)
        comment_object.gets_vote(vote_object)
        comment_author.comment_get_vote(vote_object.good)
    else:
        old_vote = 'changed' if vote_object.good != obj['good'] else 'unchanged' 
        user.changes_vote(vote_object.good, obj['good'])
        comment_author.comment_votes_change(vote_object.good, obj['good'])
        comment_object.vote_changes(vote_object, obj['good'])

    res = {}
    try:
        models.db.session.commit()
        res['data'] = vote_object.to_json()
        res['data']['old_vote'] = old_vote
    except:
        models.db.session.rollback()
    finally:
        return res

    return commitResponse(models.db.session, {}, vote_object)

def rateRecipe(obj):
    rating = obj['rating'] if 'rating' in obj else -1
    if rating < 0.5 or rating > 5:
        return errorhelper.generateError("rating must be 1-5 integer", 400)
    
    recipe_object = models.Recipe.query.get(obj['recipe'])
    if recipe_object is None:
        return errorhelper.generateError("recipe doesn't exist", 400)

    user = getUser(obj['rater'])
    if user is None:
        return errorhelper.generateError("user doesn't exist", 400)

    rating_object = models.Rating.query\
                        .filter_by(rater=obj['rater'], recipe=obj['recipe'])\
                        .first()
    old_rating = -1
    if rating_object is None:
        rating_object = models.Rating(
            rater=obj['rater'], 
            recipe=obj['recipe'],
            rating=obj['rating']
        )
        recipe_object.gets_rating(rating_object)
        user.gives_rating()
    else:
        old_rating = rating_object.rating
        recipe_object.rating_changes(rating_object, obj['rating'])

    res = {}
    try:
        models.db.session.commit()
        res['data'] = rating_object.to_json()
        res['data']['old_rating'] = old_rating
    except:
        models.db.session.rollback()
    finally:
        return res
