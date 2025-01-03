export const importCSS = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

export async function loadImage (url) {
    return new Promise(async (resolve, reject) => {
        const image = new Image();

        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', () => reject(new Error('No se pudo cargar la imagen.')));

        image.src = url;
    });
}

export function cleanContent (content) {
    const escapedText = content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const clickableText = escapedText.replace(urlPattern, function(url) {
        return `<a href="${url}" class="link" target="_blank">${url}</a>`;
    });

    return clickableText.replace(/\n/g, '<br>').trim();   
}

export function shortenLink(url, maxLength = 20) {
    if (!url) return '';
    let cleanedUrl = url.replace(/^https?:\/\//, '');

    if (cleanedUrl.length > maxLength) {
        cleanedUrl = cleanedUrl.substring(0, maxLength) + '...';
    }

    return cleanedUrl;
}