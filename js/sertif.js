// sertif.js
        const SB_URL = 'https://gnvyjnycgtmbktbcugda.supabase.co';
        const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudnlqbnljZ3RtYmt0YmN1Z2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NTY2MjcsImV4cCI6MjA5MjQzMjYyN30.tHLospYWjAOIcYwBJBrSqh5GnW1Bt23ecJqrBSlehu8';
        const sbClient = window.supabase.createClient(SB_URL, SB_KEY);

        let achievements = [];
        const categories = ["Semua", "Teknologi", "Bootcamp", "Intern", "Webinar", "Soft Skills"];
        let currentFilter = "Semua";
        let currentSearch = "";

        async function fetchCertificates() {
            const grid = document.getElementById('achievements-grid');
            grid.innerHTML = '<div class="col-span-full text-center py-10 animate-pulse">Menghubungkan ke database...</div>';
            try {
                const { data, error } = await sbClient.from('certificates').select('*').order('date', { ascending: false });
                if (error) throw error;
                achievements = data;
                renderCategories();
                renderAchievements();
            } catch (err) {
                console.error("Fetch Error:", err);
                grid.innerHTML = `<div class="col-span-full text-center text-red-500">Error: ${err.message}</div>`;
            }
        }

        function renderCategories() {
            const container = document.getElementById('category-filters');
            container.innerHTML = categories.map(cat => `
                <button onclick="setCategory('${cat}')" class="px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentFilter === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                    ${cat}
                </button>
            `).join('');
        }

        function setCategory(cat) {
            currentFilter = cat;
            renderCategories();
            renderAchievements();
        }

        function renderAchievements() {
            const grid = document.getElementById('achievements-grid');
            const empty = document.getElementById('empty-state');
            const filtered = achievements.filter(item => {
                const matchesSearch = item.title.toLowerCase().includes(currentSearch) || item.issuer.toLowerCase().includes(currentSearch);
                const matchesCat = currentFilter === "Semua" || item.category === currentFilter;
                return matchesSearch && matchesCat;
            });

            if (filtered.length === 0) {
                grid.innerHTML = '';
                empty.classList.remove('hidden');
            } else {
                empty.classList.add('hidden');
                grid.innerHTML = filtered.map(item => `
                    <div class="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-slate-200 dark:border-dark-border shadow-sm hover:shadow-xl transition-all cursor-pointer group" onclick="openModal('${item.id}')">
                        <div class="aspect-video overflow-hidden bg-slate-100">
                            <img src="${item.image_url}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://via.placeholder.com/400x225?text=Gambar+Error'">
                        </div>
                        <div class="p-5">
                            <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">${item.category}</span>
                            <h3 class="font-bold text-lg mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">${item.title}</h3>
                            <p class="text-xs text-slate-500 italic">${item.issuer}</p>
                        </div>
                    </div>
                `).join('');
                lucide.createIcons();
            }
        }

        function openModal(id) {
            const item = achievements.find(a => a.id === id);
            const modal = document.getElementById('modal');
            const content = document.getElementById('modal-content');
            const body = document.getElementById('modal-body');

            body.innerHTML = `
                <img src="${item.image_url}" class="w-full rounded-xl mb-6 shadow-lg border dark:border-dark-border">
                <div class="space-y-4">
                    <div>
                        <h2 class="text-2xl font-bold">${item.title}</h2>
                        <p class="text-indigo-600 font-medium">${item.issuer}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-dark-border">
                        <div><p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Tanggal</p><p class="text-sm font-semibold">${item.date}</p></div>
                        <div><p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID Kredensial</p><p class="font-mono text-xs break-all bg-slate-50 dark:bg-slate-800 p-1 rounded">${item.credential_id || '-'}</p></div>
                    </div>
                    <div class="mt-4">
                        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${item.description}</p>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
            setTimeout(() => content.classList.remove('scale-95', 'opacity-0'), 10);
            lucide.createIcons();
        }

        function closeModal() {
            const modal = document.getElementById('modal');
            const content = document.getElementById('modal-content');
            content.classList.add('scale-95', 'opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }

        // 2. Perbaikan fungsi Toggle agar menyimpan ke localStorage
        function toggleDarkMode() {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.theme = isDark ? 'dark' : 'light';
        }

        document.getElementById('search-input').addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            renderAchievements();
        });

        document.getElementById('modal').addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });

        window.onload = () => {
            document.getElementById('year').innerText = new Date().getFullYear();
            lucide.createIcons();
            fetchCertificates();
        };