import { useEffect, useState } from 'react';
import { api, getSession } from '../api.js';

const FIELDS = [
  ['Email', 'email'],
  ['Phone', 'phone'],
  ['City', 'city'],
  ['Department', 'department'],
  ['Date of birth', 'dateOfBirth'],
];

export default function Profile() {
  const session = getSession();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getProfile(session.user.profileId)
      .then(setProfile)
      .catch((err) => setError(err.message));
  }, [session.user.profileId]);

  if (error) return <p className="error">{error}</p>;
  if (!profile) return <p className="muted">Loading profile...</p>;

  return (
    <section className="card">
      <div className="profile-head">
        <div className="avatar">{profile.fullName.charAt(0)}</div>
        <div>
          <h1>{profile.fullName}</h1>
          <p className="muted">Profile ID {profile.id}</p>
        </div>
      </div>
      <dl className="details">
        {FIELDS.map(([label, key]) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd>{profile[key] || '-'}</dd>
          </div>
        ))}
      </dl>
      <h2>About</h2>
      <p>{profile.bio || 'No bio added yet.'}</p>
    </section>
  );
}
