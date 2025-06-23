import Helper from "../../Helper.js";

Helper.ImportCSS('/public/components/member-role/member-role.css');

class MemberRole extends HTMLElement {
    constructor (data) {
        super();
        this.classList.add('member-role', 'member-role-'+data.role);
        this.roleText = document.createElement('span');
        this.roleText.textContent = data.text;
        this.append(this.roleText);
    };
};

customElements.define('member-role', MemberRole);
export default MemberRole;