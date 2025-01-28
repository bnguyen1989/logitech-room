import { useDispatch } from "react-redux";
import { useAppSelector } from "./redux";
import { getDataSoftwareQuestionsForm } from "../store/slices/ui/selectors/selectorsForm";
import { updateDataForm } from "../store/slices/ui/Ui.slice";
import { FormName } from "../utils/baseUtils";

export const useQuestionForm = () => {
  const dispatch = useDispatch();
  const dataQuestionForm = useAppSelector(getDataSoftwareQuestionsForm);

  const setStatusForm = (value: boolean) => {
    dispatch(
      updateDataForm({
        key: FormName.QuestionFormSoftware,
        value: {
          isSubmit: value,
        },
      })
    );
  };

  return {
    data: dataQuestionForm,
		setStatusForm,
  };
};
