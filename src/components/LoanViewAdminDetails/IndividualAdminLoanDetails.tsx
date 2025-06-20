import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";


import { useLocation } from "react-router";
import AdminLoanAudit from "./AdminLoanAudit";
import AdminLoanClosing from "./AdminLoanClosing";

interface UserDataProps {
  refCustId: string;
  refCustLoanId: number;
  refLoanAmount: string;
  refLoanId: number;
  refLoanStartDate: string;
  refLoanStatus: string;
  refLoanStatusId: number;
  refProductDuration: string;
  refProductInterest: string;
  refUserEmail: string;
  refUserFname: string;
  refUserId: number;
  refUserLname: string;
  refUserMobileNo: string;
}

const IndividualAdminLoanDetails: React.FC = () => {
  // STATUS BAR
  useEffect(() => {
    
    
    

    return () => {
      
    };
  }, []);

  //   HANDLE STATES FROM PREVIOSU PROPS
  const location = useLocation();
  const { userData } = location.state || {};
  console.log("userData", userData);

  //   SEGMENT HANDLER
  const [selectedSegment, setSelectedSegment] = useState<string>("loanAudit");

  //   LOAN DATA EMPTY
  if (!userData) {
    return <div>No loan data available.</div>;
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/adminViewLoan"
              mode="md"
            ></IonBackButton>
          </IonButtons>
          <IonTitle>Admin Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="dashboardContentsTabSplit mx-2 pt-2 px-2 border-round-xl">
          <IonSegment
            value={selectedSegment}
            onIonChange={(e) => {
              const value = e.detail.value;
              if (value) setSelectedSegment(value);
            }}
          >
            <IonSegmentButton value="loanAudit">
              <IonLabel style={{ fontSize: "14px" }}>Loan Audit</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="loanClosing">
              <IonLabel style={{ fontSize: "14px" }}>Loan Closing</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {selectedSegment === "loanAudit" && (
            <AdminLoanAudit loanDataDetails={userData} />
          )}

          {selectedSegment === "loanClosing" && (
            <AdminLoanClosing loanData={userData} />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default IndividualAdminLoanDetails;
