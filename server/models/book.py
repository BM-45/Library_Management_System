# models/book.py
from flask_sqlalchemy import SQLAlchemy
from models import db



class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    isbn = db.Column(db.String(30), unique=True, nullable=False)
    image_url = db.Column(db.String(255))
    text_viewer = db.Column(db.Text)
    available_copies = db.Column(db.Integer, default=1)
    category = db.Column(db.String(100), nullable=True)
    checkouts = db.relationship('Checkout', backref='book', lazy=True)

    def __repr__(self):
        return f'<Book {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'isbn': self.isbn,
            'image_url': self.image_url,
            'text_viewer': self.text_viewer,
            'available_copies': self.available_copies
        }