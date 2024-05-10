import s from "./App.module.scss";
import { Configurator } from "./pages/configurator/Configurator";
import { GetStarted } from "./pages/getStarted/GetStarted";
import { Room } from "./pages/room/Room";
import { Route, Routes } from "react-router-dom";
import { RoomDetails } from "./pages/roomDetails/RoomDetails";
import { Modals } from "./components/Modals/Modals";
import { useEffect } from "react";
// import { ServerApi } from "./services/api/Server/ServerApi";
import { useDispatch } from "react-redux";
import { setLangText } from "./store/slices/ui/Ui.slice";
import dataLang from "./dataLang/products/en-us.json";
import type { ProductsObj } from "./types/textTypeProduct";
import { RequestConsultation } from "./pages/requestConsultation/RequestConsultation";
import { recalculateVh } from "./utils/browserUtils";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    recalculateVh();
  }, []);

  useEffect(() => {
    // new ServerApi()
    //   .getProductsLang("en-us")
    //   .then((res) => {
    //     const objData: ProductsObj = {};

    //     Object.keys(res.data.products).forEach((product) => {
    //       const newKey = product.toUpperCase();
    //       objData[newKey] = res.data.products[product];
    //     });

    //     dispatch(setLangText(objData));
    //   })
    //   .catch(() => {
    const objData: ProductsObj = {};

    const data: any = dataLang;
    Object.keys(data).forEach((productKey) => {
      const newKey = productKey.toUpperCase();
      objData[newKey] = data[productKey];
    });

    dispatch(setLangText(objData));
    // });
  }, []);
  return (
    <div className={s.app}>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/configurator" element={<Configurator />} />
        <Route path="/room" element={<Room />} />
        <Route path="/room/:roomId" element={<RoomDetails />} />
        <Route path="/request-consultation" element={<RequestConsultation />} />
        <Route path="*" element={<GetStarted />} />
      </Routes>

      <Modals />
    </div>
  );
}

export default App;
