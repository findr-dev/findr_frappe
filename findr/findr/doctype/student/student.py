# Copyright (c) 2024, Findr Study Dev Team and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils.data import cstr


class Student(Document):
 @frappe.whitelist()
 def add_courses(self,course_name,university,country,scholarship,deadline=None,course_link=None):
  self.append("course_list",{"course_name":course_name,"university":university,"country":country,"scholarship":scholarship,"deadline":deadline,"course_link":course_link})
  self.save()
 
 @frappe.whitelist()
 def delete_courses(self, row_id):
     for d in self.course_list:
         if cstr(d.name) == row_id:
             self.remove(d)
             break
     self.save()