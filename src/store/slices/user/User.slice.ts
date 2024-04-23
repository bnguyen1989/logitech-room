import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ModalsStateI {
  userId: string;
}

const initialState: ModalsStateI = {
  userId: "",
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
  },
});

export const { setUserId } = UserSlice.actions;

export default UserSlice.reducer;
