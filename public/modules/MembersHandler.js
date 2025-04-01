class MembersHandler {
    constructor () {
        this.members = [];
    }

    add (member) {
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i].id === member.id) {
                this.members[i] = member;
                break;
            }
        }

        this.members.push(member);
    }

    remove (member) {
        this.members = this.members.filter(m => m.id != member.id);
    }

    find (username) {
        return this.members.find(m => m.username === username);
    }
}

export default new MembersHandler();