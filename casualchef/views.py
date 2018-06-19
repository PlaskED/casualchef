from casualchef import app, dbapi, errorhelper
from flask import request, redirect, jsonify, g

from flask_cors import CORS, cross_origin
CORS(app)

from flask_httpauth import HTTPBasicAuth
auth = HTTPBasicAuth()

def handleResponse(res, success=200):
    response = jsonify(res)
    if 'data' in res:
        response.status_code = success
    elif 'error' in res:    
        response.status_code = res['error']['code']
    else:
        response = jsonify(errorhelper.generateError(500, 
                                'internal server error'))
        response.status_code = 500
    return response

def invalidUser(user, password):
    if user is None:
        return True
    if dbapi.verifyPassword(user, password) is False:
        return True

@auth.verify_password #Method called on @auth.login_required decorators
def verifyPassword(uname_or_token, password):
    user = dbapi.getUserByToken(uname_or_token) #try token:unused auth
    if user is None: #try user:pass auth
        user = dbapi.getUserByName(uname_or_token)
        if invalidUser(user, password):
            return False
    g.user = user
    return True

@app.route('/api/token/get', methods=['GET'])
@auth.login_required
def getAuthToken():
    token = dbapi.generateAuthToken(g.user)
    res = {}
    res['data'] = {
        'token': token.decode('ascii') 
    }
    return handleResponse(res, 200)

@app.route('/api/token/refresh', methods=['POST'])
@cross_origin(headers=['Content-Type']) # Send Access-Control-Allow-Headers
def refreshAuthToken():
    obj = request.get_json(silent=True)
    if (obj['token'] is None):
        err = errorhelper.generateError("no token", 400)
        return handleResponse(err)
    user = dbapi.getUserByToken(obj['token']) #try token:unused auth
    if user is None: #try user:pass auth
        err = errorhelper.generateError("invalid token {}".format(obj['token']), 400)
        return handleResponse(err)
    #For now generate a new token 
    token = dbapi.generateAuthToken(user)
    res = {}
    res['data'] = {
        'token': token.decode('ascii') 
    }
    return handleResponse(res, 200)
    
@app.route('/api/profile/user', methods=['GET'])
@auth.login_required
@cross_origin(headers=['Content-Type'])
def user():
    res = {}
    res['data'] = g.user.to_json()

    return handleResponse(res)

@app.route('/api/register', methods=['POST'])
def register():
    obj = request.get_json(silent=True)
    res = dbapi.createUser(obj)

    return handleResponse(res, 201)

@app.route('/api/toprecipes/<int:index>', methods=['GET'])
def getTopRecipes(index):
    res = {}
    res['data'] = dbapi.getTopRecipes(index)

    return handleResponse(res)

@app.route('/api/recipe/<int:rid>', methods=['GET'])
def getRecipe(rid):
    res = {}
    recipe = dbapi.getRecipe(rid)
    if recipe is None:
        err = errorhelper.generateError("recipe doesn't exist", 400)
        return handleResponse(err)

    res['data'] = recipe

    return handleResponse(res)

@app.route('/api/category/<int:cid>/<int:index>', methods=['GET'])
def getCategoryRecipes(cid, index):
    res = {}
    res['data'] = dbapi.getCategoryRecipes(cid, index)
    
    return handleResponse(res)

@app.route('/api/recipe/<int:rid>/comments/<int:index>', methods=['GET'])
def getRecipeComments(rid, index):
    res = {}
    res['data'] = dbapi.getRecipeComments(rid, index)

    return handleResponse(res)

@app.route('/api/profile/comments/<int:index>', methods=['GET'])
@auth.login_required
@cross_origin(headers=['Content-Type'])
def getUserComments(index):
    res = {}
    res['data'] = dbapi.getUserComments(g.user.id, index)
    
    return handleResponse(res)

@app.route('/api/profile/recipes/<int:index>', methods=['GET'])
@auth.login_required
@cross_origin(headers=['Content-Type'])
def getUserRecipes(index):
    res = {}
    res['data'] = dbapi.getUserRecipes(g.user.id, index)
    
    return handleResponse(res)

@app.route('/api/vote/comment', methods=['POST'])
@auth.login_required
@cross_origin(headers=['Content-Type'])
def voteComment():
    obj = request.get_json(silent=True)
    obj['voter'] = g.user.id
    res = dbapi.voteComment(obj)

    return handleResponse(res, 200)

@app.route('/api/rate/recipe', methods=['POST'])
@auth.login_required
@cross_origin(headers=['Content-Type'])
def rateRecipe():
    obj = request.get_json(silent=True)
    obj['rater'] = g.user.id
    res = dbapi.rateRecipe(obj)

    return handleResponse(res, 200)

@app.route('/api/create/recipe', methods=['POST'])
@auth.login_required
@cross_origin(headers=['Content-Type'])
def createRecipe():
    obj = request.get_json(silent=True)
    obj['author'] = g.user.id
    print(obj['ingredients'])
    res = dbapi.createRecipe(obj)

    return handleResponse(res, 200)

@app.route('/api/create/comment', methods=['POST'])
@auth.login_required
@cross_origin(headers=['Content-Type'])
def createComment():
    obj = request.get_json(silent=True)
    obj['author'] = g.user.id
    res = dbapi.createComment(obj)

    return handleResponse(res, 200)

@app.route('/api/delete/user', methods=['DELETE'])
@auth.login_required
def deleteUser():
    res = dbapi.deleteUser(g.user.id)

    return handleResponse(res, 204)

@app.route('/api/delete/recipe', methods=['DELETE'])
@auth.login_required
def deleteRecipe():
    obj = request.get_json(silent=True)
    if g.user.id is not obj['author']:
        err = errorhelper.generateError('incorrect user id', 400)
        return handleResponse(err)
    res = dbapi.deleteRecipe(obj)

    return handleResponse(res, 204)

@app.route('/api/delete/comment', methods=['DELETE'])
@auth.login_required
def deleteComment():
    obj = request.get_json(silent=True)
    if g.user.id is not obj['author']:
        err = errorhelper.generateError("incorrect user id", 400)
        return handleResponse(err)
    res = dbapi.deleteComment(obj)

    return handleResponse(res, 204)

@app.errorhandler(404)
def pageNotFound(error):
    return "Page not found", 404

@app.errorhandler(500)
def serverError(error):
    return "Woops.. appears the server has problems at the moment :(", 500
