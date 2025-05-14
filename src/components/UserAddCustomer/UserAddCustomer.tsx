import React, { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { InputText } from "primereact/inputtext";

const UserAddCustomer: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/userList" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Add New Customer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="formData p-3">
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText placeholder="Username" />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserAddCustomer;
