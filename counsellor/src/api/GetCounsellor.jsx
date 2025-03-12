import { useFrappeGetDoc } from "frappe-react-sdk";
import React, { useEffect } from "react";

function GetCounsellor({ counsellorID, setAssignedCounsellor }) {
   const { data } = useFrappeGetDoc("User", counsellorID);

   useEffect(() => {
      if (data) {
         setAssignedCounsellor(data.full_name);
      }
   }, [data]);
   return null;
}

export default GetCounsellor;
