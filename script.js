// Dil değiştirme işlevi
document.addEventListener('DOMContentLoaded', function() {
    // Tüm tıklama olaylarını dinle
    document.addEventListener('click', function(e) {
        // Sayfa değiştirme linkleri
        if (e.target.matches('[data-page]') || e.target.closest('[data-page]')) {
            e.preventDefault();
            const targetElement = e.target.matches('[data-page]') ? e.target : e.target.closest('[data-page]');
            const targetPage = targetElement.getAttribute('data-page');
            changePage(targetPage);
            
            // Aktif menü öğesini güncelle
            const navLinks = document.querySelectorAll('.sidebar-nav a');
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
                if (navLink.getAttribute('data-page') === targetPage) {
                    navLink.classList.add('active');
                }
            });
        }
        
        // Dil değiştirme linkleri
        if (e.target.matches('[data-lang]') || e.target.closest('[data-lang]')) {
            e.preventDefault();
            const targetElement = e.target.matches('[data-lang]') ? e.target : e.target.closest('[data-lang]');
            const lang = targetElement.getAttribute('data-lang');
            changeLanguage(lang);
        }
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
    
    // Sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
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
    checkLoginStatus();
});

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
            const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            if (!isLoggedIn) {
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
    
    // Basit doğrulama
    if (!subject || !category || !message) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }
    
    // Burada gerçek bir uygulamada API çağrısı yapılır
    // Şimdilik simüle ediyoruz
    
    alert('Destek talebiniz başarıyla gönderildi! En kısa sürede dönüş yapacağız.');
    
    // Formu temizle
    document.getElementById('supportForm').reset();
}

// Dosya indirme işlemi
function downloadFile(button) {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Dosya indirmek için giriş yapmalısınız!');
        openModal(document.getElementById('loginModal'));
        return;
    }
    
    const fileName = button.closest('.download-item').querySelector('h3').textContent;
    
    // Burada gerçek bir uygulamada dosya indirme işlemi yapılır
    // Şimdilik simüle ediyoruz
    
    alert(`${fileName} indiriliyor...\n\nGerçek bir uygulamada dosya indirme işlemi başlayacaktır.`);
    
    // İndirme simülasyonu
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> İndiriliyor...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-download"></i> İndirildi';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-download"></i> İndir';
            button.disabled = false;
        }, 2000);
    }, 1500);
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
    const userMenuItems = document.querySelectorAll('.user-dropdown a');
    if (userMenuItems.length >= 4) {
        userMenuItems[0].innerHTML = '<i class="fas fa-user"></i> Profil';
        userMenuItems[1].innerHTML = '<i class="fas fa-crown"></i> Abonelik';
        userMenuItems[2].innerHTML = '<i class="fas fa-download"></i> İndirmeler';
        userMenuItems[3].innerHTML = '<i class="fas fa-sign-out-alt"></i> Çıkış Yap';
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
    featureTexts[1].textContent = 'Yayın yapmayı mı seviyorsunuz? Video kaydetmeyi mi? Ürünlerimizle içerik üretebilir và görünmez olabilirsiniz.';
    
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
    const userMenuItems = document.querySelectorAll('.user-dropdown a');
    if (userMenuItems.length >= 4) {
        userMenuItems[0].innerHTML = '<i class="fas fa-user"></i> Profile';
        userMenuItems[1].innerHTML = '<i class="fas fa-crown"></i> Subscription';
        userMenuItems[2].innerHTML = '<i class="fas fa-download"></i> Downloads';
        userMenuItems[3].innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
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
    }
}
