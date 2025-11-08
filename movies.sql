DROP TABLE IF EXISTS movies;

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  year INT,
  director TEXT,
  genre TEXT,
  rating NUMERIC(3,1)
);

INSERT INTO movies (title, year, director, genre, rating) VALUES
('Heat', 1995, 'Michael Mann', 'Crime', 8.3),
('The Matrix', 1999, 'Wachowskis', 'Sci-Fi', 8.7),
('Blade Runner 2049', 2017, 'Denis Villeneuve', 'Sci-Fi', 8.0);