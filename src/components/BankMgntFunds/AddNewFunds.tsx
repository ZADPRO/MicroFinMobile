import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import AddFunds from "./AddFunds";
import SelfTransfer from "./SelfTransfer";

const AddNewFunds: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  //   SEGMENT VIEW HANDLER
  const [selectedSegment, setSelectedSegment] = useState<string>("addFunds");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/bank" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Add New Funds</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="dashboardContentsTabSplit">
          <IonSegment
            value={selectedSegment}
            onIonChange={(e) => {
              const value = e.detail.value;
              if (value) setSelectedSegment(value);
            }}
          >
            <IonSegmentButton value="addFunds">
              <IonLabel style={{ fontSize: "14px" }}>Add Funds</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="selfTransfer">
              <IonLabel style={{ fontSize: "14px" }}>Self Transfer</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {selectedSegment === "addFunds" && <AddFunds />}
          {selectedSegment === "selfTransfer" && <SelfTransfer />}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddNewFunds;
