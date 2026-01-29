// 카운트다운 타이머
function updateCountdown() {
    // 이벤트 날짜: 2026년 2월 15일 14:00
    const eventDate = new Date('2026-02-15T14:00:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        document.getElementById('countdown').textContent = '마감되었습니다';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // 날짜 포맷팅
    let countdownText = '';
    if (days > 0) {
        countdownText = `${days}일 ${hours}시간`;
    } else if (hours > 0) {
        countdownText = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        countdownText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    document.getElementById('countdown').textContent = countdownText;
}

// 1초마다 카운트다운 업데이트
setInterval(updateCountdown, 1000);
updateCountdown();

// 스무스 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 전화번호 자동 포맷팅
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 3) {
        e.target.value = value;
    } else if (value.length <= 7) {
        e.target.value = value.slice(0, 3) + '-' + value.slice(3);
    } else {
        e.target.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
    }
});

// 폼 제출 처리
const applicationForm = document.getElementById('applicationForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

applicationForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // 폼 데이터 수집
    const formData = {
        parentName: document.getElementById('parentName').value.trim(),
        childName: document.getElementById('childName').value.trim(),
        childAge: document.getElementById('childAge').value,
        attendees: document.getElementById('attendees').value,
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim(),
        submittedAt: new Date().toISOString()
    };

    // 유효성 검사
    if (!formData.parentName || !formData.childName || !formData.childAge || 
        !formData.attendees || !formData.phone) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
    }

    if (!document.getElementById('agree').checked) {
        alert('개인정보 수집 및 이용에 동의해주세요.');
        return;
    }

    // 전화번호 형식 검증
    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
        alert('올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)');
        return;
    }

    // 로딩 상태 표시
    const submitButton = applicationForm.querySelector('.submit-button');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 제출 중...';
    submitButton.disabled = true;

    try {
        // API로 데이터 전송
        const response = await fetch('tables/fan_meeting_applications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // 성공 메시지 표시
            applicationForm.style.display = 'none';
            successMessage.style.display = 'block';
            
            // 페이지 상단으로 스크롤
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 5초 후 폼 초기화
            setTimeout(() => {
                applicationForm.reset();
                applicationForm.style.display = 'block';
                successMessage.style.display = 'none';
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }, 5000);
        } else {
            throw new Error('서버 응답 오류');
        }
    } catch (error) {
        console.error('Error:', error);
        
        // 에러 메시지 표시
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);

        // 버튼 복원
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }
});

// 스크롤 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 애니메이션 대상 요소 설정
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.gallery-item, .info-card, .prize-box');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// 이미지 로딩 최적화
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // 브라우저가 lazy loading을 지원하는 경우
        images.forEach(img => {
            img.src = img.src;
        });
    } else {
        // 지원하지 않는 경우 polyfill 사용
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
});

// 신청 현황 실시간 업데이트 (선택사항)
async function updateApplicationCount() {
    try {
        const response = await fetch('tables/fan_meeting_applications?limit=1');
        const data = await response.json();
        
        if (data.total !== undefined) {
            const remaining = Math.max(0, 100 - data.total);
            const statNumber = document.querySelector('.stat-number');
            if (statNumber && statNumber.textContent !== '마감되었습니다') {
                statNumber.textContent = remaining;
                
                if (remaining === 0) {
                    statNumber.textContent = '마감';
                    document.querySelector('.cta-button').style.opacity = '0.5';
                    document.querySelector('.cta-button').style.pointerEvents = 'none';
                }
            }
        }
    } catch (error) {
        console.log('신청 현황 업데이트 실패:', error);
    }
}

// 페이지 로드 시 및 30초마다 신청 현황 업데이트
updateApplicationCount();
setInterval(updateApplicationCount, 30000);
