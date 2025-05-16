import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import axios from "axios";
import decrypt from "../../services/helper";

interface FundDetailsProps {
  createdAt: string;
  createdBy: string;
  refAccountTypeName: string;
  refBankAccountNo: string;
  refBankFId: number;
  refBankId: number;
  refBankName: string;
  refFundType: string;
  refFundTypeId: number;
  refPaymentType: string;
  refTxnId: number;
  refbfTransactionAmount: string;
  refbfTransactionDate: string;
  refbfTrasactionType: string;
}

const BankMgntFunds: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  // GET THE FUND DETAILS FROM BACKEND

  const [userLists, setUserLists] = useState<FundDetailsProps[] | []>([]);
  const [originalUserLists, setOriginalUserLists] = useState<
    FundDetailsProps[] | []
  >([]);
  const loadData = () => {
    console.log("line --------- 25");
    try {
      axios
        .get(import.meta.env.VITE_API_URL + "/adminRoutes/getBankFundList", {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        })
        .then((response: any) => {
          const data = decrypt(
            response.data[1],
            response.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          );

          localStorage.setItem("token", "Bearer " + data.token);

          if (data.success) {
            console.log("data", data);
            setUserLists(data.BankFund);
            setOriginalUserLists(data.BankFund);
          }
        });
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/bank" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Funds</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="recyclerContent p-2">
          <div className="flex align-items-center justify-content-between">
            <div className="flex flex-column">
              <p>Year</p>
              <p>Month</p>
            </div>
            <div className="totalAmt">INR</div>
          </div>
          <div className="transactionData">
            <div className="flex p-2 shadow-1 p-3 my-2 border-round-md">
              <div
                style={{
                  width: "40px",
                  height: "35px",
                  borderRadius: "50%",
                  background: "#3a3a3e",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                C
              </div>
              <div className="pl-3 flex w-full align-items-center justify-content-between">
                <div className="flex flex-column">
                  <p>Fund Type</p>
                  <p>Date - DD-MM-YYYY</p>
                </div>
                <div className="amount">
                  <p>Amount</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BankMgntFunds;
