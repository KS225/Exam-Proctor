import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import StudentSignin from "./pages/studentsignin";
import TeacherSignin from "./pages/teachersignin";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Profile from "./pages/Profile";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
  <Route path="/home" element={<Home />} />
         <Route path="/studentsignin" element={<StudentSignin />} />
         <Route path="/teachersignin" element={<TeacherSignin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/studentdashboard" element={<StudentDashboard />}/>
        <Route path="/teacherdashboard" element={<TeacherDashboard />}/>
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
