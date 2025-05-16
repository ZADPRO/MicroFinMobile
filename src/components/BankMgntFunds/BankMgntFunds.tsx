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
  const [userLists, setUserLists] = useState<FundDetailsProps[]>([]);
  const [monthlyData, setMonthlyData] = useState<any>({});
  console.log("monthlyData", monthlyData);
  const [currentMonthSummary, setCurrentMonthSummary] = useState({
    label: "",
    netAmount: 0,
  });

  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  const loadData = () => {
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
            setUserLists(data.BankFund);
            groupByMonth(data.BankFund);
          }
        });
    } catch (e: any) {
      console.log(e);
    }
  };

  const groupByMonth = (list: FundDetailsProps[]) => {
    const grouped: any = {};
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    let currentMonthKey = "";
    let netAmount = 0;

    list.forEach((item) => {
      const date = new Date(item.refbfTransactionDate);
      const monthYear = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }); // e.g. "May 2025"

      const amount = parseFloat(item.refbfTransactionAmount) || 0;
      const isCredit = item.refbfTrasactionType.toLowerCase() === "credit";
      const signedAmount = isCredit ? amount : -amount;

      if (!grouped[monthYear]) {
        grouped[monthYear] = {
          transactions: [],
          netAmount: 0,
        };
      }

      grouped[monthYear].transactions.push(item);
      grouped[monthYear].netAmount += signedAmount;

      if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      ) {
        currentMonthKey = monthYear;
        netAmount += signedAmount;
      }
    });

    setMonthlyData(grouped);
    setCurrentMonthSummary({
      label: currentMonthKey,
      netAmount: parseFloat(netAmount.toFixed(2)),
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/bank" mode="md" />
          </IonButtons>
          <IonTitle>Funds</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="recyclerContent p-2">
          {/* Top Monthly Summary */}
          {Object.entries(monthlyData)
            .sort((a, b) => {
              const dateA = new Date(a[0]);
              const dateB = new Date(b[0]);
              return dateB.getTime() - dateA.getTime();
            })
            .map(([month, data]: any) => (
              <div key={month} className="mb-4">
                {/* Month Header */}
                <div className="flex justify-content-between align-items-center mb-2">
                  <div className="flex flex-column">
                    <p className="text-base font-medium">
                      {month.split(" ")[0]}
                    </p>{" "}
                    {/* April */}
                    <p className="text-sm text-secondary">
                      {month.split(" ")[1]}
                    </p>{" "}
                    {/* 2025 */}
                  </div>
                  <div
                    className="text-lg"
                    style={{ color: data.netAmount >= 0 ? "green" : "red" }}
                  >
                    INR {data.netAmount >= 0 ? "+" : ""}
                    {data.netAmount.toFixed(2)}
                  </div>
                </div>

                {/* Transactions for the month */}
                {data.transactions.map(
                  (item: FundDetailsProps, idx: number) => (
                    <div
                      key={idx}
                      className="flex p-2 shadow-1 p-3 my-2 border-round-md"
                    >
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
                        {item.refFundType.charAt(0).toUpperCase()}
                      </div>
                      <div className="pl-3 flex w-full align-items-center justify-content-between">
                        <div className="flex flex-column">
                          <p>{item.refFundType}</p>
                          <p>{item.createdAt}</p>
                        </div>
                        <div className="amount">
                          <p
                            style={{
                              color:
                                item.refbfTrasactionType.toLowerCase() ===
                                "debit"
                                  ? "red"
                                  : "green",
                            }}
                          >
                            {item.refbfTrasactionType.toLowerCase() === "debit"
                              ? `-₹${item.refbfTransactionAmount}`
                              : `+₹${item.refbfTransactionAmount}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BankMgntFunds;
