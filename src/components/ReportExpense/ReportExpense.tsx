import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useHistory } from "react-router";

const ReportExpense: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  // HANDLE NAV
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/report" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Expense Report</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        
      </IonContent>
    </IonPage>
  );
};

export default ReportExpense;
