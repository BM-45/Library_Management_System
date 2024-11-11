# models/book.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    isbn = db.Column(db.String(13), unique=True, nullable=False)
    image_url = db.Column(db.String(255))
    text_viewer = db.Column(db.Text)

    def __repr__(self):
        return f'<Book {self.title}>'