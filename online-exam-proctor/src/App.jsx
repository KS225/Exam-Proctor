import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import StudentSignin from "./pages/StudentSignin";
import TeacherSignin from "./pages/TeacherSignin";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Profile from "./pages/Profile";
import ClassroomLayout from "./components/ClassroomLayout";
import ExamPage from "./pages/ExamPage";
import ExamPreview from "./pages/ExamPreview";
import ExamResults from "./pages/ExamResults";
import AttemptView from "./pages/AttemptView";
import StudentAttemptView from "./pages/StudentAttemptView"
import { AuthProvider } from "./context/AuthContext";
import StudentResults from "./pages/StudentResults";
import ViolationMonitor from "./pages/ViolationMonitor";
import ExamViolationDetails from "./pages/ExamViolationDetails";
import StudentViolations from "./pages/StudentViolations";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/studentsignin" element={<StudentSignin />} />
          <Route path="/teachersignin" element={<TeacherSignin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/teacherdashboard" element={<TeacherDashboard />} />
          <Route path="/profile" element={<Profile />} />

          {/* Classroom layout handles all tabs internally */}
          <Route path="/classroom/:code" element={<ClassroomLayout />} />


<Route
  path="/teacher/violations/:examId"
  element={<ViolationMonitor />}
/>
<Route
  path="/classroom/:code/violations/:examId"
  element={<ExamViolationDetails />}
/>
          <Route path="/exam/:id" element={<ExamPage />} />
          <Route path="/exam-preview/:id" element={<ExamPreview />} />
          <Route path="/exam-results/:examId" element={<ExamResults />} />
          <Route path="/attempt/:attemptId" element={<AttemptView />} />
          <Route path="/result/:attemptId" element={<StudentAttemptView />} />
          <Route path="/student/results" element={<StudentResults />} />
          <Route path="/studentdashboard/violations" element={<StudentViolations />} />
       
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;