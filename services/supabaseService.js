import { createClient } from '@supabase/supabase-js';
import { URL, KEY} from '@env';

const supabaseUrl = URL;
const supabaseKey = KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
