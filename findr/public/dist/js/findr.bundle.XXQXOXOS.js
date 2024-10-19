(() => {
  // frappe-html:/workspace/development/frappe-bench/apps/findr/findr/public/js/templates/student_courses.html
  frappe.templates["student_courses"] = `<div class="course-section mx-5">
	<div class="all-course">
    <h5>Courses List</h5>
        {% if (courses.length) { %}
        <table class="comment-content row" style="width: 100%; padding: 10px; border: 1px solid rgba(122, 117, 117, 0.619); border-radius: 12px; object-fit: contain;" >
            <th class="font-weight-bold" style="width: 190px;">Course</th>
            <th class="font-weight-bold" style="width: 190px;">University</th>
            <th class="font-weight-bold" style="width: 190px;">Country</th>
            <th class="font-weight-bold" style="width: 190px;">Deadline</th>
            <th class="font-weight-bold" style="width: 190px;">Scholarship</th>
            <th class="font-weight-bold" style="width: 190px;">Actions</th>
            {% for(var i=0, l=courses.length; i<l; i++) { %}
                <tr class="comment-content" name="{{ courses[i].name }}">
                    <td class="font-weight-bold course_name">
                        {{ courses[i].course_name }}
                    </td>
                    <td class="university">
                        {{ courses[i].university }}
                    </td>       
                    <td class="country">
                        {{ courses[i].country }} 
                    </td>
                    <td class="deadline">
                        {{ courses[i].deadline }}
                    </td>
                    <td class="scholarship">
                        {{ courses[i].scholarship }}
                    </td>
                    <td class="">
                        <span class="delete-course-btn  btn btn-link pl-2">
                            <svg class="icon icon-sm"><use xlink:href="#icon-delete"></use></svg>
                        </span>
                    </td>
                </tr>
            </div>
        {% } %}
        </table>
    {% } %}
</div>
    
</div>
`;
})();
//# sourceMappingURL=findr.bundle.XXQXOXOS.js.map