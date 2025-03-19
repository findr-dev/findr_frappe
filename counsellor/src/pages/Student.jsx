import {
  useFrappeCreateDoc,
  useFrappeDeleteDoc,
  useFrappeUpdateDoc,
} from "frappe-react-sdk";
import { useNavigate, useParams } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import GetReviewData from "../api/GetReviewData";
import GetStudentData from "../api/GetStudentData";
import GetCounsellorsList from "../api/GetCounsellorsList";
import GetCounsellor from "../api/GetCounsellor";

function Student() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [removeHoldModalOpen, setRemoveHoldModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [counsellorData, setCounsellorData] = useState({});
  const [holdReview, setHoldReview] = useState({});
  const [counsellor, setCounsellor] = useState([]);
  const [counsellorID, setCounsellorID] = useState([]);

  const { roleProfile, currentUser, userName } = useRole();

  const { updateDoc } = useFrappeUpdateDoc();
  const { createDoc } = useFrappeCreateDoc();
  const { deleteDoc } = useFrappeDeleteDoc();

  const [fetchStudentData, setFetchStudentData] = useState(false);
  const [fetchReview, setFetchReview] = useState(false);
  const [fetchCounsellors, setFetchCounsellors] = useState(false);
  const [reviewFilters, setReviewFilters] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [counsellorsList, setCounsellorsList] = useState([]);
  const [fetchAssignedCounsellor, setFetchAssignedCounsellor] = useState([]);
  const [feedbackDesc, setFeebackDesc] = useState("");

  const [data, setData] = useState([]);

  useEffect(() => {
    if (roleProfile != "Counsellor") {
      setFetchCounsellors(true);
    }
    if (roleProfile == "Master Auditor") {
      setReviewFilters([["reference_name", "=", id]]);
      setFetchReview(true);
    } else if (roleProfile == "Auditor") {
      setReviewFilters([
        ["reference_name", "=", id],
        ["priority", "=", "Medium"],
      ]);
      setFetchReview(true);
    } else if (roleProfile == "Counsellor") {
      setReviewFilters([["reference_name", "=", id]]);
      setFetchReview(true);
    }
    setFetchStudentData(true);
  }, [roleProfile]);

  useEffect(() => {
    if (reviewData) {
      if (roleProfile != "Master Auditor")
        setCounsellorID(reviewData[0]?.allocated_to);
    }
  }, [reviewData]);

  useEffect(() => {
    if (counsellorID) {
      setFetchAssignedCounsellor(true);
    }
  }, [counsellorID]);

  const handleAssign = (e) => {
    e.preventDefault();
    createDoc("ToDo", {
      assigned_by: currentUser,
      assigned_by_full_name: userName,
      allocated_to: counsellorData.name,
      reference_type: "Student",
      reference_name: id,
      description: `Assigned to ${counsellorData.full_name}`,
      priority: "Low",
    })
      .then(() => {
        updateDoc("Student", id, {
          status: "Assigned",
        })
          .then(() => {
            toast.success("Assigned successfully");
            setModalOpen(false);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const handleAddHold = (e) => {
    e.preventDefault();

    if (reviewData.length > 0) {
      updateDoc("ToDo", reviewData[0].name, {
        description: holdReview,
        priority: "High",
      })
        .then(() => {
          updateDoc("Student", id, {
            status: "Hold",
          })
            .then(() => {
              toast.warning(`${id} has been hold`);
              navigate(-1);
              setHoldModalOpen(false);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    } else {
      createDoc("ToDo", {
        assigned_by: currentUser,
        assigned_by_full_name: userName,
        allocated_to: currentUser,
        reference_type: "Student",
        reference_name: id,
        description: holdReview,
        priority: "High",
      })
        .then(() => {
          updateDoc("Student", id, {
            status: "Hold",
          })
            .then(() => {
              toast.warning(`${id} has been hold`);
              navigate(-1);
              setHoldModalOpen(false);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }
  };

  const handleRemoveHold = (e) => {
    e.preventDefault();
    deleteDoc("ToDo", reviewData[0].name)
      .then(() => {
        updateDoc("Student", id, {
          status: "New",
        })
          .then(() => {
            toast.success("Hold removed");
            navigate(-1);
            setHoldModalOpen(false);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const handleAddFeedback = (e) => {
    e.preventDefault();

    updateDoc("ToDo", reviewData[0].name, {
      description: feedbackDesc,
      priority: "Medium",
    })
      .then(() => {
        updateDoc("Student", id, {
          status: "Feedback Review",
        })
          .then(() => {
            toast.warning(`${id} has been send for feedback review`);
            navigate(-1);
            setFeedbackModalOpen(false);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="lg:px-10 py-24">
      <div id="cardSection" className="px-4 lg:mx-16">
        <div className="flex justify-between">
          <button
            className="text-[#0f6990] text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 hover:bg-[#0f6990] hover:text-white transition ease-in-out duration-300"
            onClick={() => navigate(-1)}
          >
            &lt; Go back
          </button>
          <div className="flex gap-3">
            {data.status == "Hold" ? (
              <button
                className="text-lg shadow py-2 px-4 rounded-2xl bg-red-700 text-white transition ease-in-out duration-300"
                onClick={() => {
                  roleProfile == "Master Auditor" &&
                    setRemoveHoldModalOpen(true);
                }}
              >
                On Hold
              </button>
            ) : (
              <>
                {roleProfile != "Master Auditor" && (
                  <button
                    className="text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 bg-red-700 text-white transition ease-in-out duration-300"
                    onClick={() => setHoldModalOpen(true)}
                  >
                    Hold
                  </button>
                )}
              </>
            )}
            {data.status == "New" && roleProfile == "Auditor" && (
              <button
                className="text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 bg-orange-400 text-white transition ease-in-out duration-300"
                onClick={() => setModalOpen(true)}
              >
                Assign To
              </button>
            )}
            {data.status == "Course Given" &&
              roleProfile == "Master Auditor" && (
                <button
                  className="text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 bg-orange-400 text-white transition ease-in-out duration-300"
                  onClick={() => setFeedbackModalOpen(true)}
                >
                  Add Feedback
                </button>
              )}
            <button
              className="text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 bg-[#0f6990] text-white transition ease-in-out duration-300"
              onClick={() => navigate(`/course/${id}`)}
            >
              Go To Courses
            </button>
          </div>
        </div>
        {roleProfile == "Auditor" && counsellor && (
          <div className="flex justify-center lg:justify-end ">
            <p className="mt-2 text-[#0F6990] lg:me-5 text-xl font-semibold">
              Assigned to : {counsellor}
            </p>
          </div>
        )}
        {roleProfile == "Master Auditor" && data.status == "hold" && (
          <div className="mx-auto w-1/2 text-center text-white bg-orange-100 shadow-md rounded-lg p-5">
            <h1 className="text-xl w-full font-semibold">
              {reviewData[0].description}
            </h1>
          </div>
        )}

        <h1 className="text-3xl text-center text-red-400 font-semibold ">
          {data.first_name} {data.last_name} is looking for{" "}
          {data.education_program}
        </h1>

        <>
          <div id="personalDetailsCard" className="mb-10">
            <h2 className="text-3xl lg:text-5xl text-[#0f6990] py-5">
              Personal Details
            </h2>
            <div className="text-gray-800 font-medium mt-5 flex flex-wrap justify-between gap-4 lg:gap-7">
              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                Full Name :
                <span className="text-[#0f6990] ms-1">
                  {data.first_name} {data.last_name}
                </span>
              </p>
              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                Gender :
                <span className="text-[#0f6990] ms-1">{data.gender}</span>
              </p>
              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                Intake :
                <span className="text-[#0f6990] ms-1">{data.intake}</span>
              </p>
              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                Year of Study :
                <span className="text-[#0f6990] ms-1">
                  {data.year_of_study}
                </span>
              </p>
              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                Marital Status :
                <span className="text-[#0f6990] ms-1">
                  {data.marital_status}
                </span>
              </p>
              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                Spouse Visa needed :
                <span className="text-[#0f6990] ms-1">
                  {data.availing_spouse_visa == 1 ? "Yes" : "No"}
                </span>
              </p>
              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                Having kids :
                <span className="text-[#0f6990] ms-1">
                  {data.have_kids == 1 ? "Yes" : "No"}
                </span>
              </p>
              {data.preferred_course && (
                <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                  Preferred Course :
                  <span className="text-[#0f6990] ms-1">
                    {data.preferred_course}
                  </span>
                </p>
              )}
              {data.preferred_country && (
                <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                  Preferred Country :
                  <span className="text-[#0f6990] ms-1">
                    {data.preferred_country}
                  </span>
                </p>
              )}
              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                Budget :
                <span className="text-[#0f6990] ms-1">{data.budget}</span>
              </p>
              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                Availing Scholarship :
                <span className="text-[#0f6990] ms-1">
                  {data.availing_scholarship == 1 ? "Yes" : "No"}
                </span>
              </p>
              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                Religion :
                <span className="text-[#0f6990] ms-1">{data.religion}</span>
              </p>
              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                Caste :<span className="text-[#0f6990] ms-1">{data.caste}</span>
              </p>
              <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                Nationality :
                <span className="text-[#0f6990] ms-1">{data.nationality}</span>
              </p>
            </div>
          </div>
          <div id="educationalDetailsCard" className="my-10">
            <h2 className="text-3xl lg:text-5xl text-[#0f6990] py-8">
              Educational Details
            </h2>
            {/* PHD Section */}
            {data.phd_course ? (
              <div id="phdSection" className="mt-5">
                <h3 className="text-xl lg:text-2xl text-center rounded-lg text-white bg-[#0f6990] py-3 mb-3 lg:mb-5">
                  PHD Qualification
                </h3>{" "}
                <div className=" text-gray-800 font-medium flex flex-wrap justify-between  gap-4 lg:gap-7">
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Course :
                    <span className="text-[#0f6990] ms-1">
                      {data.phd_course}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Institution :
                    <span className="text-[#0f6990] ms-1">
                      {data.phd_institution}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    University :
                    <span className="text-[#0f6990] ms-1">
                      {data.phd_university}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Mark :
                    <span className="text-[#0f6990] ms-1">
                      {data.phd_marks}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Mode of Study :
                    <span className="text-[#0f6990] ms-1">
                      {data.phd_mode_of_study}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Year of Study :
                    <span className="text-[#0f6990] ms-1">{data.phd_year}</span>
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}

            {/* PG Section */}
            {data.postgraduate_course ? (
              <div id="postgraduateSection" className="mt-5">
                <h3 className="text-xl lg:text-2xl text-center rounded-lg text-white bg-[#0f6990] py-3 mb-3 lg:mb-5">
                  Postgraduate Qualification
                </h3>
                <div className=" text-gray-800 font-medium flex flex-wrap justify-between  gap-4 lg:gap-7">
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Course :
                    <span className="text-[#0f6990] ms-1">
                      {data.postgraduate_course}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    University :
                    <span className="text-[#0f6990] ms-1">
                      {data.postgraduate_institution}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Board :
                    <span className="text-[#0f6990] ms-1">
                      {data.postgraduate_university}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Mark :
                    <span className="text-[#0f6990] ms-1">
                      {data.postgraduate_marks}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Mode of Study :
                    <span className="text-[#0f6990] ms-1">
                      {data.postgraduate_mode_of_study}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Year of Study :
                    <span className="text-[#0f6990] ms-1">
                      {data.postgraduate_year}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}

            {/* UG Section */}
            {data.undergraduate_course ? (
              <div id="undergraduateSection" className="mt-5">
                <h3 className="text-xl lg:text-2xl text-center rounded-lg text-white bg-[#0f6990] py-3 mb-3 lg:mb-5">
                  Undergraduate Qualification
                </h3>
                <div className=" text-gray-800 font-medium flex flex-wrap justify-between gap-4 lg:gap-7">
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Course :
                    <span className="text-[#0f6990] ms-1">
                      {data.undergraduate_course}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    University :
                    <span className="text-[#0f6990] ms-1">
                      {data.undergraduate_institution}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Board :
                    <span className="text-[#0f6990] ms-1">
                      {data.undergraduate_university}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Mark :
                    <span className="text-[#0f6990] ms-1">
                      {data.undergraduate_marks}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Mode of Study :
                    <span className="text-[#0f6990] ms-1">
                      {data.undergraduate_mode_of_study}
                    </span>
                  </p>
                  <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                    Year of Study :
                    <span className="text-[#0f6990] ms-1">
                      {data.undergraduate_year}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}

            {/* Twelfth Section */}
            <div id="twelfthSection" className="mt-5">
              <h3 className="text-xl lg:text-2xl text-center rounded-lg text-white bg-[#0f6990] py-3 mb-3 lg:mb-7">
                Twelfth Qualification
              </h3>
              <div className="text-gray-800 font-medium flex flex-wrap justify-between gap-4 lg:gap-7">
                <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                  Course :
                  <span className="text-[#0f6990] ms-1">
                    {data.twelfth_stream}
                  </span>
                </p>
                <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                  Institution :
                  <span className="text-[#0f6990] ms-1">
                    {data.twelfth_institution}
                  </span>
                </p>
                <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                  Board :
                  <span className="text-[#0f6990] ms-1">
                    {data.twelfth_board_of_study}
                  </span>
                </p>
                <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                  Mark :
                  <span className="text-[#0f6990] ms-1">
                    {data.twelfth_marks}
                  </span>
                </p>
                <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                  Mode of Study :
                  <span className="text-[#0f6990] ms-1">
                    {data.twelfth_mode_of_study}
                  </span>
                </p>
                <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                  Year of Study :
                  <span className="text-[#0f6990] ms-1">
                    {data.twelfth_year}
                  </span>
                </p>
              </div>
            </div>

            {/* Tenth Section */}
            <div id="tenthSection" className="mt-5">
              <h3 className="text-xl lg:text-2xl text-center rounded-lg text-white bg-[#0f6990] py-3 mb-3 lg:mb-5">
                Tenth Qualification
              </h3>
              <div className=" text-gray-800 font-medium flex flex-wrap justify-between gap-4 lg:gap-7">
                <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                  Institution :
                  <span className="text-[#0f6990] ms-1">
                    {data.tenth_institution}
                  </span>
                </p>
                <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                  Board :
                  <span className="text-[#0f6990] ms-1">
                    {data.tenth_board_of_study}
                  </span>
                </p>
                <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                  State :
                  <span className="text-[#0f6990] ms-1">
                    {data.tenth_state}
                  </span>
                </p>
                <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                  Mark :
                  <span className="text-[#0f6990] ms-1">
                    {data.tenth_marks}
                  </span>
                </p>
                <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                  Mode of Study :
                  <span className="text-[#0f6990] ms-1">
                    {data.tenth_mode_of_study}
                  </span>
                </p>
                <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                  Year of Study :
                  <span className="text-[#0f6990] ms-1">{data.tenth_year}</span>
                </p>
              </div>
            </div>
          </div>
          <div id="experienceDetailsCard" className="my-10">
            {data.internship_details?.length > 0 ||
            data.work_experience?.length > 0 ? (
              <h2 className="text-3xl lg:text-5xl text-[#0f6990] py-8">
                Experience Details
              </h2>
            ) : (
              ""
            )}
            {data.internship_details?.length > 0 ? (
              <div>
                <h3 className="text-xl lg:text-2xl text-center rounded-lg text-white bg-[#0f6990] py-3 mb-3 lg:mb-5">
                  Internship Experience
                </h3>
                {data.internship_details.map((intern) => (
                  <div
                    key={intern.idx}
                    className="text-base lg:text-[16px] text-gray-800 font-medium flex flex-wrap justify-between gap-4 lg:gap-7"
                  >
                    <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                      Intern :
                      <span className="text-[#0f6990] ms-1">
                        {intern.intern_position}
                      </span>
                    </p>
                    <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                      Company :
                      <span className="text-[#0f6990] ms-1">
                        {intern.intern_company_name}
                      </span>
                    </p>
                    <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                      Time :
                      <span className="text-[#0f6990] ms-1">
                        {intern.intern_from} to {intern.intern_to}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
            {data.work_experience?.length > 0 ? (
              <div>
                <h3 className="text-xl lg:text-2xl text-center rounded-lg text-white bg-[#0f6990] py-3 my-3 lg:mt-10">
                  Work Experience
                </h3>
                {data.work_experience?.map((work) => (
                  <div
                    key={work.idx}
                    className="text-base lg:text-[16px] text-gray-800 font-medium flex flex-wrap justify-between gap-4 lg:gap-7"
                  >
                    <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                      Position :
                      <span className="text-[#0f6990] ms-1">
                        {work.work_position}
                      </span>
                    </p>
                    <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                      Company :
                      <span className="text-[#0f6990] ms-1">
                        {work.work_company_name}
                      </span>
                    </p>
                    <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                      Time :
                      <span className="text-[#0f6990] ms-1">
                        {work.work_from} to {work.work_to}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
          <div id="languageProficiencyDetailsCard" className="my-10">
            {data.language_proficiency?.length > 0 ? (
              <div>
                <h2 className="text-3xl lg:text-5xl text-[#0f6990] py-8">
                  Language Proficiency
                </h2>
                {data.language_proficiency?.map((language) => (
                  <div
                    key={language.idx}
                    className="text-base lg:text-[16px] text-gray-800 font-medium flex flex-wrap gap-4 lg:gap-16"
                  >
                    <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                      Language :
                      <span className="text-[#0f6990] ms-1">
                        {language.language}
                      </span>
                    </p>
                    <p className="bg-slate-100 p-4 rounded-lg shadow-md w-full lg:w-[30%]">
                      Certificate :
                      <span className="text-[#0f6990] ms-1">
                        {language.certificate}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
        </>
      </div>

      {/* Modal to assign counsellor */}
      <Dialog open={modalOpen} onClose={() => {}} className="relative z-10">
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
                      Select a counsellor to assign
                    </DialogTitle>
                    <form>
                      <select
                        name="assign_to"
                        onChange={(e) =>
                          setCounsellorData(counsellorsList[e.target.value])
                        }
                        className="border rounded-lg px-2 py-2 text-xl text-[#0f6990] focus:outline-none w-full"
                      >
                        <option hidden>Choose a counsellor</option>
                        {counsellorsList?.map((counsellor, index) => (
                          <option key={index} value={index}>
                            {counsellor.full_name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        onClick={handleAssign}
                        className="mt-3 bg-green-700 text-white py-2 px-3 w-full rounded-md :hover:scale-110 transition ease-in-out duration-300"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        data-autofocus
                        onClick={() => setModalOpen(false)}
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

      {/* Modal to add hold review */}
      <Dialog open={holdModalOpen} onClose={() => {}} className="relative z-10">
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
                      Description for hold
                    </DialogTitle>
                    <form>
                      <input
                        type="text"
                        name="hold_review"
                        className="border rounded-lg px-2 py-2 text-[#0f6990] focus:outline-none w-full"
                        placeholder="Write a description"
                        onChange={(e) => setHoldReview(e.target.value)}
                      />
                      <button
                        type="submit"
                        onClick={handleAddHold}
                        className="mt-3 bg-green-700 text-white py-2 px-3 w-full rounded-md :hover:scale-110 transition ease-in-out duration-300"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        data-autofocus
                        onClick={() => setHoldModalOpen(false)}
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

      {/* Modal to remove hold */}
      <Dialog
        open={removeHoldModalOpen}
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
                      Remove Hold on {id}
                    </DialogTitle>

                    <button
                      onClick={handleRemoveHold}
                      className="mt-3 bg-green-700 text-white py-2 px-3 w-full rounded-md :hover:scale-110 transition ease-in-out duration-300"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      data-autofocus
                      onClick={() => setRemoveHoldModalOpen(false)}
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

      {/* Modal to add feedback review */}
      <Dialog
        open={feedbackModalOpen}
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
                      Add feedback description
                    </DialogTitle>
                    <form>
                      <input
                        type="text"
                        name="feedback_description"
                        className="border rounded-lg px-2 py-2 text-[#0f6990] focus:outline-none w-full"
                        placeholder="Write a description"
                        onChange={(e) => setFeebackDesc(e.target.value)}
                      />
                      <button
                        type="submit"
                        onClick={handleAddFeedback}
                        className="mt-3 bg-green-700 text-white py-2 px-3 w-full rounded-md :hover:scale-110 transition ease-in-out duration-300"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        data-autofocus
                        onClick={() => setFeedbackModalOpen(false)}
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

      {fetchStudentData && <GetStudentData id={id} setStudentData={setData} />}
      {fetchReview && (
        <GetReviewData filters={reviewFilters} setReviewData={setReviewData} />
      )}
      {fetchCounsellors && (
        <GetCounsellorsList setCounsellors={setCounsellorsList} />
      )}
      {fetchAssignedCounsellor && (
        <GetCounsellor
          counsellorID={counsellorID}
          setAssignedCounsellor={setCounsellor}
        />
      )}
    </div>
  );
}

export default Student;
