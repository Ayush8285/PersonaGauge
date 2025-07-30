import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

import Loader from "./components/Loader";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NotFound from "./pages/NotFound"; // Optional: Handle 404 pages

import { restoreFinished, restoreSession } from "./redux/slices/authSlice";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import UploadCV from "./pages/UploadCV";
import Quiz from "./pages/Quiz";
import Result from "./pages/Results";
import AllResults from "./pages/All_Result";
import Feedback from "./pages/Feedback";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Settings from "./pages/Settings";
import UserDetails from "./pages/UserDetails";
import AccuracyChart from "./pages/AccuracyChart"

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user);

    if (accessToken && user) {
      dispatch(restoreSession({ user, access: accessToken })); // ✅ Restore login state
    } else {
      dispatch(restoreFinished());
    }
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>

      {/* {Home Route} */}
        < Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />}/>
        {/* Public Routes (Login & Signup) */}
        <Route
          path="/login"
          element={
            loading ? (<Loader />) : isAuthenticated ? (<Navigate to="/dashboard" />) : (<Login />)}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/accuracy" element={<AccuracyChart />} />

        {/* Protected Routes (Only for logged-in users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="user/:userId" element={<UserDetails />} />
            <Route path="uploadcv" element={<UploadCV />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="result" element={<Result />} />
            <Route path="allresults/:user_id/:cv_id/:quiz_id" element={<AllResults />} />
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
