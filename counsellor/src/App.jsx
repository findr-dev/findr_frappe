import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import { FrappeProvider } from "frappe-react-sdk";
import StudentsPage from "./pages/StudentsPage";
import Student from "./pages/Student";
import ScrollToTop from "./components/ScrollToTop";
import Course from "./pages/Course";

import { useState } from "react";

function App() {
   const [token, setToken] = useState("");

   return (
      <>
         <FrappeProvider
            url="https://findrstudy.frappe.cloud"
            tokenParams={{
               type: "Bearer",
               useToken: "true",
               token: () => token,
            }}
         >
            <Navbar />
            <ScrollToTop />
            <Routes>
               <Route
                  path="/"
                  element={<Dashboard token={token} setToken={setToken} />}
               />
               <Route path="/students" element={<StudentsPage />} />
               <Route path="/students/new" element={<StudentsPage />} />
               <Route path="/students/:id" element={<Student />} />
               <Route path="/course/:id" element={<Course />} />
            </Routes>
         </FrappeProvider>
      </>
   );
}

export default App;
