import { Configurator } from "./pages/configurator/Configurator";
import { GetStarted } from "./pages/getStarted/GetStarted";
import { Room } from "./pages/room/Room";
import { Route, Routes } from "react-router-dom";
import { RoomDetails } from "./pages/roomDetails/RoomDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GetStarted />} />
      <Route path="/configurator" element={<Configurator />} />
      <Route path="/room" element={<Room />} />
      <Route path="/room/:id" element={<RoomDetails />} />
      <Route path="*" element={<GetStarted />} />
    </Routes>
  );
}

export default App;
