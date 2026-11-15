import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfileSetup = () => {
  const { createProfile, user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (!trimmed) return;

    setError(null);
    setLoading(true);

    try {
      await createProfile(trimmed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
      <div className="noise-overlay" />
      <div className="relative bg-charcoal border border-slate rounded-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
            <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl text-cream">Welcome to Movie Club</h1>
          <p className="text-silver text-sm mt-2">
            Pick a display name — this is how your friends will see you in clubs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-silver text-sm mb-1" htmlFor="displayName">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              maxLength={30}
              className="w-full bg-midnight border border-slate rounded-lg px-4 py-3 text-cream placeholder-slate focus:border-gold focus:outline-none transition-colors"
              placeholder="e.g. Nara, CinephileMax, MovieBuff42"
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !displayName.trim()}
            className="w-full bg-gold hover:bg-gold-light disabled:opacity-50 text-midnight font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Setting up...' : 'Continue'}
          </button>
        </form>

        <p className="text-slate text-xs text-center mt-4">
          Signed in as {user?.email}
        </p>
      </div>
    </div>
  );
};

export default ProfileSetup;
