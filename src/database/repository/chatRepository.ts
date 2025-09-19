import { Get } from "./chat/Get";
import { Post } from "./chat/Post";

export const chatRepository = {
    post: Post,
    get: Get
};