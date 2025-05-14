import {
  IonContent,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
} from "@ionic/react";
import React, { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import Header from "../../components/Header/Header";
import "./Home.css";
import UserLoanDashboard from "../../components/UserLoanDashboard/UserLoanDashboard";
import AdminLoanDashboard from "../../components/AdminLoanDashboard/AdminLoanDashboard";
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
        <div className="dashboardContentsTabSplit m-2">
          <IonSegment value="user">
            <IonSegmentButton value="user" contentId="user">
              <IonLabel>User Loan</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="admin" contentId="admin">
              <IonLabel>Admin Loan</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          <IonSegmentView>
            <IonSegmentContent id="user">
              <UserLoanDashboard />
            </IonSegmentContent>
            <IonSegmentContent id="admin">
              <AdminLoanDashboard />
            </IonSegmentContent>
          </IonSegmentView>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
