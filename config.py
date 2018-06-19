DEBUG = True #Set to False in release
ERROR_404_HELP = True #Set to False in release

SECRET_KEY = 'secret_key' #generate your own key
DB_USER = 'root' #db user username
DB_PASSWORD = 'root' #db user password
DB = 'db' #db name

SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://{}:{}@localhost/{}'.format(DB_USER, DB_PASSWORD, DB) #Leave as is
SQLALCHEMY_TRACK_MODIFICATIONS = False #Leave as is
