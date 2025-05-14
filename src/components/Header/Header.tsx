import React from "react";
import "./Header.css";
import { IonIcon } from "@ionic/react";
import { personCircle } from "ionicons/icons";

const Header: React.FC = () => {
  const storedProfile = localStorage.getItem("profile");
  const userDetails = storedProfile ? JSON.parse(storedProfile) : null;

  return (
    <div>
      <div className="header p-3 flex justify-content-between align-items-center">
        <div className="flex gap-2 align-items-center">
          <p className="">Hi, {userDetails?.name} !</p>
        </div>
        <IonIcon icon={personCircle} size="large" />
      </div>
    </div>
  );
};

export default Header;
