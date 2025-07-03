function replaceShortcodes() {
    const shortcodes = {
        sgt:  { name: 'GDTOT', regex: /\[fd id='(.*?)'\]/g,  url: 'https://red.moviehai.icu/file/' },
        egt: { name: 'GDTOT', regex: /\[egt id='(.*?)'\]/g, url: 'https://new17.gdtot.dad/file/' },
    };

    // Select elements with any of the target classes
    const contentContainers = document.querySelectorAll('.download-links, .single-links, .zip-links');

    contentContainers.forEach(contentContainer => {
        let content = contentContainer.innerHTML;
        for (const key in shortcodes) {
            if (shortcodes.hasOwnProperty(key)) {
                content = content.replace(shortcodes[key].regex, (match, id) => {
                    return `<a href='${shortcodes[key].url}${id}' target='_blank' class="f-links">
                                ${shortcodes[key].name}
                            </a>`;
                });
            }
        }
        contentContainer.innerHTML = content;
    });
}

document.addEventListener('DOMContentLoaded', replaceShortcodes);
