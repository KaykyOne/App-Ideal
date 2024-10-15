import { createClient } from '@supabase/supabase-js';
<<<<<<< HEAD

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
=======
import { URL, KEY} from '@env';

const supabaseUrl = URL;
const supabaseKey = KEY;
>>>>>>> main
export const supabase = createClient(supabaseUrl, supabaseKey);
