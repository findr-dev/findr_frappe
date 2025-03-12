import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";

function StudentList({ data, pageIndex, setPageIndex }) {
   const { roleProfile } = useRole();
   const navigate = useNavigate();
   return (
      <>
         {data.length > 0 ? (
            <>
               <div className="cardLayout mt-8 flex flex-wrap justify-center align-middle gap-6">
                  {data.map((student, index) => (
                     <div
                        className="group card w-full lg:w-1/4 rounded-2xl shadow-2xl p-7 cursor-pointer bg-white hover:bg-[#0f6990] transition ease-in-out duration-300"
                        key={index}
                        onClick={() => navigate(`/students/${student.name}`)}
                     >
                        <div className="flex gap-2">
                           <span className="material-symbols-outlined text-[#0f6990] group-hover:text-white">
                              face
                           </span>
                           <div>
                              <p className="text-sm text-[#0f6990] group-hover:text-white">
                                 {student.name}
                              </p>
                              <h3 className="group-hover:text-white">
                                 {student.first_name} {student.last_name}
                              </h3>
                              <p className="text-sm text-gray-600 group-hover:text-white">
                                 Looking for {student.education_program}
                              </p>
                              <p className="text-sm text-gray-600 group-hover:text-white">
                                 Status : {student.status}
                              </p>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="mt-8 flex flex-wrap justify-center align-middle gap-6">
                  {pageIndex > 0 && (
                     <button
                        onClick={() => setPageIndex(pageIndex - 12)}
                        className="text-white mt-2 px-5 py-2 shadow-lg rounded-xl bg-[#0f6990] hover:translate-x hover:scale-105 transition ease-in-out duration-300"
                     >
                        Previous
                     </button>
                  )}
                  <button
                     onClick={() => setPageIndex(pageIndex + 12)}
                     className="text-white mt-2 px-5 py-2 shadow-lg rounded-xl bg-green-600 hover:translate-x hover:scale-105 transition ease-in-out duration-300"
                  >
                     Next
                  </button>
               </div>
            </>
         ) : (
            <>
               <div className="mt-8 flex flex-wrap justify-center">
                  <h1>No Students</h1>
               </div>
            </>
         )}
      </>
   );
}

export default StudentList;
