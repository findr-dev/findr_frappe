// Copyright (c) 2024, Findr Study Dev Team and contributors
// For license information, please see license.txt

frappe.ui.form.on("Student", {
	refresh: async function(frm) {
        frm.add_custom_button(__("Add Courses"), function () {
            console.log("hello");
            frm.trigger("add_courses");
          });   
          let courses = frm.doc.course_list || [];
          console.log(courses)

          let student_course_html = frappe.render_template("student_courses", {
            courses: courses.map((c) => ({
                ...c
            }))
        });

        $(".course-section").remove();

        $(student_course_html).appendTo(
          frm.fields_dict["course_html"].wrapper
        );

        $(".course-section")
        .find(".edit-course-btn")
        .on("click", function () {
          frm.edit_btn = this;
          frm.trigger("edit_qualification");
        });
  
      $(".course-section")
        .find(".delete-course-btn")
        .on("click", function () {
          frm.delete_btn = this;
          frm.trigger("delete_courses");
        });
        
	},
  add_courses: function (frm) {
    var d = new frappe.ui.Dialog({
      title: __("Add a Course"),
      fields: [
        {
          label: "Course Name",
          fieldname: "course_name",
          fieldtype: "Data",
          reqd: 1,
        },
        {
          label: "University",
          fieldname: "university",
          fieldtype: "Data",
          reqd: 1,
        },
        {
          label: "Country",
          fieldname: "country",
          fieldtype: "Data",
          reqd: 1,
        },
        {
          label: "Scholarship",
          fieldname: "scholarship",
          fieldtype: "Data",
        },
        {
          label: "Deadline",
          fieldname: "deadline",
          fieldtype: "Date",
          reqd: 1,
        },
        {
          label: "Course Link",
          fieldname: "course_link",
          fieldtype: "Data",
          reqd: 1,
        },
      ],
      primary_action: function () {
        var data = d.get_values();
        frappe.call({
          method: "add_courses",
          doc: frm.doc,
          args: {
            course_name: data.course_name,
            university: data.university,
            country: data.country,
            scholarship: data.scholarship,
            deadline: data.deadline,
            course_link: data.course_link,
          },
          freeze: true,
          callback: function (r) {
            if (!r.exc) {
              frm.refresh();
            }
            d.hide();
          },
        });
      },
      primary_action_label: __("Add"),
    });
    d.show();
  },
  delete_courses(frm) {
    console.log("delete");
    var delete_btn = frm.delete_btn;
    let row_id = $(delete_btn).closest(".comment-content").attr("name");
    frappe.call({
      method: "delete_courses",
      doc: frm.doc,
      args: {
        row_id: row_id,
      },
      freeze: true,
      callback: function (r) {
        if (!r.exc) {
          frm.refresh();
        }
      },
    });
  },
});
