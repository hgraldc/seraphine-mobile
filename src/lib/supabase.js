import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  'https://katonhmlkktmwqjilwet.supabase.co';

const SUPABASE_ANON_KEY =
  'sb_publishable_oJfMx661GPH00dpSw5QqHw_r9NZ9x2_';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
