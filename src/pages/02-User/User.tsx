import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useHistory } from "react-router";

import agentIcon from "../../assets/users/agentImg.png";
import userIcon from "../../assets/users/userImg.png";

const User: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  const history = useHistory();
  const reportData = [
    { imgSrc: userIcon, text: "Users", route: "/userList" },
    { imgSrc: agentIcon, text: "Agents", route: "/agentList" },
  ];

  const handleNavigation = (route: string) => {
    history.push(route);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Users Management</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            {reportData.map((item, index) => (
              <IonCol
                size="5"
                key={index}
                className="ion-text-center bg-white shadow-1 gap-2 m-2"
                style={{ borderRadius: "7px" }}
                onClick={() => handleNavigation(item.route)}
              >
                <div className="rounded">
                  <img
                    src={item.imgSrc}
                    alt={item.text}
                    style={{ width: "80px", height: "auto", margin: "0 auto" }}
                  />
                  <p className="pt-2">{item.text}</p>
                </div>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default User;
