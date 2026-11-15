import React, { useState } from 'react';

const ClubCreate = ({ onSubmit, onCancel, loading }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <div className="bg-charcoal border border-slate rounded-xl p-6">
      <h3 className="font-display text-xl text-cream mb-4">Create a Club</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-silver text-sm mb-1" htmlFor="clubName">
            Club Name
          </label>
          <input
            id="clubName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={50}
            className="w-full bg-midnight border border-slate rounded-lg px-4 py-3 text-cream placeholder-slate focus:border-gold focus:outline-none transition-colors"
            placeholder="e.g. Friday Night Films, The Cinephiles"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="bg-gold hover:bg-gold-light disabled:opacity-50 text-midnight font-semibold py-2 px-5 rounded-lg transition-colors"
          >
            {loading ? 'Creating...' : 'Create Club'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-silver hover:text-cream py-2 px-5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClubCreate;
