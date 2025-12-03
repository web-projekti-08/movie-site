/*
  AuthContext hallinnoi käyttäjän todennusta ja tilaa frontendissä authApin kautta.
  authApi hoitaa itse apikutsut backendille.

  Vain accessToken tallennetaan localStorageen, refreshToken on httpOnly cookie.
  Käyttäjätietoja ei tallenneta localStorageen turvallisuussyistä.

  Muissa frontend-komponenteissa voi käyttää useAuth-hookkia käyttäjätietojen ja
  ryhmätietojen hakemiseen näin:
  const { user } = useAuth();
  const { isOwnerInGroup, isMemberInGroup } = useAuth();

  Ja itse käyttö:
  user.email -> käyttäjän sähköposti
  user.userId -> käyttäjän ID
  user.groups -> [{ group_id, group_name, role }]
  isOwnerInGroup -> true/false
  isMemberInGroup -> true/false

  Tällä voi myös näyttää tiettyjä komponentteja vain kirjautuneille käyttäjille tai
  käyttäjille, jotka ovat ryhmän omistajia/jäseniä. Esimerkiksi:

  { isOwnerInGroup(groupId) && <button>Edit Group</button> } -> Nappi näytetään vain, jos käyttäjä on ryhmän omistaja.

  { !user && <p>Please log in</p> } -> Viesti näytetään vain, jos käyttäjä ei ole kirjautunut sisään.
*/

import { createContext, useState, useEffect, useContext } from "react";
import { login, logout, register, deleteAccount, getProfile, API_URL } from "../services/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ladataan accesToken localStoragesta sivun latautuessa
  useEffect(() => {
  async function initAuth() {
    const savedToken = localStorage.getItem("accessToken");

    if (savedToken) {
      try {
        const res = await fetch(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${savedToken}` },
          credentials: 'include'
        });

        if (res.ok) {
          const data = await res.json();
          // Asetetaan käyttäjätiedot ja käyttäjän ryhmät
          setUser(data); // { userId, email, groups }
          setAccessToken(savedToken);
        } else {
          localStorage.removeItem("accessToken");
        }
      } catch (err) {
        console.error("Token validation error:", err);
        localStorage.removeItem("accessToken");
      }
    }

    setIsLoading(false);
  }

  initAuth();
}, []);

  // Hae käyttäjätiedot ja talleta token kirjautumisen yhteydessä
  const handleLogin = async (email, password) => {
    const response = await login(email, password);

    // Talleta vain token localStorageen
    localStorage.setItem("accessToken", response.accessToken);
    setAccessToken(response.accessToken);

    // Hae käyttäjätiedot tokenilla backendiltä
    const userData = await getProfile(response.accessToken);
    setUser(userData);
  };

  // Poista käyttäjätiedot ja token uloskirjautumisen yhteydessä
  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  };

  const handleRegister = async (email, password) => {
    return await register(email, password);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  }

  // Apufunktiot ryhmätietojen tarkistamiseen
  const isOwnerInGroup = (groupId) =>
  user?.groups?.some(g => g.group_id === groupId && g.role === "owner") ?? false;

  const isMemberInGroup = (groupId) =>
  user?.groups?.some(g => g.group_id === groupId && g.role === "member") ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
        deleteAccount: handleDeleteAccount,
        isOwnerInGroup,
        isMemberInGroup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}


