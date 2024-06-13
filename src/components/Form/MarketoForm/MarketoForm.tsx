import { useEffect } from "react";
import { useParams } from "react-router-dom";

const MarketoForm = () => {
  const { idForm } = useParams();
  useEffect(() => {
    // Initialize Munchkin
    const initMunchkin = () => {
      if (window.Munchkin) {
        window.Munchkin.init("201-WGH-889");
      }
    };
    initMunchkin();

    MktoForms2.loadForm("//info.logitech.com", "201-WGH-889", idForm);
    MktoForms2.whenReady((form: any) => {
      form.onSuccess((values: any, followUpUrl: any) => {
        console.log("values = ", values);
        console.log("followUpUrl = ", followUpUrl);

        form.getFormElem().hide();
        return false;
      });
    });
  }, []);

  return <form id={`mktoForm_${idForm}`}></form>;
};

export default MarketoForm;
