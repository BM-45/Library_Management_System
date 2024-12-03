from flask import Blueprint, jsonify, request
from models import db
from models.book import Book
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

search_bp = Blueprint('search_bp', __name__)

@search_bp.route('/nlp-search', methods=['POST'])
def nlp_search():
    try:
        # Get search query from request
        query = request.json.get('query', '').lower()
        
        # Initialize NLTK components
        nltk.download('punkt')
        nltk.download('stopwords')
        nltk.download('wordnet')
        
        # Process the query
        tokens = word_tokenize(query)
        stop_words = set(stopwords.words('english'))
        lemmatizer = WordNetLemmatizer()
        
        # Extract key terms
        keywords = []
        categories = []
        
        for token in tokens:
            if token not in stop_words:
                lemma = lemmatizer.lemmatize(token)
                if lemma in ['fiction', 'novel', 'story']:
                    categories.append('Fiction')
                elif lemma in ['science', 'scientific', 'research']:
                    categories.append('Non-Fiction')
                else:
                    keywords.append(lemma)
        
        # Query the database
        query = Book.query
        
        if categories:
            query = query.filter(Book.category.in_(categories))
        
        # Add keyword filtering if needed
        for keyword in keywords:
            query = query.filter(
                (Book.title.ilike(f'%{keyword}%')) |
                (Book.title.ilike(f'%{keyword}%')) |
                (Book.text_viewer.ilike(f'%{keyword}%'))
            )
        
        books = query.limit(10).all()

        books_data = []
        for book in books:
            book_dict = book.to_dict()
            if book_dict['image_url']:
                # Convert relative path to full URL
                book_dict['image_url'] = f"http://localhost:8000{book_dict['image_url']}"
            books_data.append(book_dict)
        
        return jsonify({
            'books': books_data,
            'total': len(books)
        })
        
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500