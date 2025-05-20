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
import { useFrappeCreateDoc, useFrappeUpdateDoc } from "frappe-react-sdk";
import { toast } from "react-toastify";
import { useRole } from "../context/RoleContext";
import GetStudentData from "../api/GetStudentData";
import GetReviewData from "../api/GetReviewData";

function Course() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { register, handleSubmit, reset, setValue } = useForm();
  const { roleProfile, currentUser, userName } = useRole();
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [editId, setEditId] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [reviewName, setReviewName] = useState("");
  const [reviewDesc, setReviewDesc] = useState("");
  const [data, setData] = useState([]);
  const [reviewData, setReviewData] = useState([]);

  const { updateDoc } = useFrappeUpdateDoc();
  const { createDoc } = useFrappeCreateDoc();

  const filters = [["reference_name", "=", id]];

  console.log(reviewData);

  // Form submit for adding/editing course
  const onSubmit = (formData) => {
    const courseListArray = data.course_list;

    if (roleProfile == "Auditor") {
      if (reviewData.length < 1) {
        createDoc("ToDo", {
          assigned_by: currentUser,
          assigned_by_full_name: userName,
          allocated_to: currentUser,
          reference_type: "Student",
          reference_name: id,
          description: `Courses added by ${currentUser}`,
          priority: "Medium",
        }).catch((err) => console.error(err));
      }
    }

    if (isEdit) {
      courseListArray[editId] = formData;
      if (courseListArray[editId].status == "Review") {
        courseListArray[editId].review =
          "Course updated - " + courseListArray[editId].review;
        courseListArray[editId].status = "New";
      }
    } else {
      courseListArray.push(formData);
    }

    updateDoc("Student", id, {
      course_list: courseListArray,
      status: roleProfile == "Auditor" ? "Review" : "Auditing",
    })
      .then(() => {
        toast.success("Course updated");
        setCurrentIndex(data.course_list.length);
        if (isEdit) handleNext();
        else reset();
      })
      .catch((err) => {
        toast.warning("Some internal error");
        console.error(err);
      });
  };

  // To delete course from course list
  const handleDelete = (index) => {
    setDeleteModalOpen(false);
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

  // To naviagte form through course list
  const handlePrevious = () => {
    if (currentIndex != null) {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setEditId(currentIndex - 1);
      }
    } else if (data.course_list.length > 0)
      setCurrentIndex(data.course_list.length - 1);
  };

  // To naviagte form through course list
  const handleNext = () => {
    if (currentIndex != null) {
      if (isView) {
        if (currentIndex < data.course_list.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setEditId(currentIndex + 1);
        }
      } else if (currentIndex < data.course_list.length) {
        setCurrentIndex(currentIndex + 1);
        setEditId(currentIndex + 1);
      }
    }
  };

  // To set currentIndex as well as editValue for form
  useEffect(() => {
    if (currentIndex === null) setCurrentIndex(data?.course_list?.length);
    else if (data && currentIndex < data?.course_list?.length) {
      setEditValue(data?.course_list[currentIndex]);
    } else {
      reset();
    }
  }, [currentIndex]);

  // To view course using form modal
  const handleView = (course, index) => {
    setEditValue(course);
    setCurrentIndex(index);
    setIsView(true);
    setOpen(true);
  };

  // To view course form for edit
  const handleEdit = (course, index) => {
    setEditValue(course);
    setCurrentIndex(index);
    setEditId(index);
    setIsEdit(true);
    setOpen(true);
  };

  // To set values for form
  const setEditValue = (course) => {
    setValue("status", course.status);
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
    setValue("review", course.review);
  };

  // To set name for review
  useEffect(() => {
    reviewData && reviewData.length > 0 && setReviewName(reviewData[0].name);
  }, [reviewData]);

  // To send review to auditor after adding course(s) by counsellor
  const handleSendReview = () => {
    updateDoc("ToDo", reviewName, {
      description: "Course added for review",
      priority: "Medium",
    })
      .then((res) => {
        updateDoc("Student", id, {
          status: "Auditing",
        })
          .then(() => {
            toast.success(res.description);
          })
          .catch((err) => {
            toast.error("Some internal error");
            console.error(err);
          });
      })
      .catch((err) => {
        toast.error("Some internal error");
        console.error(err);
      });
  };

  // To handle course review by auditor
  const handleCourseReview = () => {
    const course_list = data.course_list;
    course_list[currentIndex].review = reviewDesc;
    course_list[currentIndex].status = "Review";

    updateDoc("ToDo", reviewName, {
      description: "Reviewed and send back for correction",
      priority: "Medium",
    })
      .then(() => {
        updateDoc("Student", id, {
          course_list,
          status: "Review",
        })
          .then(() => {
            toast.success("Send for update of course");
            setValue("review", reviewDesc);
            setReviewModalOpen(false);
          })
          .catch((err) => {
            toast.error("Some internal error");
            console.error(err);
          });
      })
      .catch((err) => {
        toast.error("Some internal error");
        console.error(err);
      });
  };

  // To approve each course in the course list
  const handleCourseApproval = () => {
    const course_list = data.course_list;
    course_list[currentIndex].status = "Approved";
    course_list[currentIndex].review = "";

    updateDoc("Student", id, {
      course_list,
    })
      .then(() => {
        handleNext();
        setValue("review", "");
      })
      .catch((err) => console.log(err));
  };

  const handleSendCourse = (e) => {
    e.preventDefault();

    const notApprovedCourseList = data.course_list.filter(
      (course) => course.status != "Approved"
    );

    if (notApprovedCourseList?.length > 0) {
      toast.warning("Some course are still not approved");
    } else if (data.course_list?.length == 0) {
      toast.warning("Course list is empty");
    } else {
      updateDoc("Student", id, {
        status: "Course Given",
        course_added: 1,
      })
        .then(() => {
          updateDoc("ToDo", reviewName, {
            description: "Course list has been sent",
            priority: "Low",
          })
            .then(() => {
              toast.success("Course List has been sent");
            })
            .catch((err) => {
              toast.error("Some internal error");
              console.error(err);
            });
        })
        .catch((err) => {
          toast.warning("Some internal error");
          console.error(err);
        });
    }
  };

  return (
    <>
      <div className="lg:px-26 py-24">
        <div className="lg:mx-16 px-4">
          <div className="flex justify-between">
            <button
              className="text-[#0f6990] text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 hover:bg-[#0f6990] hover:text-white transition ease-in-out duration-300"
              onClick={() => navigate(-1)}
            >
              &lt; Go back
            </button>
            {data?.status != "Course Given" && (
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
            )}
          </div>
          <div className="flex justify-between">
            <h2 className="text-3xl lg:text-5xl text-[#0f6990] py-5">
              Courses
            </h2>
          </div>
          <>
            <div id="courseListContainer" className="flex justify-center">
              <table className="table-auto border border-[#0f6990] text-white w-full text-xs md:text-base lg:w-4/5 text-center rounded">
                <thead className="bg-[#0f6990]">
                  <tr>
                    <th className="lg:px-10 py-2 w-1/3">Course Name</th>
                    <th className="lg:px-10 py-2 w-2/3">University</th>
                    <th className="px-4 py-2">Action</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className=" text-[#0f6990] border border-[#0f6990]">
                  {data?.course_list?.map((course, index) => (
                    <tr key={index}>
                      <td className="py-1">{course.course_name}</td>
                      <td className="py-1">{course.university}</td>
                      <td className="py-1 flex justify-evenly w-[120px]">
                        <>
                          <span
                            className="flex justify-center align-middle material-symbols-outlined bg-red-300 rounded p-1 hover:bg-red-600 hover:text-white text-red-600 cursor-pointer"
                            onClick={() => {
                              setDeleteId(index);
                              setDeleteModalOpen(true);
                            }}
                          >
                            delete_forever
                          </span>
                          <span
                            className="flex justify-center align-middle material-symbols-outlined  rounded p-1 bg-green-300 hover:bg-green-600 hover:text-white text-green-800 cursor-pointer"
                            onClick={() => handleEdit(course, index)}
                          >
                            edit
                          </span>
                        </>
                        <span
                          className="flex justify-center align-middle material-symbols-outlined  rounded p-1 bg-blue-300 hover:bg-[#0f6990] hover:text-white text-green-800 cursor-pointer"
                          onClick={() => handleView(course, index)}
                        >
                          visibility
                        </span>
                      </td>
                      <td className="py-1">
                        <span className="material-symbols-outlined  rounded p-1 text-[#0f6990]">
                          {course.status == "Approved" ? (
                            "check"
                          ) : (
                            <>
                              {course.status == "Review"
                                ? "warning"
                                : "note_add"}
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center gap-4">
              {data?.course_list?.length > 0 && roleProfile == "Counsellor" ? (
                <button
                  className="mt-5 lg:text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 bg-green-500 text-white transition ease-in-out duration-300"
                  onClick={handleSendReview}
                >
                  Send for review
                </button>
              ) : (
                <>
                  {data.status != "Course Given" ? (
                    <button
                      className="mt-5 lg:text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 bg-green-500 text-white transition ease-in-out duration-300"
                      onClick={handleSendCourse}
                    >
                      Send Course list
                    </button>
                  ) : (
                    <h1
                      disabled
                      className="mt-5 lg:text-lg shadow bg-[#0f6990] text-white py-2 px-4 rounded-2xl"
                    >
                      Course List Added
                    </h1>
                  )}
                </>
              )}
            </div>
            {data?.status == "Feedback Review" && reviewData.length > 0 && (
              <div className="w-1/2 mx-auto shadow-md rounded-lg p-5 m-2 bg-orange-50">
                <h1>
                  <span className="text-red-500">Feedback :</span>{" "}
                  {reviewData[0].description}
                </h1>
              </div>
            )}
          </>

          {/*Course Modal Dialog Box */}
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
                                  disabled={isView}
                                  {...register("course_name")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>

                              <div>
                                <label>University Name</label>
                                <input
                                  disabled={isView}
                                  {...register("university")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>

                              <div>
                                <label>Country</label>
                                <input
                                  disabled={isView}
                                  {...register("country")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>

                              <div>
                                <label>Tution Fee</label>
                                <input
                                  disabled={isView}
                                  {...register("tution_fee")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>

                              <div>
                                <label>Course Link</label>
                                <input
                                  disabled={isView}
                                  {...register("course_link")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>

                              <div>
                                <label>Course Deadline</label>
                                <input
                                  disabled={isView}
                                  {...register("course_deadline")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>
                              {isEdit || isView ? (
                                <div className="bg-orange-200 p-2 text-slate-800 rounded-lg">
                                  <label className="font-bold">Review</label>
                                  <textarea
                                    disabled
                                    rows={6}
                                    className=" rounded-lg px-2 focus:outline-none w-full"
                                    {...register("review")}
                                  ></textarea>
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>

                            <div className="lg:space-y-1 space-y-3">
                              <div>
                                <label>Scholarship 1</label>
                                <input
                                  disabled={isView}
                                  {...register("scholarship")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>

                              <div>
                                <label>Scholarship 1 Deadline</label>
                                <input
                                  disabled={isView}
                                  {...register("scholarship_deadline")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>

                              <div>
                                <label>Scholarship 1 Link</label>
                                <input
                                  disabled={isView}
                                  {...register("how_to")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>

                              <div>
                                <label>Scholarship 2</label>
                                <input
                                  disabled={isView}
                                  {...register("scholarship_2")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>

                              <div>
                                <label>Scholarship 2 Deadline</label>
                                <input
                                  disabled={isView}
                                  {...register("scholarship_2_deadline")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>

                              <div>
                                <label>Scholarship 2 Link</label>
                                <input
                                  disabled={isView}
                                  {...register("scholarship_2_link")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>

                              <div>
                                <label>Scholarship 3</label>
                                <input
                                  disabled={isView}
                                  {...register("scholarship_3")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>

                              <div>
                                <label>Scholarship 3 Deadline</label>
                                <input
                                  disabled={isView}
                                  {...register("scholarship_3_deadline")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>

                              <div>
                                <label>Scholarship 3 Link</label>
                                <input
                                  disabled={isView}
                                  {...register("scholarship_3_link")}
                                  className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                                />
                              </div>
                            </div>
                          </div>

                          {isView ? (
                            <>
                              {roleProfile == "Auditor" && (
                                <div className="flex gap-3">
                                  {data.course_list[currentIndex].status !=
                                  "Approved" ? (
                                    <>
                                      <button
                                        type="button"
                                        className="mt-3 bg-orange-400 text-white py-2 px-3 w-full  rounded-md :hover:scale-110 transition ease-in-out duration-300"
                                        onClick={() => setReviewModalOpen(true)}
                                      >
                                        Mark Review
                                      </button>
                                      <button
                                        type="button"
                                        className="mt-3 bg-green-800 text-white py-2 px-3 w-full  rounded-md :hover:scale-110 transition ease-in-out duration-300"
                                        onClick={handleCourseApproval}
                                      >
                                        Approve
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        className="mt-3 bg-green-800 text-white py-2 px-3 w-full rounded-md "
                                      >
                                        Approved
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </>
                          ) : (
                            <button
                              type="submit"
                              className="mt-3 bg-green-800 text-white py-2 px-3 w-full  rounded-md :hover:scale-110 transition ease-in-out duration-300"
                            >
                              Add Course
                            </button>
                          )}

                          <button
                            type="button"
                            data-autofocus
                            onClick={() => {
                              setOpen(false);
                              setIsView(false);
                              setCurrentIndex(data.course_list.length);
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
            open={deleteModalOpen}
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
                          onClick={() => setDeleteModalOpen(false)}
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
          {/* Modal for adding review */}
          <Dialog
            open={reviewModalOpen}
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
                          Add a review
                        </DialogTitle>
                        <form action="">
                          <input
                            type="text"
                            name="description"
                            className="border rounded-lg px-2 py-1 text-[#0f6990] focus:outline-none w-full"
                            onChange={(e) => setReviewDesc(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={handleCourseReview}
                            className="mt-3 bg-orange-400 text-white py-2 px-3 w-full rounded-md :hover:scale-110 transition ease-in-out duration-300"
                          >
                            Send Review
                          </button>
                          <button
                            type="button"
                            data-autofocus
                            onClick={() => setReviewModalOpen(false)}
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
        </div>
      </div>
      <GetReviewData filters={filters} setReviewData={setReviewData} />
      <GetStudentData id={id} setStudentData={setData} />
    </>
  );
}

export default Course;
