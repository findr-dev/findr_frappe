import Card from "../components/Card";
import { useEffect, useState } from "react";
import { useRole } from "../context/RoleContext";
import { useFrappeAuth } from "frappe-react-sdk";

function Dashboard() {
  const { roleProfile, userName } = useRole();
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, logout } = useFrappeAuth();

  useEffect(() => {
    if (roleProfile) setIsLoading(false);
  }, [roleProfile]);

  useEffect(() => {
    if (currentUser == "counsellor@findr.study") logout();
  }, [currentUser]);

  const redirectLoginLink =
    "https://findrstudy.frappe.cloud/login?redirect-to=%2Fcounsellor#login";

  const cards = [
    {
      id: "1",
      image: (
        <span className="material-symbols-outlined text-green-800 text-8xl text-center flex h-full justify-center items-center">
          person_add
        </span>
      ),
      title: "New Students",
      description: `Newly registered students`,
      location: "students/new",
      role: "Auditor",
    },
    {
      id: "2",
      image: (
        <span className="material-symbols-outlined text-green-800 text-8xl text-center flex h-full justify-center items-center">
          pending_actions
        </span>
      ),
      title: "Review Students",
      description: `Courses has been added for reviewing`,
      location: "students/review",
      role: "Auditor",
    },
    {
      id: "3",
      image: (
        <span className="material-symbols-outlined text-green-800 text-8xl text-center flex h-full justify-center items-center">
          groups
        </span>
      ),
      title: "Feedback Students",
      description: `Students who gave a feedback to review`,
      location: "students/feedback-review",
      role: "Auditor",
    },
    {
      id: "4",
      image: (
        <span className="material-symbols-outlined text-green-800 text-8xl text-center flex h-full justify-center items-center">
          person_add
        </span>
      ),
      title: "New Students",
      description: `Newly Assigned Students`,
      location: "students/new",
      role: "Counsellor",
    },
    {
      id: "5",
      image: (
        <span className="material-symbols-outlined text-green-800 text-8xl text-center flex h-full justify-center items-center">
          pending_actions
        </span>
      ),
      title: "Review Students",
      description: `Course review pending students list`,
      location: "students/review",
      role: "Counsellor",
    },
    {
      id: "6",
      image: (
        <span className="material-symbols-outlined text-green-800 text-8xl text-center flex h-full justify-center items-center">
          groups
        </span>
      ),
      title: "All Students",
      description: `All registered students`,
      location: "students",
      role: "Master Auditor",
    },
    {
      id: "7",
      image: (
        <span className="material-symbols-outlined text-green-800 text-8xl text-center flex h-full justify-center items-center">
          flag_2
        </span>
      ),
      title: "Students on hold",
      description: `Students that are on hold`,
      location: "students/review",
      role: "Master Auditor",
    },
    {
      id: "8",
      image: (
        <span className="material-symbols-outlined text-green-800 text-8xl text-center flex h-full justify-center align-middle">
          person_add
        </span>
      ),
      title: "Course Given",
      description: `Course Given students list`,
      location: "students/course-given",
      role: "Master Auditor",
    },
  ];

  return (
    <div className="container lg:px-24 px-4 py-24 h-dvh">
      {currentUser ? (
        <>
          <div className="title">
            <p className="text-4xl lg:text-5xl  text-[#0f6990]">
              Welcome back {userName}
            </p>
          </div>
          {isLoading ? (
            <div className="h-dvh flex justify-center align-middle">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              <div className="cardLayout flex flex-wrap justify-evenly align-middle gap-2">
                {/* students list */}
                {cards.map(
                  (card) =>
                    card.role === roleProfile && (
                      <Card key={card.id} card={card} />
                    )
                )}
              </div>
              <button
                className="text-lg shadow py-2 px-4 rounded-2xl hover:scale-110 bg-[#0f6990] text-white transition ease-in-out duration-300"
                onClick={check}
              >
                Create Student
              </button>
            </>
          )}
        </>
      ) : (
        <div className="h-full flex justify-center items-center">
          <div className="card flex flex-col justify-center items-center bg-[#0f6990] w-full h-3/4 lg:w-2/6 rounded-2xl shadow-2xl p-8 lg:p-12 mt-12 cursor-pointer">
            <div className="cardHeading">
              <div className="h-30">
                <span className="material-symbols-outlined text-white text-9xl text-center flex h-full justify-center align-middle">
                  tv_signin
                </span>
              </div>
            </div>
            <div className="cardBody">
              <div className="cardContent">
                <div className="cardTitle py-2">
                  <h2 className="text-3xl text-white text-center">
                    Login to continue
                  </h2>
                </div>
              </div>
              <div className="cardAction flex justify-center">
                <button
                  className="text-[#0f6990] mt-2 px-5 py-2 shadow-lg rounded-xl bg-white hover:translate-x hover:scale-105 transition ease-in-out duration-300"
                  onClick={() => (location.href = redirectLoginLink)}
                >
                  Go to Login page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
