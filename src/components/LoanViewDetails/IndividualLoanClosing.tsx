import React from "react";

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

const IndividualLoanClosing: React.FC<IndividualLoanAuditProps> = ({
  loanData,
}) => {
  console.log("userData", loanData);
  return (
    <div>
      <div></div>
    </div>
  );
};

export default IndividualLoanClosing;
