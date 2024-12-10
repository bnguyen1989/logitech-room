import { RootState } from "../../..";
import { FormName } from "../../../../utils/baseUtils";
import { QuestionFormI } from "../type";
import { getDataQuestionFormCustomer } from "./selectoteLangPage";

export const getFormDataByName = (name: FormName) => (state: RootState) => {
  return state.ui.formData[name];
};

export const getDataSoftwareQuestionsForm = (state: RootState) => {
  const dataQuestionForm: QuestionFormI[] =
    getDataQuestionFormCustomer("v3")(state);

  const dataState = getFormDataByName(FormName.QuestionFormSoftware)(state);

  return {
    ...dataState,
    data: dataQuestionForm,
  };
};
