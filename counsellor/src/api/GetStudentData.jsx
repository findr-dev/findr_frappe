import { useFrappeGetDoc } from "frappe-react-sdk";
import React, { useEffect } from "react";

function GetStudentData({ id, setStudentData }) {
   const { data } = useFrappeGetDoc("Student", id);

   useEffect(() => {
      if (data) {
         setStudentData(data);
      }
   }, [data]);
   return null;
}

export default GetStudentData;
