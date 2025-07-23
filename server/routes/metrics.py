from flask import Blueprint, jsonify, request
from sqlalchemy import text
from models import db
from datetime import datetime, timedelta

admin_bp = Blueprint('admin_bp', __name__)

@admin_bp.route('/metrics/overdue-books', methods=['GET'])
def overdue_books_summary():
    result = db.session.execute(text("""
        SELECT user_id, COUNT(*) AS overdue_count
        FROM checkout
        WHERE due_date < CURRENT_DATE AND status = 'checked_out'
        GROUP BY user_id
        ORDER BY overdue_count DESC;
    """))
    overdue_books = [{'user_id': row.user_id, 'overdue_count': row.overdue_count} for row in result]
    return jsonify(overdue_books)



@admin_bp.route('/metrics/most-borrowed-books', methods=['GET'])
def most_borrowed_books():
    # Calculate start and end dates for the last 6 months
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)  # Approximately 6 months

    try:
        result = db.session.execute(text("""
            SELECT book_id, COUNT(*) AS borrow_count
            FROM checkout
            WHERE checkout_date BETWEEN :start_date AND :end_date
            GROUP BY book_id
            ORDER BY borrow_count DESC
            LIMIT 10;
        """), {'start_date': start_date, 'end_date': end_date})
        
        most_borrowed = [{'book_id': row.book_id, 'borrow_count': row.borrow_count} for row in result]
        return jsonify(most_borrowed)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/metrics/memberships', methods=['GET'])
def memberships_summary():
    # Calculate start and end dates for the last 6 months
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)  # Approximately 6 months

    try:
        result = db.session.execute(text("""
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') AS month,
                COUNT(CASE WHEN created_at BETWEEN :start_date AND :end_date THEN 1 END) AS new_memberships,
                COUNT(CASE WHEN renewal_date BETWEEN :start_date AND :end_date THEN 1 END) AS renewals
            FROM user
            WHERE (created_at BETWEEN :start_date AND :end_date)
               OR (renewal_date BETWEEN :start_date AND :end_date)
            GROUP BY month
            ORDER BY month;
        """), {'start_date': start_date, 'end_date': end_date})
        
        memberships = [{'month': row.month, 'new_memberships': row.new_memberships, 'renewals': row.renewals} for row in result]
        #print(memberships)
        return jsonify(memberships)
    except Exception as e:
        return jsonify({'error': str(e)}), 500