import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';

const EMPTY = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  city: '',
  department: '',
  dateOfBirth: '',
  bio: '',
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.register(form);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card">
      <h1>Create an account</h1>
      <p className="muted">Your profile is created together with your account.</p>
      <form onSubmit={handleSubmit} className="form grid">
        <label>
          Full name
          <input id="fullName" value={form.fullName} onChange={update('fullName')} required />
        </label>
        <label>
          Email
          <input id="email" type="email" value={form.email} onChange={update('email')} required />
        </label>
        <label>
          Password
          <input id="password" type="password" value={form.password} onChange={update('password')} required />
        </label>
        <label>
          Phone
          <input id="phone" value={form.phone} onChange={update('phone')} />
        </label>
        <label>
          City
          <input id="city" value={form.city} onChange={update('city')} />
        </label>
        <label>
          Department
          <input id="department" value={form.department} onChange={update('department')} />
        </label>
        <label>
          Date of birth
          <input id="dateOfBirth" type="date" value={form.dateOfBirth} onChange={update('dateOfBirth')} />
        </label>
        <label className="span-2">
          Short bio
          <textarea id="bio" rows={3} value={form.bio} onChange={update('bio')} />
        </label>
        {error && <p className="error span-2">{error}</p>}
        <div className="span-2">
          <button id="register-btn" className="btn-primary" type="submit" disabled={busy}>
            {busy ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>
      <p className="muted small">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </section>
  );
}
