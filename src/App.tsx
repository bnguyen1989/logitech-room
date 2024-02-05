import { useEffect } from 'react'
import { useAppSelector } from './hooks/redux'
import { Configurator } from "./pages/configurator/Configurator";
import { GetStarted } from './pages/getStarted/GetStarted'
import { getActiveStep } from './store/slices/ui/selectors/selectors'
import { initThreekitData } from './utils/threekitUtils'

function App() {
  const activeStep = useAppSelector(getActiveStep);

  useEffect(() => {
    initThreekitData();
  }, []);

  if (!activeStep) {
    return <GetStarted />;
  }
  
  return <Configurator />;
}

export default App;
