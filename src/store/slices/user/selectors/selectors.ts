import { RootState } from "../../..";

export const getUserId = (state: RootState) => state.user.userId;

export const getRoleData = (state: RootState) => state.user.roleData;

export const getUserData = (state: RootState) => state.user.data;
