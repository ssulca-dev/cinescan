import { createClient } from '@supabase/supabase-js';

const EXPO_PUBLIC_SUPABASE_URL= 'https://yxweecgqfceoucadbaaw.supabase.co'
const EXPO_PUBLIC_SUPABASE_KEY = 'sb_publishable_eOH2cUxxjly2uyUS3WMK-Q_JEvNoCtQ';

export const supabase = createClient(
    EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_KEY
);