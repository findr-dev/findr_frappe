import { useFrappeGetDocList } from "frappe-react-sdk";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function StudentsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    location.pathname == "/students"
      ? setFilters([
          ["registration_fee", "=", "1"],
          ["course_added", "=", "1"],
        ])
      : setFilters([
          ["registration_fee", "=", "1"],
          ["course_added", "=", "0"],
        ]);
  }, [location]);

  const { data, isLoading } = useFrappeGetDocList("Student", {
    fields: ["name", "first_name", "last_name", "education_program"],
    filters,
    limit_start: pageIndex,
    limit: 18,
  });

  return (
    <div className="studentSection container lg:px-24 px-4 py-24">
      <button
        className="text-[#0f6990] text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 hover:bg-[#0f6990] hover:text-white transition ease-in-out duration-300"
        onClick={() => navigate(-1)}
      >
        &lt; Go back
      </button>
      <h1 className="text-4xl text-[#0f6990] ">Students List</h1>
      {isLoading ? (
        <div className="h-dvh flex justify-center align-middle">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="cardLayout mt-8 flex flex-wrap justify-center align-middle gap-6">
          {data?.map((student) => (
            <div
              className="group card w-full lg:w-1/4 rounded-2xl shadow-2xl p-7 cursor-pointer bg-white hover:bg-[#0f6990] transition ease-in-out duration-300"
              key={student.idx}
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
                </div>
              </div>
            </div>
          ))}
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
        </div>
      )}
    </div>
  );
}

export default StudentsPage;
