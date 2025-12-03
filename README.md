## Elokuvasovellus

Projektin toimeksiantona on toteuttaa leffaharrastajille websivusto. Sovellus hyödyntää avoimen datan rajapintaa (The movide database). Sovelluksen selaimessa toimiva osuus toteutetaan React- ja palvelin Node-tekniikalla. Tietokantana käytetään PostgreSQL-tietokantaa.

## Projektin rakenne

```
movie-site/
├── api/                                    # Backend (Node.js + Express)
│   └── src/
│       ├── controllers/
│       │   ├── auth_controller.js         # Käyttäjän rekisteröinti, kirjautuminen, profiilin haku
│       │   ├── movie_controller.js        # Elokuvien haku ja haku TMDB-palvelusta
│       │   ├── review_controller.js       # Arvostelujen hallinta (CRUD)
│       │   ├── favorite_controller.js     # Suosikkielokuvien hallinta
│       │   ├── group_controller.js        # Ryhmien hallinta
│       │   └── group_content_controller.js # Ryhmän sisällön hallinta
│       │
│       ├── routers/
│       │   ├── auth_router.js             # Reitit: /user/register, /user/login, /user/profile
│       │   ├── movie_router.js            # Reitit: /movie (haku, now playing)
│       │   ├── review_router.js           # Reitit: /review (julkinen ja suojattu)
│       │   ├── favorite_router.js         # Reitit: /favorite (suojattu)
│       │   └── group_router.js            # Reitit: /groups (suojattu)
│       │
│       ├── middleware/
│       │   ├── auth.js                    # authenticateToken - JWT validointi
│       │   └── permission_middleware.js   # Rooliperustaisen pääsyn hallinta
│       │
│       ├── models/
│       │   ├── auth_model.js              # Käyttäjän tietokantatoiminnot
│       │   ├── review_model.js            # Arvostelujen tietokantatoiminnot
│       │   ├── favorite_model.js          # Suosikkien tietokantatoiminnot
│       │   ├── group_model.js             # Ryhmien tietokantatoiminnot
│       │   └── group_content_model.js     # Ryhmän sisällön tietokantatoiminnot
│       │
│       ├── services/
│       │   └── tmdb_service.js            # The Movie DB API integraatio
│       │
│       ├── utils/
│       │   └── jwt.js                     # JWT token generointi ja validointi
│       │
│       ├── database.js                    # PostgreSQL connection pool
│       └── index.js                       # Express-palvelimen pääkohta
│
├── frontend/                               # Frontend (React)
│   └── src/
│       ├── components/
│       │   ├── AddToFavoritesButton.jsx   # Nappi suosikki-elokuvan lisäämiseen
│       │   ├── AddToGroupButton.jsx       # Nappi elokuvan lisäämiseen ryhmään
│       │   ├── Footer.jsx                 # Sivun alatunniste
│       │   ├── Header.jsx                 # Sivun ylätunniste
│       │   ├── MovieDetails.jsx           # Elokuvan tietojen näyttö
│       │   ├── Navbar.jsx                 # Navigointipalkki
│       │   ├── ProtectedRoute.jsx         # Suojatut reitit (vain kirjautuneille)
│       │   ├── ReviewForm.jsx             # Arvostelun kirjoitus
│       │   └── ReviewList.jsx             # Arvostelujen lista
│       │
│       ├── pages/
│       │   ├── Home.jsx                   # Etusivu
│       │   ├── MoviePage.jsx              # Yksittäisen elokuvan sivu
│       │   ├── LoginPage.jsx              # Kirjautumissivu
│       │   ├── RegisterPage.jsx           # Rekisteröitymissivu
│       │   ├── ProfilePage.jsx            # Käyttäjän profiilisivu
│       │   ├── Favorites.jsx              # Suosikkielokuvat
│       │   ├── Groups.jsx                 # Käyttäjän ryhmät
│       │   ├── Settings.jsx               # Asetukset
│       │   ├── Notifications.jsx          # Ilmoitukset
│       │   └── Login.jsx                  # TURHA
│       │
│       ├── services/
│       │   ├── authApi.js                 # API-kutsut: login, register, logout, profile
│       │   ├── authFetch.js               # Apufunktio suojattujen API-kutsujen tekemiseen (JWT)
│       │   └── movieService.js            # API-kutsut elokuville ja arvosteluille
│       │
│       ├── context/
│       │   └── AuthContext.js             # Käyttäjän autentikaation ja tilan hallinta
│       │
│       ├── App.jsx                        # Pääkomponentti ja reitit
│       ├── App.css                        # Yleiset tyylit
│       └── index.js                       # React sovelluksen pääkohta
│
├── docs/                                   # Dokumentaatio
├── docker-compose.yml                     # Docker-asetukset tuotanto
├── docker-compose.override.yml            # Docker-asetukset kehitys
├── .env.example                           # Ympäristömuuttujien malli
├── .env                                   # Ympäristömuuttujat (ei versionhallinnassa)
├── movies.sql                             # Tietokannan alustavat SQL-skriptit
├── postgresql.conf                        # PostgreSQL-konfiguraatio
├── package.json                           # Projektin riippuvuudet ja skriptit
└── README.md                              # Tämä tiedosto
```

