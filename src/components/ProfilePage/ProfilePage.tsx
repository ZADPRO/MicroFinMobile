import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";

import agentIcon from "../../assets/users/agentImg.png";
import { useHistory } from "react-router";
import { chevronForwardOutline } from "ionicons/icons";

const ProfilePage: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  const history = useHistory();

  const storedProfile = localStorage.getItem("profile");
  const userDetails = storedProfile ? JSON.parse(storedProfile) : null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="light">
        <div className="shadow-1 m-3 py-2 px-3 border-round-lg bg-white">
          <div className="flex align-items-center">
            <img
              src={agentIcon}
              alt="Users"
              style={{ width: "80px", height: "auto" }}
            />
            <div className="flex flex-column pl-3">
              <p className="text-lg font-semibold">Hello 👋,</p>
              <p className="font-semibold text-lg pt-1">{userDetails.name}</p>
            </div>
          </div>
        </div>

        <IonList inset={true} className="shadow-1">
          <IonItem>
            <IonLabel>About Us</IonLabel>
            <p className="pi pi-angle-right"></p>
          </IonItem>
          <IonItem>
            <IonSelect label="Privacy" placeholder="Show Cash">
              <IonSelectOption value="apple">On</IonSelectOption>
              <IonSelectOption value="banana">Off</IonSelectOption>
            </IonSelect>{" "}
          </IonItem>
          <IonItem>
            <IonLabel>Logout</IonLabel>
            <p className="pi pi-angle-right"></p>
          </IonItem>
        </IonList>
        <p className="text-center">Made in ❤️ with ZAdroit IT Solutions</p>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
