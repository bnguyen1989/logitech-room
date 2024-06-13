import { useEffect } from "react";
import { useParams } from "react-router-dom";

const MarketoForm = () => {
  const { idForm } = useParams();
  useEffect(() => {
    // Function to load a script dynamically
    const loadScript = (src: any, id: any, onLoad: any) => {
      if (document.getElementById(id)) return; // Avoid re-adding script

      const script = document.createElement("script");
      script.src = src;
      script.id = id;
      script.async = true;
      script.onload = onLoad;
      document.head.appendChild(script);
    };

    // Initialize Marketo Forms
    loadScript(
      "//info.logitech.com/js/forms2/js/forms2.min.js",
      "mktoFormsScript",
      () => {
        debugger;
        MktoForms2.loadForm(
          "//info.logitech.com",
          "201-WGH-889",
          idForm,
          (form: any) => {
            debugger;
            form.onSuccess((values, followUpUrl) => {
              form.getFormElem().hide();
              return false;
            });
          }
        );
      }
    );

    // Initialize Munchkin
    const initMunchkin = () => {
      debugger;
      if (window.Munchkin) {
        Munchkin.init("201-WGH-889");
      }
    };
    debugger;
    loadScript(
      "//munchkin.marketo.net/munchkin.js",
      "munchkinScript",
      initMunchkin
    );
  }, []);

  return <form id={`mktoForm_${idForm}`}></form>;
};

export default MarketoForm;
