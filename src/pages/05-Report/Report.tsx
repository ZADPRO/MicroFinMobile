import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect } from "react";

import { useHistory } from "react-router";

import overallReport from "../../assets/report/overallReport.png";
import montlyReport from "../../assets/report/montlyReport.png";
import expenseReport from "../../assets/report/ExpenseReport.png";

const Report: React.FC = () => {
  useEffect(() => {
    
    
    

    return () => {
      
    };
  }, []);

  // HANDLE NAV
  const history = useHistory();

  const handleNavigation = (route: string) => {
    history.push(route);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Report Management</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol
              size="5"
              className="ion-text-center bg-white shadow-1 gap-2 m-2"
              style={{ borderRadius: "7px" }}
              onClick={() => handleNavigation("/overallReport")}
            >
              <div className="rounded">
                <img
                  src={overallReport}
                  alt="Users"
                  style={{ width: "80px", height: "auto", margin: "0 auto" }}
                />
                <p className="pt-2">Overall Report</p>
              </div>
            </IonCol>
            <IonCol
              size="5"
              className="ion-text-center bg-white shadow-1 gap-2 m-2"
              style={{ borderRadius: "7px" }}
              onClick={() => handleNavigation("/montlyReport")}
            >
              <div className="rounded">
                <img
                  src={montlyReport}
                  alt="Users"
                  style={{ width: "80px", height: "auto", margin: "0 auto" }}
                />
                <p className="pt-2">Montly Report</p>
              </div>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol
              size="5"
              className="ion-text-center bg-white shadow-1 gap-2 m-2"
              style={{ borderRadius: "7px" }}
              onClick={() => handleNavigation("/expenseReport")}
            >
              <div className="rounded">
                <img
                  src={expenseReport}
                  alt="Users"
                  style={{ width: "80px", height: "auto", margin: "0 auto" }}
                />
                <p className="pt-2">Expense Report</p>
              </div>
            </IonCol>
            <IonCol
              size="5"
              className="ion-text-center bg-white gap-2 m-2"
              style={{ borderRadius: "7px" }}
            ></IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Report;
