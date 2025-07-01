const sheetAPI = "https://script.google.com/macros/s/AKfycbyf1Zqv_3d0CxTGNSslfwwFwORukwFatY-MucQeg2EucPGst1rbbwiuTH2N16-V7LIN/exec";
let currentPage = 1;
const commentsPerPage = 5; // Number of comments per page
let allComments = [];

// Initialize comment system when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadComments();
    
    // Set up submit button
    const submitBtn = document.querySelector('#comment-section button');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitComment);
    }
});

function showStatus(message, type = "info", duration = 3000) {
    const msgBox = document.getElementById("status-message");
    if (!msgBox) return;
    
    msgBox.textContent = message;
    msgBox.className = type;
    msgBox.style.display = "block";
    
    if (duration > 0) {
        setTimeout(() => {
            msgBox.style.display = "none";
        }, duration);
    }
}

function submitComment() {
    const commentBox = document.getElementById("comment-input");
    if (!commentBox) return;
    
    const comment = commentBox.value.trim();
    if (!comment) {
        showStatus("Please enter a comment before submitting", "error");
        return;
    }

    showStatus("Submitting your comment...", "loading");
    
    // Get current page URL without hash or query parameters
    const currentUrl = window.location.href.split('#')[0].split('?')[0];
    
    const data = {
        url: currentUrl, // Store the clean URL
        comment: comment,
        timestamp: new Date().toISOString()
    };

    fetch(sheetAPI, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(() => {
        commentBox.value = "";
        showStatus("Comment submitted successfully!", "success");
        // Reload comments after submission
        loadComments();
    })
    .catch(() => {
        showStatus("Failed to submit comment. Please try again.", "error", 5000);
    });
}

function loadComments() {
    const commentList = document.getElementById("comment-list");
    if (!commentList) return;
    
    commentList.innerHTML = "<div class='loading'>Loading comments...</div>";
    
    fetch(sheetAPI)
        .then(response => response.json())
        .then(data => {
            // Get current page URL without hash or query parameters
            const currentUrl = window.location.href.split('#')[0].split('?')[0];
            
            // Filter comments for EXACT current page URL only
            allComments = data.filter(item => {
                // Compare clean URLs (without hash/query params)
                const commentUrl = item.url ? item.url.split('#')[0].split('?')[0] : '';
                return commentUrl === currentUrl;
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Newest first
            
            displayComments();
        })
        .catch(() => {
            commentList.innerHTML = "<div class='error'>Error loading comments. Please refresh the page.</div>";
        });
}

function displayComments() {
    const commentList = document.getElementById("comment-list");
    const pagination = document.getElementById("pagination");
    if (!commentList || !pagination) return;
    
    if (allComments.length === 0) {
        commentList.innerHTML = "<div class='empty'>No comments yet. Be the first to comment!</div>";
        pagination.style.display = "none";
        return;
    }
    
    const start = (currentPage - 1) * commentsPerPage;
    const end = start + commentsPerPage;
    const pageComments = allComments.slice(start, end);
    
    commentList.innerHTML = '';
    pageComments.forEach(comment => {
        const commentEl = document.createElement('div');
        commentEl.className = 'comment';
        commentEl.innerHTML = `
            <p>${comment.comment || 'No comment text'}</p>
            <small>Posted on ${formatDate(comment.timestamp)}</small>
        `;
        commentList.appendChild(commentEl);
    });
    
    // Update pagination buttons
    updatePagination();
}

function formatDate(timestamp) {
    if (!timestamp) return "unknown date";
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function updatePagination() {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;
    
    const totalPages = Math.ceil(allComments.length / commentsPerPage);
    const prevBtn = pagination.querySelector("button:first-child");
    const nextBtn = pagination.querySelector("button:last-child");
    
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
    
    // Show pagination only if needed
    pagination.style.display = allComments.length > commentsPerPage ? "flex" : "none";
}

function nextPage() {
    const totalPages = Math.ceil(allComments.length / commentsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayComments();
        scrollToComments();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayComments();
        scrollToComments();
    }
}

function scrollToComments() {
    const commentSection = document.getElementById("comment-section");
    if (commentSection) {
        window.scrollTo({
            top: commentSection.offsetTop - 20,
            behavior: 'smooth'
        });
    }
}