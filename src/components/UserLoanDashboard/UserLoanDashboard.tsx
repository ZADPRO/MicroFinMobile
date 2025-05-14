import React from "react";
import "./UserLoanDashboard.css";

const UserLoanDashboard: React.FC = () => {
  console.log("UserLoanDashboard", UserLoanDashboard);
  return (
    <div>
      <div className="cardsForCarousel">
        <div className="flex w-full h-full">
          <p className="flex-1 flex border-1 border-round-xl m-1 align-items-center justify-content-center">
            Total Loan Count
          </p>
          <div className="flex flex-1 flex-column">
            <p className="flex-1 flex align-items-center border-1 border-round-xl m-1 justify-content-center">
              Total Amount
            </p>
            <p className="flex-1 flex align-items-center border-1 border-round-xl m-1 justify-content-center">
              Initial Interst
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoanDashboard;
