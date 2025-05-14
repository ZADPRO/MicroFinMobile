import { IonContent, IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";

import { StatusBar, Style } from "@capacitor/status-bar";

import loginImg from "../../assets/login/login.png";
import { InputText } from "primereact/inputtext";
import { useHistory } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

const Login: React.FC = () => {
  // STATUS BAR
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  // USER LOGIN
  const history = useHistory();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    if (isAuthenticated) {
      history.replace("/home");
    }

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, [isAuthenticated, history]);

  const handleLogin = () => {
    if (username === "admin" && password === "123456") {
      login({ username });
      history.replace("/home");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="loginScreen">
          <img src={loginImg} alt="" />
          <div className="flex loginForm flex-column align-items-center mt-3 w-full px-6">
            <p className="m-0">LOGIN</p>
            <InputText
              placeholder="Enter Username"
              className="mt-3 w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <InputText
              placeholder="Enter Password"
              className="mt-3 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
