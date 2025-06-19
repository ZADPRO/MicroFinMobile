import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import decrypt from "../../services/helper";
import { IonCol, IonIcon, IonLabel, IonModal, IonRow } from "@ionic/react";
import { informationCircleOutline } from "ionicons/icons";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { Message } from "primereact/message";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useHistory } from "react-router";
import { InputText } from "primereact/inputtext";

interface IndividualLoanAuditProps {
  loanData: {
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
  };
}

interface setUserLoanProps {
  refLoanAmount: string;
  refLoanId: number;
  refProductDuration: string;
  refProductInterest: string;
}

interface BankDetailsReponseProps {
  refAccountType: number;
  refAccountTypeName: string;
  refBankAccountNo: string;
  refBankId: number;
  refBankName: string;
  refIFSCsCode: string;
}

interface MatchedLoanDetailsProps {
  isInterestFirst: boolean;
  refBalanceAmt: string; // Note: it's a string, e.g., "-20227.83"
  refInitialInterest: string;
  refInterestMonthCount: number;
  refLoanAmount: string;
  refLoanDueDate: string; // Format: YYYY-MM-DD
  refLoanId: number;
  refLoanStartDate: string;
  refLoanStatus: string;
  refProductDuration: number;
  refProductInterest: string;
  refRepaymentStartDate: string;
  refRepaymentTypeName: string;
  refVendorName: string;
  totalInterest: string;
  totalPrincipal: string;
}

