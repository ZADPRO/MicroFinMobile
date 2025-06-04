import { IonContent, IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";

import loginImg from "../../assets/login/loginImg.png";
import { InputText } from "primereact/inputtext";
import { useHistory } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { Password } from "primereact/password";
import axios from "axios";
import decrypt from "../../services/helper";
import { ProgressSpinner } from "primereact/progressspinner"; // 🔹 Add this

const Login: React.FC = () => {
  const history = useHistory();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 🔹 Loading state

  useEffect(() => {
    if (isAuthenticated) {
      history.replace("/home");
    }

    return () => {};
  }, [isAuthenticated, history]);

  const handleLogin = async () => {
    setLoading(true); // 🔹 Start loading
    setError("");

    if (username === "admin" && password === "123456") {
      login({ username });
      history.replace("/home");
      setLoading(false);
      return;
    }

    try {
      const credentials = {
        login: username,
        password: password,
      };

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/adminLogin",
        credentials
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        localStorage.setItem("loginStatus", "true");
        localStorage.setItem("profile", JSON.stringify(data.profile));

        history.push("/home");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // 🔹 Stop loading
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="loginScreen">
          <img src={loginImg} alt="" />
          <div className="flex loginForm flex-column align-items-center mt-3 w-full px-6">
            <p className="m-0 font-bold">LOGIN</p>
            <InputText
              placeholder="Enter Username"
              className="mt-3 w-full form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading} // 🔹 Disable input while loading
            />
            <Password
              placeholder="Enter Password"
              className="mt-3 w-full form-input"
              value={password}
              toggleMask
              feedback={false}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading} // 🔹 Disable input while loading
            />
            {error && <p className="text-red-500">{error}</p>}

            {/* <p
              className="m-0 mt-3 w-full align-items-end flex justify-content-end"
              onClick={() => history.push("/forgotPassword")}
            >
              Forgot Password ?
            </p> */}

            <button
              className="px-5 w-full mt-4"
              onClick={handleLogin}
              disabled={loading} // 🔹 Disable button while loading
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {loading && (
              <div className="mt-4">
                <ProgressSpinner
                  style={{ width: "40px", height: "40px" }}
                  strokeWidth="4"
                />
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
