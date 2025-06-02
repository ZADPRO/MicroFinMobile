import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import axios from "axios";
import decrypt, { formatRupees } from "../../services/helper";
import { add, funnel } from "ionicons/icons";
import { useHistory } from "react-router";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { useLocation } from "react-router"; // import useLocation
import { Nullable } from "vitest";

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
    return () => {};
  }, []);

  // HISTORY NAV
  const history = useHistory();
  const location = useLocation(); // get location object

  useEffect(() => {
    console.log("location", location);
    // If the page was redirected with shouldReload = true
  }, []);

  const [loading, setLoading] = useState<boolean>(true);

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
    setLoading(true);

    try {
      axios
        .get(import.meta.env.VITE_API_URL + "/adminRoutes/getBankFundList", {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const data = decrypt(
            response.data[1],
            response.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          );

          localStorage.setItem("token", "Bearer " + data.token);

          if (data.success) {
            console.log("data", data);
            setUserLists(data.BankFund);
            groupByMonth(data.BankFund);
          }
          setLoading(false);
        });
    } catch (e: any) {
      console.log(e);
      setLoading(false);
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
    console.log("grouped", grouped);
    setCurrentMonthSummary({
      label: currentMonthKey,
      netAmount: parseFloat(netAmount.toFixed(2)),
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Call API on load or reload
    if (location.state?.shouldReload) {
      loadData();
      // Clear the reload flag so it doesn’t trigger again unnecessarily
      history.replace({ ...location, state: {} });
    } else {
      loadData();
    }
  }, [location.state?.shouldReload]);

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
  const [fromDate, setFromDate] = useState<Nullable<Date>>(null);
  const [toDate, setToDate] = useState<Nullable<Date>>(null);

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
        <div className="recyclerContent p-3">
          {loading ? (
            // Show 4 skeletons as placeholders
            [...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="flex p-2 shadow-3 p-3 my-2 border-round-md"
              >
                <IonSkeletonText
                  animated
                  style={{
                    width: "40px",
                    height: "35px",
                    borderRadius: "50%",
                  }}
                />
                <div className="pl-3 flex flex-column w-full">
                  <IonSkeletonText animated style={{ width: "60%" }} />
                  <IonSkeletonText
                    animated
                    style={{ width: "40%", marginTop: "6px" }}
                  />
                </div>
              </div>
            ))
          ) : (
            <>
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
                        {data.netAmount >= 0 ? "+ " : " "}
                        {formatRupees(data.netAmount.toFixed(2))}
                      </div>
                    </div>

                    {/* Transactions for the month */}
                    {data.transactions.map(
                      (item: FundDetailsProps, idx: number) => (
                        <div
                          key={idx}
                          className="flex p-2 shadow-3 p-4 my-2 border-round-md"
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "35px",
                              borderRadius: "50%",
                              background: "#0478df",
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
                              <p style={{ fontSize: "13px" }}>
                                {item.createdAt}
                              </p>
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
                                {item.refbfTrasactionType.toLowerCase() ===
                                "debit"
                                  ? `- ${formatRupees(
                                      item.refbfTransactionAmount
                                    )}`
                                  : `+ ${formatRupees(
                                      item.refbfTransactionAmount
                                    )}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ))}
            </>
          )}
        </div>

        {/* ADD NEW FUNDS */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => history.push("/addNewFunds")}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
          keepContentsMounted={true}
          initialBreakpoint={0.6}
          breakpoints={[0, 0.4, 0.6, 1]}
          className="calendar-modal"
        >
          <div className="py-4">
            <div className="flex flex-col md:flex-row">
              {/* LEFT SIDE: Filter Types */}
              <div className="w-full md:w-1/3 bg-gray-100 rounded-lg p-3 shadow-sm">
                {[
                  "Bank Name",
                  "Fund Type",
                  // "Payment Type",
                  "Action",
                  "From Date",
                  "To Date",
                ].map((item, idx) => (
                  <p
                    key={idx}
                    className={`py-2 px-3 mb-2 rounded cursor-pointer transition-all text-black ${
                      activeFilter === item
                        ? "bg-gray-300 font-semibold"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveFilter(item)}
                  >
                    {item}
                  </p>
                ))}
              </div>

              {/* RIGHT SIDE: Filter Values */}
              <div className="w-full md:w-2/3 bg-white rounded-lg px-3 py-4 shadow-md max-h-[50vh] overflow-y-auto text-black">
                {activeFilter === "Bank Name" &&
                  Array.from(new Set(userLists.map((i) => i.refBankName))).map(
                    (name, idx) => (
                      <div key={idx} className="flex align-items-center mb-2">
                        <Checkbox
                          inputId={`bank-${idx}`}
                          checked={selectedBankNames.includes(name)}
                          onChange={(e) =>
                            handleCheckChange(name, e.checked, "bank")
                          }
                          className="mr-2"
                        />
                        <label htmlFor={`bank-${idx}`} className="text-sm">
                          {name}
                        </label>
                      </div>
                    )
                  )}

                {activeFilter === "Fund Type" &&
                  Array.from(new Set(userLists.map((i) => i.refFundType))).map(
                    (type, idx) => (
                      <div key={idx} className="flex align-items-center mb-2">
                        <Checkbox
                          inputId={`fund-${idx}`}
                          checked={selectedFundTypes.includes(type)}
                          onChange={(e) =>
                            handleCheckChange(type, e.checked, "fund")
                          }
                          className="mr-2"
                        />
                        <label htmlFor={`fund-${idx}`} className="text-sm">
                          {type}
                        </label>
                      </div>
                    )
                  )}

                {/* {activeFilter === "Payment Type" &&
                  Array.from(
                    new Set(userLists.map((i) => i.refPaymentType))
                  ).map((type, idx) => (
                    <div key={idx} className="flex align-items-center mb-2">
                      <Checkbox
                        inputId={`payment-${idx}`}
                        checked={selectedPaymentTypes.includes(type)}
                        onChange={(e) =>
                          handleCheckChange(type, e.checked, "payment")
                        }
                        className="mr-2"
                      />
                      <label htmlFor={`payment-${idx}`} className="text-sm">
                        {type}
                      </label>
                    </div>
                  ))} */}

                {activeFilter === "Action" &&
                  ["credit", "debit"].map((type, idx) => (
                    <div key={idx} className="flex align-items-center mb-2">
                      <Checkbox
                        inputId={`action-${idx}`}
                        checked={selectedActions.includes(type)}
                        onChange={(e) =>
                          handleCheckChange(type, e.checked, "action")
                        }
                        className="mr-2"
                      />
                      <label
                        htmlFor={`action-${idx}`}
                        className="text-sm capitalize"
                      >
                        {type}
                      </label>
                    </div>
                  ))}

                {activeFilter === "From Date" && (
                  <Calendar
                    value={fromDate}
                    onChange={(e) => setFromDate(e.value)}
                    dateFormat="yy-mm-dd"
                    placeholder="Choose From Date"
                    className="w-full"
                  />
                )}

                {activeFilter === "To Date" && (
                  <Calendar
                    value={toDate}
                    onChange={(e) => setToDate(e.value)}
                    dateFormat="yy-mm-dd"
                    placeholder="Choose To Date"
                    className="w-full"
                  />
                )}
              </div>
            </div>

            {/* Apply Button */}
            <div className="mx-3 text-center">
              <button
                onClick={applyFilters}
                className="px-5 mt-2 submitButton w-full"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default BankMgntFunds;
