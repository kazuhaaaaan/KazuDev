import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  ExternalLink, 
  X, 
  ChevronRight, 
  Award as AwardIcon, 
  Star, 
  Calendar, 
  User, 
  Mail, 
  Github, 
  Linkedin, 
  Instagram,
  Download,
  Briefcase
} from 'lucide-react';

// Data Sertifikat
const CERTIFICATES = [
  {
    id: 1,
    title: "Full Stack Web Development",
    issuer: "Dicoding Indonesia",
    date: "Januari 2024",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    description: "Sertifikasi kompetensi dalam membangun aplikasi web dari frontend hingga backend menggunakan ekosistem JavaScript modern."
  },
  {
    id: 2,
    title: "UI/UX Design Specialist",
    issuer: "Google Career Certificates",
    date: "Maret 2024",
    category: "Design",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop",
    description: "Mempelajari proses desain yang berpusat pada pengguna, pembuatan prototipe, dan pengujian kegunaan produk digital."
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    issuer: "IBM",
    date: "Juni 2023",
    category: "Data Science",
    image: "https://images.unsplash.com/photo-1551288049-bbbda536ad0a?q=80&w=800&auto=format&fit=crop",
    description: "Memahami analisis data, visualisasi, dan dasar-dasar machine learning menggunakan Python dan library terkait."
  },
  {
    id: 4,
    title: "English Proficiency (IELTS 7.5)",
    issuer: "British Council",
    date: "September 2023",
    category: "Language",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop",
    description: "Sertifikat kemampuan bahasa Inggris tingkat lanjut untuk keperluan profesional dan akademik internasional."
  },
  {
    id: 5,
    title: "Mobile App Development",
    issuer: "Udacity",
    date: "Desember 2023",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop",
    description: "Fokus pada pengembangan aplikasi lintas platform menggunakan React Native dan integrasi API."
  }
];

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedCert, setSelectedCert] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const categories = ["Semua", ...new Set(CERTIFICATES.map(cert => cert.category))];

  const filteredCerts = selectedCategory === "Semua" 
    ? CERTIFICATES 
    : CERTIFICATES.filter(cert => cert.category === selectedCategory);

  // Deteksi scroll untuk efek navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle Dark Mode via class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      
      {/* Navbar Transparan dengan Blur */}
      <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        scrolled 
          ? (darkMode ? 'bg-slate-950/80 border-b border-slate-800' : 'bg-white/80 border-b border-slate-200') 
          : 'bg-transparent'
      } backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
                <AwardIcon className="text-white w-6 h-6" />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase italic bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                CertiHub
              </span>
            </div>

            {/* Navigasi Desktop */}
            <div className="hidden md:flex items-center space-x-10 font-bold text-sm uppercase tracking-widest">
              <a href="#beranda" className="hover:text-blue-500 transition-colors">Beranda</a>
              <a href="#sertifikat" className="hover:text-blue-500 transition-colors">Sertifikat</a>
              <a href="#kontak" className="hover:text-blue-500 transition-colors">Kontak</a>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl transition-all ${
                  darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'
                } hover:scale-110 active:scale-95`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Tombol Menu Mobile */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'text-yellow-400' : 'text-slate-600'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 focus:outline-none">
                <div className="space-y-1.5">
                  <span className={`block w-6 h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-4 h-0.5 bg-current transition-all ml-auto ${isMenuOpen ? '-rotate-45 -translate-y-2 w-6' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile Samping */}
        {isMenuOpen && (
          <div className={`md:hidden absolute w-full p-6 animate-in slide-in-from-top duration-300 ${darkMode ? 'bg-slate-950 border-b border-slate-800' : 'bg-white border-b border-slate-200'}`}>
            <div className="flex flex-col gap-6 text-center font-bold uppercase tracking-widest">
              <a href="#beranda" onClick={() => setIsMenuOpen(false)}>Beranda</a>
              <a href="#sertifikat" onClick={() => setIsMenuOpen(false)}>Sertifikat</a>
              <a href="#kontak" onClick={() => setIsMenuOpen(false)}>Kontak</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section dengan Background Pattern */}
      <section id="beranda" className="relative pt-44 pb-32 px-4 overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] ${darkMode ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
            <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px] ${darkMode ? 'bg-indigo-600' : 'bg-indigo-200'}`}></div>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-tighter mb-8 border border-blue-200 dark:border-blue-800">
            <Star size={14} fill="currentColor" />
            <span>Digital Credential Showcase</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
            Validasi Skill Melalui <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">Prestasi Nyata.</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Kurasi koleksi sertifikat profesional dan pencapaian akademik dalam satu platform yang elegan dan mudah diakses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <a href="#sertifikat" className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-2 group">
              Eksplorasi Sertifikat <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button className="px-10 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2">
              <Download size={20} /> Unduh Resume
            </button>
          </div>
        </div>
      </section>

      {/* Main Content: Sertifikat */}
      <section id="sertifikat" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Filter dengan Glassmorphism */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black mb-4 tracking-tight">Koleksi Sertifikat</h2>
              <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6"></div>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Menyaring {filteredCerts.length} bukti kompetensi yang telah diverifikasi oleh lembaga ternama.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Sertifikat */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCerts.map((cert) => (
              <div 
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className={`group cursor-pointer relative flex flex-col h-full rounded-[2.5rem] transition-all duration-500 border ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-2xl shadow-slate-200/50'
                } hover:shadow-blue-500/10 hover:-translate-y-3 overflow-hidden`}
              >
                {/* Visual Area */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={cert.image} 
                    alt={cert.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                     <span className="px-6 py-2 bg-white text-slate-950 rounded-full font-bold text-sm">Lihat Detail</span>
                  </div>
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {cert.category}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-blue-500 font-bold text-xs mb-3 uppercase tracking-wider">
                    <Calendar size={14} />
                    <span>{cert.date}</span>
                  </div>
                  <h3 className="text-xl font-black mb-3 line-clamp-2 leading-tight group-hover:text-blue-500 transition-colors">
                    {cert.title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-6">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <User size={16} className="text-blue-500" />
                    </div>
                    <span className="font-semibold">{cert.issuer}</span>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verifikasi Online</span>
                    <ExternalLink size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats & Tools */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: "Total Lisensi", value: "24", color: "text-blue-600" },
                    { label: "Course Jam", value: "480+", color: "text-indigo-500" },
                    { label: "Skill Utama", value: "12", color: "text-purple-500" },
                    { label: "Kepuasan", value: "100%", color: "text-pink-500" }
                ].map((stat, i) => (
                    <div key={i} className={`p-8 rounded-[2rem] border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100 shadow-sm'} text-center`}>
                        <div className={`text-5xl font-black mb-2 ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="kontak" className={`pt-24 pb-12 px-4 ${darkMode ? 'bg-slate-950 border-t border-slate-900' : 'bg-white border-t border-slate-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-20">
            <div className="max-w-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-600 p-2 rounded-lg"><AwardIcon className="text-white w-5 h-5" /></div>
                    <span className="font-black text-xl italic tracking-tighter uppercase">CertiHub</span>
                </div>
                <p className="text-slate-500 leading-relaxed mb-8">
                    Menghubungkan keahlian dengan peluang. Portofolio digital ini dikelola secara berkala untuk mencerminkan perkembangan profesional terbaru.
                </p>
                <div className="flex gap-4">
                    {[Linkedin, Github, Instagram, Mail].map((Icon, i) => (
                        <a key={i} href="#" className={`p-3 rounded-xl transition-all ${darkMode ? 'bg-slate-900 hover:bg-blue-900' : 'bg-slate-100 hover:bg-blue-100'} hover:-translate-y-1`}>
                            <Icon size={20} className="text-blue-600" />
                        </a>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                <div>
                    <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-6">Navigasi</h4>
                    <ul className="space-y-4 text-sm font-bold text-slate-500">
                        <li><a href="#beranda" className="hover:text-blue-500">Beranda</a></li>
                        <li><a href="#sertifikat" className="hover:text-blue-500">Koleksi</a></li>
                        <li><a href="#kontak" className="hover:text-blue-500">Hubungi Saya</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-6">Layanan</h4>
                    <ul className="space-y-4 text-sm font-bold text-slate-500">
                        <li><a href="#" className="hover:text-blue-500">Web Dev</a></li>
                        <li><a href="#" className="hover:text-blue-500">UI Design</a></li>
                        <li><a href="#" className="hover:text-blue-500">Consultancy</a></li>
                    </ul>
                </div>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2024 Design & Build by You.</p>
            <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <a href="#" className="hover:text-blue-500">Privasi</a>
                <a href="#" className="hover:text-blue-500">Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Detail Sertifikat */}
      {selectedCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setSelectedCert(null)}
          ></div>
          <div className={`relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-500 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <button 
              onClick={() => setSelectedCert(null)}
              className="absolute top-8 right-8 p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-all z-10"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-3/5 p-4 lg:p-8">
                <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 h-full">
                    <img 
                    src={selectedCert.image} 
                    alt={selectedCert.title} 
                    className="w-full h-full object-cover"
                    />
                </div>
              </div>
              <div className="lg:w-2/5 p-10 lg:pl-4 flex flex-col">
                <div className="mb-10">
                    <span className="inline-block px-5 py-2 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-blue-500/30">
                    {selectedCert.category}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight tracking-tighter italic">
                        {selectedCert.title}
                    </h2>
                    
                    <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600"><User size={20} /></div>
                        <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Institusi</p>
                        <p className="font-bold text-lg">{selectedCert.issuer}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600"><Calendar size={20} /></div>
                        <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Waktu Terbit</p>
                        <p className="font-bold text-lg">{selectedCert.date}</p>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Deskripsi Kompetensi</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {selectedCert.description}
                    </p>
                </div>

                <div className="mt-auto flex flex-col gap-4">
                  <button className="flex items-center justify-center gap-3 w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-sm tracking-widest transition-all shadow-xl shadow-blue-500/30 active:scale-95">
                    <ExternalLink size={20} /> Verifikasi Keaslian
                  </button>
                  <button 
                    onClick={() => setSelectedCert(null)}
                    className="w-full py-5 text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Kembali ke Galeri
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;