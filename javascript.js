// javascript.js - Animasi yang Konsisten untuk Website Bengkel

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    
    // Set warna berdasarkan jenis notifikasi
    if (type === 'error') {
        notification.style.background = 'var(--accent)';
    } else if (type === 'warning') {
        notification.style.background = 'var(--secondary)';
    } else {
        notification.style.background = 'var(--success)';
    }
    
    notification.classList.add('show');
    
    // Sembunyikan setelah 4 detik
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Fungsi untuk menampilkan popup konfirmasi dengan animasi
function showConfirmationPopup(message, isSuccess = true) {
    const popup = document.createElement('div');
    popup.className = 'confirmation-popup active';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">
                <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            </div>
            <h2>${isSuccess ? 'Berhasil!' : 'Perhatian!'}</h2>
            <p>${message}</p>
            <button class="popup-close" onclick="this.closest('.confirmation-popup').remove()">Tutup</button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Auto close setelah 5 detik untuk pesan sukses
    if (isSuccess) {
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 5000);
    }
}

// Fungsi untuk membuat efek confetti
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2001;
    `;
    document.body.appendChild(confettiContainer);
    
    const colors = ['#2563eb', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 2px;
            left: ${Math.random() * 100}vw;
            top: -10px;
            opacity: 0.8;
        `;
        
        confettiContainer.appendChild(confetti);
        
        // Animate confetti
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
    
    // Remove confetti container after animation
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

// Fungsi untuk memproses form pemesanan dengan animasi
function submitBooking(event) {
    if (event) event.preventDefault();
    
    // Ambil data form
    const formData = getFormData();
    
    // Validasi form
    if (!validateForm(formData)) {
        return false;
    }
    
    // Tampilkan loading state dengan animasi
    const submitBtn = document.querySelector('.booking-form .primary-btn, .membership-form .submit-btn');
    if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulasi pengiriman data
        setTimeout(() => {
            // Reset tombol
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Tampilkan animasi sukses
            showSuccessAnimation();
            
            // Reset form
            const form = document.getElementById('bookingForm') || document.getElementById('membershipForm');
            if (form) {
                form.reset();
            }
        }, 2000);
    } else {
        // Fallback jika tombol tidak ditemukan
        showSuccessAnimation();
    }
    
    return false;
}

