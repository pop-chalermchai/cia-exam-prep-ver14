import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://sbvfxglyredueygwtxju.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidmZ4Z2x5cmVkdWV5Z3d0eGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MzQ3NDgsImV4cCI6MjA5NzExMDc0OH0.6c7J095nWHHXCFXEEKoOP-YHvk4Iov3p0YojLvjHPZY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
