import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "./redux";
import {
  getRoleData,
  getUserData,
  getUserId,
} from "../store/slices/user/selectors/selectors";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserId } from "../store/slices/user/User.slice";
import { IdGenerator } from "../models/IdGenerator";
import { User } from "../models/user/User";
import Role from "../models/user/role/Role";

export const useUser = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const userIdUrl = searchParams.get("userId");
  const userId = useAppSelector(getUserId);
  const roleData = useAppSelector(getRoleData);
  const userData = useAppSelector(getUserData);

  useEffect(() => {
    if (userId) return;
    let tempUserId = IdGenerator.generateId();
    if (userIdUrl) {
      tempUserId = userIdUrl;
    }
    dispatch(setUserId({ userId: tempUserId }));
  }, []);

  useEffect(() => {
    if (!userIdUrl) return;
    if (userIdUrl === userId) return;
    dispatch(setUserId({ userId: userIdUrl }));
  }, [userIdUrl]);

  const role = new Role(roleData.name, roleData.permissions);

  return new User(userId, role).setUserData(userData);
};
