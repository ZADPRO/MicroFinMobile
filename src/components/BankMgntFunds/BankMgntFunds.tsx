import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import axios from "axios";
import decrypt from "../../services/helper";
import { funnel } from "ionicons/icons";

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
  // STATUS BAR HANDLER
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  // USER DATA HANDLER
  const [userLists, setUserLists] = useState<FundDetailsProps[]>([]);
  const [monthlyData, setMonthlyData] = useState<any>({});
  console.log("monthlyData", monthlyData);
  const [currentMonthSummary, setCurrentMonthSummary] = useState({
    label: "",
    netAmount: 0,
  });

  // GET DATA FROM DATABASE

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

  // GROUPING THE MONTH FOR OVERALL SUMMARY
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

  // MODAL HANDLER
  const [showModal, setShowModal] = useState<boolean>(false);

  // FILTER OPTIONS - HANDLER
  const [activeFilter, setActiveFilter] = useState("Bank Name");

  const [selectedBankNames, setSelectedBankNames] = useState<string[]>([]);
  const [selectedFundTypes, setSelectedFundTypes] = useState<string[]>([]);
  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState<string[]>(
    []
  );
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleCheckChange = (value: string, checked: boolean, type: string) => {
    const setterMap: any = {
      bank: setSelectedBankNames,
      fund: setSelectedFundTypes,
      payment: setSelectedPaymentTypes,
      action: setSelectedActions,
    };

    const stateMap: any = {
      bank: selectedBankNames,
      fund: selectedFundTypes,
      payment: selectedPaymentTypes,
      action: selectedActions,
    };

    const updated = checked
      ? [...stateMap[type], value]
      : stateMap[type].filter((v: string) => v !== value);

    setterMap[type](updated);
  };

  // APPLY FILTER DATA
  const applyFilters = () => {
    const filtered = userLists.filter((item) => {
      const createdDate = new Date(item.createdAt);

      const matchesBank =
        selectedBankNames.length === 0 ||
        selectedBankNames.includes(item.refBankName);
      const matchesFund =
        selectedFundTypes.length === 0 ||
        selectedFundTypes.includes(item.refFundType);
      const matchesPayment =
        selectedPaymentTypes.length === 0 ||
        selectedPaymentTypes.includes(item.refPaymentType);
      const matchesAction =
        selectedActions.length === 0 ||
        selectedActions.includes(item.refbfTrasactionType);

      const matchesFrom =
        !fromDate || new Date(item.createdAt) >= new Date(fromDate);
      const matchesTo = !toDate || new Date(item.createdAt) <= new Date(toDate);

      return (
        matchesBank &&
        matchesFund &&
        matchesPayment &&
        matchesAction &&
        matchesFrom &&
        matchesTo
      );
    });

    groupByMonth(filtered); // update UI
    setShowModal(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/bank" mode="md" />
          </IonButtons>
          <IonTitle>Funds</IonTitle>
          <IonButtons slot="end">
            <IonIcon
              icon={funnel}
              onClick={() => setShowModal(true)}
              style={{ fontSize: "20px", paddingRight: "10px" }}
            />
          </IonButtons>
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
                    <p className="text-sm text-secondary">
                      {month.split(" ")[1]}
                    </p>{" "}
                  </div>
                  <div
                    className="text-lg"
                    style={{ color: data.netAmount >= 0 ? "green" : "red" }}
                  >
                    {data.netAmount >= 0 ? "+ " : " "}₹{" "}
                    {data.netAmount.toFixed(2)}
                  </div>
                </div>

                {/* Transactions for the month */}
                {data.transactions.map(
                  (item: FundDetailsProps, idx: number) => (
                    <div
                      key={idx}
                      className="flex p-2 shadow-3 p-3 my-2 border-round-md"
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
                          <p style={{ fontSize: "13px" }}>{item.createdAt}</p>
                        </div>
                        <div className="amount">
                          <p
                            style={{
                              color:
                                item.refbfTrasactionType.toLowerCase() ===
                                "debit"
                                  ? "red"
                                  : "green",
                              fontSize: "16px",
                            }}
                          >
                            {item.refbfTrasactionType.toLowerCase() === "debit"
                              ? `- ₹${Number(
                                  item.refbfTransactionAmount
                                ).toFixed(2)}`
                              : `+ ₹${Number(
                                  item.refbfTransactionAmount
                                ).toFixed(2)}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}
        </div>

        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
          keepContentsMounted={true}
          initialBreakpoint={0.4}
          breakpoints={[0, 0.4, 0.75]}
          className="calendar-modal"
        >
          <div className="p-3">
            <div className="flex">
              {/* LEFT SIDE: Filter Types */}
              <div className="w-4 border-right-1 pr-3">
                {[
                  "Bank Name",
                  "Fund Type",
                  "Payment Type",
                  "Action",
                  "From Date",
                  "To Date",
                ].map((item, idx) => (
                  <p
                    key={idx}
                    className={`mb-3 cursor-pointer ${
                      activeFilter === item ? "font-bold" : ""
                    }`}
                    onClick={() => setActiveFilter(item)}
                  >
                    {item}
                  </p>
                ))}
              </div>

              {/* RIGHT SIDE: Dynamic Filter Values */}
              <div className="w-8 pl-3">
                {activeFilter === "Bank Name" &&
                  Array.from(new Set(userLists.map((i) => i.refBankName))).map(
                    (name, idx) => (
                      <div key={idx} className="mb-2">
                        <input
                          type="checkbox"
                          checked={selectedBankNames.includes(name)}
                          onChange={(e) =>
                            handleCheckChange(name, e.target.checked, "bank")
                          }
                        />{" "}
                        {name}
                      </div>
                    )
                  )}

                {activeFilter === "Fund Type" &&
                  Array.from(new Set(userLists.map((i) => i.refFundType))).map(
                    (type, idx) => (
                      <div key={idx} className="mb-2">
                        <input
                          type="checkbox"
                          checked={selectedFundTypes.includes(type)}
                          onChange={(e) =>
                            handleCheckChange(type, e.target.checked, "fund")
                          }
                        />{" "}
                        {type}
                      </div>
                    )
                  )}

                {activeFilter === "Payment Type" &&
                  Array.from(
                    new Set(userLists.map((i) => i.refPaymentType))
                  ).map((type, idx) => (
                    <div key={idx} className="mb-2">
                      <input
                        type="checkbox"
                        checked={selectedPaymentTypes.includes(type)}
                        onChange={(e) =>
                          handleCheckChange(type, e.target.checked, "payment")
                        }
                      />{" "}
                      {type}
                    </div>
                  ))}

                {activeFilter === "Action" &&
                  ["credit", "debit"].map((type, idx) => (
                    <div key={idx} className="mb-2">
                      <input
                        type="checkbox"
                        checked={selectedActions.includes(type)}
                        onChange={(e) =>
                          handleCheckChange(type, e.target.checked, "action")
                        }
                      />{" "}
                      {type}
                    </div>
                  ))}

                {activeFilter === "From Date" && (
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                )}

                {activeFilter === "To Date" && (
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                )}
              </div>
            </div>

            {/* Apply Button */}
            <div className="mt-3 text-center">
              <button onClick={applyFilters}>Apply Filters</button>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default BankMgntFunds;
