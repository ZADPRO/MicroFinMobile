import React from 'react';

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
const Repayment: React.FC<{ userData: UserDataProps }> = ({ userData }) => {
    return (
        <div>
Reapyadf
        </div>
    );
};

export default Repayment;