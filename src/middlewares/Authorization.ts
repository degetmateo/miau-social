import { NextFunction, Request, Response } from "express";
import { Member, Role } from "../database/models/Member";
import UnauthorizedError from "../errors/UnauthorizedError";
import JWT from "../helpers/JWT";
import { memberRepository } from "../database/repository/memberRepository";
import { ResponseError } from "../helpers/ControllerResponse";

class Authorization {
    Custom = (perms: Role[]) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const authorization = req.headers['authorization']?.split(" ");
                if (!authorization) throw new UnauthorizedError("Authorization failed.");
                
                const token = authorization[1];
                if (!token) throw new UnauthorizedError("Authorization failed.");
                
                const member = await JWT.Validate(token);
                if (!member || !member.id || !member.username || !member.role || !member.email) throw new UnauthorizedError("Authorization failed.");
                if (!await this.hasPermissions(member, perms)) throw new UnauthorizedError("Authorization failed.");
                
                req.member = member;
                next();
            } catch (error) {
                console.error(error);
                ResponseError(res, error);
            }
        }
    }

    Everyone = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authorization = req.headers['authorization']?.split(" ");
            if (!authorization) throw new UnauthorizedError("Authorization failed.");
            
            const token = authorization[1];
            if (!token) throw new UnauthorizedError("Authorization failed.");

            const member = await JWT.Validate(token);
            if (!member || !member.id || !member.username || !member.role || !member.email) throw new UnauthorizedError("Authorization failed.");

            req.member = member;
            next();
        } catch (error) {
            ResponseError(res, error);
        }
    }

    private hasPermissions = async (member: { id: number; username: string; role: string }, perms: string[]) => {
        const qMember = await memberRepository.getById({ id: member.id });
        return qMember.role_member === 'admin' || perms.includes(qMember.role_member);
    }

    RefreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies['refresh-token'];
            if (!token) throw new UnauthorizedError("No estás autorizado.");

            const member = await JWT.Validate(token);
            req.member = member;
            next();
        } catch (error) {
            ResponseError(res, new UnauthorizedError("La sesión expiró."));
        }
    }
}

export default new Authorization();