// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize libraries with existence checks
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }

    if (typeof toastr !== 'undefined') {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-right",
            timeOut: 5000
        };
    }

    // Load common elements
    loadCommonElements();
    
    // Initialize other components
    setupBackToTop();
    
    // Show welcome message if not a refresh
    if (performance.navigation && performance.navigation.type !== 1 && typeof toastr !== 'undefined') {
        toastr.success('Welcome to MovieHai!', 'Enjoy the movie');
    }
});

function loadCommonElements() {
    // Load header if element exists
    const headerElement = document.getElementById('dynamic-header');
    if (headerElement) {
        fetch('/templates/header.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                headerElement.innerHTML = data;
                setupHeaderEvents();
            })
            .catch(error => {
                console.error('Error loading header:', error);
                // Fallback content remains
            });
    }

    // Load footer if element exists
    const footerElement = document.getElementById('dynamic-footer');
    if (footerElement) {
        fetch('/templates/footer.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                footerElement.innerHTML = data;
                setupFooterEvents();
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                // Fallback content remains
            });
    }

    // Load message if element exists
    const messageElement = document.getElementById('dynamic-message');
    if (messageElement) {
        fetch('/templates/message.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                messageElement.innerHTML = data;
                setupMessageEvents();
                if (messageElement.textContent.trim() !== '') {
                    messageElement.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error loading message:', error);
                messageElement.style.display = 'none';
            });
    }
}

function setupHeaderEvents() {
    const toggleBtn = document.getElementById('toggle-download-btn');
    if (toggleBtn && typeof toastr !== 'undefined') {
        toggleBtn.addEventListener('click', function() {
            const enabled = this.textContent.includes('Enable');
            this.textContent = enabled ? 'Disable Download' : 'Enable Download';
            toastr.success(`Downloads ${enabled ? 'enabled' : 'disabled'}`);
        });
    }
}

function setupFooterEvents() {
    // Footer specific events can be added here
}

function setupMessageEvents() {
    const messageContainer = document.getElementById('dynamic-message');
    if (!messageContainer) return;

    const closeBtn = messageContainer.querySelector('.close-message');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            messageContainer.style.display = 'none';
            document.cookie = "messageDismissed=true; max-age=86400"; // 1 day
        });
    }
}

function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function initLightbox() {
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'alwaysShowNavOnTouchDevices': true
        });
    }
}