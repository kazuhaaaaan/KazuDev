(function () {
    let modal, formView, successView, form, emailInput, errorText, submitBtn, successEmail;
    let activeClient = null;
    let activeRedirect = '';

    function inject() {
        if (document.getElementById('forgot-password-modal')) {
            modal = document.getElementById('forgot-password-modal');
            return;
        }

        document.body.insertAdjacentHTML('beforeend', `
            <div id="forgot-password-modal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4">
                <div data-forgot-backdrop class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
                <div role="dialog" aria-modal="true" aria-labelledby="forgot-title"
                    class="relative w-full max-w-md bg-white dark:bg-dark-card rounded-[2rem] border border-slate-200 dark:border-dark-border shadow-2xl p-6 sm:p-8 overflow-hidden">
                    <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

                    <button type="button" data-forgot-close aria-label="Tutup"
                        class="absolute top-4 right-4 z-10 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>

                    <div data-forgot-form-view class="relative">
                        <div class="text-center mb-8">
                            <div class="inline-flex p-4 bg-indigo-600 rounded-3xl text-white shadow-lg shadow-indigo-200 dark:shadow-none mb-4">
                                <i data-lucide="key-round" class="w-8 h-8"></i>
                            </div>
                            <h2 id="forgot-title" class="text-2xl font-extrabold tracking-tight">Lupa Password?</h2>
                            <p class="text-slate-500 dark:text-slate-400 text-sm mt-2">Masukkan email admin, kami akan mengirim link untuk membuat password baru.</p>
                        </div>

                        <form data-forgot-form class="space-y-4">
                            <div>
                                <label class="block text-sm font-bold mb-2 ml-1 opacity-80">Email Address</label>
                                <div class="relative">
                                    <i data-lucide="mail" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"></i>
                                    <input type="email" data-forgot-email required placeholder="admin@email.com"
                                        class="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                                </div>
                            </div>

                            <p data-forgot-error class="hidden text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl px-4 py-3"></p>

                            <div class="flex gap-3 pt-2">
                                <button type="button" data-forgot-close
                                    class="flex-1 py-3.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                    Batal
                                </button>
                                <button type="submit" data-forgot-submit
                                    class="flex-1 py-3.5 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2">
                                    <i data-lucide="send" class="w-5 h-5"></i> Kirim Link
                                </button>
                            </div>
                        </form>
                    </div>

                    <div data-forgot-success-view class="hidden relative text-center">
                        <div class="inline-flex p-4 bg-green-500 rounded-3xl text-white shadow-lg shadow-green-200 dark:shadow-none mb-5">
                            <i data-lucide="mail-check" class="w-8 h-8"></i>
                        </div>
                        <h2 class="text-2xl font-extrabold tracking-tight mb-2">Email Terkirim</h2>
                        <p class="text-slate-500 dark:text-slate-400 text-sm mb-1">Link reset password telah dikirim ke</p>
                        <p data-forgot-success-email class="font-bold text-indigo-600 dark:text-indigo-400 break-all mb-6"></p>
                        <p class="text-xs text-slate-400 mb-6">Periksa inbox atau folder spam. Link berlaku untuk waktu terbatas.</p>
                        <button type="button" data-forgot-close
                            class="w-full py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-200 dark:shadow-none">
                            Mengerti
                        </button>
                    </div>
                </div>
            </div>
        `);

        modal = document.getElementById('forgot-password-modal');
        formView = modal.querySelector('[data-forgot-form-view]');
        successView = modal.querySelector('[data-forgot-success-view]');
        form = modal.querySelector('[data-forgot-form]');
        emailInput = modal.querySelector('[data-forgot-email]');
        errorText = modal.querySelector('[data-forgot-error]');
        submitBtn = modal.querySelector('[data-forgot-submit]');
        successEmail = modal.querySelector('[data-forgot-success-email]');

        modal.querySelectorAll('[data-forgot-close]').forEach((btn) => btn.addEventListener('click', close));
        modal.querySelector('[data-forgot-backdrop]').addEventListener('click', close);
        form.addEventListener('submit', handleSubmit);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
        });
    }

    function friendlyError(message) {
        const msg = String(message || '');
        const lower = msg.toLowerCase();

        if (lower.includes('for security purposes')) return 'Tunggu sekitar 60 detik sebelum meminta link lagi.';
        if (lower.includes('rate limit')) return 'Batas pengiriman email tercapai. Coba lagi sekitar 1 jam, atau pasang custom SMTP di Supabase.';
        if (lower.includes('not authorized')) return 'Email ini belum diizinkan oleh pengirim bawaan Supabase. Gunakan custom SMTP atau email anggota organisasi.';
        return msg;
    }

    function showError(message) {
        errorText.textContent = friendlyError(message);
        errorText.classList.remove('hidden');
    }

    function setLoading(loading) {
        submitBtn.disabled = loading;
        submitBtn.innerHTML = loading
            ? '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Mengirim...'
            : '<i data-lucide="send" class="w-5 h-5"></i> Kirim Link';
        if (window.lucide) window.lucide.createIcons();
    }

    function open(options) {
        inject();
        activeClient = options.client;
        activeRedirect = options.redirectTo || (window.location.origin + '/reset-password.html');

        formView.classList.remove('hidden');
        successView.classList.add('hidden');
        errorText.classList.add('hidden');
        emailInput.value = options.email || '';
        setLoading(false);

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';

        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => emailInput.focus(), 50);
    }

    function close() {
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }

    async function handleSubmit(e) {
        e.preventDefault();
        errorText.classList.add('hidden');

        const email = emailInput.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('Masukkan alamat email yang valid.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await activeClient.auth.resetPasswordForEmail(email, {
                redirectTo: activeRedirect
            });
            if (error) throw error;

            successEmail.textContent = email;
            formView.classList.add('hidden');
            successView.classList.remove('hidden');
            if (window.lucide) window.lucide.createIcons();
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    }

    window.openForgotPasswordModal = open;
})();
