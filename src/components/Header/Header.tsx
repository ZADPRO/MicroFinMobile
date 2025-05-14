import React from "react";
import "./Header.css";
import { IonHeader, IonIcon, IonToolbar } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";

const Header: React.FC = () => {
  const storedProfile = localStorage.getItem("profile");
  const userDetails = storedProfile ? JSON.parse(storedProfile) : null;

  return (
    <IonHeader>
      <IonToolbar>
        <div className="header p-2 flex justify-content-between align-items-center">
          <div className="flex gap-2 align-items-center">
            <p className="">Hi, {userDetails?.name} !</p>
          </div>
          <IonIcon icon={personCircleOutline} size="large" />
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