// Fungsi untuk menampilkan animasi sukses
function showSuccessAnimation() {
    // Buat elemen animasi sukses
    const successAnimation = document.createElement('div');
    successAnimation.className = 'success-animation';
    successAnimation.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 2rem;
        border-radius: var(--radius);
        text-align: center;
        z-index: 2000;
        box-shadow: var(--shadow-xl);
        animation: modalSlideIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    `;
    
    successAnimation.innerHTML = `
        <div class="success-icon" style="font-size: 4rem; color: var(--success); margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="color: var(--primary-dark); margin-bottom: 1rem;">Pemesanan Berhasil!</h3>
        <p style="color: var(--muted); margin-bottom: 1.5rem;">Teknisi akan menghubungi Anda dalam 5 menit.</p>
        <button class="cta-button" onclick="this.parentElement.remove()" style="background: var(--primary); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 50px; cursor: pointer;">Tutup</button>
    `;
    
    document.body.appendChild(successAnimation);
    
    // Tambahkan confetti
    createConfetti();
    
    // Auto remove setelah 5 detik
    setTimeout(() => {
        if (successAnimation.parentNode) {
            successAnimation.remove();
        }
    }, 5000);
}

// Fungsi validasi form
function validateForm(formData) {
    // Validasi nama
    if (!formData.name) {
        showConfirmationPopup('Harap masukkan nama lengkap', false);
        return false;
    }
    
    // Validasi telepon
    const phoneRegex = /^[0-9]{10,13}$/;
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        showConfirmationPopup('Format nomor telepon tidak valid! (10-13 digit)', false);
        return false;
    }
    
    // Validasi email
    if (formData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showConfirmationPopup('Format email tidak valid!', false);
            return false;
        }
    }
    
    // Validasi pilihan layanan
    if (!formData.service) {
        showConfirmationPopup('Harap pilih jenis layanan', false);
        return false;
    }
    
    // Validasi jenis kendaraan
    if (!formData.vehicleType) {
        showConfirmationPopup('Harap pilih jenis kendaraan', false);
        return false;
    }
    
    // Validasi merk kendaraan
    if (!formData.vehicleBrand) {
        showConfirmationPopup('Harap masukkan merk kendaraan', false);
        return false;
    }
    
    // Validasi lokasi
    if (!formData.location) {
        showConfirmationPopup('Harap masukkan lokasi saat ini', false);
        return false;
    }
    
    // Validasi deskripsi masalah
    if (!formData.problem) {
        showConfirmationPopup('Harap deskripsikan masalah yang dialami', false);
        return false;
    }
    
    // Validasi tingkat urgensi
    if (!formData.urgency) {
        showConfirmationPopup('Harap pilih tingkat urgensi', false);
        return false;
    }
    
    return true;
}

// Fungsi untuk mengisi form pemesanan dari halaman layanan
function prefillServiceForm(serviceName) {
    // Simpan nama layanan di localStorage
    localStorage.setItem('selectedService', serviceName);
    
    // Redirect ke halaman form pemesanan
    window.location.href = 'form_pesan.html';
}

// Fungsi untuk memuat layanan yang dipilih dari halaman sebelumnya
function loadSelectedService() {
    const selectedService = localStorage.getItem('selectedService');
    if (selectedService) {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            serviceSelect.value = selectedService;
            // Hapus dari localStorage setelah digunakan
            localStorage.removeItem('selectedService');
        }
    }
}

// Fungsi untuk toggle menu mobile
// javascript.js

// Fungsi untuk toggle menu mobile
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active'); // Kode ini sudah benar
    }
}

// Event listener diinisialisasi untuk tombol toggler
// ... (Bagian ini sudah ada dan benar)
const mobileMenu = document.querySelector('.mobile-menu-toggle');
if (mobileMenu) {
    mobileMenu.addEventListener('click', toggleMobileMenu); // Kode ini sudah benar
}

// Fungsi untuk animasi scroll yang konsisten
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Tambahkan efek stagger delay berdasarkan urutan
                const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Amati semua elemen dengan class 'animate-on-scroll'
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Fungsi untuk animasi hover pada kartu
function initCardAnimations() {
    const cards = document.querySelectorAll('.service-card, .membership-card, .article-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = 'var(--shadow-xl)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'var(--shadow)';
        });
    });
}

// Fungsi untuk animasi tombol
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.cta-button, .primary-btn, .select-plan');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px)';
        });
    });
}

// Fungsi untuk animasi form input
function initFormAnimations() {
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-5px)';
            this.style.borderColor = 'var(--primary)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
            if (!this.value) {
                this.style.borderColor = '#e2e8f0';
            }
        });
    });
}

// Fungsi untuk inisialisasi event listeners
function initEventListeners() {
    // Event listener untuk form pemesanan
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', submitBooking);
    }
    
    // Event listener untuk form membership
    const membershipForm = document.getElementById('membershipForm');
    if (membershipForm) {
        membershipForm.addEventListener('submit', submitBooking);
    }
    
    // // Event listener untuk tombol pesan di halaman layanan
    // const bookServiceButtons = document.querySelectorAll('.book-service');
    // bookServiceButtons.forEach(button => {
    //     button.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         const serviceName = this.getAttribute('data-service');
    //         prefillServiceForm(serviceName);
    //     });
    // });

    // Tambahkan di javascript.js - dalam fungsi initEventListeners()

// Event listener untuk pilihan membership
const selectMembershipButtons = document.querySelectorAll('.select-membership');
selectMembershipButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const plan = this.getAttribute('data-plan');
        const price = this.getAttribute('data-price');
        
        // Animasi pilihan paket
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        // Simpan pilihan paket
        localStorage.setItem('selectedPlan', plan);
        localStorage.setItem('selectedPlanPrice', price);
        
        // Redirect ke form membership
        setTimeout(() => {
            window.location.href = 'membership.html';
        }, 500);
    });
});
    
    // Event listener untuk menu mobile
    const mobileMenu = document.querySelector('.mobile-menu-toggle');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', toggleMobileMenu);
    }
    
    // Event listener untuk semua tombol CTA
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        if (!button.hasAttribute('data-service') && button.textContent.includes('Pesan')) {
            button.addEventListener('click', function(e) {
                if (!this.href) {
                    e.preventDefault();
                    showConfirmationPopup('Redirect ke halaman pemesanan...', true);
                    setTimeout(() => {
                        window.location.href = 'form_pesan.html';
                    }, 1000);
                }
            });
        }
    });
    
    // Event listener untuk pilihan paket membership
    const selectPlanButtons = document.querySelectorAll('.select-plan');
    selectPlanButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            const price = this.getAttribute('data-price');
            
            // Animasi pilihan paket
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Simpan pilihan paket
            localStorage.setItem('selectedPlan', plan);
            localStorage.setItem('selectedPlanPrice', price);
            
            // Redirect ke form membership
            setTimeout(() => {
                window.location.href = 'membership.html';
            }, 500);
        });
    });
}

// Fungsi untuk memuat pilihan paket membership
function loadSelectedPlan() {
    const selectedPlan = localStorage.getItem('selectedPlan');
    const selectedPlanPrice = localStorage.getItem('selectedPlanPrice');
    
    if (selectedPlan && selectedPlanPrice) {
        const planDisplay = document.getElementById('selectedPlanDisplay');
        const planName = document.getElementById('selectedPlanName');
        const planPrice = document.getElementById('selectedPlanPrice');
        
        if (planDisplay && planName && planPrice) {
            planName.textContent = `Paket ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}`;
            planPrice.textContent = `Rp ${parseInt(selectedPlanPrice).toLocaleString('id-ID')} / Tahun`;
            planDisplay.style.display = 'flex';
            
            // Scroll ke form
            setTimeout(() => {
                document.querySelector('.membership-form-section').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }, 500);
        }
    }
}

// Fungsi bantu untuk mendapatkan data form
function getFormData() {
    return {
        name: document.getElementById('name')?.value.trim() || document.getElementById('fullName')?.value.trim() || '',
        phone: document.getElementById('phone')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        service: document.getElementById('service')?.value || '',
        vehicleType: document.getElementById('vehicleType')?.value || '',
        vehicleBrand: document.getElementById('vehicleBrand')?.value.trim() || '',
        location: document.getElementById('location')?.value.trim() || document.getElementById('address')?.value.trim() || '',
        problem: document.getElementById('problem')?.value.trim() || '',
        urgency: document.getElementById('urgency')?.value || ''
    };
}

// Fungsi untuk membuat floating particles
function createFloatingParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 60 + 20;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadSelectedService();
    loadSelectedPlan();
    initScrollAnimations();
    initCardAnimations();
    initButtonAnimations();
    initFormAnimations();
    createFloatingParticles();
    
    // Tambahkan class animate-on-scroll ke elemen yang perlu dianimasikan
    const serviceCards = document.querySelectorAll('.service-card');
    const membershipCards = document.querySelectorAll('.membership-card');
    const articleCards = document.querySelectorAll('.article-card');
    
    serviceCards.forEach(card => card.classList.add('animate-on-scroll'));
    membershipCards.forEach(card => card.classList.add('animate-on-scroll'));
    articleCards.forEach(card => card.classList.add('animate-on-scroll'));
    
    // Handle URL parameters untuk prefill form
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam && document.getElementById('service')) {
        document.getElementById('service').value = serviceParam;
    }
});

/// javascript.js - Animasi yang Konsisten untuk Website Bengkel

// javascript.js - Animasi yang Konsisten untuk Website Bengkel

// Fungsi untuk menampilkan modal error
function showErrorModal(message) {
    // Buat modal error jika belum ada
    let errorModal = document.getElementById('errorModal');
    
    if (!errorModal) {
        errorModal = document.createElement('div');
        errorModal.id = 'errorModal';
        errorModal.className = 'modal';
        errorModal.innerHTML = `
            <div class="modal-content error-modal">
                <div class="modal-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h2>Perhatian!</h2>
                <p>${message}</p>
                <button class="modal-close error-close" id="errorModalClose">
                    Tutup
                </button>
            </div>
        `;
        document.body.appendChild(errorModal);
        
        // Event listener untuk tombol close
        const errorClose = document.getElementById('errorModalClose');
        if (errorClose) {
            errorClose.addEventListener('click', closeErrorModal);
        }
        
        // Event listener untuk klik di luar modal
        errorModal.addEventListener('click', function(e) {
            if (e.target === errorModal) {
                closeErrorModal();
            }
        });
    } else {
        // Update pesan error
        const errorMessage = errorModal.querySelector('p');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }
    
    // Tampilkan modal
    errorModal.classList.add('show');
    
    // Auto close setelah 5 detik
    setTimeout(() => {
        closeErrorModal();
    }, 5000);
}

// Fungsi untuk menutup modal error
function closeErrorModal() {
    const errorModal = document.getElementById('errorModal');
    if (errorModal) {
        errorModal.classList.remove('show');
    }
}

// Fungsi untuk menampilkan modal sukses
function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.add('show');
        createConfetti();
        
        // Auto close setelah 5 detik
        setTimeout(() => {
            successModal.classList.remove('show');
        }, 5000);
    }
}

// Fungsi untuk menutup modal sukses
function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.remove('show');
    }
}

// Fungsi validasi form
function validateForm(formData) {
    // Validasi nama
    if (!formData.name) {
        showErrorModal('Harap masukkan nama lengkap');
        return false;
    }
    
    // Validasi telepon
    const phoneRegex = /^[0-9]{10,13}$/;
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        showErrorModal('Format nomor telepon tidak valid! (10-13 digit)');
        return false;
    }
    
    // Validasi email
    if (formData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showErrorModal('Format email tidak valid!');
            return false;
        }
    }
    
    // Validasi pilihan layanan
    if (!formData.service) {
        showErrorModal('Harap pilih jenis layanan');
        return false;
    }
    
    // Validasi jenis kendaraan
    if (!formData.vehicleType) {
        showErrorModal('Harap pilih jenis kendaraan');
        return false;
    }
    
    // Validasi merk kendaraan
    if (!formData.vehicleBrand) {
        showErrorModal('Harap masukkan merk kendaraan');
        return false;
    }
    
    // Validasi lokasi
    if (!formData.location) {
        showErrorModal('Harap masukkan lokasi saat ini');
        return false;
    }
    
    // Validasi deskripsi masalah
    if (!formData.problem) {
        showErrorModal('Harap deskripsikan masalah yang dialami');
        return false;
    }
    
    // Validasi tingkat urgensi
    if (!formData.urgency) {
        showErrorModal('Harap pilih tingkat urgensi');
        return false;
    }
    
    return true;
}

// Fungsi untuk memproses form pemesanan dengan animasi
function submitBooking(event) {
    if (event) event.preventDefault();
    
    // Ambil data form
    const formData = getFormData();
    
    // Validasi form
    if (!validateForm(formData)) {
        return false;
    }
    
    // Tampilkan loading state dengan animasi
    const submitBtn = document.querySelector('.booking-form .primary-btn');
    if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulasi pengiriman data
        setTimeout(() => {
            // Reset tombol
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Tampilkan modal sukses
            showSuccessModal();
            
            // Reset form
            const form = document.getElementById('bookingForm');
            if (form) {
                form.reset();
            }
        }, 2000);
    } else {
        // Fallback jika tombol tidak ditemukan
        showSuccessModal();
    }
    
    return false;
}

// Fungsi untuk inisialisasi event listeners
function initEventListeners() {
    // Event listener untuk form pemesanan
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', submitBooking);
    }
    
    // Event listener untuk modal sukses close button
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeSuccessModal);
    }
    
    // Event listener untuk menutup modal sukses saat klik di luar
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                closeSuccessModal();
            }
        });
    }
}

// Back to Top Functionality
const backToTopBtn = document.createElement('button');
backToTopBtn.className = 'back-to-top';
backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Newsletter Form Handling
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('.newsletter-input').value;
    
    // Simulasi pengiriman newsletter
    const notification = document.getElementById('notification');
    notification.textContent = 'Terima kasih! Anda telah berlangganan newsletter kami.';
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
    
    newsletterForm.reset();
  });
}
// ... (fungsi-fungsi lainnya tetap sama)