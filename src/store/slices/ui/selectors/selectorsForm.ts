import { RootState } from "../../..";
import { FormName } from "../../../../utils/baseUtils";
import { RoleUserName } from "../../../../utils/userRoleUtils";
import { getRoleData } from "../../user/selectors/selectors";
import { QuestionFormI } from "../type";
import { getDataQuestionFormCustomer } from "./selectoteLangPage";

export const getFormDataByName = (name: FormName) => (state: RootState) => {
  return state.ui.formData[name];
};

export const getDataSoftwareQuestionsForm = (state: RootState) => {
  const userRoleData = getRoleData(state);
  let dataQuestionForm: QuestionFormI[] = [];
  if (userRoleData.name === RoleUserName.CUSTOMER) {
    dataQuestionForm = getDataQuestionFormCustomer("v1")(state);
  }

  if (userRoleData.name === RoleUserName.PARTNER) {
    dataQuestionForm = getDataQuestionFormCustomer("v2")(state);
  }

  const dataState = getFormDataByName(FormName.QuestionFormSoftware)(state);

  return {
    ...dataState,
    data: dataQuestionForm,
  };
};
