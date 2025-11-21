function replaceShortcodes() {
    const shortcodes = {
        sgt: { name: 'DOWNLOAD', regex: /\[sgt id='(.*?)'\]/g, url: 'https://red.moviehai.icu/file/'},
        gdf: { name: 'GDFLIX', regex: /\[gdf id='(.*?)'\]/g, url: 'https://new9.gdflix.net/file/'},
        fpd: { name: 'FILEPRESS', regex: /\[fpd id='(.*?)'\]/g, url: 'https://new1.filepress.cloud/file/'},
        apd: { name: 'APPDRIVE', regex: /\[apd id='(.*?)'\]/g, url: 'https://appdrive.life/file/'}
    };

    const contentContainers = document.querySelectorAll('.download-links, .single-links, .zip-links');

    contentContainers.forEach(contentContainer => {
        const linkContainers = contentContainer.querySelectorAll('.link-container');
        
        linkContainers.forEach(linkContainer => {
            const h2Element = linkContainer.querySelector('h2');
            let content = h2Element.innerHTML;
            
            for (const key in shortcodes) {
                if (shortcodes.hasOwnProperty(key)) {
                    content = content.replace(shortcodes[key].regex, (match, id) => {
                        return `<a href='${shortcodes[key].url}${id}' target='_blank' class="f-links">
                                    ${shortcodes[key].name}
                                </a>`;
                    });
                }
            }
            
            h2Element.innerHTML = content;
            
            // Add data-size attribute for file size display
            const h4Element = linkContainer.querySelector('h4');
            const sizeMatch = h4Element.textContent.match(/\[(\d+\.?\d*\s*(MB|GB))\]/);
            if (sizeMatch) {
                h4Element.setAttribute('data-size', sizeMatch[1]);
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', replaceShortcodes);

// Also initialize when new content is added dynamically
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            replaceShortcodes();
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
