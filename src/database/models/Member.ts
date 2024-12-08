export type Member = {
    id_member: number;
    name_member: string;
    username_member: string;
    bio_member: string;
    password_member: string;
    token_member: string;
    date_creation_member: Date;
    icon_url: string;
    banner_url: string;
    role_member: Role;
}

export type Role = 'member' | 'tester' | 'mod' | 'admin';