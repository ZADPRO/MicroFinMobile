import { IonAvatar, IonChip, IonLabel } from "@ionic/react";
import { Divider } from "primereact/divider";
import React from "react";

import { useIonRouter } from "@ionic/react";

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
        <div className="flex flex-wrap loanChips">
          <IonChip
            outline={true}
            onClick={() => handleNavigation("/userLoanRepayment")}
          >
            {" "}
            <IonAvatar>
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel>Repayment</IonLabel>
          </IonChip>
          <IonChip
            outline={true}
            onClick={() => handleNavigation("/userNewLoan")}
          >
            {" "}
            <IonAvatar>
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel>New Loan</IonLabel>
          </IonChip>
          <IonChip
            outline={true}
            onClick={() => handleNavigation("/userViewLoan")}
          >
            {" "}
            <IonAvatar>
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel>View Loan</IonLabel>
          </IonChip>
        </div>
        <Divider />
        <IonLabel>Admin</IonLabel>
        <div className="flex flex-wrap loanChips">
          <IonChip
            outline={true}
            onClick={() => handleNavigation("/adminLoanRepayment")}
          >
            {" "}
            <IonAvatar>
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel>Repayment</IonLabel>
          </IonChip>
          <IonChip
            outline={true}
            onClick={() => handleNavigation("/adminNewLoan")}
          >
            {" "}
            <IonAvatar>
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel>New Loan</IonLabel>
          </IonChip>
          <IonChip
            outline={true}
            onClick={() => handleNavigation("/adminViewLoan")}
          >
            {" "}
            <IonAvatar>
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel>View Loan</IonLabel>
          </IonChip>
        </div>
      </div>
    </div>
  );
};

export default LoanMenuModal;
