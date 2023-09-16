from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import models
from database import db
from flask import Flask, render_template, url_for, flash, redirect, request, abort
from forms import RegistrationForm, LoginForm, UpdateAccountForm
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask import session
from models import User, Question, Answer
#from forms import RegistrationForm, LoginForm, UpdateAccountForm, QuestionForm, AnswerForm, UpdatePasswordForm
from forms import RegistrationForm, LoginForm, UpdateAccountForm, UpdatePasswordForm
from werkzeug.security import generate_password_hash, check_password_hash
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///climate_forum.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'mysecretkeystring'


db.init_app(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Add this function to create the database schema
def create_database():
    with app.app_context():
        db.create_all()


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
        hashed_password = generate_password_hash(form.password.data, method="pbkdf2:sha256", salt_length=8)
        user = User(username=form.username.data, email=form.email.data, password=hashed_password, profile=form.profile.data, notifications=form.notifications.data)
        db.session.add(user)
        db.session.commit()
        flash(f'Account created for {form.username.data}!', 'success')
        login_user(user)
        return redirect(url_for('climate_model_forum'))
    return render_template('register.html', title='Register', form=form)

    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data)
        user = User(username=form.username.data, email=form.email.data, password=hashed_password, profile=form.profile.data, notifications=form.notifications.data)
        db.session.add(user)
        db.session.commit()
        flash(f'Account created for {form.username.data}!', 'success')
        login_user(user)
        return redirect(url_for('climate_model_forum'))
    return render_template('register.html', title='Register', form=form)

@app.route("/login", methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and check_password_hash(user.password, form.password.data):
            login_user(user)
            flash('Logged in successfully.', 'success')
            return redirect(url_for('climate_model_forum'))
        else:
            flash('Login failed. Check your email and password.', 'danger')
    return render_template('login.html', title='Login', form=form)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash("You have been logged out.", "success")
    return redirect(url_for("climate_model_forum"))

@app.route('/climate-model-forum/add-question', methods=['GET', 'POST'])
@login_required
def add_question():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        user_id = current_user.id
        question = Question(title=title, content=content, user_id=user_id)
        db.session.add(question)
        db.session.commit()

        # Send email to the admin
        admin_email = "admin@example.com"  # Replace with the admin's email address
        subject = f"Climate Model Forum: {title}"
        body = f"Question posted by {current_user.username}:\n\n{content}\n\nTo stop receiving notifications, please uncheck your notifications in the Climate Model Forum Account Settings."
        send_email([admin_email], subject, body)

        return redirect(url_for('climate_model_forum'))
    return render_template('add_question.html')


@app.route('/climate-model-forum/question/<int:question_id>/add-response', methods=['POST'])
@login_required
def add_response(question_id):
    question = Question.query.get_or_404(question_id)
    content = request.form['content']
    user_id = current_user.id
    answer = models.Answer(content=content, user_id=user_id, question_id=question_id)
    db.session.add(answer)
    db.session.commit()

    # Send email to the user who posted the question
    if question.author.notifications:  # Only send if the user has notifications enabled
        subject = f"Climate Model Forum: {question.title}"
        body = f"Question posted by {question.author.username}:\n\n{question.content}\n\n"
        body += f"New answer posted by {current_user.username}:\n\n{content}\n\n"
        body += "To stop receiving notifications, please uncheck your notifications in the Climate Model Forum Account Settings."
        send_email([question.author.email], subject, body)

    return redirect(url_for('question', question_id=question_id))



@app.route('/climate-model-forum/question/<int:question_id>/delete', methods=['POST'])
@login_required
def delete_question(question_id):
    question = Question.query.get_or_404(question_id)
    if not current_user.admin:
        abort(403)

    answers = Answer.query.filter_by(question_id=question_id).all()
    for answer in answers:
        db.session.delete(answer)

    db.session.delete(question)
    db.session.commit()
    flash('Question has been deleted.', 'success')
    return redirect(url_for('climate_model_forum'))


@app.route('/climate-model-forum/question/<int:question_id>/delete-answer/<int:answer_id>', methods=['POST'])
@login_required
def delete_answer(question_id, answer_id):
    answer = Answer.query.get_or_404(answer_id)
    if current_user.admin:
        db.session.delete(answer)
        db.session.commit()
    return redirect(url_for('question', question_id=question_id))



@app.route("/account", methods=["GET", "POST"])
@login_required
def account():
    form_account = UpdateAccountForm(request.form, prefix="account")
    form_password = UpdatePasswordForm(request.form, prefix="password")

    if request.method == "POST":
        print("POST request received.")
        print("Request form data:", request.form)

        if 'submit' in request.form:
            form_account.submit.data = True

        if 'submit_password' in request.form:
            form_password.submit_password.data = True

    print("Account form submit data:", form_account.submit.data)  # Debugging line
    print("Password form submit data:", form_password.submit_password.data)  # Debugging line


    if form_account.submit.data:
        if form_account.validate_on_submit():
            current_user.username = form_account.username.data
            current_user.email = form_account.email.data
            current_user.profile = form_account.profile.data
            current_user.notifications = form_account.notifications.data
            db.session.commit()
            flash("Your account has been updated.", "success")
            return redirect(url_for("account"))

    if form_password.submit_password.data:
        print("Password form submitted.")  # Debugging line
        print(f"Stored password hash: {current_user.password}")  # Debugging line
        if form_password.validate_on_submit():
            if check_password_hash(current_user.password, form_password.current_password.data):
                hashed_password = generate_password_hash(form_password.new_password.data, method="pbkdf2:sha256", salt_length=8)
                current_user.password = hashed_password
                db.session.commit()
                flash("Your password has been updated.", "success")
                return redirect(url_for("account"))
            else:
                flash("Incorrect current password.", "danger")
                print("Incorrect current password.")  # Debugging line
        else:
            print("Form data:", request.form)  # Debugging line
            print("Password form errors:", form_password.errors)  # Debugging line

    form_account.username.data = current_user.username
    form_account.email.data = current_user.email
    form_account.profile.data = current_user.profile
    form_account.notifications.data = current_user.notifications

    return render_template("account.html", title="Account", form_account=form_account, form_password=form_password)


def send_email(to_email, subject, content):
    message = Mail(
        from_email='a.sengupta@unsw.edu.au',
        to_emails=to_email,
        subject=subject,
        html_content=content)

    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        #sg = SendGridAPIClient('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')
        response = sg.send(message)
        print("Fresponse.status_code:", response.status_code)
    except Exception as e:
        print(e)


if __name__ == '__main__':
    create_database()  # Add this line to create the database schema
    app.run(debug=True, use_reloader=False)
