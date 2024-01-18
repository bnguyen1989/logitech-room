import { createSlice } from '@reduxjs/toolkit';
import type { ThreekitAuthProps } from '@threekit/rest-api';

/*****************************************************
 * Standard Selectors
 ****************************************************/

export const getAuth = (state: {
  auth: ThreekitAuthProps;
}): ThreekitAuthProps | undefined => {
  return state.auth.orgId.length ? state.auth : undefined;
};

/*****************************************************
 * Threekit Slice
 ****************************************************/

const initialState = {
  host: 'preview.threekit.com',
  orgId: '',
  publicToken: ''
} as ThreekitAuthProps;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {}
});
