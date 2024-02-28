import { Configurator } from "./pages/configurator/Configurator";
import { GetStarted } from "./pages/getStarted/GetStarted";
import { Room } from "./pages/room/Room";
import { Route, Routes } from "react-router-dom";
import { RoomDetails } from "./pages/roomDetails/RoomDetails";
import { Modals } from './components/Modals/Modals'

function App() {
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
