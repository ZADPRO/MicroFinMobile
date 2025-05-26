import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonSkeletonText,
  IonToolbar,
  IonModal,
  IonIcon,
  IonFooter,
  IonButton,
} from "@ionic/react";

import React, { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useHistory } from "react-router";
import decrypt, { formatRupees } from "../../services/helper";
import { Calendar } from "primereact/calendar";
import { funnel } from "ionicons/icons";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import axios from "axios";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

interface option {
  label: string;
  value: number | string;
}

interface LoanDetails {
  refCustLoanId: number;
  refLoanAmount: string;
  refInitialInterest: string;
  refInterest: string;
  refInterestStatus: string;
  refPrincipal: string;
  refPrincipalStatus: string;
  refLoanStartDate: string; // "YYYY-MM-DD"
  refPaymentDate: string; // "YYYY-MM"
  refRepaymentTypeName: string;
  refUserFname: string;
  refUserLname: string;
  refUserMobileNo: string;
}

const ReportMonthly: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  // HANDLE NAV
  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);
  const [noDataFound, setNoDataFound] = useState<boolean>(false);

  // MODAL HANDLER
  const [showModal, setShowModal] = useState<boolean>(false);

  const [selectedInterestStatusOption, setSelectedInterestStatusOption] =
    useState<string[]>(["Pending", "paid"]);
  const [selectedPrincipalStatusOption, setSelectedPrincipalStatusOption] =
    useState<string[]>(["Pending", "paid"]);
  const [startDate, setStartDate] = useState<Nullable<Date>>(null);
  const [endDate, setEndDate] = useState<Nullable<Date>>(null);

  const [repaymentError, setRepaymentError] = useState(false);
  const [statusError, setStatusError] = useState(false);

  const [overAllData, setOverAllData] = useState<LoanDetails[]>([]);

  const [selectedLoanOption, setSelectedLoanOption] = useState<number>(1);
  const LoanOption: option[] = [
    { label: "Customer Loan", value: 1 },
    { label: "Admin Loan", value: 2 },
  ];
  const loanStatus: option[] = [
    { label: "Pending", value: "Pending" },
    { label: "Paid", value: "paid" },
  ];

  function formatToYearMonth(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
    return `${year}-${month}`;
  }

  const getData = (
    loanOp: number,
    interest: string[] | [],
    principal: string[] | [],
    startDate: string | Date,
    endDate: string | Date
  ) => {
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/report/monthlyReport",
          {
            interest: interest,
            principal: principal,
            loanOption: loanOp,
            startDate: formatToYearMonth(startDate),
            endDate: formatToYearMonth(endDate),
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const data = decrypt(
            response.data[1],
            response.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          );
          localStorage.setItem("token", "Bearer " + data.token);
          if (data.success) {
            console.log("data line ------- 90", data);
            setOverAllData(data.data);
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "S.No",
      "Loan Id",
      "Date",
      "Re-Payment Month",
      "Name",
      "Mobile",
      "Repayment",
      "Loan Amount",
      "Initial Interest",
      "Monthly Interest",
      "Monthly Principal",
      "Principal Status",
      "Interest Status",
    ];

    const rows = overAllData.map((row, index) => [
      index + 1,
      row.refCustLoanId,
      row.refLoanStartDate,
      row.refPaymentDate,
      `${row.refUserFname} ${row.refUserLname}`,
      row.refUserMobileNo,
      row.refRepaymentTypeName,
      `INR ${row.refLoanAmount}`,
      `INR ${row.refInitialInterest}`,
      `INR ${row.refInterest}`,
      `INR ${row.refPrincipal}`,
      `${row.refPrincipalStatus}`,
      `${row.refInterestStatus}`,
    ]);

    const csvContent = [
      headers.join(","), // header row
      ...rows.map((row) => row.map((value) => `"${value}"`).join(",")), // data rows
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Monthly Report (${new Date()}).csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    setStartDate(new Date());
    setEndDate(new Date());
    getData(
      selectedLoanOption,
      selectedInterestStatusOption,
      selectedPrincipalStatusOption,
      new Date(),
      new Date()
    );
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/report" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Monthly Report</IonTitle>
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
        <div className="productsDisplayCards m-3">
          {loading ? (
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
          ) : noDataFound ? (
            <div className="text-center text-gray-500 p-4">No data found</div>
          ) : (
            overAllData.map((item: LoanDetails, idx: number) => (
              <div
                key={idx}
                className="flex p-2 shadow-3 p-3 my-2 border-round-md align-items-center"
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
                  {item.refUserFname?.charAt(0).toUpperCase() || "N"}
                </div>
                <div className="pl-3 flex flex-column w-full align-items-center justify-content-between">
                  <div className="flex flex-row justify-content-between w-full">
                    <p>
                      {item.refUserFname && item.refUserLname
                        ? `${item.refUserFname} ${item.refUserLname}`
                        : "No data"}
                    </p>
                  </div>
                  <div className="flex flex-row justify-content-between w-full">
                    <p>{item.refCustLoanId || "No data"}</p>
                  </div>
                  <div className="flex flex-row justify-content-between w-full mt-1">
                    <p>{item.refRepaymentTypeName || "No data"}</p>
                    <p>{formatRupees(item.refLoanAmount ?? "No data")}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
          keepContentsMounted={true}
          initialBreakpoint={0.75}
          breakpoints={[0, 0.4, 0.75, 1]}
          className="calendar-modal"
        >
          <div className="p-3 flex flex-column justify-content-center">
            <Dropdown
              value={selectedLoanOption}
              onChange={(e: DropdownChangeEvent) => {
                setSelectedLoanOption(e.value);
                getData(
                  e.value,
                  selectedInterestStatusOption,
                  selectedPrincipalStatusOption,
                  startDate || new Date(),
                  endDate || new Date()
                );
              }}
              options={LoanOption}
              optionLabel="label"
              placeholder="Select a Loan"
              className=" w-full"
            />
            <MultiSelect
              filter
              value={selectedInterestStatusOption}
              onChange={(e: MultiSelectChangeEvent) => {
                setSelectedInterestStatusOption(e.value);
                setRepaymentError(e.value.length === 0);
                if (
                  e.value.length !== 0 &&
                  selectedPrincipalStatusOption?.length !== 0
                ) {
                  getData(
                    selectedLoanOption,
                    e.value,
                    selectedPrincipalStatusOption,
                    startDate || new Date(),
                    endDate || new Date()
                  );
                } else {
                  setOverAllData([]);
                }
              }}
              options={loanStatus}
              optionLabel="label"
              placeholder="Select a Repayment Type"
              className="w-[100%] mt-3"
              required
            />
            {repaymentError && (
              <small className="text-[red]">
                Please select at least one repayment type.
              </small>
            )}
          </div>
        </IonModal>
      </IonContent>
      <IonFooter>
        <IonButton expand="block" onClick={handleExportCSV}>
          Export CSV
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default ReportMonthly;
