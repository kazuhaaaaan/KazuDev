// --- 1. KONFIGURASI SUPABASE ---
const SB_URL = 'https://gnvyjnycgtmbktbcugda.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudnlqbnljZ3RtYmt0YmN1Z2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NTY2MjcsImV4cCI6MjA5MjQzMjYyN30.tHLospYWjAOIcYwBJBrSqh5GnW1Bt23ecJqrBSlehu8';
const sbAdmin = window.supabase.createClient(SB_URL, SB_KEY);

const form = document.getElementById('certificate-form');
const submitBtn = document.getElementById('submit-btn');

// --- 2. PROTEKSI HALAMAN (SECURITY GATE) ---
async function checkAuth() {
    const { data: { session } } = await sbAdmin.auth.getSession();
    
    // Jika tidak ada session (belum login), arahkan ke halaman login
    if (!session) {
        window.location.href = 'login.html'; // Pastikan kamu memiliki file login.html
    } else {
        // Tampilkan halaman admin jika sudah login
        document.body.classList.add('auth-ready');
        loadAdminList();
    }
}

// --- 3. FITUR SIMPAN & UPDATE ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const editId = document.getElementById('edit-id').value;
    const oldImgUrl = document.getElementById('old-image-url').value;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> <span>Memproses...</span>`;

    const file = document.getElementById('image-file').files[0];
    const payload = {
        title: document.getElementById('title').value,
        issuer: document.getElementById('issuer').value,
        date: document.getElementById('date').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        credential_id: document.getElementById('credential_id').value || '-'
    };

    try {
        if (file) {
            const cleanFileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
            const { error: storageError } = await sbAdmin.storage.from('certificates').upload(cleanFileName, file);
            if (storageError) throw storageError;

            const { data: urlData } = sbAdmin.storage.from('certificates').getPublicUrl(cleanFileName);
            payload.image_url = urlData.publicUrl;
        } else if (editId) {
            payload.image_url = oldImgUrl;
        } else {
            throw new Error("Pilih gambar terlebih dahulu!");
        }

        if (editId) {
            const { error } = await sbAdmin.from('certificates').update(payload).eq('id', editId);
            if (error) throw error;
            alert('Berhasil diperbarui!');
        } else {
            const { error } = await sbAdmin.from('certificates').insert([payload]);
            if (error) throw error;
            alert('Berhasil disimpan!');
        }

        resetForm();
        loadAdminList();
    } catch (err) {
        alert('Gagal: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        resetFormUI();
    }
});

// --- 4. LOAD DAFTAR SERTIFIKAT ---
async function loadAdminList() {
    const listContainer = document.getElementById('admin-list');
    listContainer.innerHTML = '<p class="text-center py-10 opacity-50 flex items-center justify-center gap-2"><i data-lucide="loader-2" class="animate-spin w-5 h-5"></i> Memuat data...</p>';
    lucide.createIcons();
    
    const { data, error } = await sbAdmin.from('certificates').select('*').order('date', { ascending: false });
    
    if (error) {
        listContainer.innerHTML = '<p class="text-center text-red-500 py-10">Error memuat database.</p>';
        return;
    }

    if (data.length === 0) {
        listContainer.innerHTML = '<p class="text-center py-10 opacity-50 italic">Belum ada data yang ditambahkan.</p>';
        return;
    }

    listContainer.innerHTML = data.map(item => `
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-dark-card p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm hover:shadow-md transition-shadow gap-4">
            <div class="flex items-center gap-4 overflow-hidden w-full sm:w-auto">
                <img src="${item.image_url}" class="w-14 h-14 rounded-xl object-cover border border-slate-100 dark:border-slate-800 flex-shrink-0" onerror="this.src='https://via.placeholder.com/100'">
                <div class="overflow-hidden">
                    <p class="font-bold truncate text-base text-slate-900 dark:text-white">${item.title}</p>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-[10px] uppercase tracking-widest font-bold">${item.category}</span>
                        <span class="text-xs text-slate-500 truncate">${item.issuer}</span>
                    </div>
                </div>
            </div>
            <div class="flex gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
                <button onclick="prepareEdit('${encodeURIComponent(JSON.stringify(item))}')" class="flex-1 sm:flex-none p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex justify-center items-center">
                    <i data-lucide="edit-3" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteCertificate('${item.id}', '${item.image_url}')" class="flex-1 sm:flex-none p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-600 hover:text-white transition-all flex justify-center items-center">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

// --- 5. FUNGSI EDIT, DELETE & LOGOUT ---
window.prepareEdit = function(jsonItem) {
    const item = JSON.parse(decodeURIComponent(jsonItem));
    document.getElementById('edit-id').value = item.id;
    document.getElementById('old-image-url').value = item.image_url;
    document.getElementById('title').value = item.title;
    document.getElementById('issuer').value = item.issuer;
    document.getElementById('date').value = item.date;
    document.getElementById('category').value = item.category;
    document.getElementById('description').value = item.description;
    document.getElementById('credential_id').value = item.credential_id;

    document.getElementById('form-title').innerHTML = `<i data-lucide="edit-3" class="text-orange-500"></i> Mode Edit`;
    document.getElementById('cancel-edit').classList.remove('hidden');
    document.getElementById('image-file').required = false; 
    submitBtn.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5"></i> <span>Perbarui Sertifikat</span>`;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    lucide.createIcons();
}

window.resetForm = function() {
    form.reset();
    document.getElementById('edit-id').value = "";
    document.getElementById('old-image-url').value = "";
    resetFormUI();
}

function resetFormUI() {
    document.getElementById('form-title').innerHTML = `<i data-lucide="plus-circle" class="text-indigo-600"></i> Tambah Baru`;
    document.getElementById('cancel-edit').classList.add('hidden');
    document.getElementById('image-file').required = true;
    submitBtn.innerHTML = `<i data-lucide="save" class="w-5 h-5"></i> <span>Simpan Sertifikat</span>`;
    lucide.createIcons();
}

window.deleteCertificate = async function(id, imageUrl) {
    if (!confirm('Hapus sertifikat ini secara permanen?')) return;
    try {
        // Hapus file gambar dari Storage terlebih dahulu
        if(imageUrl && imageUrl.includes('supabase.co')) {
            const fileName = imageUrl.split('/').pop();
            await sbAdmin.storage.from('certificates').remove([fileName]);
        }
        
        // Hapus baris data dari Database
        await sbAdmin.from('certificates').delete().eq('id', id);
        loadAdminList();
    } catch (err) { 
        alert('Hapus gagal: ' + err.message); 
    }
}

window.handleLogout = async function() {
    if (confirm('Keluar dari panel admin?')) {
        await sbAdmin.auth.signOut();
        window.location.href = 'login.html';
    }
}

window.toggleDarkMode = function() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.theme = isDark ? 'dark' : 'light';
}

// Jalankan Pengecekan Auth saat halaman dibuka
checkAuth();
window.onload = () => lucide.createIcons();