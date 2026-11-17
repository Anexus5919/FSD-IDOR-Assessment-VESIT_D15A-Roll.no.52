import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { clearSession, getSession } from './api.js';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';

function Header() {
  const navigate = useNavigate();
  const session = getSession();

  function logout() {
    clearSession();
    navigate('/login');
  }

  return (
    <header className="topbar">
      <Link to="/" className="brand">ProfileHub</Link>
      {session ? (
        <div className="topbar-right">
          <span className="muted">Signed in as {session.user.email}</span>
          <button className="btn-secondary" onClick={logout}>Log out</button>
        </div>
      ) : (
        <nav className="topbar-right">
          <Link to="/login">Log in</Link>
          <Link to="/register">Register</Link>
        </nav>
      )}
    </header>
  );
}

function RequireSession({ children }) {
  return getSession() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <RequireSession>
                <Profile />
              </RequireSession>
            }
          />
        </Routes>
      </main>
    </>
  );
}
