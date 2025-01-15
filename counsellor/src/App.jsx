import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import { FrappeProvider } from "frappe-react-sdk";
import StudentsPage from "./pages/StudentsPage";
import Student from "./pages/Student";
import ScrollToTop from "./components/ScrollToTop";
import Course from "./pages/Course";
import { AuthComponent } from "./auth/Auth";

function App() {
  return (
    <>
      <FrappeProvider>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<AuthComponent />} />
          <Route path="/counsellor/" element={<Dashboard />} />
          <Route path="/counsellor/students" element={<StudentsPage />} />
          <Route path="/counsellor/students/new" element={<StudentsPage />} />
          <Route path="/counsellor/students/:id" element={<Student />} />
          <Route path="/counsellor/course/:id" element={<Course />} />
        </Routes>
      </FrappeProvider>
    </>
  );
}

export default App;
