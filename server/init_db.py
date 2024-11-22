# init_db.py
from models.book import db, Book
from app import create_app

def init_db():
    app = create_app()
    with app.app_context():
        db.create_all()

        # Check if the database is empty
        if Book.query.count() == 0:
            # Add sample books
            sample_books = [
                Book(
                    title="To Kill a Mockingbird",
                    author="Harper Lee",
                    isbn="9780446310789",
                    image_url="https://example.com/to_kill_a_mockingbird.jpg",
                    text_viewer="Sample text for To Kill a Mockingbird"
                ),
                Book(
                    title="1984",
                    author="George Orwell",
                    isbn="9780451524935",
                    image_url="https://example.com/1984.jpg",
                    text_viewer="Sample text for 1984"
                ),
                Book(
                    title="Pride and Prejudice",
                    author="Jane Austen",
                    isbn="9780141439518",
                    image_url="https://example.com/pride_and_prejudice.jpg",
                    text_viewer="Sample text for Pride and Prejudice"
                )
            ]

            db.session.add_all(sample_books)
            db.session.commit()
            print("Sample books added to the database.")
        else:
            print("Database already contains books. Skipping initialization.")

if __name__ == "__main__":
    init_db()