## Movie Site

Web application for movie enthusiasts. Users can browse movies, create accounts, write reviews, manage favorites, and participate in groups.
The application uses The Movie Database (TMDB) API for movie data.

The frontend is built with React, the backend with Node.js + Express, and data is stored in a PostgreSQL database.
The entire project is containerized using Docker.

## Deployed project available at
https://movie-site-frontend-bgje.onrender.com/

## Tech Stack

### Frontend
 - React
 - React Router
 - Fetch API
 - Runs in Docker

### Backend
 - Node.js
 - Express
 - JWT authentication (access + refresh tokens)
 - Runs in Docker

### Database
 - PostgreSQL 16
 - Separate databases for development and testing

### Testing
 - Jest
 - Supertest
 - Integration tests against a real test database

## Testing
### Local testing with npm:
1. Create test database:
```bash
createdb -U postgres netdb_test
```
2. Install dependencies:
```bash
cd api
npm install
```
3. Run tests:
```bash
npm test
```
### Testing with Docker:
1. Start Docker Desktop
2. Run the tests:
```bash
docker-compose -f docker-compose.test.yml up --build
```
3. Clean up containers and volumes:
```bash
docker-compose -f docker-compose.test.yml down -v
```