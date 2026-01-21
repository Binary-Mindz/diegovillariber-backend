import { Role } from 'generated/prisma/enums';
import { Roles } from './roles';

export const Admin = () => Roles(Role.ADMIN);
export const User = () => Roles(Role.User);