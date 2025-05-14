import { IonContent, IonPage } from "@ionic/react";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import splashImage from "../../assets/splash/splashLogo.png";
import { StatusBar, Style } from "@capacitor/status-bar";
import "./Splash.css";

const Splash: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    const timer = setTimeout(() => {
      const userDetails = localStorage.getItem("userDetails");
      if (userDetails) {
        history.push("/home");
      } else {
        history.push("/login");
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  return (
    <IonPage>
      <IonContent>
        <div className="splashScreenImg">
          <img src={splashImage} alt="splash" />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Splash;
