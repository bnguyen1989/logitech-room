import { Configurator } from "./pages/configurator/Configurator";
import { GetStarted } from "./pages/getStarted/GetStarted";
import { Room } from "./pages/room/Room";
import { Route, Routes } from "react-router-dom";
import { RoomDetails } from "./pages/roomDetails/RoomDetails";
import { Modals } from "./components/Modals/Modals";
import { useEffect } from "react";
import { ServerApi } from "./services/api/Server/ServerApi";
import { useDispatch } from "react-redux";
import { setLangText } from "./store/slices/ui/Ui.slice";
import dataLang from "./dataLang/products/en-us.json";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    new ServerApi()
      .getProductsLang("en-us")
      .then((res) => {
        let objData: any = {};

        Object.keys(res.data.products).forEach((product) => {
          const newKey = product.toUpperCase();
          objData[newKey] = res.data.products[product];
        });

        dispatch(setLangText(objData));
      })
      .catch(() => {
        dispatch(setLangText(dataLang));
        console.log("dataLang", dataLang);
      });
  }, []);
  return (
    <div className={"app"}>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/configurator" element={<Configurator />} />
        <Route path="/room" element={<Room />} />
        <Route path="/room/:roomId" element={<RoomDetails />} />
        <Route path="*" element={<GetStarted />} />
      </Routes>

      <Modals />
    </div>
  );
}

export default App;
