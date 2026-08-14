# Deepak Web Studio — Supabase Connected

This version keeps the simple 4-file GitHub structure:
- index.html
- admin.html
- supabase_setup.sql
- README.txt

Supabase project URL:
https://tuetxbaikmxjbojxlpuf.supabase.co

The frontend uses the Supabase Publishable key. Publishable keys are intended to be exposed in browser code; database access is controlled by Row Level Security. Never put a secret/service-role key in this repository.

1. Run supabase_setup.sql in Supabase SQL Editor.
2. In Supabase Authentication > Users, create your admin email/password.
3. Upload these files to GitHub.
4. Connect the repository to Netlify.
5. Open /admin.html and sign in with your Supabase admin user.

Note: The URL you supplied ended in /rest/v1/. The browser client uses the base project URL above, without /rest/v1/.
