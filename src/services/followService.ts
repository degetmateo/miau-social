import { followRepository } from "../database/repository/followRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";

const follow = async (data: {
    id_member_follower: number;
    id_member_followed: number;
}) => {
    if (data.id_member_followed <= 0) throw new InvalidArgumentError("La ID del miembro a seguir debe ser positiva.");

    const response = await followRepository.follow(data);
    return response;
}

const unfollow = async (data: {
    id_member_follower: number;
    id_member_followed: number;
}) => {
    if (data.id_member_followed <= 0) throw new InvalidArgumentError("La ID del miembro a dejar de seguir debe ser positiva.");

    const response = await followRepository.unfollow(data);
    return response;
}

export const followService = {
    follow,
    unfollow
}