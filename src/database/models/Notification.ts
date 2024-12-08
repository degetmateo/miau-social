export type Notification = {
    id: number;
    id_member: number;
    date: Date;
    type: TypeNotification;
    id_post_target: number;
    id_member_target: number;
    status: StatusNotification;
}

export type TypeNotification = 'upvote' | 'comment' | 'follow';

export type StatusNotification = 'pending' | 'seen';