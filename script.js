// Firebase yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyDexampleAPIKeyForFirebase",
    authDomain: "pluto-project.firebaseapp.com",
    projectId: "pluto-project",
    storageBucket: "pluto-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:exampleappid"
};

// Firebase'i başlat
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Dil değiştirme işlevi
document.addEventListener('DOMContentLoaded', function() {
    const languageLinks = document.querySelectorAll('.language-dropdown a');
    const languageBtn = document.querySelector('.language-btn');
    
    // Dil değiştirme olayları
    languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
    
    // Ödeme formu işleme
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processPayment();
        });
    }
    
    // Kart numarası formatlama
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            formatCardNumber(e);
        });
    }
    
    // Son kullanma tarihi formatlama
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            formatExpiryDate(e);
        });
    }
    
    // Giriş/Kayıt modal işlemleri
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userLoginBtn = document.getElementById('userLoginBtn');
    const userRegisterBtn = document.getElementById('userRegisterBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeButtons = document.querySelectorAll('.close');
    const logoutBtn = document.getElementById('logoutBtn');
    const userProfileBtn = document.getElementById('userProfileBtn');
    
    // Modal açma işlevleri
    if (loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if (registerBtn) registerBtn.addEventListener('click', () => openModal(registerModal));
    if (userLoginBtn) userLoginBtn.addEventListener('click', () => openModal(loginModal));
    if (userRegisterBtn) userRegisterBtn.addEventListener('click', () => openModal(registerModal));
    
    // Modal kapatma işlevleri
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(loginModal);
            closeModal(registerModal);
        });
    });
    
    // Dışarı tıklayınca modal kapatma
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) closeModal(loginModal);
        if (e.target === registerModal) closeModal(registerModal);
    });
    
    // Giriş formu işleme
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loginUser();
        });
    }
    
    // Kayıt formu işleme
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registerUser();
        });
    }
    
    // Çıkış işlemi
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
    
    // Profil menüsü
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = document.querySelector('.user-dropdown');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Sayfa dışına tıklanınca dropdown'ı kapat
    document.addEventListener('click', function() {
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) dropdown.style.display = 'none';
    });
    
    // Dropdown menü öğelerine tıklama
    const dropdownItems = document.querySelectorAll('.user-dropdown a');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) {
                changePage(page);
            }
        });
    });
    
    // Sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Sayfa geçişleri
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            changePage(targetPage);
            
            // Aktif menü öğesini güncelle
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Footer linkleri
    const footerDownloadLink = document.querySelector('.footer-download-link');
    if (footerDownloadLink) {
        footerDownloadLink.addEventListener('click', function(e) {
            e.preventDefault();
            changePage('download');
            
            // Aktif menü öğesini güncelle
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
                if (navLink.getAttribute('data-page') === 'download') {
                    navLink.classList.add('active');
                }
            });
        });
    }
    
    // Destek formu işleme
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitSupportRequest();
        });
    }
    
    // İndirme butonları
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            downloadFile(this);
        });
    });
    
    // Kullanıcı giriş durumunu kontrol et
    checkAuthState();
});

// Firebase Authentication state observer
function checkAuthState() {
    auth.onAuthStateChanged(user => {
        if (user) {
            // Kullanıcı giriş yapmış
            getUserData(user.uid);
        } else {
            // Kullanıcı giriş yapmamış
            checkLoginStatus(false);
        }
    });
}

// Firestore'dan kullanıcı verilerini al
function getUserData(uid) {
    db.collection('users').doc(uid).get()
    .then(doc => {
        if (doc.exists) {
            const userData = doc.data();
            checkLoginStatus(true, userData);
            updateProfilePage(userData);
        } else {
            console.log("No such document!");
        }
    })
    .catch(error => {
        console.log("Error getting document:", error);
    });
}

// Kullanıcı giriş işlemi
function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Basit doğrulama
    if (!email || !password) {
        alert('Lütfen e-posta ve şifre girin.');
        return;
    }
    
    // Firebase ile giriş yap
    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Giriş başarılı
        const user = userCredential.user;
        
        // Modalı kapat
        closeModal(document.getElementById('loginModal'));
        
        alert('Başarıyla giriş yaptınız!');
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        alert('Giriş hatası: ' + errorMessage);
    });
}

// Kullanıcı kayıt işlemi
function registerUser() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Basit doğrulama
    if (!username || !email || !password || !confirmPassword) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Şifreler eşleşmiyor.');
        return;
    }
    
    if (!agreeTerms) {
        alert('Kullanım şartlarını kabul etmelisiniz.');
        return;
    }
    
    // Firebase ile kayıt ol
    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Kayıt başarılı
        const user = userCredential.user;
        
        // Firestore'a kullanıcı verilerini kaydet
        return db.collection('users').doc(user.uid).set({
            username: username,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            membership: 'free',
            membershipExpiry: null
        });
    })
    .then(() => {
        // Modalı kapat
        closeModal(document.getElementById('registerModal'));
        
        alert('Kayıt işlemi başarılı! Hoş geldiniz.');
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        alert('Kayıt hatası: ' + errorMessage);
    });
}

// Kullanıcı çıkış işlemi
function logoutUser() {
    auth.signOut().then(() => {
        // Çıkış başarılı
        alert('Çıkış yaptınız.');
    }).catch((error) => {
        // Çıkış hatası
        alert('Çıkış hatası: ' + error.message);
    });
}

// Profil sayfasını güncelle
function updateProfilePage(userData) {
    document.getElementById('profileUsername').textContent = userData.username;
    document.getElementById('profileEmail').textContent = userData.email;
    document.getElementById('profileDetailUsername').textContent = userData.username;
    document.getElementById('profileDetailEmail').textContent = userData.email;
    
    // Üyelik tarihini formatla
    if (userData.createdAt) {
        const date = userData.createdAt.toDate();
        document.getElementById('profileMemberSince').textContent = 'Üyelik Tarihi: ' + formatDate(date);
    }
    
    // Üyelik durumu
    if (userData.membership === 'free') {
        document.getElementById('profileMembershipStatus').textContent = 'Ücretsiz';
        document.getElementById('profileMembershipEnd').textContent = 'Yok';
    } else {
        document.getElementById('profileMembershipStatus').textContent = 'Premium';
        if (userData.membershipExpiry) {
            const expiryDate = userData.membershipExpiry.toDate();
            document.getElementById('profileMembershipEnd').textContent = formatDate(expiryDate);
        }
    }
}

