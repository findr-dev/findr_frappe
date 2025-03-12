import { useFrappeGetDocList } from "frappe-react-sdk";
import React, { useEffect } from "react";

function GetCounsellorsList({ setCounsellors }) {
   const { data } = useFrappeGetDocList("User", {
      fields: ["name", "full_name"],
      filters: [["role_profile_name", "=", "Counsellor"]],
   });
   
   useEffect(() => {
      if (data) setCounsellors(data);
   }, [data]);

   return null
}

export default GetCounsellorsList;
