import { useEffect } from "react";
import { useParams } from "react-router-dom";

const MarketoForm = (props: any) => {
  const idFormProps = props.formId;

  const { idForm } = useParams();

  const FormID = idFormProps ? idFormProps : idForm;
  useEffect(() => {
    // Initialize Munchkin
    const initMunchkin = () => {
      if (window.Munchkin) {
        window.Munchkin.init("201-WGH-889");
      }
    };
    initMunchkin();

    MktoForms2.loadForm("//info.logitech.com", "201-WGH-889", FormID);
    MktoForms2.whenReady((form: any) => {
      form.onSuccess((values: any, followUpUrl: any) => {
        console.log("values = ", values);
        console.log("followUpUrl = ", followUpUrl);

        form.getFormElem().hide();
        return false;
      });
    });
  }, []);

  return <form id={`mktoForm_${FormID}`}></form>;
};

export default MarketoForm;
