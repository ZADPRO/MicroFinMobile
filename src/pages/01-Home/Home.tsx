import {
  IonContent,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import Header from "../../components/Header/Header";
import "./Home.css";
import UserLoanDashboard from "../../components/UserLoanDashboard/UserLoanDashboard";
import AdminLoanDashboard from "../../components/AdminLoanDashboard/AdminLoanDashboard";

const Home: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<string>("user");

  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  return (
    <IonPage>
      <IonContent>
        <Header />
        <div className="dashboardContentsTabSplit m-2">
          <IonSegment
            value={selectedSegment}
            onIonChange={(e) => {
              console.log("e", e);
              const value = e.detail.value;
              if (value) {
                console.log("value", value);
                setSelectedSegment(value);
              }
            }}
          >
            <IonSegmentButton value="user">
              <IonLabel style={{ fontSize: "14px" }}>User Loan</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="admin">
              <IonLabel style={{ fontSize: "14px" }}>Admin Loan</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {selectedSegment === "user" && <UserLoanDashboard />}
          {selectedSegment === "admin" && <AdminLoanDashboard />}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
