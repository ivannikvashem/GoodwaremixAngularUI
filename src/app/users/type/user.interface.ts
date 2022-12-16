import {RoleInterface} from "./role.interface";

export interface UserInterface {
  id?: string;
  username: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: RoleInterface;
  linkedSuppliers: Array<any>;
  isDeleted: boolean;
  lastLogin?: Date;
  token?: string;
}
