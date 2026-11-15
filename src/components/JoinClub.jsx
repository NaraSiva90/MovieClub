import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const JoinClub = ({ inviteCode, onJoin, onCancel, loading }) => {
  const [club, setClub] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('invite_code', inviteCode.toUpperCase().trim())
        .single();

      if (error || !data) {
        setFetchError('Club not found. The invite link may be invalid or expired.');
      } else {
        setClub(data);
      }
      setFetching(false);
    };
    fetchClub();
  }, [inviteCode]);

  if (fetching) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="noise-overlay" />
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="text-silver text-sm">Looking up club...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
        <div className="noise-overlay" />
        <div className="relative bg-charcoal border border-slate rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-900/30 border border-red-500/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="font-display text-xl text-cream mb-2">Invalid Invite Link</h2>
          <p className="text-silver text-sm">{fetchError}</p>
          <button
            onClick={onCancel}
            className="mt-6 bg-slate hover:bg-slate/80 text-cream font-medium py-2 px-5 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
      <div className="noise-overlay" />
      <div className="relative bg-charcoal border border-slate rounded-2xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="font-display text-2xl text-cream mb-2">Join {club.name}?</h2>
        <p className="text-silver text-sm mb-6">
          You've been invited to join this movie club. Your reviews for shared films will be visible to other members.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => onJoin(inviteCode)}
            disabled={loading}
            className="bg-gold hover:bg-gold-light disabled:opacity-50 text-midnight font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Joining...' : 'Join Club'}
          </button>
          <button
            onClick={onCancel}
            className="border border-slate hover:border-silver text-silver hover:text-cream py-2 px-6 rounded-lg transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinClub;
