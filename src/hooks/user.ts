import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "./redux";
import { getUserId } from "../store/slices/user/selectors/selectors";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserId } from "../store/slices/user/User.slice";
import { IdGenerator } from "../models/IdGenerator";

export const useUser = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const userIdUrl = searchParams.get("userId");
  const userId = useAppSelector(getUserId);

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

  return {
    userId,
  };
};
