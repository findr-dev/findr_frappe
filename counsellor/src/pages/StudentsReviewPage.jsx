import { useEffect, useState } from "react";
import StudentList from "../components/StudentList";
import { useNavigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import GetReviewData from "../api/GetReviewData";
import GetStudentList from "../api/GetStudentList";

function StudentsReviewPage() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const { currentUser, roleProfile } = useRole();

  const [filters, setFilters] = useState([]);
  const [reviewFilters, setReviewFilters] = useState([]);

  const [fetchReview, setFetchReview] = useState(false);
  const [fetchStudentList, setFetchStudentList] = useState(false);
  const [data, setData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    if (roleProfile == "Auditor") {
      setReviewFilters([
        ["assigned_by", "=", currentUser],
        ["priority", "=", "Medium"],
      ]);
      setFetchReview(true);
    } else if (roleProfile == "Counsellor") {
      setReviewFilters([
        ["allocated_to", "=", currentUser],
        ["priority", "=", "Medium"],
      ]);
      setFetchReview(true);
    } else if (roleProfile == "Master Auditor") {
      setReviewFilters([["priority", "=", "High"]]);
      setFetchReview(true);
    }
  }, [roleProfile]);

  useEffect(() => {
    if (reviewData) {
      const filteredStudentData = reviewData.map(
        (review) => review.reference_name
      );

      if (roleProfile == "Master Auditor") {
        setFilters([
          ["registration_fee", "=", "1"],
          ["status", "=", "Hold"],
          ["name", "in", filteredStudentData],
        ]);
      } else if (roleProfile == "Counsellor") {
        setFilters([
          ["registration_fee", "=", "1"],
          ["status", "in", ["Review", "Feedback Review"]],
          ["name", "in", filteredStudentData],
        ]);
      } else if (roleProfile == "Auditor") {
        setFilters([
          ["registration_fee", "=", "1"],
          ["status", "in", ["Review", "Auditing"]],
          ["name", "in", filteredStudentData],
        ]);
      }

      setFetchStudentList(true);
    }
  }, [reviewData]);

  console.log(filters);

  useEffect(() => {
    if (studentList) setData(studentList);
    else setData([]);
  }, [studentList]);

  return (
    <div className="studentSection lg:px-24 px-4 py-24">
      <button
        className="text-[#0f6990] text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 hover:bg-[#0f6990] hover:text-white transition ease-in-out duration-300"
        onClick={() => navigate(-1)}
      >
        &lt; Go back
      </button>
      <h1 className="text-4xl text-[#0f6990] ">Students List</h1>

      <>
        <StudentList
          data={data}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
        />
        {fetchReview && (
          <GetReviewData
            filters={reviewFilters}
            setReviewData={setReviewData}
          />
        )}
        {fetchStudentList && (
          <GetStudentList
            filters={filters}
            pageIndex={pageIndex}
            setStudentList={setStudentList}
          />
        )}
      </>
    </div>
  );
}

export default StudentsReviewPage;
