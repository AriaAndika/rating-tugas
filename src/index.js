import { createClient } from "@supabase/supabase-js";


const supabaseUrl = 'https://foxjqkiedqqblxxcegbt.supabase.co'
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZveGpxa2llZHFxYmx4eGNlZ2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgwNDQ2MzMsImV4cCI6MTk4MzYyMDYzM30.4k_k_KVztDiE50HC7F0b-x4im92EtrLN22l_Tt_VHTQ`
process.supabase = createClient(supabaseUrl, supabaseKey)


