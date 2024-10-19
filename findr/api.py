import frappe
import hmac
import hashlib
import razorpay
import json
from frappe import _

secret_id = frappe.get_conf().razorpay_key_id
secret_key = frappe.get_conf().razorpay_key_secret

@frappe.whitelist(allow_guest=True)
def create_payment_order(amount,currency='INR'):
    client = razorpay.Client(auth=(secret_id, secret_key))
    data = {
        'amount': amount * 100,  # amount in paise
        'currency': currency, 
    }
    order = client.order.create(data=data)
    return order

@frappe.whitelist(allow_guest=True)
def verify_payment(razorpay_order_id, razorpay_payment_id, razorpay_signature):
    client = razorpay.Client(auth=(secret_id, secret_key))
    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })
        # Process the payment and update your database
        return {'status': 'success'}
    except Exception as e:
        return {'status': 'failed', 'message': str(e)}  