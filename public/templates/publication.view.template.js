import Aside from "../components/aside/Aside.js";
import Header from "../components/header/Header.js";

const header = new Header({ text: 'Publicación' });
header.setAttribute('id', 'publication-header');

const aside = new Aside();
aside.setAttribute('id', 'publication-aside');

export default () => {
    return `
        <div id="nav-container" class="publication-nav-container"></div>

        <div class="publication-main">
            <div id="header-container"></div>

            <div>
                <div id="thread-container"></div>
                <div>
                    <div id="thread-container"></div>
                    <div id="publication-container"></div>
                    <div id="creator-container"></div>
                </div>
                <div id="replies-container"></div>
            </div>
        </div>

        <div id="aside-container"></div>
    `;
};