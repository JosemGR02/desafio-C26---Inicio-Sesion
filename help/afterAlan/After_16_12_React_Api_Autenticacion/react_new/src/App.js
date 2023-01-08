import { Route, Routes } from "react-router-dom";
import { AuthRouter } from "./routers";

function App() {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthRouter />} />
      <Route path="/*" element={<div> HOLA! </div>} />
    </Routes>
  );
}

export default App;
