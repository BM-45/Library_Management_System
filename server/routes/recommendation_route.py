from flask import Blueprint, jsonify, request
from models import db
from models.user import User
from models.book import Book
from models.checkout import Checkout
from sqlalchemy import func
from collections import Counter
import random

recommend_bp = Blueprint('recommend_bp', __name__)

@recommend_bp.route('/recommendations/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    try:
        # Get user's checkout history
        user_checkouts = Checkout.query.filter_by(user_id=user_id).all()
        
        # Get categories of books the user has checked out
        user_categories = [checkout.book.category for checkout in user_checkouts]
        
        # Find most common categories
        common_categories = Counter(user_categories).most_common()
        
        # Get recommendations based on common categories
        recommendations = []
        for category, _ in common_categories:
            category_books = Book.query.filter_by(category=category)\
                                 .order_by(func.random())\
                                 .limit(5)\
                                 .all()
            recommendations.extend(category_books)
        
        # Remove duplicates and books user has already checked out
        checked_out_ids = [checkout.book_id for checkout in user_checkouts]
        unique_recommendations = list({book.id: book for book in recommendations if book.id not in checked_out_ids}.values())
        
        # If recommendations are empty, randomly select 4 books
        if not unique_recommendations:
            unique_recommendations = Book.query.order_by(func.random()).limit(4).all()
        else:
            # Limit to top 10 recommendations
            unique_recommendations = unique_recommendations[:10]
        
        books_data = []
        for book in unique_recommendations:
            book_dict = book.to_dict()
            if book_dict['image_url']:
                # Convert relative path to full URL
                book_dict['image_url'] = f"http://localhost:8000{book_dict['image_url']}"
            books_data.append(book_dict)

        return jsonify({
            'user_id': user_id,
            'recommendations': books_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500