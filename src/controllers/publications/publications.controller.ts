import publicationsControllerAdminRemove from "./publications.controller.admin.remove";
import publicationsControllerGet from "./publications.controller.get";
import publicationsControllerPost from "./publications.controller.post";
import publicationsControllerRemove from "./publications.controller.remove";

export const publicationsController = {
    get: publicationsControllerGet,
    post: publicationsControllerPost,
    remove: publicationsControllerRemove,
    adminRemove: publicationsControllerAdminRemove
};