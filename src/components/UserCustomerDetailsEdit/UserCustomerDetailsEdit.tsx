import React, { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
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
import { useLocation } from "react-router-dom";
import UserDataEdit from "./UserDataEdit";
import UserReferenceEdit from "./UserReferenceEdit";
import UserAudit from "./UserAudit";

const UserCustomerDetailsEdit: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  //   GET THE REF CUST ID FROM URL
  const location = useLocation();
  const { refCustId } = location.state || {};

  //   SEGMENT VIEW HANDLER
  const [selectedSegment, setSelectedSegment] = useState<string>("userData");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/userList" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>{refCustId || "Customer ID"}</IonTitle>
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
            <IonSegmentButton value="userData">
              <IonLabel style={{ fontSize: "14px" }}>User Data</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="reference">
              <IonLabel style={{ fontSize: "14px" }}>Reference</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="audit">
              <IonLabel style={{ fontSize: "14px" }}>Audit</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {selectedSegment === "userData" && <UserDataEdit />}
          {selectedSegment === "reference" && <UserReferenceEdit />}
          {selectedSegment === "audit" && <UserAudit />}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserCustomerDetailsEdit;
