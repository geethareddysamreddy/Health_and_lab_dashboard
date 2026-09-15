import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Intakes from "./pages/Intakes/Intakes";
import Integrations from "./pages/Integrations/Integrations";
import { IntakesProvider } from "./context/IntakesContext";

export default function App() {
  return (
    <IntakesProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="intakes" element={<Intakes />} />
            <Route path="integrations" element={<Integrations />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </IntakesProvider>
  );
}
