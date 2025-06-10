import { importCSS } from "../../helpers.js";
importCSS('/public/components/member-badge/member-badge.css');

class MemberBadge extends HTMLElement {
    constructor () {
        super();
        
    };
};

customElements.define('member-badge', MemberBadge);
export default MemberBadge;