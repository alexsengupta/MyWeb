from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import models
from models import Question
from database import db
from flask import Flask, render_template, url_for, flash, redirect
from forms import RegistrationForm, LoginForm
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from models import User
from flask import session


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///climate_forum.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'mysecretkeystring'

db.init_app(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/climate-model-forum')
def climate_model_forum():
    questions = Question.query.order_by(Question.date_posted.desc()).all()
    return render_template('climate_model_forum.html', questions=questions)

@app.route('/climate-model-forum/question/<int:question_id>')
def question(question_id):
    question = models.Question.query.get_or_404(question_id)
    answers = models.Answer.query.filter_by(question_id=question_id).order_by(models.Answer.date_posted.desc()).all()
    return render_template('question.html', question=question, answers=answers)

@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data)
        user = User(username=form.username.data, email=form.email.data, password=hashed_password, profile=form.profile.data, notifications=form.notifications.data)
        db.session.add(user)
        db.session.commit()
        flash(f'Account created for {form.username.data}!', 'success')
        return redirect(url_for('climate_model_forum'))
    return render_template('register.html', title='Register', form=form)

@app.route("/login", methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and check_password_hash(user.password, form.password.data):
            session["user_id"] = user.id
            flash('Logged in successfully.', 'success')
            return redirect(url_for('climate_model_forum'))
        else:
            flash('Login failed. Check your email and password.', 'danger')
    return render_template('login.html', title='Login', form=form)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
