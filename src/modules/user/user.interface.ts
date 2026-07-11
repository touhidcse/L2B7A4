import { Role } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
    id: string;
    name: string;
    email: string;
    password: string;
    address?: string;
    phone? :    string;
    role : Role;
    isBan: boolean
}