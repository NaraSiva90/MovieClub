import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kwfapgxcmsgeitiqztzb.supabase.co';
const supabaseAnonKey = 'sb_publishable__hqcnvME2mF6KzMwApOA5A_HTfTFXlk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
