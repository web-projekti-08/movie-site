import React, { useState, useEffect } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("movies"); // movies tai tvshows
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        if (activeTab === "movies") {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/movie`);
          const data = await res.json();
          setMovies(data);
        } else {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/tvshow`);
          const data = await res.json();
          setTvShows(data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [activeTab]);

  const dataToShow = activeTab === "movies" ? movies : tvShows;

  return (
    <div className="container mt-4">
      <div className="btn-group mb-4" role="group">
        <button
          type="button"
          className={`btn ${activeTab === "movies" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("movies")}
        >
          Movies
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "tvshows" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setActiveTab("tvshows")}
        >
          TV Shows
        </button>
      </div>

      {loading ? (
        <p>Loading {activeTab}…</p>
      ) : dataToShow.length === 0 ? (
        <p>{activeTab} not found.</p>
      ) : (
        <div className="row">
          {dataToShow.map((item) => (
            <div key={item.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card h-100">
                <img
                  src={item.image || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FlOqJGrDhForxVbfhstTAHhi1qMS.jpg&f=1&nofb=1&ipt=019db8a94d111fd408bdb995ef827732a379415e224b0b8661c00d26162e66d3"}
                  className="card-img-top"
                  alt={item.title}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text flex-grow-1">
                    Year: {item.year}<br />
                    Director: {item.director}<br />
                    Genre: {item.genre}<br />
                    Rating: {item.rating}
                  </p>
                  <a href="#" className="btn btn-primary mt-auto">Add to favorites</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
