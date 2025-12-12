## Elokuvasovellus

Projektin toimeksiantona on toteuttaa leffaharrastajille websivusto. Sovellus hyödyntää avoimen datan rajapintaa (The movide database). Sovelluksen selaimessa toimiva osuus toteutetaan React- ja palvelin Node-tekniikalla. Tietokantana käytetään PostgreSQL-tietokantaa.


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