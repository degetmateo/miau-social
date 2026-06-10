import { followRepository } from "../database/repository/followRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";

const follow = async (data: {
    id_member_follower: string;
    id_member_followed: string;
}) => {
    if (data.id_member_followed == data.id_member_follower) throw new InvalidArgumentError("No puedes seguirte a ti mismo.");

    const response = await followRepository.follow(data);
    return response;
}

const unfollow = async (data: {
    id_member_follower: string;
    id_member_followed: string;
}) => {
    if (data.id_member_followed == data.id_member_follower) throw new InvalidArgumentError("No puedes dejar de seguirte a ti mismo.");

    const response = await followRepository.unfollow(data);
    return response;
}

const get = async (data: {
    username: string;
    type: 'followed' | 'followers';
    offset: number;
}) => {
    if (!data.username) throw new InvalidArgumentError("Username must be especified.");
    if (!['followed', 'followers'].includes(data.type)) throw new InvalidArgumentError("Type is invalid.")
    if (!data.offset || isNaN(data.offset) || data.offset <= 0) data.offset = 0;
    const response = data.type === 'followers' ?
        await followRepository.getFollowers(data) :
        await followRepository.getFollowed(data);

    return response;
}

const getRandomFollowers = async (data: {
    member: any;
}) => {
    return await followRepository.getRandomFollowers(data);
};

export const followService = {
    follow,
    unfollow,
    get,
    getRandomFollowers
}