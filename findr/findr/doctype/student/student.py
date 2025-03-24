# Copyright (c) 2024, Findr Study Dev Team and contributors
# For license information, please see license.txt

import frappe
# import bcrypt
from frappe.model.document import Document
from frappe.utils.data import cstr

# @frappe.whitelist(allow_guest=True)  # Allow API calls from React frontend
# def verify_student_login(email, entered_password):
#     """Authenticate student using email and password"""
#     student = frappe.db.get_value("Student", {"email": email}, ["name", "password"], as_dict=True)

#     if not student:
#         return{"status": "404", "message": "Account not found"}

#     stored_hash = student.password.encode("utf-8")
#     entered_password = entered_password.encode("utf-8")

#     if bcrypt.checkpw(entered_password, stored_hash):
#         salt = stored_hash[:29].decode("utf-8")
#         return {"status": "200", "message": "Login successful", "student_id": student.name, "salt": salt }
#     else:
#         return{"status": "401", "message": "Invalid credentials"}


class Student(Document):
    # def validate(self):
    #     """Hash the password before saving the Student document"""
    #     if self.password and not self.password.startswith("$2b$"):  # Prevent double hashing
    #         self.password = self.hash_password(self.password)

    # def hash_password(self, password):
    #     """Generate bcrypt hash for the password"""
    #     salt = bcrypt.gensalt()
    #     return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    @frappe.whitelist()
    def add_courses(self, course_name, university, country, scholarship, deadline=None, course_link=None):
        """Add courses to the student's course list"""
        self.append("course_list", {
            "course_name": course_name,
            "university": university,
            "country": country,
            "scholarship": scholarship,
            "deadline": deadline,
            "course_link": course_link
        })
        self.save()

    @frappe.whitelist()
    def delete_courses(self, row_id):
        """Remove a course from the student's course list"""
        for d in self.course_list:
            if cstr(d.name) == row_id:
                self.remove(d)
                break
        self.save()

  