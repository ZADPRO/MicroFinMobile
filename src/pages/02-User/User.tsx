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
import "./User.css";
import agentIcon from "../../assets/users/agentImg.png";
import userIcon from "../../assets/users/userImg.png";
import vendorIcon from "../../assets/users/vendor.png";

const User: React.FC = () => {
  useEffect(() => {
    
    StatusBar.setStyle({ style: Style.Dark });
    

    return () => {
      
    };
  }, []);

  const history = useHistory();

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
            <IonCol
              size="5"
              className="ion-text-center bg-white shadow-1 gap-2 m-2"
              style={{ borderRadius: "7px" }}
              onClick={() => handleNavigation("/userList")}
            >
              <div className="rounded">
                <img
                  src={userIcon}
                  alt="Users"
                  style={{ width: "80px", height: "auto", margin: "0 auto" }}
                />
                <p className="pt-2">Users</p>
              </div>
            </IonCol>
            <IonCol
              size="5"
              className="ion-text-center bg-white shadow-1 gap-2 m-2"
              style={{ borderRadius: "7px" }}
              onClick={() => handleNavigation("/agentList")}
            >
              <div className="rounded">
                <img
                  src={agentIcon}
                  alt="Users"
                  style={{ width: "80px", height: "auto", margin: "0 auto" }}
                />
                <p className="pt-2">Agents</p>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol
              size="5"
              className="ion-text-center bg-white shadow-1 gap-2 mx-2"
              style={{ borderRadius: "7px" }}
              onClick={() => handleNavigation("/vendorLists")}
            >
              <div className="rounded">
                <img
                  src={vendorIcon}
                  alt="Users"
                  style={{ width: "80px", height: "auto", margin: "0 auto" }}
                />
                <p className="pt-2">Vendors</p>
              </div>
            </IonCol>
            <IonCol
              size="5"
              className="ion-text-center bg-white gap-2 m-2"
            ></IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default User;
