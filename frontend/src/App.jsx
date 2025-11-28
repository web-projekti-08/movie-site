import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Groups from "./pages/Groups";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Navbar />
      <Header />
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;