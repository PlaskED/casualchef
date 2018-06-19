from casualchef import models
from casualchef import dbapi

import sys

def generate_roles():
    dbapi.createRole({'name':'chef', 
                      'description':'account rank 1'})
    dbapi.createRole({'name':'professional chef', 
                      'description':'account rank 2'})
    dbapi.createRole({'name':'master chef', 
                      'description':'account rank 3'})
    dbapi.createRole({'name':'admin', 
                      'description':'admin rank'})
def generate_n_users(n):
    """Generates n test users"""
    for x in range(1, n+1):
        dbapi.createUser({
            'email':'test{}@test'.format(x),
            'username':'test{}'.format(x),
            'password':'test{}'.format(x)
        })

def init_db(n=0):
    with models.app.app_context():
        models.db.drop_all()
        models.db.create_all()
        generate_roles()
        if n != 0:
            generate_n_users(n)

if __name__ == "__main__":
    n = 0
    if len(sys.argv) == 2:
        n = int(sys.argv[1])
    init_db(n)
