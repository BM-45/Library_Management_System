from app import create_app, db
from models.user import User
from models.book import Book
from models.checkout import Checkout
from datetime import datetime, timedelta
import random

def add_sample_checkouts():
    app = create_app()
    with app.app_context():
        # Get all users and books
        users = User.query.all()
        books = Book.query.all()

        # Create sample checkouts
        checkouts = [
            Checkout(
                user_id=random.choice(users).id,
                book_id=random.choice(books).id,
                checkout_date=datetime.now() - timedelta(days=random.randint(1, 30)),
                due_date=datetime.now() + timedelta(days=random.randint(1, 14)),
                status='checked_out'
            ) for _ in range(20)  # Create 20 sample checkouts
        ]

        # Add checkouts to the database
        db.session.add_all(checkouts)
        db.session.commit()

        print(f"{len(checkouts)} sample checkouts added successfully.")

if __name__ == "__main__":
    add_sample_checkouts()