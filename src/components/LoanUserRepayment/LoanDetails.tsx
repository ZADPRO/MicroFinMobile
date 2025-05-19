import axios from "axios";
import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";

const LoanDetails: React.FC = () => {
  // STATES HANDLED FOR LOAN DETAILS
  const [loanDetails, setLoanDetails] = useState<any>();

  // GET LOAN DETAILS FROM DB
  const getLoanData = () => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/rePayment/rePaymentCalculation",
        {
          //   loanId: loanId,
          //   rePayId: rePayId,
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
      Loan details
      <p>{loanDetails}</p>
    </div>
  );
};

export default LoanDetails;
