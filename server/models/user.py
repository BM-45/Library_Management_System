from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from models import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)  # 'admin', 'member', 'free'
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.now(), nullable=False)  # Automatically set on creation
    renewal_date = db.Column(db.TIMESTAMP, nullable=True)  # Nullable for users who haven't renewed

    def __init__(self, username, email, password, user_type):
        self.username = username
        self.email = email
        self.set_password(password)
        self.user_type = user_type

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'user_type': self.user_type,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'renewal_date': self.renewal_date.isoformat() if self.renewal_date else None
        }