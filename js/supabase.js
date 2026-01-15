const supabaseUrl = "https://vekemojwamqurnqcsazv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZla2Vtb2p3YW1xdXJucWNzYXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjkxMDAsImV4cCI6MjA4NDAwNTEwMH0.CbKCU5ZwUiNNGmwpNgx0SVErC4GaLZrCxtdVEl7H_Xs";


window.supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);
