import { IonContent, IonPage } from "@ionic/react";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import splashImage from "../../assets/splash/splashLogo.png";

import "./Splash.css";

const Splash: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    console.log("User Login Page");
    const timer = setTimeout(() => {
      const userDetails = localStorage.getItem("profile");
      if (userDetails) {
        history.push("/home");
      } else {
        history.push("/login");
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <IonPage>
      <IonContent>
        <div className="splashScreenWrapper">
          <div className="splashScreenImg">
            <img src={splashImage} alt="splash" />
          </div>
          <div className="splashQuote">
            <p>"Your journey to health starts here."</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Splash;
