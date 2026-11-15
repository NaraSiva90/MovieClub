import React, { useState, useEffect } from 'react';
import { useClubReviews } from '../hooks/useClubReviews';

const MEMBER_COLORS = [
  '#E6A855', '#7CB9E8', '#E88D8D', '#9ACD32', '#B19CD9',
  '#F4A460', '#87CEEB', '#DDA0DD', '#98FB98', '#FF6B6B',
];

const ClubView = ({ club, userId, onBack, onSelectFilm, getInviteLink, onLeave, onDelete }) => {
  const { getSharedFilms, loading: reviewsLoading } = useClubReviews();
  const [members, setMembers] = useState([]);
  const [sharedFilms, setSharedFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [error, setError] = useState(null);

  const loadClubData = async () => {
    setLoading(true);
    try {
      // Import supabase to fetch members
      const { supabase } = await import('../lib/supabase');
      const { data: membersData } = await supabase
        .from('club_members')
        .select('*')
        .eq('club_id', club.id)
        .order('joined_at', { ascending: true });

      setMembers(membersData || []);

      if (membersData && membersData.length >= 2) {
        const films = await getSharedFilms(membersData);
        setSharedFilms(films);
      }
    } catch (err) {
      console.error('Failed to load club data:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadClubData();
  }, [club.id]);

  const handleCopyInvite = async () => {
    const link = getInviteLink(club);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2000);
    } catch {
      prompt('Copy this invite link:', link);
    }
  };

  const handleLeave = async () => {
    if (window.confirm('Leave this club? You can rejoin with the invite link.')) {
      try {
        await onLeave(club.id);
        onBack();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this club? This cannot be undone. All members will be removed.')) {
      try {
        await onDelete(club.id);
        onBack();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getMemberColor = (memberId) => {
    const idx = members.findIndex(m => m.user_id === memberId);
    return MEMBER_COLORS[idx % MEMBER_COLORS.length];
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        <p className="text-silver text-sm">Loading club...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="text-silver hover:text-cream text-sm mb-4 inline-flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Clubs
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-display text-3xl text-cream">{club.name}</h2>
            <p className="text-silver mt-1">
              {members.length} {members.length === 1 ? 'member' : 'members'}
              {' · '}
              {sharedFilms.length} shared {sharedFilms.length === 1 ? 'film' : 'films'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopyInvite}
              className="border border-gold/50 hover:border-gold text-gold hover:text-gold-light font-medium py-2 px-4 rounded-lg transition-colors text-sm inline-flex items-center gap-2"
            >
              {copiedInvite ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Invite Link
                </>
              )}
            </button>
            {club.myRole === 'owner' ? (
              <button
                onClick={handleDelete}
                className="border border-red-500/50 hover:border-red-500 text-red-400 hover:text-red-300 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Delete Club
              </button>
            ) : (
              <button
                onClick={handleLeave}
                className="border border-slate hover:border-silver text-silver hover:text-cream font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Leave Club
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Members */}
      <div className="bg-charcoal border border-slate rounded-xl p-5">
        <h3 className="font-display text-lg text-cream mb-3">Members</h3>
        <div className="flex flex-wrap gap-3">
          {members.map((member, idx) => (
            <div
              key={member.id}
              className="inline-flex items-center gap-2 bg-midnight border border-slate rounded-full px-3 py-1.5"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: MEMBER_COLORS[idx % MEMBER_COLORS.length] }}
              />
              <span className="text-cream text-sm">
                {member.display_name}
                {member.user_id === userId && (
                  <span className="text-slate ml-1">(you)</span>
                )}
              </span>
              {member.role === 'owner' && (
                <span className="text-gold text-xs">★</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Shared Films */}
      {members.length < 2 ? (
        <div className="bg-charcoal border border-slate rounded-xl p-12 text-center">
          <h3 className="font-display text-xl text-cream mb-2">Invite friends to get started</h3>
          <p className="text-silver mb-4">
            You need at least 2 members who've reviewed the same film to see comparisons.
          </p>
          <button
            onClick={handleCopyInvite}
            className="bg-gold hover:bg-gold-light text-midnight font-semibold py-2 px-5 rounded-lg transition-colors"
          >
            Copy Invite Link
          </button>
        </div>
      ) : sharedFilms.length === 0 ? (
        <div className="bg-charcoal border border-slate rounded-xl p-12 text-center">
          <h3 className="font-display text-xl text-cream mb-2">No shared films yet</h3>
          <p className="text-silver">
            When two or more members review the same film, it'll appear here for comparison.
          </p>
        </div>
      ) : (
        <div>
          <h3 className="font-display text-lg text-cream mb-4">Shared Films</h3>
          <div className="grid gap-3">
            {sharedFilms.map((film) => {
              const year = film.movieData.release_date?.split('-')[0];
              const posterUrl = film.movieData.poster_path
                ? `https://image.tmdb.org/t/p/w92${film.movieData.poster_path}`
                : null;

              return (
                <button
                  key={film.movieId}
                  onClick={() => onSelectFilm(film, members)}
                  className="bg-charcoal border border-slate rounded-xl p-4 text-left hover:border-gold/50 transition-all group w-full"
                >
                  <div className="flex items-center gap-4">
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={film.movieData.title}
                        className="w-12 h-18 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-18 rounded bg-slate/30 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-cream font-medium group-hover:text-gold transition-colors truncate">
                        {film.movieData.title}
                        {year && <span className="text-silver ml-2">({year})</span>}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex -space-x-1">
                          {film.reviews.map((review, idx) => {
                            const member = members.find(m => m.user_id === review.userId);
                            const color = getMemberColor(review.userId);
                            return (
                              <div
                                key={review.userId}
                                className="w-5 h-5 rounded-full border-2 border-charcoal flex items-center justify-center text-[8px] font-bold text-midnight"
                                style={{ backgroundColor: color }}
                                title={member?.display_name}
                              >
                                {member?.display_name?.[0]?.toUpperCase()}
                              </div>
                            );
                          })}
                        </div>
                        <span className="text-silver text-sm">
                          {film.reviews.length} reviews
                        </span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-slate group-hover:text-gold transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubView;
