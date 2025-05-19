import axios from "axios";
import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";

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
        import.meta.env.VITE_API_URL + "/rePayment/rePaymentCalculation",
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
          <b>Mobile:</b> {userData.refUserMobileNo}
        </p>
        <p className="mt-3 uppercase underline font-bold">Loan Details</p>
        <p className="mt-3">
          <b>Payment Month</b>: {loanDetails?.refPaymentDate}
        </p>
        <p className="mt-2">
          <b>Total Amount</b>: {loanDetails?.refBalanceAmt}
        </p>
        <p className="mt-2">
          <b>Balance Amount</b>: {loanDetails?.refLoanAmount}
        </p>
        <p className="mt-2">
          <b>Loan Duration</b>: {loanDetails?.refProductDuration}
        </p>

        <p className="mt-2">
          <b>Interest</b>: {loanDetails?.refProductInterest} %
        </p>
        <p className="mt-2">
          <b>Re-Payment Type</b>: {loanDetails?.refRepaymentTypeName}
        </p>
        <p className="mt-2">
          <b>Interest Paid Initial</b>:{" "}
          {loanDetails?.isInterestFirst === true ? "Yes" : "No"}
        </p>
        <p className="mt-2">
          <b>No of Month Paid First</b>: {loanDetails?.refInterestMonthCount}
        </p>
        <p className="mt-2">
          <b>Initial Interest</b>: ₹ {loanDetails?.refInitialInterest}
        </p>

        <p className="mt-3 uppercase underline font-bold">Current Details</p>
        <p className="mt-2">
          <b>Loan Get Date</b>: {loanDetails?.refLoanStartDate}
        </p>
        <p className="mt-2">
          <b>Loan Start Month</b>:{" "}
          {loanDetails?.refRepaymentStartDate
            ? formatToFirstOfMonth(loanDetails.refRepaymentStartDate)
            : " -"}
        </p>
        <p className="mt-2">
          <b>Loan End Month</b>: {loanDetails?.refLoanDueDate}
        </p>
        <p className="mt-2">
          <b>Total Interst Paid</b>: ₹ {loanDetails?.totalInterest}
        </p>
        <p className="mt-2">
          <b>Total Principal Paid</b>: ₹ {loanDetails?.totalPrincipal}
        </p>
      </div>
    </div>
  );
};

export default LoanDetails;
