import GetMembers from "../database/repository/auxiliary/GetMembers";
import { memberRepository } from "../database/repository/memberRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";
import ImgBB from "../helpers/ImgBB";
import Password from "../helpers/Password";
import Validator from "../helpers/Validator";
import { PARAMETERS } from "../static/parameters";

const getByUsername = async (data: {
    id_logged_member: number;
    username: string;
}) => {
    if (!data.username) throw new InvalidArgumentError("Username not found.");
    const response = await memberRepository.getByUsername(data);
    return response;
}

const updateName = async (data: {
    id_member: number;
    name: string;
}) => {
    data.name = data.name + '';
    data.name = data.name.trim();
    
    if (!data.name) throw new InvalidArgumentError("Tenés que escribir tu nuevo nombre.");

    if (data.name.length > PARAMETERS.NAME_MAX_LENGTH) throw new InvalidArgumentError(`Tu nuevo nombre debe tener como máximo ${PARAMETERS.NAME_MAX_LENGTH} carácteres.`);
    if (data.name.length < PARAMETERS.NAME_MIN_LENGTH) throw new InvalidArgumentError(`Tu nuevo nombre debe tener como mínimo ${PARAMETERS.NAME_MIN_LENGTH} carácteres.`);

    const response = await memberRepository.updateName(data);
    return response;
}

const updateUsername = async (data: {
    member: any;
    token: string;
    username: string;
}) => {
    Validator.Username(data.username);
    Validator.Token(data.token);
    return await memberRepository.UpdateUsername(data);
};

const updateBio = async (data: {
    id_member: number;
    bio: string;
}) => {    
    if (data.bio.length > PARAMETERS.BIO_MAX_LENGTH) throw new InvalidArgumentError(`Tu nueva biografia debe tener como máximo ${PARAMETERS.BIO_MAX_LENGTH} carácteres.`);

    const response = await memberRepository.updateBio(data);
    return response;
}

const updatePassword = async (data: {
    member: any;
    token: string;
    password: string;
    new_password: string;
}) => {
    if (!data.password) throw new InvalidArgumentError("Tenés que escribir tu clave anterior.");
    Validator.Password(data.new_password);
    Validator.Token(data.token);
    data.new_password = await Password.hash(data.new_password);
    return await memberRepository.UpdatePassword(data);
};

const updateIconURL = async (data: {
    id_member: number;
    url: string;
}) => {    
    if (!data.url) throw new InvalidArgumentError("Tenés que ingresar el enlace hacia tu imagen.");

    const response = await memberRepository.updateIcon({
        id_member: data.id_member,
        source: 'other',
        url: data.url,
        delete_url: null,
        imgbb_id: null
    });
    
    return response;
}

const updateIconImage = async (data: {
    id_member: number;
    buffer: Express.Multer.File['buffer'];
}) => {
    const apiResponse: {
        data: {
            id: string;
            url: string;
            delete_url: string;
        }
    } = await ImgBB.upload({
        buffer: data.buffer
    });

    const response = await memberRepository.updateIcon({
        id_member: data.id_member,
        url: apiResponse.data.url,
        imgbb_id: apiResponse.data.id,
        delete_url: apiResponse.data.delete_url,
        source: 'imgbb'
    });

    return response;
}

const updateBannerURL = async (data: {
    id_member: number;
    url: string;
}) => {    
    if (!data.url) throw new InvalidArgumentError("Tenés que ingresar el enlace hacia tu imagen.");

    const response = await memberRepository.updateBanner({
        id_member: data.id_member,
        source: 'other',
        url: data.url,
        delete_url: null,
        imgbb_id: null
    });
    
    return response;
}

const updateBannerImage = async (data: {
    id_member: number;
    buffer: Express.Multer.File['buffer'];
}) => {
    const apiResponse: {
        data: {
            id: string;
            url: string;
            delete_url: string;
        }
    } = await ImgBB.upload({
        buffer: data.buffer
    });

    const response = await memberRepository.updateBanner({
        id_member: data.id_member,
        url: apiResponse.data.url,
        imgbb_id: apiResponse.data.id,
        delete_url: apiResponse.data.delete_url,
        source: 'imgbb'
    });

    return response;
}

