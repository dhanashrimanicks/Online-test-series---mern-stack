import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Login from "./pages/Login";
import AddAdmin from "./pages/AddAdmin";
import StudentRegister from "./pages/StudentRegister";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import PrivateRoute from "./components/PrivateRoute";
import CreateFaculties from "./pages/CreateFaculties";
import AllStudents from "./pages/AllStudents";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StudentProfile from "./pages/StudentProfile";
import FacultyProfile from "./pages/FacultyProfile";
import AdminProfile from "./pages/AdminProfile";
import CreateTestSeries from "./pages/CreateTestSeries";
import AddQuestions from "./pages/AddQuestions";
import MyTestSeries from "./pages/MyTestSeries";
import ManageQuestions from "./pages/ManageQuestions";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/addadmin" element={<AddAdmin />} />
        <Route path="/register" element={<StudentRegister />} />
        <Route path="/admin" element={<PrivateRoute role="admin" />}>
          <Route path="admindashboard" element={<AdminDashboard />} />
          <Route path="createfaculties" element={<CreateFaculties />} />
          <Route path="students" element={<AllStudents />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
        <Route path="/faculty" element={<PrivateRoute role="faculty" />}>
          <Route path="facultydashboard" element={<FacultyDashboard />} />
          <Route path="profile" element={<FacultyProfile />} />
          <Route path="create-testseries" element={<CreateTestSeries />} />
          <Route path="add-questions/:testId" element={<AddQuestions />} />
          <Route path="my-test-series" element={<MyTestSeries />} />
          <Route
            path="manage-questions/:testId"
            element={<ManageQuestions />}
          />
        </Route>
        <Route path="/student" element={<PrivateRoute role="student" />}>
          <Route path="studentdashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Your other routes */}
      </Routes>
    </QueryClientProvider>
  );
}
export default App;
