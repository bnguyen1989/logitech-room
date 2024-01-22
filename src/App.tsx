import { useAppSelector } from './hooks/redux'
import { Configurator } from "./pages/configurator/Configurator";
import { GetStarted } from './pages/getStarted/GetStarted'
import { getActiveStep } from './store/slices/ui/selectors/selectors'

function App() {
  const activeStep = useAppSelector(getActiveStep);

  if (!activeStep) {
    return <GetStarted />;
  }
  
  return <Configurator />;
}

export default App;
