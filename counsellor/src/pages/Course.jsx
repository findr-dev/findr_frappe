import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useState } from "react";
import {
   Dialog,
   DialogBackdrop,
   DialogPanel,
   DialogTitle,
} from "@headlessui/react";
import { useFrappeGetDoc, useFrappeUpdateDoc } from "frappe-react-sdk";
import { toast } from "react-toastify";

function Course() {
   const navigate = useNavigate();
   const { id } = useParams();
   const { register, handleSubmit } = useForm();
   const { updateDoc } = useFrappeUpdateDoc();
   const [open, setOpen] = useState(false);
   const [deleteId, setDeleteId] = useState(0);
   const [modal2open, setModal2open] = useState(false);

   const { data, isLoading } = useFrappeGetDoc("Student", id);

   const onSubmit = (formData) => {
      const {
         course_name,
         course_deadline,
         course_link,
         university,
         country,
         scholarship_name,
         scholarship_deadline,
         how_to,
      } = formData;

      if (
         !course_name ||
         !course_deadline ||
         !course_link ||
         !university ||
         !country ||
         !scholarship_name ||
         !scholarship_deadline ||
         !how_to
      ) {
         const courseListArray = data.course_list;
         courseListArray.push(formData);

         const course_added = 0;

         if(data.course_list.length <1) course_added = 0;
         else course_added = 1;

         updateDoc("Student", id, {
            course_list: courseListArray,
            course_added
         })
            .then(() => toast.success("Course updated"))
            .catch((err) => {
               toast.warning("Some internal error");
               console.error(err);
            });
      }
   };

   const handleDelete = (index) => {
      setModal2open(false);
      data.course_list.splice(index, 1);
      const newCourseList = data.course_list;
      updateDoc("Student", id, {
         course_list: newCourseList,
      })
         .then(() => toast.success("Course removed"))
         .catch((err) => {
            toast.warning("Some internal error");
            console.error(err);
         });
   };

   return (
      <div className="container lg:px-26 py-24">
         <div className="lg:mx-16 px-4">
            <div className="flex justify-between">
               <button
                  className="text-[#0f6990] text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 hover:bg-[#0f6990] hover:text-white transition ease-in-out duration-300"
                  onClick={() => navigate(-1)}
               >
                  &lt; Go back
               </button>
               <button
                  className="text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 bg-[#0f6990] text-white transition ease-in-out duration-300"
                  onClick={() => setOpen(true)}
               >
                  Add Course
               </button>
            </div>
            <h2 className="text-3xl lg:text-5xl text-[#0f6990] py-5">
               Courses
            </h2>
            {isLoading ? (
               <div className="h-dvh flex justify-center align-middle">
                  <div className="loader"></div>
               </div>
            ) : (
               <div id="courseListContainer" className="flex justify-center">
                  <table className="table-auto text-white w-full text-xs md:text-base lg:w-4/5 text-center border border-[#0f6990] rounded">
                     <thead className="bg-[#0f6990]">
                        <tr>
                           <th className="lg:px-10 py-2 w-1/3">Course Name</th>
                           <th className="lg:px-10 py-2 w-2/3">University</th>
                           <th className="lg:px-10 py-2">Action</th>
                        </tr>
                     </thead>
                     <tbody className=" text-[#0f6990]">
                        {data.course_list.map((course, index) => (
                           <tr key={course.idx}>
                              <td className="py-1">{course.course_name}</td>
                              <td className="py-1">{course.university}</td>
                              <td className="py-1">
                                 <span
                                    className=" flex justify-center align-middle material-symbols-outlined text-red-600 cursor-pointer"
                                    onClick={() => {
                                       setDeleteId(index);
                                       setModal2open(true);
                                    }}
                                 >
                                    delete_forever
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}

            {/* Course Modal Dialog Box */}
            <Dialog open={open} onClose={setOpen} className="relative z-10">
               <DialogBackdrop
                  transition
                  className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
               />
               <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                     <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                     >
                        <div className="bg-white px-4 pb-4 lg:pt-5 sm:p-6 sm:pb-4">
                           <div>
                              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                 <DialogTitle className="text-2xl font-semibold text-[#0f6990] py-5">
                                    Add Course
                                 </DialogTitle>
                                 <div className="flex justify-center">
                                    <form
                                       onSubmit={handleSubmit(onSubmit)}
                                       className="flex flex-wrap"
                                    >
                                       <div className="w-full py-1">
                                          <label>Course Name</label>
                                          <input
                                             {...register("course_name")}
                                             className="border rounded-lg px-2 text-[#0f6990] focus:outline-none p-1 w-full"
                                          />
                                       </div>

                                       <div className="w-full py-1">
                                          <label>University Name</label>
                                          <input
                                             {...register("university")}
                                             className="border rounded-lg px-2 text-[#0f6990] focus:outline-none p-1 w-full"
                                          />
                                       </div>

                                       <div className="w-full py-1">
                                          <label>Country</label>
                                          <input
                                             {...register("country")}
                                             className="border rounded-lg px-2 text-[#0f6990] focus:outline-none p-1 w-full"
                                          />
                                       </div>

                                       <div className="w-full py-1">
                                          <label>Scholarship</label>
                                          <input
                                             {...register("scholarship")}
                                             className="border rounded-lg px-2 text-[#0f6990] focus:outline-none p-1 w-full"
                                          />
                                       </div>

                                       <div className="w-full py-1">
                                          <label>Scholarship Deadline</label>
                                          <input
                                             {...register(
                                                "scholarship_deadline"
                                             )}
                                             className="border rounded-lg px-2 text-[#0f6990] focus:outline-none p-1 w-full"
                                          />
                                       </div>

                                       <div className="w-full py-1">
                                          <label>Course Link</label>
                                          <input
                                             {...register("course_link")}
                                             className="border rounded-lg px-2 text-[#0f6990] focus:outline-none p-1 w-full"
                                          />
                                       </div>

                                       <div className="w-full py-1">
                                          <label>Course Deadline</label>
                                          <input
                                             {...register("course_deadline")}
                                             className="border rounded-lg px-2 text-[#0f6990] focus:outline-none p-1 w-full"
                                          />
                                       </div>

                                       <div className="w-full py-1">
                                          <label>
                                             How to apply for scholarship?
                                          </label>
                                          <input
                                             {...register("how_to")}
                                             className="border rounded-lg px-2 text-[#0f6990] focus:outline-none p-1 w-full"
                                          />
                                       </div>
                                       <button
                                          type="submit"
                                          onClick={() => setOpen(false)}
                                          className="mt-3 bg-green-800 text-white py-2 px-3 w-full rounded-md :hover:scale-110 transition ease-in-out duration-300"
                                       >
                                          Add Course
                                       </button>
                                       <button
                                          type="button"
                                          data-autofocus
                                          onClick={() => setOpen(false)}
                                          className="mt-3 w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                       >
                                          Cancel
                                       </button>
                                    </form>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </DialogPanel>
                  </div>
               </div>
            </Dialog>

            {/* Course delete confirmation dialog box */}
            <Dialog
               open={modal2open}
               onClose={setModal2open}
               className="relative z-10"
            >
               <DialogBackdrop
                  transition
                  className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
               />
               <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                     <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                     >
                        <div className="bg-white px-4 pb-4 lg:pt-5 sm:p-6 sm:pb-4">
                           <div>
                              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                 <DialogTitle className="text-2xl font-semibold text-[#0f6990] py-5">
                                    Are you sure to delete this course?
                                 </DialogTitle>
                                 <button
                                    type="submit"
                                    onClick={() => handleDelete(deleteId)}
                                    className="mt-3 bg-red-700 text-white py-2 px-3 w-full rounded-md :hover:scale-110 transition ease-in-out duration-300"
                                 >
                                    Confirm Delete
                                 </button>
                                 <button
                                    type="button"
                                    data-autofocus
                                    onClick={() => setModal2open(false)}
                                    className="mt-3 w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                 >
                                    Cancel
                                 </button>
                              </div>
                           </div>
                        </div>
                     </DialogPanel>
                  </div>
               </div>
            </Dialog>
         </div>
      </div>
   );
}

export default Course;
