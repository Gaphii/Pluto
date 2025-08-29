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
});

// Dil değiştirme fonksiyonu
function changeLanguage(lang) {
    const languageBtn = document.querySelector('.language-btn');
    
    // Dil butonunu güncelle
    switch(lang) {
        case 'tr':
            languageBtn.innerHTML = '<i class="fas fa-globe"></i> Türkçe <i class="fas fa-chevron-down"></i>';
            break;
        case 'en':
            languageBtn.innerHTML = '<i class="fas fa-globe"></i> English <i class="fas fa-chevron-down"></i>';
            break;
        case 'ru':
            languageBtn.innerHTML = '<i class="fas fa-globe"></i> Русский <i class="fas fa-chevron-down"></i>';
            break;
        case 'jp':
            languageBtn.innerHTML = '<i class="fas fa-globe"></i> 日本語 <i class="fas fa-chevron-down"></i>';
            break;
    }
    
    // Burada gerçek bir uygulamada API çağrısı yapılır veya dil dosyaları yüklenir
    // Örnek olarak sadece bir alert gösteriyoruz
    alert(`Dil ${lang} olarak değiştirildi! Gerçek bir uygulamada tüm içerik çevrilmiş olacaktır.`);
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

// Sayfa yüklendiğinde animasyonlar
window.addEventListener('load', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    // Özellik kartlarına animasyon ekle
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * index);
    });
    
    // Fiyatlandırma kartlarına animasyon ekle
    pricingCards.forEach((card, index) => {
        card.style.opacity = '0';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease';
            card.style.opacity = '1';
        }, 300 + (200 * index));
    });
});