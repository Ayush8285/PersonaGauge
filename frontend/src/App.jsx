import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import UploadCV from "./pages/UploadCV";
import Quiz from "./pages/Quiz";
import Result from "./pages/Results";
// import Settings from "./pages/Dashboard/Settings";
// import ContactUs from "./pages/StaticPages/ContactUs";
// import AboutUs from "./pages/StaticPages/AboutUs";
// import Rate from "./pages/StaticPages/Rate";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="uploadcv" element={<UploadCV />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="result" element={<Result />} />
          {/* <Route path="settings" element={<Settings />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="rate" element={<Rate />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
