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
  IonToast,
} from "@ionic/react";

import React, { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import decrypt, { formatRupees } from "../../services/helper";
import { Calendar } from "primereact/calendar";
import { funnel } from "ionicons/icons";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import axios from "axios";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Nullable } from "vitest";

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

  const [loading, setLoading] = useState<boolean>(false);
  const [noDataFound, setNoDataFound] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

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
    setLoading(true);
    setNoDataFound(false);

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
          setNoDataFound(data.data.length === 0);
        }
      })
      .catch((error) => {
        console.error("error", error);
        setNoDataFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleExportCSV = async () => {
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

    const fileName = `Monthly_Expense_Report_${formatToYearMonth(
      new Date()
    )}.csv`;

    try {
      await Filesystem.writeFile({
        path: fileName,
        data: csvContent,
        directory: Directory.Documents, // Use Directory.External or Directory.Documents
        encoding: Encoding.UTF8,
      });

      setToastMessage(
        `CSV exported successfully to Documents folder as ${fileName}`
      );
      setShowToast(true);
    } catch (e) {
      console.error("Unable to save file", e);
      setToastMessage("Failed to export CSV.");
      setShowToast(true);
    }
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
            <p className="mt-3">Interest Status</p>
            <MultiSelect
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
              className="mt-3 w-[14rem]"
              required
            />
            {repaymentError && (
              <small className="text-[red]">
                Please select at least one repayment type.
              </small>
            )}

            <p className="mt-3">Principal Status</p>

            <MultiSelect
              value={selectedPrincipalStatusOption}
              onChange={(e: MultiSelectChangeEvent) => {
                setSelectedPrincipalStatusOption(e.value);
                setStatusError(e.value.length === 0); // true if nothing selected
                if (
                  e.value.length !== 0 &&
                  selectedInterestStatusOption?.length !== 0
                ) {
                  getData(
                    selectedLoanOption,
                    selectedInterestStatusOption,
                    e.value,
                    startDate || new Date(),
                    endDate || new Date()
                  );
                } else {
                  setOverAllData([]);
                }
              }}
              options={loanStatus}
              optionLabel="label"
              placeholder="Select a Loan Status"
              className="mt-3"
              required
            />
            {statusError && (
              <small className="text-[red]">
                Please select at least one loan status.
              </small>
            )}

            <p className="mt-3">From Date</p>

            <Calendar
              value={startDate}
              placeholder="Select Start Range"
              className="mt-3"
              onChange={(e) => {
                setStartDate(e.value);
                if (endDate && e.value && endDate < e.value) {
                  setEndDate(e.value);
                  getData(
                    selectedLoanOption,
                    selectedInterestStatusOption,
                    selectedPrincipalStatusOption,
                    e.value,
                    e.value
                  );
                } else {
                  getData(
                    selectedLoanOption,
                    selectedInterestStatusOption,
                    selectedPrincipalStatusOption,
                    e.value || new Date(),
                    endDate || new Date()
                  );
                }
              }}
              view="month"
              dateFormat="mm/yy"
              maxDate={new Date()}
            />

            <p className="mt-3">To Date</p>

            <Calendar
              value={endDate}
              placeholder="Select End Range"
              onChange={(e) => {
                setEndDate(e.value);
                getData(
                  selectedLoanOption,
                  selectedInterestStatusOption,
                  selectedPrincipalStatusOption,
                  startDate || new Date(),
                  e.value || new Date()
                );
              }}
              className="mt-3"
              view="month"
              dateFormat="mm/yy"
              minDate={startDate || undefined}
              disabled={!startDate}
              maxDate={new Date()}
            />
          </div>
        </IonModal>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
        />
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
