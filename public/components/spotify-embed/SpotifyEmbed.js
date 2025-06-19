import Helper from "../../Helper.js";

Helper.ImportCSS('/public/components/spotify-embed/spotify-embed.css');

class SpotifyEmbed extends HTMLElement {
    constructor () {
        super();
    };
};

customElements.define('spotify-embed', SpotifyEmbed);
export default SpotifyEmbed;