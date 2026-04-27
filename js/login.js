        // --- 1. Konfigurasi Supabase ---
        const SUPABASE_URL = 'https://gnvyjnycgtmbktbcugda.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudnlqbnljZ3RtYmt0YmN1Z2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NTY2MjcsImV4cCI6MjA5MjQzMjYyN30.tHLospYWjAOIcYwBJBrSqh5GnW1Bt23ecJqrBSlehu8';
        const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

        const loginForm = document.getElementById('login-form');
        const loginBtn = document.getElementById('login-btn');

        // --- 2. Cek Jika Sudah Login ---
        async function checkSession() {
            const { data } = await sbClient.auth.getSession();
            if (data.session) {
                window.location.href = 'admin'; // Kalau sudah login, langsung lempar ke admin
            }
        }
        checkSession();

        // --- 3. Proses Login ---
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // UI State
            loginBtn.disabled = true;
            loginBtn.innerHTML = `<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Mengecek...`;

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const { data, error } = await sbClient.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) throw error;

                // Login Berhasil
                window.location.href = 'admin';

            } catch (err) {
                alert('Waduh Gagal: ' + err.message);
                loginBtn.disabled = false;
                loginBtn.innerHTML = `<i data-lucide="log-in" class="w-5 h-5"></i> Masuk Sekarang`;
                lucide.createIcons();
            }
        });

        // Initialize Icons
        lucide.createIcons();