const AdminLoanClosing: React.FC<IndividualLoanAuditProps> = ({ loanData }) => {
  // NAVIGATION HANDLER
  const history = useHistory();
  // MODLA STATES HANDLED FOR AUDIT PAGE
  const [showModal, setShowModal] = useState<boolean>(false);

  // USE STATE FOR LOAN CLOSING AUDIT
  const [userLoan, setUserLoan] = useState<setUserLoanProps[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<number | null>();
  const [bankModeType, setBankModeType] = useState<string>("");
  const [loanDetails, setLoanDetails] =
    useState<MatchedLoanDetailsProps | null>(null);
  const [showCard, setShowCard] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [errorShow, setErrorShow] = useState(false);
  const [loanAmt, setLoanAmt] = useState<string | null>();
  const [newLoanAmt, setNewLoanAmt] = useState<number | null>();

  const [bankDetailsResponse, setBankDetailsReponse] = useState<
    BankDetailsReponseProps[] | []
  >([]);
  const [bankID, setBankid] = useState<number | null>();

  // GET ALL LOAN DATA FROM DB BY PASSING THE LOAN ID
  const getLoanDatas = async (LoanId: number) => {
    console.log("LoanId", LoanId);
    axios
      .post(
        import.meta.env.VITE_API_URL + "/adminLoan/loanCloseData",
        {
          LoanId: LoanId,
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
        console.log("data line ------ 278", data);
        localStorage.setItem("token", "Bearer " + data.token);

        if (data.success) {
          const matchedLoan = data.data.find(
            (item) => item.refLoanId === LoanId
          );
          console.log("matchedLoan", matchedLoan);
          setLoanDetails(matchedLoan);
          const options = data.bank.map((d: any) => ({
            name: `Name : ${d.refBankName} - A/C : ${d.refBankAccountNo} - IFSC's : ${d.refIFSCsCode}`,
            value: d.refBankId,
            refAccountType: d.refAccountType,
          }));
          console.log("options", options);
          setBankDetailsReponse(options);
          setShowCard(true);
        }
      });
  };

  // GET ALL USER LOAN DATA - FOR LOAN CLOSING
  const getUserLoanData = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/adminRoutes/addLoanOption`,
        { userId: loanData.refUserId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      localStorage.setItem("token", "Bearer " + data.token);

      console.log("data", data);
      if (data.success) {
        const options = data.data.map((d: any) => ({
          name: `Loan Amt : ${d.refLoanAmount} - Interest : ${d.refProductInterest} - Duration : ${d.refProductDuration}`,
          value: d.refLoanId,
        }));
        setUserLoan(options);
      }
    } catch (error) {
      console.error("Error loading loan data", error);
    }
  };

  // FORMAT DATE
  function formatToFirstOfMonth(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = "01";

    return `${year}-${month}-${day}`;
  }

  // FORM SUBMIT TO CLOSE THE LOAN
  const loanUpdate = () => {
    console.log("selectedLoan", selectedLoan);
    axios
      .post(
        import.meta.env.VITE_API_URL + "/adminLoan/payPrincipalAmt",
        {
          LoanId: selectedLoan,
          principalAmt: newLoanAmt,
          bankId: bankID,
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
        console.log("data line ------ 278", data);
        localStorage.setItem("token", "Bearer " + data.token);

        if (data.success) {
          setSelectedLoan(null);
          setLoanDetails(null);
          setBankModeType("");
          setBankid(null);
          setLoanAmt(null);
          history.goBack();
        }
      });
  };

  const rawAmountRef = useRef<number>(0); // Store the actual number
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputValueChangeForInr = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value;
    const numericValue = input.replace(/[^0-9]/g, ""); // Remove non-numeric chars
    console.log("numericValue", numericValue);

    let amount = parseInt(numericValue || "0", 10);
    const maxValue = parseFloat(loanDetails?.refBalanceAmt ?? "0");

    if (amount > maxValue) {
      amount = Math.floor(maxValue); // Clamp to max
    }

    rawAmountRef.current = amount;
    console.log("rawAmountRef", rawAmountRef);
    const formatted = formatINR(amount);
    console.log("formatted", formatted);
    setNewLoanAmt(Number(numericValue));
    setLoanAmt(formatted);
  };

  useEffect(() => {
    setShowCard(true);
    setErrorShow(false);
    setSelectedLoan(loanData.refLoanId);
    getLoanDatas(loanData.refLoanId);
    getUserLoanData();
  }, []);
  return (
    <div>
      <div className="mt-3">
        {showCard && (
          <>
            <div className="flex shadow-1 p-3 justify-content-between align-items-center">
              <p>Vendor Name: {loanDetails?.refVendorName}</p>
              <IonIcon
                icon={informationCircleOutline}
                onClick={() => {
                  setShowModal(true); // Open the modal
                }}
                style={{ fontSize: "22px" }}
              />
            </div>
            <InputText
              className="mt-3 w-full"
              placeholder="Enter Balance Amount"
              disabled={loanData?.refLoanStatus !== "opened"}
              value={loanAmt ?? ""}
              onChange={handleInputValueChangeForInr}
            />

            <div className="flex flex-wrap gap-3 mt-3">
              <div className="flex align-items-center">
                <RadioButton
                  inputId="bankModeType1"
                  name="Bank"
                  value="Bank"
                  disabled={loanData?.refLoanStatus !== "opened"}
                  onChange={(e: RadioButtonChangeEvent) =>
                    setBankModeType(e.value)
                  }
                  checked={bankModeType === "Bank"}
                />
                <label htmlFor="bankModeType1" className="ml-2">
                  Bank
                </label>
              </div>
              <div className="flex align-items-center">
                <RadioButton
                  inputId="bankModeType2"
                  disabled={loanData?.refLoanStatus !== "opened"}
                  name="Cash"
                  value="Cash"
                  onChange={(e: RadioButtonChangeEvent) =>
                    setBankModeType(e.value)
                  }
                  checked={bankModeType === "Cash"}
                />
                <label htmlFor="bankModeType2" className="ml-2">
                  Cash
                </label>
              </div>
            </div>

            {errorShow && (
              <div className="flex mt-3 ">
                <div className="flex-1">
                  <Message text={errorMessage} />
                </div>
              </div>
            )}

            <Dropdown
              value={bankID}
              filter
              onChange={(e: DropdownChangeEvent) => setBankid(e.value)}
              options={bankDetailsResponse.filter(
                (item) =>
                  (bankModeType === "Bank" && item.refAccountType === 1) ||
                  (bankModeType === "Cash" && item.refAccountType === 2)
              )}
              optionValue="value"
              disabled={loanData?.refLoanStatus !== "opened"}
              optionLabel="name"
              placeholder="Select a Bank"
              className="w-full mt-3"
            />

            <button
              className="px-5 mt-3 submitButton w-full"
              onClick={loanUpdate}
              disabled={loanData?.refLoanStatus !== "opened"}
            >
              Submit
            </button>
          </>
        )}
      </div>{" "}
      <IonModal
        isOpen={showModal}
        onDidDismiss={() => setShowModal(false)}
        keepContentsMounted={true}
        initialBreakpoint={0.75}
        breakpoints={[0, 0.4, 0.75, 1]}
      >
        <div
          className="p-3 flex flex-column overflow-auto"
          style={{ marginBottom: "10px" }}
        >
          {loanDetails !== null && (
            <>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Vendor Name</b>
                </IonCol>
                <IonCol>{loanDetails?.refVendorName}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Loan Amount</b>
                </IonCol>
                <IonCol>{loanDetails?.refProductInterest}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Balance Amount</b>
                </IonCol>
                <IonCol>{loanDetails?.refBalanceAmt}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Loan Duration</b>
                </IonCol>
                <IonCol>
                  {" "}
                  {loanDetails?.refProductDuration}{" "}
                  {loanDetails?.refProductDurationType === 1
                    ? "Months"
                    : loanDetails?.refProductDurationType === 2
                    ? "Weeks"
                    : "Days"}{" "}
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Loan Interest</b>
                </IonCol>
                <IonCol>{loanDetails?.refProductInterest} %</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Re-Payment Type</b>
                </IonCol>
                <IonCol>{loanDetails?.refRepaymentTypeName}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Interest Paid First</b>
                </IonCol>
                <IonCol>
                  {loanDetails?.isInterestFirst === true ? "Yes" : "No"}
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>
                    No of{" "}
                    {loanDetails?.refProductDurationType === 1
                      ? "Months"
                      : loanDetails?.refProductDurationType === 2
                      ? "Weeks"
                      : "Days"}{" "}
                    Paid First
                  </b>
                </IonCol>
                <IonCol>
                  {" "}
                  {loanDetails?.refInterestMonthCount === null
                    ? 0
                    : loanDetails?.refInterestMonthCount}{" "}
                  %
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Initial Interest</b>
                </IonCol>
                <IonCol>
                  {" "}
                  {loanDetails?.refInitialInterest === null
                    ? 0
                    : loanDetails?.refInitialInterest}{" "}
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Loan Get Date</b>
                </IonCol>
                <IonCol>{loanDetails?.refLoanStartDate}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>
                    Loan Start{" "}
                    {loanDetails?.refProductDurationType === 1
                      ? "Months"
                      : loanDetails?.refProductDurationType === 2
                      ? "Weeks"
                      : "Days"}{" "}
                    :{" "}
                  </b>
                </IonCol>
                <IonCol>
                  {" "}
                  {loanDetails?.refRepaymentStartDate
                    ? formatToFirstOfMonth(loanDetails?.refRepaymentStartDate)
                    : " -"}
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>
                    Loan End{" "}
                    {loanDetails?.refProductDurationType === 1
                      ? "Months"
                      : loanDetails?.refProductDurationType === 2
                      ? "Weeks"
                      : "Days"}{" "}
                  </b>
                </IonCol>
                <IonCol>{loanDetails?.refLoanDueDate}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Total Interest Paid</b>
                </IonCol>
                <IonCol>{loanDetails?.totalInterest}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Total Principal Paid</b>
                </IonCol>
                <IonCol>{loanDetails?.totalPrincipal}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Loan Status</b>
                </IonCol>
                <IonCol>{loanDetails?.refLoanStatus}</IonCol>
              </IonRow>
            </>
          )}
        </div>
      </IonModal>
    </div>
  );
};

export default AdminLoanClosing;
