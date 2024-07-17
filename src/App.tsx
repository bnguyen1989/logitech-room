import s from "./App.module.scss";
import { Configurator } from "./pages/configurator/Configurator";
import { GetStarted } from "./pages/getStarted/GetStarted";
import { Room } from "./pages/room/Room";
import { Route, Routes, useLocation } from "react-router-dom";
import { RoomDetails } from "./pages/roomDetails/RoomDetails";
import { Modals } from "./components/Modals/Modals";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLangText } from "./store/slices/ui/Ui.slice";
import type { ProductsObj } from "./types/textTypeProduct";
import { RequestConsultation } from "./pages/requestConsultation/RequestConsultation";
import { recalculateVh } from "./utils/browserUtils";
import { LanguageService } from "./services/LanguageService/LanguageService";
import { useLocale } from "./hooks/useLocal";
import { Loader } from "./components/Loader/Loader";
import { Application } from "./models/Application";
import { MunchkinScript } from "./components/Munchkin/MunchkinScript";
import MarketoForm from "./components/Form/MarketoForm/MarketoForm";

declare const app: Application;

function App() {
  const dispatch = useDispatch();
  const locale = useLocale();
  const [isRequest, setIsRequest] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    recalculateVh();
    if (!locale || !locale.length) return;

    new LanguageService()
      .getLanguageData(locale)
      .then((res) => {
        const { pages, products } = res;

        const objDataProducts: ProductsObj = {};

        Object.keys(products).forEach((key) => {
          const newKey = key.toUpperCase();
          objDataProducts[newKey] = products[key];
        });

        dispatch(
          setLangText({
            pages,
            products: objDataProducts,
          })
        );

        app.currentConfigurator.language = locale;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsRequest(false);
      });
  }, [locale]);

  if (isRequest)
    return (
      <div className={s.loader}>
        <Loader />
      </div>
    );

  return (
    <div className={s.app}>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/configurator" element={<Configurator />} />
        <Route path="/room" element={<Room />} />
        <Route path="/room/:roomId" element={<RoomDetails />} />
        <Route path="/request-consultation" element={<RequestConsultation />} />
        <Route path="/Marketo/:idForm" element={<MarketoForm />} />

        <Route path="*" element={<GetStarted />} />
      </Routes>

      <Modals />
      <MunchkinScript />
    </div>
  );
}

export default App;
