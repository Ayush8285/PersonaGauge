/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { login } from "./redux/slices/authSlice";
import { BrowserRouter as Router, Routes, Route,} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom"; 

import Home from "./pages/Home";
import UploadCV from "./pages/UploadCV";
import Quiz from "./pages/Quiz";
import Result from "./pages/Results";
import Feedback from "./pages/Feedback";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Settings from "./pages/Settings";
import UserDetails from "./pages/UserDetails";

import Login from "./components/Login";
import Signup from "./components/Signup";
import NotFound from "./pages/NotFound"; // Optional: Handle 404 pages

const App = () => {

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user"));
    

    if (accessToken && user) {
      dispatch(login.fulfilled({ user, access: accessToken })); // ✅ Restore login state
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes (Login & Signup) */}
        <Route path="/login" element={ isAuthenticated ? <Navigate to={"/"} /> :<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes (Only for logged-in users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={ <Home />} />
            <Route path="user/:userId" element={<UserDetails />} />
            <Route path="uploadcv" element={<UploadCV />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="result" element={<Result />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 Page (Optional) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
