import { useFrappeGetDocList } from "frappe-react-sdk";
import React, { useEffect } from "react";

function GetStudentList({ filters, pageIndex, setStudentList }) {
   const { data } = useFrappeGetDocList("Student", {
      fields: [
         "name",
         "first_name",
         "last_name",
         "education_program",
         "course_list",
         "status",
      ],
      filters,
      limit_start: pageIndex,
      limit: 18,
      orderBy: {
         field: "modified",
         order: "asc",
      },
   });      

   useEffect(() => {
      if (data) setStudentList(data);
   }, [data]);

   return null;
}

export default GetStudentList;
