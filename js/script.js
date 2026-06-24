// --- 1. DATA DATABASE AKUN LOGIN (Array of Objects) ---
        const daftarAkunPetugas = [
            { "user": "admin", "pass": "admin123", "role": "Administrator" },
            { "user": "dokter", "pass": "dokter123", "role": "Dokter Spesialis" },
            { "user": "perawat", "pass": "perawat123", "role": "Perawat Senior" }
        ];

        // --- 2. INSTANSIASI VARIABEL STRUKTUR DATA UTAMA ---
        let regulerQueue = [];   // Antrean Biasa (FIFO)
        let igdQueue = [];       // Antrean Prioritas (Priority Queue)
        let riwayatPeriksa = []; // Database Riwayat Pasien Selesai (Untuk Searching)

        // Clock Updater
        let clockInterval;
        function startClock() {
            const updateClock = () => {
                const clockEl = document.getElementById('liveClock');
                const dateEl = document.getElementById('liveDate');
                const now = new Date();

                clockEl.innerText = now.toLocaleTimeString('id-ID');

                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                dateEl.innerText = now.toLocaleDateString('id-ID', options);
            };
            updateClock();
            clockInterval = setInterval(updateClock, 1000);
        }

        // --- NOTIFIKASI TOAST CUSTOM ---
        function showToast(title, msg, type = 'info') {
            const toastContainer = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;

            toast.innerHTML = `
                <div class="toast-content">
                    <div class="toast-title">${title}</div>
                    <div class="toast-msg">${msg}</div>
                </div>
            `;

            toastContainer.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 4500);
        }

        // --- CUSTOM MODAL DIALOG (Untuk Hasil Pencarian) ---
        function showModal(title, message, isSuccess = true) {
            const modal = document.getElementById('searchModal');
            const mTitle = document.getElementById('modalTitle');
            const mBody = document.getElementById('modalBody');
            const mIcon = document.getElementById('modalIcon');

            mTitle.innerText = title;
            mBody.innerText = message;

            if (isSuccess) {
                mIcon.className = "modal-icon-container success";
                mIcon.innerHTML = `
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                `;
            } else {
                mIcon.className = "modal-icon-container danger";
                mIcon.innerHTML = `
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                `;
            }

            modal.classList.add('active');
        }

        function closeModal() {
            document.getElementById('searchModal').classList.remove('active');
        }

        // --- LISTENERS TOMBOL ENTER PADA INPUT ---
        document.getElementById('username').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') document.getElementById('password').focus();
        });
        document.getElementById('password').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') prosesLogin();
        });
        document.getElementById('patientName').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') tambahPasien();
        });
        document.getElementById('searchKey').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') cariPasien();
        });

        // --- FUNGSI PROSES AUTENTIKASI ---
        function prosesLogin() {
            const userInput = document.getElementById('username').value.trim();
            const passInput = document.getElementById('password').value.trim();
            const errorMsg = document.getElementById('loginErrorMsg');

            if (!userInput || !passInput) {
                errorMsg.style.display = 'block';
                errorMsg.innerText = "Masukkan username dan password!";
                return;
            }

            // Implementasi Algoritma Linear Search untuk Autentikasi
            let loginSukses = false;
            let akunTerhubung = null;
            for (let i = 0; i < daftarAkunPetugas.length; i++) {
                if (daftarAkunPetugas[i].user === userInput && daftarAkunPetugas[i].pass === passInput) {
                    loginSukses = true;
                    akunTerhubung = daftarAkunPetugas[i];
                    break;
                }
            }

            if (loginSukses && akunTerhubung) {
                document.getElementById('loginScreen').style.display = 'none';

                const mainApp = document.getElementById('mainAppScreen');
                mainApp.style.display = 'flex';
                document.body.style.justifyContent = 'flex-start';

                document.getElementById('profileName').innerText = akunTerhubung.user;
                document.getElementById('profileRole').innerText = akunTerhubung.role;
                document.getElementById('userAvatar').innerText = akunTerhubung.user.charAt(0);

                startClock();
                cetakLog(`Petugas [${akunTerhubung.user} - ${akunTerhubung.role}] berhasil masuk ke dalam sistem.`, 'log-success');
                showToast("Login Berhasil", `Selamat bekerja, ${akunTerhubung.user}!`, 'success');
                errorMsg.style.display = 'none';

                renderVisuals();
            } else {
                errorMsg.style.display = 'block';
                errorMsg.innerText = "Username atau Password salah!";
                showToast("Akses Ditolak", "Identitas petugas tidak terdaftar di database.", "danger");
            }
        }

        // --- TOGGLE TAMPILAN PILIHAN PRIORITAS ---
        function togglePrioritySelect() {
            const type = document.getElementById('queueType').value;
            const priorityGroup = document.getElementById('priorityGroup');
            const alertText = document.getElementById('serviceInfoAlert');

            if (type === 'igd') {
                priorityGroup.style.display = 'block';
                alertText.innerHTML = `
                    <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                        <strong>Emergency Queue (Prioritas):</strong> Diurutkan berdasarkan kegawatan. Skala 1 (terparah) langsung diposisikan di depan.
                    </div>
                `;
            } else {
                priorityGroup.style.display = 'none';
                alertText.innerHTML = `
                    <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                        <strong>Antrean Reguler (FIFO):</strong> Pasien akan diperiksa secara berurutan sesuai urutan waktu kedatangan murni.
                    </div>
                `;
            }
        }

        // --- FUNGSI OPERATOR QUEUE (ADD / ENQUEUE) ---
        function tambahPasien() {
            const nameInput = document.getElementById('patientName');
            const name = nameInput.value.trim();
            const type = document.getElementById('queueType').value;

            if (name === "") {
                showToast("Pendaftaran Gagal", "Mohon masukkan nama pasien terlebih dahulu!", "warning");
                return;
            }

            if (type === 'reguler') {
                // Prinsip FIFO: Data masuk di ujung belakang array
                regulerQueue.push({ nama: name });
                cetakLog(`Pasien Reguler [${name}] berhasil didaftarkan.`, 'log-info');
                showToast("Pasien Terdaftar", `[${name}] masuk ke antrean reguler.`, 'success');
            } else {
                // Prinsip Priority Queue: Dimasukkan lalu disortir (Ascending Berdasarkan Urgensi)
                const prioritySelect = document.getElementById('priorityLevel');
                const priority = parseInt(prioritySelect.value);
                igdQueue.push({ nama: name, prioritas: priority });

                igdQueue.sort((a, b) => a.prioritas - b.prioritas);

                let skalaStr = priority === 1 ? "Sangat Kritis (Skala 1)" : (priority === 2 ? "Gawat Darurat (Skala 2)" : "Cedera Ringan (Skala 3)");
                cetakLog(`Pasien IGD [${name}] masuk dengan tingkat kegawatan ${skalaStr}.`, 'log-warning');
                showToast("Tindakan IGD", `Pasien [${name}] masuk antrean prioritas (${skalaStr}).`, 'warning');
            }

            nameInput.value = "";
            renderVisuals();
        }

        // --- FUNGSI OPERATOR QUEUE (POLL / DEQUEUE) - REGULER ---
        function panggilReguler() {
            if (regulerQueue.length === 0) {
                showToast("Antrean Kosong", "Tidak ada pasien di antrean reguler saat ini.", "warning");
                return;
            }
            // FIFO: Ambil data indeks 0
            const pasien = regulerQueue.shift();
            riwayatPeriksa.push(pasien.nama);

            cetakLog(`PASIEN DIPANGGIL: Pasien Reguler [${pasien.nama}] silakan masuk ke Ruang Poli.`, 'log-success');
            showToast("Panggilan Pasien", `Poli Umum: Pasien [${pasien.nama}] silakan masuk.`, 'info');
            renderVisuals();
        }

        // --- FUNGSI OPERATOR QUEUE (POLL / DEQUEUE) - IGD ---
        function panggilIGD() {
            if (igdQueue.length === 0) {
                showToast("IGD Aman", "Tidak ada antrean darurat di IGD saat ini.", "success");
                return;
            }
            // Ambil elemen terdepan hasil sorting prioritas tertinggi
            const pasien = igdQueue.shift();
            riwayatPeriksa.push(pasien.nama);

            cetakLog(`TINDAKAN DARURAT: Pasien IGD [${pasien.nama}] (Skala ${pasien.prioritas}) segera dibawa ke Kamar Operasi.`, 'log-danger');
            showToast("URGENT / CALL IGD", `Kamar Operasi: Pasien [${pasien.nama}] (Skala ${pasien.prioritas}) segera masuk!`, 'danger');
            renderVisuals();
        }

        // --- 3. ALGORITMA PENCARIAN DATA (Linear Search) ---
        function cariPasien() {
            const searchInput = document.getElementById('searchKey');
            const keyword = searchInput.value.trim().toLowerCase();

            if (keyword === "") {
                showToast("Pencarian Gagal", "Masukkan nama pasien yang dicari!", "warning");
                return;
            }

            let ditemukan = false;
            let namaLengkap = "";

            for (let i = 0; i < riwayatPeriksa.length; i++) {
                if (riwayatPeriksa[i].toLowerCase().includes(keyword)) {
                    ditemukan = true;
                    namaLengkap = riwayatPeriksa[i];
                    break;
                }
            }

            if (ditemukan) {
                showModal(
                    "Pasien Ditemukan",
                    `Data medis ditemukan! Pasien atas nama "${namaLengkap}" sudah selesai menjalani pemeriksaan dan tercatat di database hari ini.`,
                    true
                );
                cetakLog(`[Pencarian] Pasien "${namaLengkap}" ditemukan di database rekam medis.`, 'log-success');
            } else {
                showModal(
                    "Tidak Ditemukan",
                    `Data pasien dengan kata kunci "${keyword}" tidak dapat ditemukan di riwayat pemeriksaan hari ini. Pastikan nama sudah tepat.`,
                    false
                );
                cetakLog(`[Pencarian] Pasien "${keyword}" tidak ditemukan.`, 'log-danger');
            }

            searchInput.value = "";
        }

        // --- FUNGSI UPDATE RENDER GRAFIS (VISUAL) & STATS ---
        function renderVisuals() {
            document.getElementById('statRegulerQueue').innerText = regulerQueue.length;
            document.getElementById('statIgdQueue').innerText = igdQueue.length;
            document.getElementById('statTotalQueue').innerText = regulerQueue.length + igdQueue.length;
            document.getElementById('statCompleted').innerText = riwayatPeriksa.length;

            // Render Antrean Reguler
            const regulerVisual = document.getElementById('regulerQueueVisual');
            if (regulerQueue.length === 0) {
                regulerVisual.innerHTML = '<div class="empty-text">Belum ada pasien di antrean reguler.</div>';
            } else {
                regulerVisual.innerHTML = '';
                for (let i = regulerQueue.length - 1; i >= 0; i--) {
                    const box = document.createElement('div');
                    const isNextUp = (i === 0);
                    box.className = `patient-box reg-box ${isNextUp ? 'next-up' : ''}`;
                    box.innerHTML = `
                        ${isNextUp ? '<span class="next-up-indicator">Panggilan Berikutnya</span>' : ''}
                        <div class="patient-name-text" title="${regulerQueue[i].nama}">${regulerQueue[i].nama}</div>
                        <span class="badge">No. ${i + 1}</span>
                    `;
                    regulerVisual.appendChild(box);
                }
            }

            // Render Antrean IGD
            const igdVisual = document.getElementById('igdQueueVisual');
            if (igdQueue.length === 0) {
                igdVisual.innerHTML = '<div class="empty-text">Belum ada pasien di IGD.</div>';
            } else {
                igdVisual.innerHTML = '';
                for (let i = igdQueue.length - 1; i >= 0; i--) {
                    const box = document.createElement('div');
                    const isNextUp = (i === 0);
                    const prio = igdQueue[i].prioritas;
                    box.className = `patient-box priority priority-${prio} ${isNextUp ? 'next-up' : ''}`;
                    box.innerHTML = `
                        ${isNextUp ? '<span class="next-up-indicator">Panggilan Berikutnya</span>' : ''}
                        <div class="patient-name-text" title="${igdQueue[i].nama}">${igdQueue[i].nama}</div>
                        <span class="badge">Skala ${prio}</span>
                    `;
                    igdVisual.appendChild(box);
                }
            }
        }

        // --- FUNGSI PENCATAT LOG SISTEM ---
        function cetakLog(pesan, typeClass = 'log-info') {
            const logSystem = document.getElementById('logSystem');
            const li = document.createElement('li');
            li.className = typeClass;

            const now = new Date();
            const waktu = now.toLocaleTimeString('id-ID');
            li.innerText = `[${waktu}] ${pesan}`;

            logSystem.appendChild(li);
            logSystem.scrollTop = logSystem.scrollHeight;
        }

        // --- FUNGSI PROSES LOGOUT ---
        function prosesLogout() {
            clearInterval(clockInterval);
            document.getElementById('username').value = "";
            document.getElementById('password').value = "";
            document.getElementById('mainAppScreen').style.display = 'none';
            document.getElementById('loginScreen').style.display = 'flex';
            document.body.style.justifyContent = 'center';
            showToast("Sesi Berakhir", "Anda telah keluar dari aplikasi E-Klinik.", "info");
        }