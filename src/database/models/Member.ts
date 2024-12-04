export type Member = {
    id_member: number;
    name_member: string;
    username_member: string;
    bio_member: string;
    password_member: string;
    token_member: string;
    date_creation_member: Date;
    profile_pic_url_member: string;
    banner_url_member: string;
    role_member: Role;
}

export type Role = 'member' | 'tester' | 'mod' | 'admin';