import { adminRepository } from "../database/repository/adminRepository";
import InvalidArgumentError from "../errors/InvalidArgumentError";
import Password from "../helpers/Password";

const updatePassword = async (data: {
    username: string;
    password: string;
}) => {
    if (!data.username || !data.password) throw new InvalidArgumentError("Username & password required.");
    data.password = await Password.hash(data.password);
    const response = await adminRepository.updatePassword(data);
    return response;
}

export const adminService = {
    updatePassword
}