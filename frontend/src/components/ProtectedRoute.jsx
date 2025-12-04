/*
  ProtectedRoute komponentti suojaa reittejä, jotka vaativat käyttäjän olevan kirjautuneena sisään.
  Jos käyttäjä ei ole kirjautunut, hänet ohjataan login-sivulle.
*/

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="container mt-4"><p>Loading...</p></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}