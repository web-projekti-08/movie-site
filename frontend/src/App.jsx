import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Groups from "./pages/Groups";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import Notifications from "./pages/Notifications";
import MoviePage from './pages/MoviePage';


function App() {
  return (
    <Router>
      <Navbar />
      <Header />
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/movie/:id" element={<MoviePage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;