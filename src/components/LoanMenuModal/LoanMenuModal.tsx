import { IonAvatar, IonChip, IonLabel } from "@ionic/react";
import { Divider } from "primereact/divider";
import React from "react";

import { useIonRouter } from "@ionic/react";

import repayment from "../../assets/loan/repayment.png";
import newLoan from "../../assets/loan/newLoan.png";
import viewLoan from "../../assets/loan/viewLoan.png";

type LoanMenuModalProps = {
  onClose: () => void;
};

const LoanMenuModal: React.FC<LoanMenuModalProps> = ({ onClose }) => {
  // ION ROUTER FROM MODAL FOR LOAN NAVIGATION
  const router = useIonRouter();

  const handleNavigation = (path: string) => {
    router.push(path, "forward", "push");
    onClose();
  };

  return (
    <div>
      <div
        className="p-3 flex flex-column"
        style={{
          gap: "2px",
          width: "100%",
        }}
      >
        <IonLabel>User</IonLabel>
        <div className="flex mt-3 gap-2">
          <div
            className="flex-1 flex flex-column align-items-center justify-content-center shadow-2 py-3 border-round-lg"
            onClick={() => handleNavigation("/userLoanRepayment")}
          >
            <img src={repayment} className="modalImg" alt="" />
            <p className="text-sm">Repayment</p>
          </div>
          <div
            className="flex-1 flex flex-column align-items-center justify-content-center shadow-2 py-3 border-round-lg"
            onClick={() => handleNavigation("/userNewLoan")}
          >
            <img src={newLoan} alt="" className="modalImg" />
            <p>New Loan</p>
          </div>
          <div
            className="flex-1 flex flex-column align-items-center justify-content-center shadow-2 py-3 border-round-lg"
            onClick={() => handleNavigation("/userViewLoan")}
          >
            <img src={viewLoan} alt="" className="modalImg" />
            <p>View Loan</p>
          </div>
        </div>

        <Divider />
        <IonLabel>Admin</IonLabel>
        <div className="flex mt-3 gap-2">
          <div
            className="flex-1 flex flex-column align-items-center justify-content-center shadow-2 py-3 border-round-lg"
            onClick={() => handleNavigation("/adminLoanRepayment")}
          >
            <img src={repayment} className="modalImg" alt="" />
            <p className="text-sm">Repayment</p>
          </div>
          <div
            className="flex-1 flex flex-column align-items-center justify-content-center shadow-2 py-3 border-round-lg"
            onClick={() => handleNavigation("/adminNewLoan")}
          >
            <img src={newLoan} alt="" className="modalImg" />
            <p>New Loan</p>
          </div>
          <div
            className="flex-1 flex flex-column align-items-center justify-content-center shadow-2 py-3 border-round-lg"
            onClick={() => handleNavigation("/adminViewLoan")}
          >
            <img src={viewLoan} alt="" className="modalImg" />
            <p>View Loan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanMenuModal;
