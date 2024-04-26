import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  PermissionUser,
  RoleUserName,
  getRoleByName,
} from "../../../utils/userRoleUtils";
import Role from "../../../models/user/role/Role";

interface ModalsStateI {
  userId: string;
  roleData: {
    name: RoleUserName;
    permissions: PermissionUser[];
  };
}

const initialState: ModalsStateI = {
  userId: "",
  roleData: {
    name: RoleUserName.VIEWER,
    permissions: getRoleByName(RoleUserName.VIEWER).permissions,
  },
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (
      state,
      action: PayloadAction<{
        userId: string;
      }>
    ) => {
      state.userId = action.payload.userId;
    },
    changeRoleUser: (
      state,
      action: PayloadAction<{
        role: Role;
      }>
    ) => {
      const { role } = action.payload;
      state.roleData = {
        name: role.name,
        permissions: role.permissions,
      };
    },
  },
});

export const { setUserId, changeRoleUser } = UserSlice.actions;

export default UserSlice.reducer;
