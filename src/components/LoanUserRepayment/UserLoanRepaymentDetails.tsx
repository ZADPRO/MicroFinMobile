import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonLabel,
  IonHeader,
  IonPage,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { StatusBar, Style } from "@capacitor/status-bar";
import LoanDetails from "./LoanDetails";
import Repayment from "./Repayment";
import Followup from "./Followup";
import Audit from "./Audit";
import { useLocation } from "react-router";

const UserLoanRepaymentDetails: React.FC = () => {
  // STATUS BAR
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  // GET THE DATA FROM STATE
  const location = useLocation();
  const { userData } = location.state || {};

  // HANDLE SEGMENTS
  const [selectedSegment, setSelectedSegment] = useState<string>("loanDetails");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/userLoanRepayment"
              mode="md"
            ></IonBackButton>
          </IonButtons>
          <IonTitle>Loan Repayment Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="dashboardContentsTabSplit">
          <IonSegment
            scrollable={true}
            value={selectedSegment}
            style={{ scrollbarWidth: "none" }}
            onIonChange={(e) => {
              const value = e.detail.value;
              if (value) setSelectedSegment(value);
            }}
          >
            <IonSegmentButton value="loanDetails">
              <IonLabel style={{ fontSize: "14px" }}>Loan Details</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="repayment">
              <IonLabel style={{ fontSize: "14px" }}>Repayment</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="followup">
              <IonLabel style={{ fontSize: "14px" }}>Follow Up</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="audit">
              <IonLabel style={{ fontSize: "14px" }}>Audit</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {selectedSegment === "loanDetails" && <LoanDetails />}
          {selectedSegment === "repayment" && <Repayment />}
          {selectedSegment === "followup" && <Followup />}
          {selectedSegment === "audit" && <Audit />}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserLoanRepaymentDetails;
