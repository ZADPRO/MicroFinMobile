import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { callSharp, funnel } from "ionicons/icons";

import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import axios from "axios";
import decrypt, { formatRupees } from "../../services/helper";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";

interface LoanDetails {
  BalancePrincipalAmount: string;
  InterestPaidCount: string;
  PrincipalPaidCount: string;
  TotalInterestPaid: string;
  TotalMonthPaidCount: string;
  TotalPrincipalPaid: string;
  UnPaidMonthCount: string;
  refCustLoanId: number;
  refDocFee: string | null;
  refInitialInterest: string;
  refInterestMonthCount: number;
  refLoanAmount: string;
  refLoanStartDate: string;
  refLoanStatus: string;
  refProductDuration: string;
  refProductInterest: string;
  refRepaymentTypeName: string;
  refSecurity: string | null;
  refUserEmail: string;
  refUserFname: string;
  refUserId: number;
  refUserLname: string;
  refUserMobileNo: string;
}

interface option {
  label: string;
  value: number;
}

const ReportOverall: React.FC = () => {
  useEffect(() => {
    
    StatusBar.setStyle({ style: Style.Dark });
    

    return () => {
      
    };
  }, []);

  const LoanOption: option[] = [
    { label: "Customer Loan", value: 1 },
    { label: "Admin Loan", value: 2 },
  ];

  const [loading, setLoading] = useState<boolean>(false);
  const [noDataFound, setNoDataFound] = useState<boolean>(false);

  // MODAL HANDLER
  const [showModal, setShowModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [overAllData, setOverAllData] = useState<LoanDetails[]>([]);
  const [repaymentError, setRepaymentError] = useState(false);
  const [statusError, setStatusError] = useState(false);

  const [repaymentOption, setRepaymentOption] = useState<option[]>([]);
  const [statusOption, setStatusOption] = useState<option[]>([]);
  const [selectedRePaymentOption, setSelectedRePaymentOption] = useState<
    number[]
  >([]);
  const [selectedStatusOption, setSelectedStatusOption] = useState<number[]>(
    []
  );
  const [selectedLoanOption, setSelectedLoanOption] = useState<number>(1);

  function formatToYearMonth(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
  }

  const handleExportCSV = async () => {
    const headers = [
      "S.No",
      "Date",
      "Expense",
      "Category",
      "Amount",
      "Amount Source",
      "Type",
    ];

    const rows = overAllData.map((row, index) => [
      index + 1,
      row.refCustLoanId,
      row.refLoanStartDate,
      `${row.refUserFname} ${row.refUserLname}`,
      row.refUserMobileNo,
      row.refRepaymentTypeName,
      `INR ${row.refLoanAmount}`,
      `INR ${row.refInitialInterest}`,
      `${row.refInterestMonthCount} Month`,
      `${row.refProductInterest} %`,
      `${row.refProductDuration} Month`,
      `INR ${row.TotalPrincipalPaid}`,
      `INR ${row.TotalInterestPaid}`,
      `INR ${row.BalancePrincipalAmount}`,
      `${row.InterestPaidCount} Month`,
      `${row.PrincipalPaidCount} Month`,
      `${row.TotalMonthPaidCount} Month`,
      `${row.UnPaidMonthCount} Month`,
      `${row.refLoanStatus}`,
      `INR ${row.refDocFee === null ? 0 : row.refDocFee}`,
      `${row.refSecurity === null ? "No Document" : row.refSecurity}`,
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

  const getOptions = () => {
    try {
      axios
        .get(import.meta.env.VITE_API_URL + "/report/overAllReportOption", {
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
            const options1: option[] = data.rePayment.map((item: any) => ({
              label: item.refRepaymentTypeName,
              value: item.refRepaymentTypeId,
            }));
            setRepaymentOption(options1);
            setSelectedRePaymentOption(options1.map((opt) => opt.value));

            const options2: option[] = data.status.map((item: any) => ({
              label: item.refLoanStatus,
              value: item.refLoanStatusId,
            }));
            setStatusOption(options2);
            setSelectedStatusOption(options2.map((opt) => opt.value));
            getData(
              selectedLoanOption,
              options1.map((opt) => opt.value),
              options2.map((opt) => opt.value)
            );
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  const getData = (
    loanOp: number,
    rePayment: number[] | [],
    status: number[] | []
  ) => {
    setLoading(true);
    setNoDataFound(false);
    axios
      .post(
        import.meta.env.VITE_API_URL + "/report/overAllReport",
        {
          rePaymentType: rePayment,
          loanStatus: status,
          loanOption: loanOp,
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

  useEffect(() => {
    getOptions();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/report" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Overall Report</IonTitle>
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
                    <p>{item.refUserFname || "No data"}</p>
                    <p
                      className={`loan-status ${
                        item.refLoanStatus?.toLowerCase() || "no-data"
                      }`}
                    >
                      {item.refLoanStatus || "No data"}
                    </p>
                  </div>
                  <div className="flex flex-row justify-content-between w-full mt-1">
                    <p>{item.refRepaymentTypeName || "No data"}</p>
                    <p>{formatRupees(item.refLoanAmount ?? "No data")}</p>
                  </div>
                  <div className="flex flex-row align-items-center gap-1 w-full mt-2">
                    <IonIcon icon={callSharp} />
                    <p>{item.refUserMobileNo || "No data"}</p>
                  </div>
                  <div className="flex w-full justify-content-end">
                    <p className="mt-1 text-sm">
                      {item.refLoanStartDate || "No data"}
                    </p>
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
                getData(e.value, selectedRePaymentOption, selectedStatusOption);
              }}
              options={LoanOption}
              optionLabel="label"
              placeholder="Select a Loan"
              className="p-1 w-full"
            />

            <p className="mt-3">Repayment Type</p>
            <MultiSelect
              value={selectedRePaymentOption}
              onChange={(e: MultiSelectChangeEvent) => {
                setSelectedRePaymentOption(e.value);
                setRepaymentError(e.value.length === 0);
                if (
                  e.value.length !== 0 &&
                  selectedStatusOption?.length !== 0
                ) {
                  getData(selectedLoanOption, e.value, selectedStatusOption);
                } else {
                  setOverAllData([]);
                }
              }}
              options={repaymentOption}
              optionLabel="label"
              placeholder="Select a Repayment Type"
              className="mt-3"
              required
            />
            {repaymentError && (
              <small className="text-[red]">
                Please select at least one repayment type.
              </small>
            )}

            <p className="mt-3">Loan Status</p>
            <MultiSelect
              value={selectedStatusOption}
              onChange={(e: MultiSelectChangeEvent) => {
                setSelectedStatusOption(e.value);
                setStatusError(e.value.length === 0); // true if nothing selected
                if (
                  e.value.length !== 0 &&
                  selectedRePaymentOption?.length !== 0
                ) {
                  getData(selectedLoanOption, selectedRePaymentOption, e.value);
                } else {
                  setOverAllData([]);
                }
              }}
              options={statusOption}
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

export default ReportOverall;
