// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Configure Toastr
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    timeOut: 5000
};

// Load common elements dynamically
function loadCommonElements() {
    // Load header
    fetch('templates/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('dynamic-header').innerHTML = data;
            setupHeaderEvents();
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch('templates/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('dynamic-footer').innerHTML = data;
            setupFooterEvents();
        })
        .catch(error => console.error('Error loading footer:', error));

    // Load dynamic message
    fetch('templates/message.html')
        .then(response => response.text())
        .then(data => {
            const messageContainer = document.getElementById('dynamic-message');
            messageContainer.innerHTML = data;
            setupMessageEvents();
            
            // Show message only if it has content
            if (messageContainer.textContent.trim() !== '') {
                messageContainer.style.display = 'block';
            }
        })
        .catch(error => console.error('Error loading message:', error));
}

// Setup message events
function setupMessageEvents() {
    const messageContainer = document.getElementById('dynamic-message');
    const closeBtn = messageContainer.querySelector('.close-message');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            messageContainer.style.display = 'none';
            // Optionally set a cookie to remember the dismissal
            document.cookie = "messageDismissed=true; max-age=86400"; // 1 day
        });
    }
}

// Check if message was dismissed
function checkMessageDismissed() {
    const cookies = document.cookie.split(';').map(c => c.trim());
    return cookies.includes('messageDismissed=true');
}

// Setup header events
function setupHeaderEvents() {
    // Toggle download button
    const toggleBtn = document.getElementById('toggle-download-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const enabled = this.textContent.includes('Enable');
            this.textContent = enabled ? 'Disable Download' : 'Enable Download';
            toastr.success(`Downloads ${enabled ? 'enabled' : 'disabled'}`);
        });
    }
}

// Setup footer events
function setupFooterEvents() {
    // Back to top button
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

// Initialize Lightbox
function initLightbox() {
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'alwaysShowNavOnTouchDevices': true
    });
}

// Initialize the page
function init() {
    loadCommonElements();
    initLightbox();
    
    // Only show welcome message if not coming from a refresh
    if (performance.navigation.type !== 1) {
        toastr.success('Welcome to MovieHai!', 'Enjoy the movie');
    }
}

// Start the application
init();