import React, { useEffect, useState } from "react";
import StudentList from "../components/StudentList";
import GetStudentList from "../api/GetStudentList";
import { useNavigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";

function AllStudentsPage() {
   const navigate = useNavigate();
   const [pageIndex, setPageIndex] = useState(0);
   const { roleProfile } = useRole();

   const [filters, setFilters] = useState([]);

   const [fetchStudentList, setFetchStudentList] = useState(false);
   const [data, setData] = useState([]);

   useEffect(() => {
      if (roleProfile == "Master Auditor") {
         setFilters([["registration_fee", "=", "1"]]);
         setFetchStudentList(true);
      }
   }, [roleProfile]);

   return (
      <>
         <div className="studentSection container lg:px-24 px-4 py-24">
            <button
               className="text-[#0f6990] text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 hover:bg-[#0f6990] hover:text-white transition ease-in-out duration-300"
               onClick={() => navigate(-1)}
            >
               &lt; Go back
            </button>
            <h1 className="text-4xl text-[#0f6990] ">Students List</h1>

            <StudentList
               data={data}
               pageIndex={pageIndex}
               setPageIndex={setPageIndex}
            />
         </div>
         {fetchStudentList && (
            <GetStudentList
               filters={filters}
               pageIndex={pageIndex}
               setStudentList={setData}
            />
         )}
      </>
   );
}

export default AllStudentsPage;
