import { useEffect } from "react";
import { useParams } from "react-router-dom";

const MarketoForm = () => {
  const { idForm } = useParams();
  useEffect(() => {
    // Initialize Munchkin
    const initMunchkin = () => {
      debugger;
      //@ts-ignore
      if (window.Munchkin) {
        //@ts-ignore
        window.Munchkin.init("201-WGH-889");
      }
    };
    initMunchkin();

    MktoForms2.loadForm("//info.logitech.com", "201-WGH-889", idForm);
    MktoForms2.whenReady((form: any) => {
      debugger;
      form.onSuccess((values: any, followUpUrl: any) => {
        debugger;
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
