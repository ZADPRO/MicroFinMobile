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

import bank from "../../assets/bank/bank.png";
import funds from "../../assets/bank/funds.png";
import expense from "../../assets/bank/expense.png";
import product from "../../assets/bank/products.png";

import "./Bank.css"; // CSS for styling

const Bank: React.FC = () => {
  useEffect(() => {
    
    
    

    return () => {
      
    };
  }, []);

  const history = useHistory();

  const reportData = [
    { imgSrc: bank, text: "Bank", route: "/bankDetails" },
    { imgSrc: funds, text: "Funds", route: "/fundDetails" },
    { imgSrc: expense, text: "Expense", route: "/expenseDetails" },
    { imgSrc: product, text: "Product", route: "/productDetails" },
  ];

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
          <IonTitle>Bank Management</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            {reportData.map((item, index) => (
              <IonCol
                size="5"
                key={index}
                className="ion-text-center bg-white shadow-1 gap-2 m-2"
                style={{ borderRadius: "7px" }}
                onClick={() => handleNavigation(item.route)}
              >
                <div className="rounded">
                  <img
                    src={item.imgSrc}
                    alt=" "
                    style={{ width: "80px", height: "auto", margin: "0 auto" }}
                  />
                  <p className="pt-2">{item.text}</p>
                </div>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Bank;
