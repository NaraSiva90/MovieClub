import React, { useState } from 'react';
import ClubCreate from './ClubCreate';

const ClubList = ({ clubs, loading, onCreateClub, onSelectClub, getInviteLink }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleCreate = async (name) => {
    setError(null);
    setCreateLoading(true);
    try {
      await onCreateClub(name);
      setShowCreate(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCopyInvite = async (e, club) => {
    e.stopPropagation();
    const link = getInviteLink(club);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(club.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      prompt('Copy this invite link:', link);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        <p className="text-silver text-sm">Loading clubs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display text-3xl text-cream">My Clubs</h2>
          <p className="text-silver mt-1">
            {clubs.length} {clubs.length === 1 ? 'club' : 'clubs'}
          </p>
        </div>
        {!showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="bg-gold hover:bg-gold-light text-midnight font-semibold py-2 px-5 rounded-lg transition-colors"
          >
            + New Club
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {showCreate && (
        <ClubCreate
          onSubmit={handleCreate}
          onCancel={() => { setShowCreate(false); setError(null); }}
          loading={createLoading}
        />
      )}

      {clubs.length === 0 && !showCreate ? (
        <div className="bg-charcoal border border-slate rounded-xl p-12 text-center">
          <div className="text-silver mb-4">
            <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-display text-xl text-cream mb-2">No clubs yet</h3>
          <p className="text-silver mb-6">Create a club and invite friends to compare SPACE reviews.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-gold hover:bg-gold-light text-midnight font-semibold py-2 px-5 rounded-lg transition-colors"
          >
            Create Your First Club
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {clubs.map((club) => (
            <button
              key={club.id}
              onClick={() => onSelectClub(club)}
              className="bg-charcoal border border-slate rounded-xl p-5 text-left hover:border-gold/50 transition-all group w-full"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg text-cream group-hover:text-gold transition-colors">
                    {club.name}
                  </h3>
                  <p className="text-silver text-sm mt-1">
                    {club.myRole === 'owner' ? 'Owner' : 'Member'}
                    {' · '}
                    Created {new Date(club.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleCopyInvite(e, club)}
                    className="p-2 text-silver hover:text-gold transition-colors"
                    title="Copy invite link"
                  >
                    {copiedId === club.id ? (
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    )}
                  </button>
                  <svg className="w-5 h-5 text-slate group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubList;
