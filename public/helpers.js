import router from "./router.js";

export const importCSS = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

export const importJS = (href) => {
    const script = document.createElement('script');
    script.src = href;
    document.head.appendChild(script);
}

export async function loadImage (url) {
    return new Promise(async (resolve, reject) => {
        const image = new Image();

        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', () => reject(new Error('No se pudo cargar la imagen.')));

        image.src = url;
    });
}

export function formatContent (content) {
    if (!content) return document.createElement("span");

    const baseDomain = window.location.origin;
    const container = document.createElement("span");

    const escapeHTML = (text) =>
        text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    const lines = content.split("\n");

    lines.forEach((line, lineIndex) => {
        const words = line.split(/\s+/);

        words.forEach((word, wordIndex) => {
            let element;

            if (/^(https?:\/\/[^\s]+)$/.test(word)) {
                if (word.startsWith(baseDomain)) {
                    element = document.createElement("span");
                    element.classList.add("link", "internal-link");
                    element.textContent = word;
                    element.style.cursor = "pointer";

                    element.onclick = (e) => {
                        e.stopPropagation();
                        router.navigateTo(word.replace(baseDomain, ""));
                    };
                } else {
                    element = document.createElement("a");
                    element.classList.add("link");
                    element.href = word;
                    element.target = "_blank";
                    element.textContent = word;
                }
            } else {
                element = document.createElement('span');
                element.innerHTML = escapeHTML(word);
            }

            container.append(element);

            if (wordIndex < words.length - 1) {
                container.append(document.createTextNode(" "));
            }
        });

        if (lineIndex < lines.length - 1) {
            container.append(document.createElement("br"));
        }
    });

    return container;
}

export function cleanContent (content) {
    const escapedText = content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    return escapedText.replace(/\n/g, '<br>').trim();   
}

export function formatContent2 (content) {
    const baseDomain = window.location.origin;
    const container = document.createElement("span");
    
    if (!content) return container;

    content = content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    content = content.replace(/\n/g, '<br>').trim();   

    const parts = content.trim().split(/\s+/); 

    parts.forEach((part, index) => {
        let element;

        if (/^(https?:\/\/[^\s]+)$/.test(part)) {
            if (part.startsWith(baseDomain)) {
                element = document.createElement("span");
                element.classList.add("link", "internal-link");
                element.textContent = part;
                element.style.cursor = "pointer";

                element.onclick = (e) => {
                    e.stopPropagation();
                    router.navigateTo(part.replace(baseDomain, ""));
                };
            } else {
                element = document.createElement("a");
                element.classList.add("link");
                element.href = part;
                element.target = "_blank";
                element.textContent = part;
            }
        } else {
            element = document.createTextNode(part);
        }

        container.appendChild(element);

        if (index < parts.length - 1) {
            container.appendChild(document.createTextNode(" "));
        }
    });

    return container;
}

export function shortenLink(url, maxLength = 20) {
    if (!url) return '';
    let cleanedUrl = url.replace(/^https?:\/\//, '');

    if (cleanedUrl.length > maxLength) {
        cleanedUrl = cleanedUrl.substring(0, maxLength) + '...';
    }

    return cleanedUrl;
}

export function dataURLToBlob (dataURL) {
    const [header, base64Data] = dataURL.split(',');
    const mimeType = header.match(/:(.*?);/)[1]

    const binaryData = atob(base64Data);
    const arrayBuffer = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
        arrayBuffer[i] = binaryData.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeType });
}

export function ScrollBottom (element, func) {
    element.onscroll = () => {
        const SCROLL_HEIGHT = element.scrollHeight;
        const CLIENT_HEIGHT = element.clientHeight;
        const SCROLL = element.scrollTop;
        const LIMIT = 1;

        if (Math.ceil(SCROLL + CLIENT_HEIGHT) >= Math.ceil(SCROLL_HEIGHT - LIMIT)) func();
    }
}

export function Scroll (data = {
    element: null,
    top: () => {},
    scroll: () => {},
    bottom: () => {},
    bottom_limit: 1
}) {
    data.element.onscroll = () => {
        const SCROLL_HEIGHT = data.element.scrollHeight;
        const CLIENT_HEIGHT = data.element.clientHeight;
        const SCROLL = data.element.scrollTop;
        const LIMIT = 1;
        const BOTTOM_LIMIT = data.bottom_limit || 1;
    
        if (data.top && SCROLL <= LIMIT) data.top();
        if (data.scroll) data.scroll(SCROLL);
        if (data.bottom && Math.ceil(SCROLL + CLIENT_HEIGHT) >= Math.ceil(SCROLL_HEIGHT - BOTTOM_LIMIT)) data.bottom();
    }
}


export function getTimeElapsedSince (date) {
    const now = new Date();
    const dif = now - date;
    const seconds = Math.floor(dif / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    // if (years > 0) return `hace ${years} ${years === 1 ? 'año' : 'años'}`;
    // if (months > 0) return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
    // if (days > 0) return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
    // if (hours > 0) return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    // if (minutes > 0) return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    // if (seconds <= 30) return `ahora`;
    // return `hace ${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`;

    if (years > 0) return `${years}a`;
    if (months > 0) return `${months}m`;
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}min`;
    if (seconds <= 30) return `ahora`;
    return `${seconds}s`;
}

export function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}