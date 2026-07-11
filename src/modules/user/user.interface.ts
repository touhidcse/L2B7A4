import { Role } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
    id: string;
    name: string;
    email: string;
    password: string;
    profilePhoto ?: string;
    bio? :    string;
    role : Role;
    isBan: boolean
}