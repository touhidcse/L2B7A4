import { Role } from "../../../generated/prisma/enums";
export interface CategoryPayload {
    id: string;
    type: string;
    services: string[]
}

export interface UpdateUserStatusPayload  {
    isBan: boolean;
};