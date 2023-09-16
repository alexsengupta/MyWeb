from app import app, db
from models import User
from models import Question


with app.app_context():
    existing_user = User.query.filter_by(email='newdummyuser@example.com').first()
    if existing_user:
        db.session.delete(existing_user)
        db.session.commit()
        print("User deleted.")
    else:
        print("No user found with the specified email.")

    dummy_user = User(name='DummyUser', email='newdummyuser@example.com', password='dummy_password', profile='Dummy Profile')
    db.session.add(dummy_user)
    db.session.commit()

    dummy_question = Question(title='Dummy Question', content='This is a dummy question.', user_id=dummy_user.id)
    db.session.add(dummy_question)
    db.session.commit()

