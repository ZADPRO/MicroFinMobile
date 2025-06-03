import axios from "axios";
import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";

import { IonRow, IonCol } from "@ionic/react";

interface UserLoanRepaymentProps {
  InteresePay: string;
  isInterestFirst: boolean;
  refBalanceAmt: number;
  refInitialInterest: string;
  refInterestMonthCount: number;
  refInterestStatus: string;
  refLoanAmount: string;
  refLoanDueDate: string;
  refLoanStartDate: string;
  refNewDuration: string;
  refPaymentDate: string;
  refPrincipal: string;
  refPrincipalStatus: string;
  refProductDuration: string;
  refProductInterest: string;
  refProductName: string;
  refRepaymentStartDate: string;
  refRepaymentTypeName: string;
  totalInterest: string;
  totalPrincipal: string;
  refProductDurationType: number;
}

interface UserDataProps {
  refCustId: string;
  refLoanAmount: string;
  refLoanId: number;
  refPaymentDate: string;
  refProductDuration: string;
  refProductInterest: string;
  refProductName: string;
  refRpayId: number;
  refUserAddress: string;
  refUserDistrict: string;
  refUserFname: string;
  refUserId: number;
  refUserLname: string;
  refUserMobileNo: string;
  refUserPincode: string;
  refUserState: string;
}

const LoanDetails: React.FC<{ userData: UserDataProps }> = ({ userData }) => {
  console.log("userData", userData);
  // STATES HANDLED FOR LOAN DETAILS
  const [loanDetails, setLoanDetails] = useState<UserLoanRepaymentProps | null>(
    null
  );

  //   FORMAT DATE
  function formatToFirstOfMonth(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = "01";

    return `${year}-${month}-${day}`;
  }

  // GET LOAN DETAILS FROM DB
  const getLoanData = () => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/AdminRePayment/rePaymentCalculation",
        {
          loanId: userData.refLoanId,
          rePayId: userData.refRpayId,
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
        console.log("data line ----- 205", data);
        localStorage.setItem("token", "Bearer " + data.token);

        if (data.success) {
          setLoanDetails(data.data[0]);
        }
      });
  };
  useEffect(() => {
    getLoanData();
  }, []);

  return (
    <div>
      <div className="loanDetails flex flex-column m-3">
        <p className="text-center font-bold uppercase">
          {userData.refUserFname} {userData.refUserLname}
        </p>
        <p className="text-center mt-2">
          <b>Mobile</b> {userData.refUserMobileNo}
        </p>
        <p className="mt-3 uppercase underline font-bold">Loan Details</p>
        <IonRow className="mt-2">
          <IonCol>
            <b>Payment Month</b>
          </IonCol>
          <IonCol>{loanDetails?.refPaymentDate}</IonCol>
        </IonRow>
        <IonRow className="mt-2">
          <IonCol>
            <b>Total Amount</b>
          </IonCol>
          <IonCol>₹ {loanDetails?.refBalanceAmt}</IonCol>
        </IonRow>
        <IonRow className="mt-2">
          <IonCol>
            <b>Balance Amount</b>
          </IonCol>
          <IonCol>₹ {loanDetails?.refLoanAmount}</IonCol>
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
              : "Days"}
          </IonCol>
        </IonRow>
        <IonRow className="mt-2">
          <IonCol>
            <b>Interest</b>
          </IonCol>
          <IonCol>{loanDetails?.refProductInterest}%</IonCol>
        </IonRow>
        <IonRow className="mt-2">
          <IonCol>
            <b>Repayment Type</b>
          </IonCol>
          <IonCol>{loanDetails?.refRepaymentTypeName}</IonCol>
        </IonRow>
        <IonRow className="mt-2">
          <IonCol>
            <b>Interest Paid Initial</b>
          </IonCol>
          <IonCol>{loanDetails?.isInterestFirst ? "Yes" : "No"}</IonCol>
        </IonRow>
        <IonRow className="mt-2">
          <IonCol>
            <b>
              No. of{" "}
              {loanDetails?.refProductDurationType === 1
                ? "Months"
                : loanDetails?.refProductDurationType === 2
                ? "Weeks"
                : "Days"}{" "}
              Paid First
            </b>
          </IonCol>
          <IonCol>{loanDetails?.refInterestMonthCount}</IonCol>
        </IonRow>
        <IonRow className="mt-2">
          <IonCol>
            <b>Initial Interest</b>
          </IonCol>
          <IonCol>₹ {loanDetails?.refInitialInterest}</IonCol>
        </IonRow>

        <p className="mt-3 uppercase underline font-bold">Current Details</p>
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
            {loanDetails?.refRepaymentStartDate
              ? formatToFirstOfMonth(loanDetails.refRepaymentStartDate)
              : "-"}
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
          <IonCol>₹ {loanDetails?.totalInterest}</IonCol>
        </IonRow>
        <IonRow className="mt-2">
          <IonCol>
            <b>Total Principal Paid</b>
          </IonCol>
          <IonCol>₹ {loanDetails?.totalPrincipal}</IonCol>
        </IonRow>
      </div>
    </div>
  );
};

export default LoanDetails;