// Tarih formatlama
function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day} ${getMonthName(month)} ${year}`;
}

// Ay ismini al
function getMonthName(month) {
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months[month - 1];
}

// Sayfa değiştirme fonksiyonu
function changePage(pageId) {
    const pages = document.querySelectorAll('.page');
    const targetPage = document.getElementById(`${pageId}-page`);
    
    // Tüm sayfaları gizle
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Hedef sayfayı göster
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Sayfa başlığını güncelle
        document.title = `PLUTO - ${getPageTitle(pageId)}`;
        
        // Sayfayı en üste kaydır
        window.scrollTo(0, 0);
        
        // Eğer indirme sayfasıysa ve kullanıcı giriş yapmamışsa uyarı göster
        if (pageId === 'download') {
            const user = auth.currentUser;
            if (!user) {
                setTimeout(() => {
                    alert('Dosya indirmek için giriş yapmalısınız!');
                }, 300);
            }
        }
    } else {
        console.error(`Sayfa bulunamadı: ${pageId}`);
    }
}

// Sayfa başlıklarını al
function getPageTitle(pageId) {
    const titles = {
        'home': 'Ana Sayfa',
        'features': 'Özellikler',
        'pricing': 'Fiyatlandırma',
        'download': 'Dosya İndirme',
        'support': 'Destek',
        'profile': 'Profil',
        'subscription': 'Abonelik',
        'downloads': 'İndirme Geçmişi'
    };
    
    return titles[pageId] || 'PLUTO';
}

// Destek talebi gönderme
function submitSupportRequest() {
    const subject = document.getElementById('supportSubject').value;
    const category = document.getElementById('supportCategory').value;
    const message = document.getElementById('supportMessage').value;
    const user = auth.currentUser;
    
    if (!user) {
        alert('Destek talebi göndermek için giriş yapmalısınız!');
        return;
    }
    
    // Basit doğrulama
    if (!subject || !category || !message) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }
    
    // Firestore'a destek talebini kaydet
    db.collection('supportTickets').add({
        userId: user.uid,
        subject: subject,
        category: category,
        message: message,
        status: 'open',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
        alert('Destek talebiniz başarıyla gönderildi! En kısa sürede dönüş yapacağız. Talep ID: ' + docRef.id);
        
        // Formu temizle
        document.getElementById('supportForm').reset();
    })
    .catch((error) => {
        alert('Destek talebi gönderilirken hata oluştu: ' + error.message);
    });
}

// Dosya indirme işlemi
function downloadFile(button) {
    const user = auth.currentUser;
    
    if (!user) {
        alert('Dosya indirmek için giriş yapmalısınız!');
        openModal(document.getElementById('loginModal'));
        return;
    }
    
    const fileName = button.closest('.download-item').querySelector('h3').textContent;
    
    // İndirme geçmişine ekle
    db.collection('downloads').add({
        userId: user.uid,
        fileName: fileName,
        downloadedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        // İndirme simülasyonu
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> İndiriliyor...';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-download"></i> İndirildi';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-download"></i> İndir';
                button.disabled = false;
                
                alert(`${fileName} başarıyla indirildi!`);
            }, 2000);
        }, 1500);
    })
    .catch((error) => {
        alert('İndirme işlemi sırasında hata oluştu: ' + error.message);
    });
}

// Dil değiştirme fonksiyonu
function changeLanguage(lang) {
    const languageBtn = document.querySelector('.language-btn');
    const navTexts = document.querySelectorAll('.nav-text');
    
    // Dil butonunu güncelle
    switch(lang) {
        case 'tr':
            languageBtn.innerHTML = '<i class="fas fa-globe"></i> <span class="nav-text">Türkçe</span> <i class="fas fa-chevron-down"></i>';
            updateContentTurkish();
            break;
        case 'en':
            languageBtn.innerHTML = '<i class="fas fa-globe"></i> <span class="nav-text">English</span> <i class="fas fa-chevron-down"></i>';
            updateContentEnglish();
            break;
        case 'ru':
            languageBtn.innerHTML = '<i class="fas fa-globe"></i> <span class="nav-text">Русский</span> <i class="fas fa-chevron-down"></i>';
            updateContentRussian();
            break;
        case 'jp':
            languageBtn.innerHTML = '<i class="fas fa-globe"></i> <span class="nav-text">日本語</span> <i class="fas fa-chevron-down"></i>';
            updateContentJapanese();
            break;
    }
    
    // Nav text'leri tekrar göster (mobilde gizlenmiş olabilir)
    navTexts.forEach(text => {
        text.style.display = 'inline';
    });
    
    // Seçilen dili localStorage'a kaydet
    localStorage.setItem('selectedLanguage', lang);
}

// İçeriği Türkçe olarak güncelle
function updateContentTurkish() {
    document.querySelector('html').lang = 'tr';
    document.title = 'PLUTO - JUST TO BE A WINNER!';
    
    // Navigasyon metinleri
    const navItems = document.querySelectorAll('.sidebar-nav a .nav-text');
    if (navItems.length >= 5) {
        navItems[0].textContent = 'Ana Sayfa';
        navItems[1].textContent = 'Özellikler';
        navItems[2].textContent = 'Fiyatlandırma';
        navItems[3].textContent = 'Dosya İndir';
        navItems[4].textContent = 'Destek';
    }
    
    // Giriş/Kayıt butonları
    const authButtons = document.querySelectorAll('.auth-btn');
    authButtons[0].innerHTML = '<i class="fas fa-sign-in-alt"></i> Giriş Yap';
    authButtons[1].innerHTML = '<i class="fas fa-user-plus"></i> Kayıt Ol';
    
    // Kullanıcı menüsü
    const userMenuItems = document.querySelectorAll('.user-dropdown a .nav-text');
    if (userMenuItems.length >= 4) {
        userMenuItems[0].textContent = 'Profil';
        userMenuItems[1].textContent = 'Abonelik';
        userMenuItems[2].textContent = 'İndirmeler';
        userMenuItems[3].textContent = 'Çıkış Yap';
    }
    
    // Hero section
    document.querySelector('.hero h1').textContent = 'PLUTO';
    document.querySelector('.hero h2').textContent = 'JUST TO BE A WINNER!';
    document.querySelector('.hero p').textContent = 'PLUTO, CS2, CS:GO, GTA 5 Online, CS 1.6, Apex Legends ve SCP:SL gibi popüler çevrimiçi oyunlar için bir oyun asistanıdır.';
    document.querySelector('.hero .btn').textContent = 'Hemen Katıl';
    
    // Hoş geldiniz bölümü
    document.querySelector('.welcome .section-title h2').textContent = 'PLUTO projesi sayfasına hoş geldiniz!';
    const welcomeParagraphs = document.querySelectorAll('.welcome-content p');
    welcomeParagraphs[0].textContent = 'PLUTO, son 8 yılda 250.000\'den fazla memnun kullanıcıyla BDT pazarının önde gelen projelerinden biridir. Ürünlerimiz, oyunculara kendilerini bir e-spor yıldızı olarak deneyimleme fırsatı sunuyor.';
    welcomeParagraphs[1].textContent = 'Bugün PLUTO\'ya katılın ve çevrimiçi oyunlarda ustalık yolculuğunuza başlayın!';
    
    // Özellikler bölümü
    document.querySelector('.features .section-title h2').textContent = 'Özelliklerimiz';
    const featureTitles = document.querySelectorAll('.feature-card h3');
    const featureTexts = document.querySelectorAll('.feature-card p');
    
    featureTitles[0].textContent = 'Koruma';
    featureTexts[0].textContent = 'Teknolojilerimiz oyun deneyiminizin istikrarını ve güvenliğini sağlar.';
    
    featureTitles[1].textContent = 'Bypass Kaydı';
    featureTexts[1].textContent = 'Yayın yapmayı mı seviyorsunuz? Video kaydetmeyi mi? Ürünlerimizle içerik üretebilir ve görünmez olabilirsiniz.';
    
    featureTitles[2].textContent = '7/24 Destek';
    featureTexts[2].textContent = '7/24 teknik desteğimiz her zaman size yardımcı olmaya hazırdır.';
    
    featureTitles[3].textContent = 'Bulut Teknolojileri';
    featureTexts[3].textContent = 'Tüm ayarlarınızı bulutta güvenli bir şekilde depolamak ve korumak için bulut teknolojisini kullanıyoruz.';
    
    // Fiyatlandırma bölümü
    document.querySelector('.payment .section-title h2').textContent = 'Üyelik ve Ödeme';
    document.querySelector('.payment .section-title p').textContent = 'PLUTO\'ya katılın ve kazananların arasında yerinizi alın!';
    
    const pricingTitles = document.querySelectorAll('.pricing-card h3');
    pricingTitles[0].textContent = '1 Aylık Üyelik';
    pricingTitles[1].textContent = '3 Aylık Üyelik';
    pricingTitles[2].textContent = '1 Yıllık Üyelik';
    
    const pricingButtons = document.querySelectorAll('.pricing-card .btn');
    pricingButtons.forEach(btn => {
        btn.textContent = 'Satın Al';
    });
    
    // Ödeme formu
    document.querySelector('.payment-form h3').textContent = 'Ödeme Bilgileri';
    const formLabels = document.querySelectorAll('.payment-form label');
    formLabels[0].textContent = 'Kart Numarası';
    formLabels[1].textContent = 'Son Kullanma Tarihi';
    formLabels[2].textContent = 'CVV';
    formLabels[3].textContent = 'Kart Üzerindeki İsim';
    
    const formPlaceholders = document.querySelectorAll('.payment-form input');
    formPlaceholders[0].placeholder = '1234 5678 9012 3456';
    formPlaceholders[1].placeholder = 'MM/YY';
    formPlaceholders[2].placeholder = '123';
    formPlaceholders[3].placeholder = 'Ad Soyad';
    
    document.querySelector('.payment-form .form-check label').textContent = 'Kart bilgilerimi kaydet';
    document.querySelector('.payment-form .btn').textContent = 'Ödemeyi Tamamla';
    
    // Dosya indirme bölümü
    document.querySelector('.download .section-title h2').textContent = 'Dosya İndirme';
    document.querySelector('.download .section-title p').textContent = 'PLUTO yazılımını indirin ve kurulum talimatlarını takip edin.';
    document.querySelector('.download-notice p').textContent = 'Dosya indirmek için giriş yapmış olmanız gerekmektedir.';
    
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-download"></i> İndir';
    });
    
    // Destek bölümü
    document.querySelector('.support .section-title h2').textContent = 'Destek';
    document.querySelector('.support .section-title p').textContent = 'Bir sorunuz veya probleminiz mi var? Destek ekibimizle iletişime geçin.';
    document.querySelector('.support-notice p').textContent = 'Destek talebi oluşturmak için giriş yapmış olmanız gerekmektedir.';
    
    const supportLabels = document.querySelectorAll('.support-form label');
    supportLabels[0].textContent = 'Konu';
    supportLabels[1].textContent = 'Kategori';
    supportLabels[2].textContent = 'Mesaj';
    
    const supportPlaceholders = document.querySelectorAll('.support-form input, .support-form textarea, .support-form select');
    supportPlaceholders[0].placeholder = 'Sorununuzun konusu';
    supportPlaceholders[2].placeholder = 'Sorununuzu detaylı bir şekilde açıklayın';
    
    const supportOptions = document.querySelectorAll('.support-form option');
    supportOptions[0].textContent = 'Kategori seçin';
    supportOptions[1].textContent = 'Teknik Sorun';
    supportOptions[2].textContent = 'Fatura ve Ödeme';
    supportOptions[3].textContent = 'Hesap Sorunu';
    supportOptions[4].textContent = 'Diğer';
    
    document.querySelector('.support-form .btn').textContent = 'Gönder';
    
    // Profil bölümü
    document.querySelector('#profile-page .section-title h2').textContent = 'Profil Bilgileri';
    document.querySelector('#profile-page .section-title p').textContent = 'Hesap bilgilerinizi görüntüleyin ve yönetin.';
    
    // Abonelik bölümü
    document.querySelector('#subscription-page .section-title h2').textContent = 'Abonelik Yönetimi';
    document.querySelector('#subscription-page .section-title p').textContent = 'Abonelik planınızı görüntüleyin ve yönetin.';
    
    // İndirme geçmişi bölümü
    document.querySelector('#downloads-page .section-title h2').textContent = 'İndirme Geçmişi';
    document.querySelector('#downloads-page .section-title p').textContent = 'Daha önce indirdiğiniz dosyaların listesi.';
    
    // Giriş modalı
    document.querySelector('#loginModal h2').textContent = 'Giriş Yap';
    const loginLabels = document.querySelectorAll('#loginForm label');
    loginLabels[0].textContent = 'E-posta';
    loginLabels[1].textContent = 'Şifre';
    
    const loginPlaceholders = document.querySelectorAll('#loginForm input');
    loginPlaceholders[0].placeholder = 'E-posta adresiniz';
    loginPlaceholders[1].placeholder = 'Şifreniz';
    
    document.querySelector('#loginForm .form-check label').textContent = 'Beni hatırla';
    document.querySelector('.forgot-password').textContent = 'Şifremi unuttum';
    document.querySelector('#loginForm .btn').textContent = 'Giriş Yap';
    document.querySelector('.auth-divider span').textContent = 'veya';
    
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons[0].innerHTML = '<i class="fab fa-google"></i> Google ile giriş yap';
    socialButtons[1].innerHTML = '<i class="fab fa-discord"></i> Discord ile giriş yap';
    
    // Kayıt modalı
    document.querySelector('#registerModal h2').textContent = 'Kayıt Ol';
    const registerLabels = document.querySelectorAll('#registerForm label');
    registerLabels[0].textContent = 'Kullanıcı Adı';
    registerLabels[1].textContent = 'E-posta';
    registerLabels[2].textContent = 'Şifre';
    registerLabels[3].textContent = 'Şifre Tekrar';
    
    const registerPlaceholders = document.querySelectorAll('#registerForm input');
    registerPlaceholders[0].placeholder = 'Kullanıcı adınız';
    registerPlaceholders[1].placeholder = 'E-posta adresiniz';
    registerPlaceholders[2].placeholder = 'Şifreniz';
    registerPlaceholders[3].placeholder = 'Şifrenizi tekrar girin';
    
    document.querySelector('#registerForm .form-check label').textContent = 'Kullanım şartlarını ve gizlilik politikasını kabul ediyorum';
    document.querySelector('#registerForm .btn').textContent = 'Kayıt Ol';
}

// İçeriği İngilizce olarak güncelle
function updateContentEnglish() {
    document.querySelector('html').lang = 'en';
    document.title = 'PLUTO - JUST TO BE A WINNER!';
    
    // Navigasyon metinleri
    const navItems = document.querySelectorAll('.sidebar-nav a .nav-text');
    if (navItems.length >= 5) {
        navItems[0].textContent = 'Home';
        navItems[1].textContent = 'Features';
        navItems[2].textContent = 'Pricing';
        navItems[3].textContent = 'Download';
        navItems[4].textContent = 'Support';
    }
    
    // Giriş/Kayıt butonları
    const authButtons = document.querySelectorAll('.auth-btn');
    authButtons[0].innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    authButtons[1].innerHTML = '<i class="fas fa-user-plus"></i> Register';
    
    // Kullanıcı menüsü
    const userMenuItems = document.querySelectorAll('.user-dropdown a .nav-text');
    if (userMenuItems.length >= 4) {
        userMenuItems[0].textContent = 'Profile';
        userMenuItems[1].textContent = 'Subscription';
        userMenuItems[2].textContent = 'Downloads';
        userMenuItems[3].textContent = 'Logout';
    }
    
    // Hero section
    document.querySelector('.hero h1').textContent = 'PLUTO';
    document.querySelector('.hero h2').textContent = 'JUST TO BE A WINNER!';
    document.querySelector('.hero p').textContent = 'PLUTO is a gaming assistant for popular online games like CS2, CS:GO, GTA 5 Online, CS 1.6, Apex Legends, and SCP:SL.';
    document.querySelector('.hero .btn').textContent = 'Join Now';
    
    // Hoş geldiniz bölümü
    document.querySelector('.welcome .section-title h2').textContent = 'Welcome to the PLUTO project page!';
    const welcomeParagraphs = document.querySelectorAll('.welcome-content p');
    welcomeParagraphs[0].textContent = 'PLUTO is one of the leading projects in the CIS market with over 250,000 satisfied users over the past 8 years. Our products give players the opportunity to experience themselves as an e-sports star.';
    welcomeParagraphs[1].textContent = 'Join PLUTO today and start your journey to mastery in online games!';
    
    // Özellikler bölümü
    document.querySelector('.features .section-title h2').textContent = 'Our Features';
    const featureTitles = document.querySelectorAll('.feature-card h3');
    const featureTexts = document.querySelectorAll('.feature-card p');
    
    featureTitles[0].textContent = 'Protection';
    featureTexts[0].textContent = 'Our technologies ensure the stability and security of your gaming experience.';
    
    featureTitles[1].textContent = 'Bypass Record';
    featureTexts[1].textContent = 'Love to stream? Record videos? With our products, you can create content and become invisible.';
    
    featureTitles[2].textContent = '24/7 Support';
    featureTexts[2].textContent = 'Our 24/7 technical support is always ready to help you.';
    
    featureTitles[3].textContent = 'Cloud Technologies';
    featureTexts[3].textContent = 'We use cloud technology to securely store and protect all your settings in the cloud.';
    
    // Fiyatlandırma bölümü
    document.querySelector('.payment .section-title h2').textContent = 'Membership & Payment';
    document.querySelector('.payment .section-title p').textContent = 'Join PLUTO and take your place among the winners!';
    
    const pricingTitles = document.querySelectorAll('.pricing-card h3');
    pricingTitles[0].textContent = '1 Month Membership';
    pricingTitles[1].textContent = '3 Month Membership';
    pricingTitles[2].textContent = '1 Year Membership';
    
    const pricingButtons = document.querySelectorAll('.pricing-card .btn');
    pricingButtons.forEach(btn => {
        btn.textContent = 'Buy Now';
    });
    
    // Ödeme formu
    document.querySelector('.payment-form h3').textContent = 'Payment Information';
    const formLabels = document.querySelectorAll('.payment-form label');
    formLabels[0].textContent = 'Card Number';
    formLabels[1].textContent = 'Expiry Date';
    formLabels[2].textContent = 'CVV';
    formLabels[3].textContent = 'Name on Card';
    
    const formPlaceholders = document.querySelectorAll('.payment-form input');
    formPlaceholders[0].placeholder = '1234 5678 9012 3456';
    formPlaceholders[1].placeholder = 'MM/YY';
    formPlaceholders[2].placeholder = '123';
    formPlaceholders[3].placeholder = 'Full Name';
    
    document.querySelector('.payment-form .form-check label').textContent = 'Save my card details';
    document.querySelector('.payment-form .btn').textContent = 'Complete Payment';
    
    // Dosya indirme bölümü
    document.querySelector('.download .section-title h2').textContent = 'File Download';
    document.querySelector('.download .section-title p').textContent = 'Download the PLUTO software and follow the installation instructions.';
    document.querySelector('.download-notice p').textContent = 'You must be logged in to download files.';
    
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-download"></i> Download';
    });
    
    // Destek bölümü
    document.querySelector('.support .section-title h2').textContent = 'Support';
    document.querySelector('.support .section-title p').textContent = 'Have a question or problem? Contact our support team.';
    document.querySelector('.support-notice p').textContent = 'You must be logged in to create a support ticket.';
    
    const supportLabels = document.querySelectorAll('.support-form label');
    supportLabels[0].textContent = 'Subject';
    supportLabels[1].textContent = 'Category';
    supportLabels[2].textContent = 'Message';
    
    const supportPlaceholders = document.querySelectorAll('.support-form input, .support-form textarea, .support-form select');
    supportPlaceholders[0].placeholder = 'Your issue subject';
    supportPlaceholders[2].placeholder = 'Describe your issue in detail';
    
    const supportOptions = document.querySelectorAll('.support-form option');
    supportOptions[0].textContent = 'Select category';
    supportOptions[1].textContent = 'Technical Issue';
    supportOptions[2].textContent = 'Billing & Payment';
    supportOptions[3].textContent = 'Account Issue';
    supportOptions[4].textContent = 'Other';
    
    document.querySelector('.support-form .btn').textContent = 'Submit';
    
    // Profil bölümü
    document.querySelector('#profile-page .section-title h2').textContent = 'Profile Information';
    document.querySelector('#profile-page .section-title p').textContent = 'View and manage your account information.';
    
    // Abonelik bölümü
    document.querySelector('#subscription-page .section-title h2').textContent = 'Subscription Management';
    document.querySelector('#subscription-page .section-title p').textContent = 'View and manage your subscription plan.';
    
    // İndirme geçmişi bölümü
    document.querySelector('#downloads-page .section-title h2').textContent = 'Download History';
    document.querySelector('#downloads-page .section-title p').textContent = 'List of files you have downloaded previously.';
    
    // Giriş modalı
    document.querySelector('#loginModal h2').textContent = 'Login';
    const loginLabels = document.querySelectorAll('#loginForm label');
    loginLabels[0].textContent = 'Email';
    loginLabels[1].textContent = 'Password';
    
    const loginPlaceholders = document.querySelectorAll('#loginForm input');
    loginPlaceholders[0].placeholder = 'Your email address';
    loginPlaceholders[1].placeholder = 'Your password';
    
    document.querySelector('#loginForm .form-check label').textContent = 'Remember me';
    document.querySelector('.forgot-password').textContent = 'Forgot password?';
    document.querySelector('#loginForm .btn').textContent = 'Login';
    document.querySelector('.auth-divider span').textContent = 'or';
    
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons[0].innerHTML = '<i class="fab fa-google"></i> Login with Google';
    socialButtons[1].innerHTML = '<i class="fab fa-discord"></i> Login with Discord';
    
    // Kayıt modalı
    document.querySelector('#registerModal h2').textContent = 'Register';
    const registerLabels = document.querySelectorAll('#registerForm label');
    registerLabels[0].textContent = 'Username';
    registerLabels[1].textContent = 'Email';
    registerLabels[2].textContent = 'Password';
    registerLabels[3].textContent = 'Confirm Password';
    
    const registerPlaceholders = document.querySelectorAll('#registerForm input');
    registerPlaceholders[0].placeholder = 'Your username';
    registerPlaceholders[1].placeholder = 'Your email address';
    registerPlaceholders[2].placeholder = 'Your password';
    registerPlaceholders[3].placeholder = 'Confirm your password';
    
    document.querySelector('#registerForm .form-check label').textContent = 'I agree to the terms of use and privacy policy';
    document.querySelector('#registerForm .btn').textContent = 'Register';
}

// İçeriği Rusça olarak güncelle
function updateContentRussian() {
    document.querySelector('html').lang = 'ru';
    document.title = 'PLUTO - JUST TO BE A WINNER!';
    
    // Navigasyon metinleri
    const navItems = document.querySelectorAll('.sidebar-nav a .nav-text');
    if (navItems.length >= 5) {
        navItems[0].textContent = 'Главная';
        navItems[1].textContent = 'Возможности';
        navItems[2].textContent = 'Цены';
        navItems[3].textContent = 'Скачать';
        navItems[4].textContent = 'Поддержка';
    }
    
    // Giriş/Kayıt butonları
    const authButtons = document.querySelectorAll('.auth-btn');
    authButtons[0].innerHTML = '<i class="fas fa-sign-in-alt"></i> Войти';
    authButtons[1].innerHTML = '<i class="fas fa-user-plus"></i> Регистрация';
    
    // Kullanıcı menüsü
    const userMenuItems = document.querySelectorAll('.user-dropdown a .nav-text');
    if (userMenuItems.length >= 4) {
        userMenuItems[0].textContent = 'Профиль';
        userMenuItems[1].textContent = 'Подписка';
        userMenuItems[2].textContent = 'Загрузки';
        userMenuItems[3].textContent = 'Выйти';
    }
    
    // Hero section
    document.querySelector('.hero h1').textContent = 'PLUTO';
    document.querySelector('.hero h2').textContent = 'JUST TO BE A WINNER!';
    document.querySelector('.hero p').textContent = 'PLUTO - это игровой ассистент для популярных онлайн-игр, таких как CS2, CS:GO, GTA 5 Online, CS 1.6, Apex Legends и SCP:SL.';
    document.querySelector('.hero .btn').textContent = 'Присоединиться';
    
    // Hoş geldiniz bölümü
    document.querySelector('.welcome .section-title h2').textContent = 'Добро пожаловать на страницу проекта PLUTO!';
    const welcomeParagraphs = document.querySelectorAll('.welcome-content p');
    welcomeParagraphs[0].textContent = 'PLUTO является одним из ведущих проектов на рынке СНГ с более чем 250 000 довольных пользователей за последние 8 лет. Наши продукты дают игрокам возможность почувствовать себя звездой киберспорта.';
    welcomeParagraphs[1].textContent = 'Присоединяйтесь к PLUTO сегодня и начните свой путь к мастерству в онлайн-играх!';
    
    // Özellikler bölümü
    document.querySelector('.features .section-title h2').textContent = 'Наши возможности';
    const featureTitles = document.querySelectorAll('.feature-card h3');
    const featureTexts = document.querySelectorAll('.feature-card p');
    
    featureTitles[0].textContent = 'Защита';
    featureTexts[0].textContent = 'Наши технологии обеспечивают стабильность и безопасность вашего игрового опыта.';
    
    featureTitles[1].textContent = 'Обход записи';
    featureTexts[1].textContent = 'Любите стримить? Записывать видео? С нашими продуктами вы можете создавать контент и оставаться невидимым.';
    
    featureTitles[2].textContent = 'Поддержка 24/7';
    featureTexts[2].textContent = 'Наша техническая поддержка 24/7 всегда готова помочь вам.';
    
    featureTitles[3].textContent = 'Облачные технологии';
    featureTexts[3].textContent = 'Мы используем облачные технологии для безопасного хранения и защиты всех ваших настроек в облаке.';
    
    // Fiyatlandırma bölümü
    document.querySelector('.payment .section-title h2').textContent = 'Членство и оплата';
    document.querySelector('.payment .section-title p').textContent = 'Присоединяйтесь к PLUTO и займите свое место среди победителей!';
    
    const pricingTitles = document.querySelectorAll('.pricing-card h3');
    pricingTitles[0].textContent = '1 месяц членства';
    pricingTitles[1].textContent = '3 месяца членства';
    pricingTitles[2].textContent = '1 год членства';
    
    const pricingButtons = document.querySelectorAll('.pricing-card .btn');
    pricingButtons.forEach(btn => {
        btn.textContent = 'Купить сейчас';
    });
    
    // Ödeme formu
    document.querySelector('.payment-form h3').textContent = 'Платежная информация';
    const formLabels = document.querySelectorAll('.payment-form label');
    formLabels[0].textContent = 'Номер карты';
    formLabels[1].textContent = 'Срок действия';
    formLabels[2].textContent = 'CVV';
    formLabels[3].textContent = 'Имя на карте';
    
    const formPlaceholders = document.querySelectorAll('.payment-form input');
    formPlaceholders[0].placeholder = '1234 5678 9012 3456';
    formPlaceholders[1].placeholder = 'ММ/ГГ';
    formPlaceholders[2].placeholder = '123';
    formPlaceholders[3].placeholder = 'Имя Фамилия';
    
    document.querySelector('.payment-form .form-check label').textContent = 'Сохранить данные моей карты';
    document.querySelector('.payment-form .btn').textContent = 'Завершить оплату';
    
    // Dosya indirme bölümü
    document.querySelector('.download .section-title h2').textContent = 'Загрузка файлов';
    document.querySelector('.download .section-title p').textContent = 'Скачайте программное обеспечение PLUTO и следуйте инструкциям по установке.';
    document.querySelector('.download-notice p').textContent = 'Для загрузки файлов необходимо войти в систему.';
    
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-download"></i> Скачать';
    });
    
    // Destek bölümü
    document.querySelector('.support .section-title h2').textContent = 'Поддержка';
    document.querySelector('.support .section-title p').textContent = 'Есть вопрос или проблема? Свяжитесь с нашей службой поддержки.';
    document.querySelector('.support-notice p').textContent = 'Для создания запроса в поддержку необходимо войти в систему.';
    
    const supportLabels = document.querySelectorAll('.support-form label');
    supportLabels[0].textContent = 'Тема';
    supportLabels[1].textContent = 'Категория';
    supportLabels[2].textContent = 'Сообщение';
    
    const supportPlaceholders = document.querySelectorAll('.support-form input, .support-form textarea, .support-form select');
    supportPlaceholders[0].placeholder = 'Тема вашей проблемы';
    supportPlaceholders[2].placeholder = 'Подробно опишите вашу проблему';
    
    const supportOptions = document.querySelectorAll('.support-form option');
    supportOptions[0].textContent = 'Выберите категорию';
    supportOptions[1].textContent = 'Техническая проблема';
    supportOptions[2].textContent = 'Оплата и выставление счетов';
    supportOptions[3].textContent = 'Проблема с аккаунтом';
    supportOptions[4].textContent = 'Другое';
    
    document.querySelector('.support-form .btn').textContent = 'Отправить';
    
    // Profil bölümü
    document.querySelector('#profile-page .section-title h2').textContent = 'Информация профиля';
    document.querySelector('#profile-page .section-title p').textContent = 'Просматривайте и управляйте информацией вашего аккаунта.';
    
    // Abonelik bölümü
    document.querySelector('#subscription-page .section-title h2').textContent = 'Управление подпиской';
    document.querySelector('#subscription-page .section-title p').textContent = 'Просматривайте и управляйте вашим планом подписки.';
    
    // İndirme geçmişi bölümü
    document.querySelector('#downloads-page .section-title h2').textContent = 'История загрузок';
    document.querySelector('#downloads-page .section-title p').textContent = 'Список файлов, которые вы скачали ранее.';
    
    // Giriş modalı
    document.querySelector('#loginModal h2').textContent = 'Вход';
    const loginLabels = document.querySelectorAll('#loginForm label');
    loginLabels[0].textContent = 'Email';
    loginLabels[1].textContent = 'Пароль';
    
    const loginPlaceholders = document.querySelectorAll('#loginForm input');
    loginPlaceholders[0].placeholder = 'Ваш адрес email';
    loginPlaceholders[1].placeholder = 'Ваш пароль';
    
    document.querySelector('#loginForm .form-check label').textContent = 'Запомнить меня';
    document.querySelector('.forgot-password').textContent = 'Забыли пароль?';
    document.querySelector('#loginForm .btn').textContent = 'Войти';
    document.querySelector('.auth-divider span').textContent = 'или';
    
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons[0].innerHTML = '<i class="fab fa-google"></i> Войти через Google';
    socialButtons[1].innerHTML = '<i class="fab fa-discord"></i> Войти через Discord';
    
    // Kayıt modalı
    document.querySelector('#registerModal h2').textContent = 'Регистрация';
    const registerLabels = document.querySelectorAll('#registerForm label');
    registerLabels[0].textContent = 'Имя пользователя';
    registerLabels[1].textContent = 'Email';
    registerLabels[2].textContent = 'Пароль';
    registerLabels[3].textContent = 'Подтверждение пароля';
    
    const registerPlaceholders = document.querySelectorAll('#registerForm input');
    registerPlaceholders[0].placeholder = 'Ваше имя пользователя';
    registerPlaceholders[1].placeholder = 'Ваш адрес email';
    registerPlaceholders[2].placeholder = 'Ваш пароль';
    registerPlaceholders[3].placeholder = 'Подтвердите ваш пароль';
    
    document.querySelector('#registerForm .form-check label').textContent = 'Я согласен с условиями использования и политикой конфиденциальности';
    document.querySelector('#registerForm .btn').textContent = 'Зарегистрироваться';
}

// İçeriği Japonca olarak güncelle
function updateContentJapanese() {
    document.querySelector('html').lang = 'jp';
    document.title = 'PLUTO - JUST TO BE A WINNER!';
    
    // Navigasyon metinleri
    const navItems = document.querySelectorAll('.sidebar-nav a .nav-text');
    if (navItems.length >= 5) {
        navItems[0].textContent = 'ホーム';
        navItems[1].textContent = '特徴';
        navItems[2].textContent = '価格';
        navItems[3].textContent = 'ダウンロード';
        navItems[4].textContent = 'サポート';
    }
    
    // Giriş/Kayıt butonları
    const authButtons = document.querySelectorAll('.auth-btn');
    authButtons[0].innerHTML = '<i class="fas fa-sign-in-alt"></i> ログイン';
    authButtons[1].innerHTML = '<i class="fas fa-user-plus"></i> 登録';
    
    // Kullanıcı menüsü
    const userMenuItems = document.querySelectorAll('.user-dropdown a .nav-text');
    if (userMenuItems.length >= 4) {
        userMenuItems[0].textContent = 'プロフィール';
        userMenuItems[1].textContent = 'サブスクリプション';
        userMenuItems[2].textContent = 'ダウンロード';
        userMenuItems[3].textContent = 'ログアウト';
    }
    
    // Hero section
    document.querySelector('.hero h1').textContent = 'PLUTO';
    document.querySelector('.hero h2').textContent = 'JUST TO BE A WINNER!';
    document.querySelector('.hero p').textContent = 'PLUTOは、CS2、CS:GO、GTA 5 Online、CS 1.6、Apex Legends、SCP:SLなどの人気オンラインゲームのためのゲーミングアシスタントです。';
    document.querySelector('.hero .btn').textContent = '今すぐ参加';
    
    // Hoş geldiniz bölümü
    document.querySelector('.welcome .section-title h2').textContent = 'PLUTOプロジェクトページへようこそ！';
    const welcomeParagraphs = document.querySelectorAll('.welcome-content p');
    welcomeParagraphs[0].textContent = 'PLUTOは、過去8年間で25万人以上の満足したユーザーを抱えるCIS市場の主要プロジェクトの1つです。私たちの製品は、プレイヤーがeスポーツスターとしての経験を積む機会を提供します。';
    welcomeParagraphs[1].textContent = '今日PLUTOに参加して、オンラインゲームでのマスタリーへの旅を始めましょう！';
    
    // Özellikler bölümü
    document.querySelector('.features .section-title h2').textContent = '私たちの特徴';
    const featureTitles = document.querySelectorAll('.feature-card h3');
    const featureTexts = document.querySelectorAll('.feature-card p');
    
    featureTitles[0].textContent = '保護';
    featureTexts[0].textContent = '私たちのテクノロジーは、ゲーム体験の安定性と安全性を確保します。';
    
    featureTitles[1].textContent = 'バイパス記録';
    featureTexts[1].textContent = '配信が好きですか？動画を記録しますか？私たちの製品でコンテンツを作成し、見えなくなることができます。';
    
    featureTitles[2].textContent = '24/7サポート';
    featureTexts[2].textContent = '24時間体制の技術サポートが常にあなたを助ける準備ができています。';
    
    featureTitles[3].textContent = 'クラウド技術';
    featureTexts[3].textContent = 'クラウドテクノロジーを使用して、すべての設定をクラウド内で安全に保存および保護します。';
    
    // Fiyatlandırma bölümü
    document.querySelector('.payment .section-title h2').textContent = 'メンバーシップとお支払い';
    document.querySelector('.payment .section-title p').textContent = 'PLUTOに参加して、勝者の仲間入りをしましょう！';
    
    const pricingTitles = document.querySelectorAll('.pricing-card h3');
    pricingTitles[0].textContent = '1ヶ月メンバーシップ';
    pricingTitles[1].textContent = '3ヶ月メンバーシップ';
    pricingTitles[2].textContent = '1年メンバーシップ';
    
    const pricingButtons = document.querySelectorAll('.pricing-card .btn');
    pricingButtons.forEach(btn => {
        btn.textContent = '今すぐ購入';
    });
    
    // Ödeme formu
    document.querySelector('.payment-form h3').textContent = 'お支払い情報';
    const formLabels = document.querySelectorAll('.payment-form label');
    formLabels[0].textContent = 'カード番号';
    formLabels[1].textContent = '有効期限';
    formLabels[2].textContent = 'CVV';
    formLabels[3].textContent = 'カード名義人';
    
    const formPlaceholders = document.querySelectorAll('.payment-form input');
    formPlaceholders[0].placeholder = '1234 5678 9012 3456';
    formPlaceholders[1].placeholder = 'MM/YY';
    formPlaceholders[2].placeholder = '123';
    formPlaceholders[3].placeholder = '姓名';
    
    document.querySelector('.payment-form .form-check label').textContent = 'カード情報を保存する';
    document.querySelector('.payment-form .btn').textContent = '支払いを完了する';
    
    // Dosya indirme bölümü
    document.querySelector('.download .section-title h2').textContent = 'ファイルのダウンロード';
    document.querySelector('.download .section-title p').textContent = 'PLUTOソフトウェアをダウンロードして、インストール手順に従ってください。';
    document.querySelector('.download-notice p').textContent = 'ファイルをダウンロードするには、ログインする必要があります。';
    
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-download"></i> ダウンロード';
    });
    
    // Destek bölümü
    document.querySelector('.support .section-title h2').textContent = 'サポート';
    document.querySelector('.support .section-title p').textContent = '質問や問題がありますか？サポートチームまでお問い合わせください。';
    document.querySelector('.support-notice p').textContent = 'サポートチケットを作成するには、ログインする必要があります。';
    
    const supportLabels = document.querySelectorAll('.support-form label');
    supportLabels[0].textContent = '件名';
    supportLabels[1].textContent = 'カテゴリ';
    supportLabels[2].textContent = 'メッセージ';
    
    const supportPlaceholders = document.querySelectorAll('.support-form input, .support-form textarea, .support-form select');
    supportPlaceholders[0].placeholder = '問題の件名';
    supportPlaceholders[2].placeholder = '問題を詳細に説明してください';
    
    const supportOptions = document.querySelectorAll('.support-form option');
    supportOptions[0].textContent = 'カテゴリを選択';
    supportOptions[1].textContent = '技術的な問題';
    supportOptions[2].textContent = '請求と支払い';
    supportOptions[3].textContent = 'アカウントの問題';
    supportOptions[4].textContent = 'その他';
    
    document.querySelector('.support-form .btn').textContent = '送信';
    
    // Profil bölümü
    document.querySelector('#profile-page .section-title h2').textContent = 'プロフィール情報';
    document.querySelector('#profile-page .section-title p').textContent = 'アカウント情報を表示および管理します。';
    
    // Abonelik bölümü
    document.querySelector('#subscription-page .section-title h2').textContent = 'サブスクリプション管理';
    document.querySelector('#subscription-page .section-title p').textContent = 'サブスクリプションプランを表示および管理します。';
    
    // İndirme geçmişi bölümü
    document.querySelector('#downloads-page .section-title h2').textContent = 'ダウンロード履歴';
    document.querySelector('#downloads-page .section-title p').textContent = '以前にダウンロードしたファイルのリスト。';
    
    // Giriş modalı
    document.querySelector('#loginModal h2').textContent = 'ログイン';
    const loginLabels = document.querySelectorAll('#loginForm label');
    loginLabels[0].textContent = 'メールアドレス';
    loginLabels[1].textContent = 'パスワード';
    
    const loginPlaceholders = document.querySelectorAll('#loginForm input');
    loginPlaceholders[0].placeholder = 'あなたのメールアドレス';
    loginPlaceholders[1].placeholder = 'あなたのパスワード';
    
    document.querySelector('#loginForm .form-check label').textContent = 'ログイン状態を保持する';
    document.querySelector('.forgot-password').textContent = 'パスワードをお忘れですか？';
    document.querySelector('#loginForm .btn').textContent = 'ログイン';
    document.querySelector('.auth-divider span').textContent = 'または';
    
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons[0].innerHTML = '<i class="fab fa-google"></i> Googleでログイン';
    socialButtons[1].innerHTML = '<i class="fab fa-discord"></i> Discordでログイン';
    
    // Kayıt modalı
    document.querySelector('#registerModal h2').textContent = '登録';
    const registerLabels = document.querySelectorAll('#registerForm label');
    registerLabels[0].textContent = 'ユーザー名';
    registerLabels[1].textContent = 'メールアドレス';
    registerLabels[2].textContent = 'パスワード';
    registerLabels[3].textContent = 'パスワードの確認';
    
    const registerPlaceholders = document.querySelectorAll('#registerForm input');
    registerPlaceholders[0].placeholder = 'あなたのユーザー名';
    registerPlaceholders[1].placeholder = 'あなたのメールアドレス';
    registerPlaceholders[2].placeholder = 'あなたのパスワード';
    registerPlaceholders[3].placeholder = 'パスワードを確認してください';
    
    document.querySelector('#registerForm .form-check label').textContent = '利用規約とプライバシーポリシーに同意します';
    document.querySelector('#registerForm .btn').textContent = '登録';
}

// Kullanıcı giriş durumunu kontrol et
function checkLoginStatus(isLoggedIn, userData = null) {
    const userLoginBtn = document.getElementById('userLoginBtn');
    const userRegisterBtn = document.getElementById('userRegisterBtn');
    const userMenu = document.querySelector('.user-menu');
    const usernameSpan = document.querySelector('.username');
    const downloadButtons = document.querySelectorAll('.download-btn');
    const supportForm = document.getElementById('supportForm');
    const supportInputs = supportForm.querySelectorAll('input, select, textarea, button');
    const downloadNotice = document.querySelector('.download-notice');
    const supportNotice = document.querySelector('.support-notice');
    const downloadLinks = document.querySelectorAll('.download-link');
    
    if (isLoggedIn && userData) {
        // Kullanıcı giriş yapmış
        if (userLoginBtn) userLoginBtn.style.display = 'none';
        if (userRegisterBtn) userRegisterBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (usernameSpan) usernameSpan.textContent = userData.username;
        
        // İndirme butonlarını etkinleştir
        downloadButtons.forEach(btn => {
            btn.disabled = false;
        });
        
        // Destek formunu etkinleştir
        supportInputs.forEach(input => {
            input.disabled = false;
        });
        
        // Bildirimleri gizle
        if (downloadNotice) downloadNotice.style.display = 'none';
        if (supportNotice) supportNotice.style.display = 'none';
        
        // İndirme linklerini göster
        downloadLinks.forEach(link => {
            link.style.display = 'flex';
        });
    } else {
        // Kullanıcı giriş yapmamış
        if (userLoginBtn) userLoginBtn.style.display = 'block';
        if (userRegisterBtn) userRegisterBtn.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
        
        // İndirme butonlarını devre dışı bırak
        downloadButtons.forEach(btn => {
            btn.disabled = true;
        });
        
        // Destek formunu devre dışı bırak
        supportInputs.forEach(input => {
            input.disabled = true;
        });
        
        // Bildirimleri göster
        if (downloadNotice) downloadNotice.style.display = 'flex';
        if (supportNotice) supportNotice.style.display = 'flex';
        
        // Eğer şu an indirme sayfasındaysa ana sayfaya yönlendir
        const currentPage = document.querySelector('.page.active');
        if (currentPage && currentPage.id === 'download-page') {
            changePage('home');
            
            // Aktif menü öğesini güncelle
            const navLinks = document.querySelectorAll('.sidebar-nav a');
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
                if (navLink.getAttribute('data-page') === 'home') {
                    navLink.classList.add('active');
                }
            });
        }
    }
}

// Kart numarası formatlama
function formatCardNumber(e) {
    let input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    // Boşluk ekleme
    if (value.length > 0) {
        value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    
    input.value = value;
}

// Son kullanma tarihi formatlama
function formatExpiryDate(e) {
    let input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    
    input.value = value;
}

// Ödeme işleme
function processPayment() {
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('cardName').value;
    const saveCard = document.getElementById('saveCard').checked;
    const user = auth.currentUser;
    
    if (!user) {
        alert('Ödeme yapmak için giriş yapmalısınız!');
        return;
    }
    
    // Basit doğrulama
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }
    
    if (cardNumber.replace(/\s/g, '').length !== 16) {
        alert('Geçerli bir kart numarası girin.');
        return;
    }
    
    if (cvv.length !== 3) {
        alert('Geçerli bir CVV numarası girin.');
        return;
    }
    
    // Ödeme başarılı mesajı
    alert('Ödeme başarıyla tamamlandı! PLUTO üyeliğiniz aktif edildi.');
    
    // Formu temizle
    document.getElementById('paymentForm').reset();
}

// Modal açma fonksiyonu
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Modal kapatma fonksiyonu
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}
