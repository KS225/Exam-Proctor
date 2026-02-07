import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import StudentSignin from "./pages/studentsignin";
import TeacherSignin from "./pages/teachersignin";
import Home from "./pages/Home";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/studentsignin" element={<StudentSignin />} />
         <Route path="/teachersignin" element={<TeacherSignin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student-dashboard" element={<h1>Student Dashboard</h1>} />
        <Route path="/teacher-dashboard" element={<h1>Teacher Dashboard</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
