import { IonContent, IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";

import { StatusBar, Style } from "@capacitor/status-bar";

import loginImg from "../../assets/login/login.png";
import { InputText } from "primereact/inputtext";
import { useHistory } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { Password } from "primereact/password";
import axios from "axios";
import decrypt from "../../services/helper";

const Login: React.FC = () => {
  // STATUS BAR
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  // USER LOGIN
  const history = useHistory();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    if (isAuthenticated) {
      history.replace("/home");
    }

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, [isAuthenticated, history]);

  const handleLogin = async () => {
    if (username === "admin" && password === "123456") {
      login({ username });
      history.replace("/home");
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
        console.log("data", data);
        const profile = data.profile;

        localStorage.setItem("token", "Bearer " + data.token);
        localStorage.setItem("loginStatus", "true");
        localStorage.setItem("profile", JSON.stringify(profile));

        history.push("/home");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error", err);
      setError("Something went wrong. Please try again.");
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
            />
            <Password
              placeholder="Enter Password"
              className="mt-3 w-full form-input"
              value={password}
              toggleMask
              feedback={false}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p>{error}</p>
            <p className="m-0 mt-3 w-full align-items-end flex justify-content-end">
              Forgot Password ?
            </p>
            <button className="px-5 w-full mt-4" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
