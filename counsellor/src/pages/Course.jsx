// edit id and isedit to be used with the arrow keys

import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
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
   const { register, handleSubmit, reset, setValue } = useForm();
   const { updateDoc } = useFrappeUpdateDoc();
   const [open, setOpen] = useState(false);
   const [deleteId, setDeleteId] = useState(0);
   const [editId, setEditId] = useState(0);
   const [isEdit, setIsEdit] = useState(false);
   const [modal2open, setModal2open] = useState(false);
   const [currentIndex, setCurrentIndex] = useState(null);

   const { data, isLoading } = useFrappeGetDoc("Student", id);

   const onSubmit = (formData) => {
      const courseListArray = data.course_list;

      isEdit
         ? (courseListArray[editId] = formData)
         : courseListArray.push(formData);

      updateDoc("Student", id, {
         course_list: courseListArray,
         course_added: 1,
      })
         .then(() => {
            toast.success("Course updated");
            setCurrentIndex(data.course_list.length);
            reset();
         })
         .catch((err) => {
            toast.warning("Some internal error");
            console.error(err);
         });
   };

   const handleDelete = (index) => {
      setModal2open(false);
      data.course_list.splice(index, 1);
      const newCourseList = data.course_list;
      updateDoc("Student", id, {
         course_list: newCourseList,
      })
         .then(() => {
            toast.error("Course removed");
            setCurrentIndex(data.course_list.length);
         })
         .catch((err) => {
            toast.warning("Some internal error");
            console.error(err);
         });
   };

   const handlePrevious = () => {
      if (currentIndex != null) {
         if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setEditId(currentIndex - 1);
         }
      } else if (data.course_list.length > 0)
         setCurrentIndex(data.course_list.length - 1);
   };

   const handleNext = () => {
      if (currentIndex != null) {
         if (currentIndex < data.course_list.length) {
            setCurrentIndex(currentIndex + 1);
            setEditId(currentIndex + 1);
         }
      }
   };

   useEffect(() => {
      if (currentIndex === null) setCurrentIndex(data?.course_list.length);
      else if (data && currentIndex < data?.course_list.length) {
         setEditValue(data?.course_list[currentIndex]);
      } else {
         reset();
      }
   }, [currentIndex]);

   const handleEdit = (course, index) => {
      setEditValue(course);
      setCurrentIndex(index);
      setEditId(index);
      setIsEdit(true);
      setOpen(true);
   };

   const setEditValue = (course) => {
      setValue("course_name", course.course_name);
      setValue("university", course.university);
      setValue("country", course.country);
      setValue("course_link", course.course_link);
      setValue("course_deadline", course.course_deadline);
      setValue("scholarship", course.scholarship);
      setValue("scholarship_deadline", course.scholarship_deadline);
      setValue("how_to", course.how_to);
      setValue("tution_fee", course.tution_fee);
      setValue("scholarship_2", course.scholarship_2);
      setValue("scholarship_2_deadline", course.scholarship_2_deadline);
      setValue("scholarship_2_link", course.scholarship_2_link);
      setValue("scholarship_3", course.scholarship_3);
      setValue("scholarship_3_deadline", course.scholarship_3_deadline);
      setValue("scholarship_3_link", course.scholarship_3_link);
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
                  onClick={() => {
                     setOpen(true);
                     setIsEdit(false);
                     reset();
                  }}
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
                           <th className="px-4 py-2">Action</th>
                        </tr>
                     </thead>
                     <tbody className=" text-[#0f6990]">
                        {data.course_list.map((course, index) => (
                           <tr key={index}>
                              <td className="py-1">{course.course_name}</td>
                              <td className="py-1">{course.university}</td>
                              <td className="py-1 flex justify-evenly">
                                 <span
                                    className="flex justify-center align-middle material-symbols-outlined bg-red-300 rounded p-1 hover:bg-red-600 hover:text-white text-red-600 cursor-pointer"
                                    onClick={() => {
                                       setDeleteId(index);
                                       setModal2open(true);
                                    }}
                                 >
                                    delete_forever
                                 </span>
                                 <span
                                    className="flex justify-center align-middle material-symbols-outlined bg-green-300 rounded p-1 hover:bg-green-600 hover:text-white text-green-800 cursor-pointer"
                                    onClick={() => handleEdit(course, index)}
                                 >
                                    edit
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}

            {/* Course Modal Dialog Box */}
            <Dialog open={open} onClose={() => {}} className="relative z-10">
               <DialogBackdrop
                  transition
                  className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
               />
               <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                     <DialogPanel
                        transition
                        className="relative transform rounded-lg w-full lg:w-1/2 bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                     >
                        <button
                           className="absolute text-slate-800 hover:bg-slate-100 hover:text-black rounded-[50%] transition duration-300 flex p-2 -left-32 top-1/2"
                           onClick={handlePrevious}
                        >
                           <span className="material-symbols-outlined text-5xl">
                              keyboard_double_arrow_left
                           </span>
                        </button>
                        <button
                           className="absolute text-slate-800 hover:bg-slate-100 hover:text-black rounded-[50%] transition duration-300 flex p-2 -right-32 top-1/2"
                           onClick={handleNext}
                        >
                           <span className="material-symbols-outlined text-5xl">
                              keyboard_double_arrow_right
                           </span>
                        </button>
                        <div className="bg-white px-4 pb-4 lg:pt-5 sm:p-6 sm:pb-4">
                           <div className="mt-3 text-center sm:mt-0 sm:text-left">
                              <div className="flex justify-center">
                                 <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="lg:grid grid-cols-2 gap-4">
                                       <div className="lg:space-y-1 space-y-3">
                                          <div>
                                             <label>Course Name</label>
                                             <input
                                                {...register("course_name")}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>

                                          <div>
                                             <label>University Name</label>
                                             <input
                                                {...register("university")}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>

                                          <div>
                                             <label>Country</label>
                                             <input
                                                {...register("country")}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>

                                          <div>
                                             <label>Tution Fee</label>
                                             <input
                                                {...register("tution_fee")}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>

                                          <div>
                                             <label>Course Link</label>
                                             <input
                                                {...register("course_link")}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>

                                          <div>
                                             <label>Course Deadline</label>
                                             <input
                                                type="date"
                                                min={
                                                   new Date()
                                                      .toISOString()
                                                      .split("T")[0]
                                                }
                                                {...register("course_deadline")}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>
                                       </div>

                                       <div className="lg:space-y-1 space-y-3">
                                          <div>
                                             <label>Scholarship 1</label>
                                             <input
                                                {...register("scholarship")}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>

                                          <div>
                                             <label>
                                                Scholarship 1 Deadline
                                             </label>
                                             <input
                                                type="date"
                                                min={
                                                   new Date()
                                                      .toISOString()
                                                      .split("T")[0]
                                                }
                                                {...register(
                                                   "scholarship_deadline"
                                                )}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>

                                          <div>
                                             <label>Scholarship 1 Link</label>
                                             <input
                                                {...register("how_to")}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>

                                          <div>
                                             <label>Scholarship 2</label>
                                             <input
                                                {...register("scholarship_2")}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>

                                          <div>
                                             <label>
                                                Scholarship 2 Deadline
                                             </label>
                                             <input
                                                type="date"
                                                min={
                                                   new Date()
                                                      .toISOString()
                                                      .split("T")[0]
                                                }
                                                {...register(
                                                   "scholarship_2_deadline"
                                                )}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>

                                          <div>
                                             <label>Scholarship 2 Link</label>
                                             <input
                                                {...register(
                                                   "scholarship_2_link"
                                                )}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>

                                          <div>
                                             <label>Scholarship 3</label>
                                             <input
                                                {...register("scholarship_3")}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>

                                          <div>
                                             <label>
                                                Scholarship 3 Deadline
                                             </label>
                                             <input
                                                type="date"
                                                min={
                                                   new Date()
                                                      .toISOString()
                                                      .split("T")[0]
                                                }
                                                {...register(
                                                   "scholarship_3_deadline"
                                                )}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>

                                          <div>
                                             <label>Scholarship 3 Link</label>
                                             <input
                                                {...register(
                                                   "scholarship_3_link"
                                                )}
                                                className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                             />
                                          </div>
                                       </div>
                                    </div>

                                    <button
                                       type="submit"
                                       className="mt-3 bg-green-800 text-white py-2 px-3 w-full  rounded-md :hover:scale-110 transition ease-in-out duration-300"
                                    >
                                       Add Course
                                    </button>
                                    <button
                                       type="button"
                                       data-autofocus
                                       onClick={() => {
                                          setOpen(false);
                                          setCurrentIndex(
                                             data.course_list.length
                                          );
                                       }}
                                       className="mt-3 w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                       Cancel
                                    </button>
                                 </form>
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
               onClose={() => {}}
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
   