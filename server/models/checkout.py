from datetime import datetime
from models import db

class Checkout(db.Model):
    __tablename__ = 'checkout'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    checkout_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)
    returned_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='checked_out')
    overdue_fee = db.Column(db.Numeric(10, 2), default=0.00)

    user = db.relationship('User', backref=db.backref('checkout', lazy=True))
    

    def calculate_overdue_fee(self):
        if self.returned_date and self.returned_date > self.due_date:
            days_overdue = (self.returned_date - self.due_date).days
            self.overdue_fee = days_overdue * 1.00  # Assuming $1 per day overdue

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'checkout_date': self.checkout_date.isoformat(),
            'due_date': self.due_date.isoformat(),
            'returned_date': self.returned_date.isoformat() if self.returned_date else None,
            'status': self.status,
            'overdue_fee': float(self.overdue_fee)
        }
