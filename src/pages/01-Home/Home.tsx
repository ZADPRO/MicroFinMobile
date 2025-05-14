import {
  IonContent,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import Header from "../../components/Header/Header";
import "./Home.css";

const Home: React.FC = () => {
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
        <div className="dashboardContentsTabSplit">
          <IonToolbar>
            <IonSegment value="user">
              <IonSegmentButton value="user">
                <IonLabel>User Loan</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="admin">
                <IonLabel>Admin Loan</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
