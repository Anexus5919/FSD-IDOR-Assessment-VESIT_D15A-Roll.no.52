import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, saveSession } from '../api.js';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const session = await api.login(form);
      saveSession(session);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card narrow">
      <h1>Log in</h1>
      <p className="muted">Use your ProfileHub account to view your profile.</p>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          Password
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button id="login-btn" className="btn-primary" type="submit" disabled={busy}>
          {busy ? 'Signing in...' : 'Log in'}
        </button>
      </form>
      <p className="muted small">
        No account yet? <Link to="/register">Create one</Link>
      </p>
    </section>
  );
}
