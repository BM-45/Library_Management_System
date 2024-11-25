from datetime import datetime, timedelta
from models import db

class Checkout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    checkout_date = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime, default=lambda: datetime.utcnow() + timedelta(days=14))
    returned_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='checked_out')  # checked_out, returned, overdue

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'checkout_date': self.checkout_date.isoformat(),
            'due_date': self.due_date.isoformat(),
            'returned_date': self.returned_date.isoformat() if self.returned_date else None,
            'status': self.status
        }