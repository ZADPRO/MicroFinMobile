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


import LoanDetails from "./LoanDetails";
import Repayment from "./Repayment";
import Followup from "./Followup";
import Audit from "./Audit";
import { useHistory, useLocation } from "react-router";

interface UserDataProps {
  refCustId: string;
  refLoanAmount: string;
  refLoanId: number;
  refPaymentDate: string;
  refProductDuration: string;
  refProductInterest: string;
  refProductName: string;
  refRpayId: number;
  refUserAddress: string;
  refUserDistrict: string;
  refUserFname: string;
  refUserId: number;
  refUserLname: string;
  refUserMobileNo: string;
  refUserPincode: string;
  refUserState: string;
}

const UserLoanRepaymentDetails: React.FC = () => {
  // STATUS BAR
  useEffect(() => {
    
    
    

    return () => {
      
    };
  }, []);

  // GET THE DATA FROM STATE
  const history = useHistory();
  const location = useLocation();
  const { userData } = location.state || {};
  useEffect(() => {
    if (!userData) {
      history.replace("/userLoanRepayment"); // or show an error page
    }
  }, [userData, history]);

  // HANDLE SEGMENTS
  const [selectedSegment, setSelectedSegment] = useState<string>("loanDetails");

  if (!userData) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <p>Error: No user data found. Redirecting...</p>
        </IonContent>
      </IonPage>
    );
  }

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
          <IonTitle>{userData.refCustId}</IonTitle>
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

          {selectedSegment === "loanDetails" && (
            <LoanDetails userData={userData} />
          )}
          {selectedSegment === "repayment" && <Repayment userData={userData} />}
          {selectedSegment === "followup" && <Followup userData={userData} />}
          {selectedSegment === "audit" && <Audit userData={userData} />}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserLoanRepaymentDetails;
