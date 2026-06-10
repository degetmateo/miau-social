import publicationsRepositoryGet from "./publications.repository.get";
import publicationRepositoryPost from "./publications.repository.post";
import publicationsRepositoryGetThread from "./publications.repository.get.thread";

export const publicationsRepository = {
    get: publicationsRepositoryGet,
    post: publicationRepositoryPost,
    getThread: publicationsRepositoryGetThread
};