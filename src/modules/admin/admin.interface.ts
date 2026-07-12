import { Role } from "../../../generated/prisma/enums";
export interface CategoryPayload {
    id: string;
    name: string;
    services: string[]
}

export interface UpdateUserStatusPayload  {
    isBan: boolean;
};