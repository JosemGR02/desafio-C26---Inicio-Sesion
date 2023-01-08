import { Route, Routes } from "react-router-dom";
import { Login } from "./screens";

export const AuthRouter = () => {
  return (
    <Routes>
      {/* /auth */}
      <Route index element={<Login />} />
    </Routes>
  );
};
