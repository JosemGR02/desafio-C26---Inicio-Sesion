import axios from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const onLoginSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const response = await axios.post(
        "http://localhost:8080/api/auth",
        {
          email: loginData.email,
          password: loginData.password,
        },
        { withCredentials: true }
      );

      console.log(response);

      if (response.status === 200) {
        // window.location.replace('/')
        navigate("/");

        return;
      }

      alert("Credenciales incorrectas");
    },
    [loginData.email, loginData.password, navigate]
  );

  return (
    <div>
      Login
      <form onSubmit={onLoginSubmit}>
        <input
          name="email"
          placeholder="Ingrese su email"
          onChange={(e) =>
            setLoginData((prevState) => ({
              ...prevState,
              email: e.target.value,
            }))
          }
          value={loginData.email}
        />
        <input
          name="password"
          placeholder="Ingrese su password"
          onChange={(e) =>
            setLoginData((prevState) => ({
              ...prevState,
              password: e.target.value,
            }))
          }
          value={loginData.password}
        />

        <input type="submit" value="Iniciar sesión" />
      </form>
    </div>
  );
};
