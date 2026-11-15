import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const generateInviteCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

export const useClubs = (userId) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClubs = useCallback(async () => {
    if (!userId) return;

    const { data: memberships, error: memErr } = await supabase
      .from('club_members')
      .select('club_id, role')
      .eq('user_id', userId);

    if (memErr) {
      console.error('Failed to fetch memberships:', memErr);
      setLoading(false);
      return;
    }

    if (memberships.length === 0) {
      setClubs([]);
      setLoading(false);
      return;
    }

    const clubIds = memberships.map(m => m.club_id);
    const roleMap = {};
    memberships.forEach(m => { roleMap[m.club_id] = m.role; });

    const { data: clubsData, error: clubErr } = await supabase
      .from('clubs')
      .select('*')
      .in('id', clubIds)
      .order('created_at', { ascending: false });

    if (clubErr) {
      console.error('Failed to fetch clubs:', clubErr);
      setLoading(false);
      return;
    }

    const clubsWithRole = clubsData.map(club => ({
      ...club,
      myRole: roleMap[club.id] || 'member',
    }));

    setClubs(clubsWithRole);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const createClub = useCallback(async (name, displayName) => {
    const inviteCode = generateInviteCode();

    const { data: club, error: clubErr } = await supabase
      .from('clubs')
      .insert({ name, created_by: userId, invite_code: inviteCode })
      .select()
      .single();

    if (clubErr) throw clubErr;

    const { error: memErr } = await supabase
      .from('club_members')
      .insert({
        club_id: club.id,
        user_id: userId,
        display_name: displayName,
        role: 'owner',
      });

    if (memErr) throw memErr;

    await fetchClubs();
    return club;
  }, [userId, fetchClubs]);

  const joinClub = useCallback(async (inviteCode, displayName) => {
    const { data: club, error: clubErr } = await supabase
      .from('clubs')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase().trim())
      .single();

    if (clubErr) throw new Error('Club not found. Check the invite link and try again.');

    // Check if already a member
    const { data: existing } = await supabase
      .from('club_members')
      .select('id')
      .eq('club_id', club.id)
      .eq('user_id', userId)
      .single();

    if (existing) throw new Error('You are already a member of this club.');

    // Check member limit
    const { count } = await supabase
      .from('club_members')
      .select('id', { count: 'exact', head: true })
      .eq('club_id', club.id);

    if (count >= club.max_members) throw new Error('This club is full.');

    const { error: joinErr } = await supabase
      .from('club_members')
      .insert({
        club_id: club.id,
        user_id: userId,
        display_name: displayName,
        role: 'member',
      });

    if (joinErr) throw joinErr;

    await fetchClubs();
    return club;
  }, [userId, fetchClubs]);

  const getClubMembers = useCallback(async (clubId) => {
    const { data, error } = await supabase
      .from('club_members')
      .select('*')
      .eq('club_id', clubId)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch members:', error);
      return [];
    }
    return data;
  }, []);

  const leaveClub = useCallback(async (clubId) => {
    const { error } = await supabase
      .from('club_members')
      .delete()
      .eq('club_id', clubId)
      .eq('user_id', userId);

    if (error) throw error;
    await fetchClubs();
  }, [userId, fetchClubs]);

  const deleteClub = useCallback(async (clubId) => {
    const { error } = await supabase
      .from('clubs')
      .delete()
      .eq('id', clubId);

    if (error) throw error;
    await fetchClubs();
  }, [fetchClubs]);

  const getInviteLink = useCallback((club) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?join=${club.invite_code}`;
  }, []);

  return {
    clubs,
    loading,
    createClub,
    joinClub,
    getClubMembers,
    leaveClub,
    deleteClub,
    getInviteLink,
    refreshClubs: fetchClubs,
  };
};
