import router from "./router.js";

class Helper {
    ImportCSS (href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    };

    Format (content) {
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
    };
};

export default new Helper();