const updateProfile = async (data: {
    id_member: number;
    name: string;
    bio: string;
    location: string;
    link: string;
    icon: Express.Multer.File['buffer'] | null,
    icon_action: 'none' | 'update' | 'delete';
    banner: Express.Multer.File['buffer'] | null
    banner_action: 'none' | 'update' | 'delete';
}) => {
    if (data.name) data.name = data.name.trim();
    
    if (!data.name || data.name.length <= 0) throw new InvalidArgumentError("Tenés que escribir tu nuevo nombre.");

    if (data.name.length > PARAMETERS.NAME_MAX_LENGTH) throw new InvalidArgumentError(`Tu nuevo nombre debe tener como máximo ${PARAMETERS.NAME_MAX_LENGTH} carácteres.`);
    if (data.name.length < PARAMETERS.NAME_MIN_LENGTH) throw new InvalidArgumentError(`Tu nuevo nombre debe tener como mínimo ${PARAMETERS.NAME_MIN_LENGTH} carácteres.`);

    if (data.bio) data.bio = data.bio.trim();

    if (data.bio && data.bio.length > PARAMETERS.BIO_MAX_LENGTH) throw new InvalidArgumentError(`Tu nueva biografia debe tener como máximo ${PARAMETERS.BIO_MAX_LENGTH} carácteres.`);

    if (data.location) data.location = data.location.trim();

    if (data.location && data.location.length > PARAMETERS.LOCATION_MAX_LENGTH) throw new InvalidArgumentError(`Tu nueva ubicación debe tener como máximo ${PARAMETERS.LOCATION_MAX_LENGTH} carácteres.`);

    if (data.link) data.link = data.link.trim();

    if (data.link && data.link.length > PARAMETERS.LINK_MAX_LENGTH) throw new InvalidArgumentError(`Tu nuevo enlace debe tener como máximo ${PARAMETERS.LINK_MAX_LENGTH} carácteres.`);

    if (!data.icon_action) throw new InvalidArgumentError("ICON_ACTION is missing.");
    if (!data.banner_action) throw new InvalidArgumentError("BANNER_ACTION is missing.");
    const allowedActions = ['none', 'update', 'delete'];
    if (!allowedActions.includes(data.icon_action)) throw new InvalidArgumentError("ICON_ACTION is invalid.");
    if (!allowedActions.includes(data.banner_action)) throw new InvalidArgumentError("BANNER_ACTION is invalid.");

    let apiResponseIcon: any = null;
    if (data.icon_action === 'update' && data.icon) {
        apiResponseIcon = await ImgBB.upload({ buffer: data.icon });
    }

    let apiResponseBanner: any = null;
    if (data.banner_action === 'update' && data.banner) {
        apiResponseBanner = await ImgBB.upload({ buffer: data.banner });
    }

    const response = await memberRepository.updateProfile({
        id_member: data.id_member,
        name: data.name,
        bio: data.bio,
        location: data.location,
        link: data.link,
        icon: apiResponseIcon ? {
            url: apiResponseIcon.data.url,
            imgbb_id: apiResponseIcon.data.id,
            delete_url: apiResponseIcon.data.delete_url,
            source: 'imgbb'
        } : null,
        icon_action: data.icon_action,
        banner: apiResponseBanner ? {
            url: apiResponseBanner.data.url,
            imgbb_id: apiResponseBanner.data.id,
            delete_url: apiResponseBanner.data.delete_url,
            source: 'imgbb'
        } : null,
        banner_action: data.banner_action
    });

    return response;
}

const get = async (data: {
    member: any;
    search?: string;
    offset: number;
}) => {
    if (!data.search) throw new InvalidArgumentError("Search query is required.");
    return await GetMembers({
        query: data.search,
        offset: data.offset
    });
};

export const memberService = {
    getByUsername,
    updateName,
    updateUsername,
    updateBio,
    updatePassword,
    updateIconURL,
    updateIconImage,
    updateBannerURL,
    updateBannerImage,
    updateProfile,
    get
}