import os
from flask import Flask
from models import User
from database import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance', 'climate_forum.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

def set_admin(email):
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        if user:
            user.admin = True
            db.session.commit()
            print(f"User with email '{email}' is now an admin.")
        else:
            print(f"No user found with email '{email}'.")

if __name__ == "__main__":
    set_admin("user.climate.forum@gmail.com")

