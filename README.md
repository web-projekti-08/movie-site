## Elokuvasovellus

Projektin toimeksiantona on toteuttaa leffaharrastajille websivusto. Sovellus hyödyntää avoimen datan rajapintaa (The movide database). Sovelluksen selaimessa toimiva osuus toteutetaan React- ja palvelin Node-tekniikalla. Tietokantana käytetään PostgreSQL-tietokantaa.


## Testing
### Local testing with npm:
1. **Create the test database** in PostgreSQL:
```bash
CREATE DATABASE netdb_test;
```
### Inside api/ folder:
2.  Install dependencies:
```bash
npm install
```
3.  Run tests:
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