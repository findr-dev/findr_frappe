import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import { FrappeProvider } from "frappe-react-sdk";
import Student from "./pages/Student";
import ScrollToTop from "./components/ScrollToTop";
import Course from "./pages/Course";

import { ToastContainer } from "react-toastify";
import { RoleProvider } from "./context/RoleContext";
import AllStudentsPage from "./pages/AllStudentsPage";
import NewStudentsPage from "./pages/NewStudentsPage";
import StudentsReviewPage from "./pages/StudentsReviewPage";
import StudentsCourseGiven from "./pages/StudentsCourseGiven";
import StudentFeedBackReview from "./pages/StudentFeedBackReview";

function App() {
  return (
    <>
      <FrappeProvider
      //   url="http://127.0.0.1:8000"
      //   enableSocket={false}
      //   tokenParams={{
      //     useToken: "true",
      //     type: "token",
      //     token: () => "9b3b139dfd782d3:658888b185ca3db",
      //   }}
      >
        <RoleProvider>
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<AllStudentsPage />} />
            <Route path="/students/new" element={<NewStudentsPage />} />
            <Route path="/students/review" element={<StudentsReviewPage />} />
            <Route
              path="/students/course-given"
              element={<StudentsCourseGiven />}
            />
            <Route
              path="/students/feedback-review"
              element={<StudentFeedBackReview />}
            />
            <Route path="/students/:id" element={<Student />} />
            <Route path="/course/:id" element={<Course />} />
          </Routes>
        </RoleProvider>
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </FrappeProvider>
    </>
  );
}

export default App;
