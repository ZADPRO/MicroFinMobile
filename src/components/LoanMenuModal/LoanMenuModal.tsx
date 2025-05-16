import { IonAvatar, IonChip, IonLabel } from "@ionic/react";
import { Divider } from "primereact/divider";
import React from "react";

const LoanMenuModal: React.FC = () => {
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
          <IonChip outline={true}>
            {" "}
            <IonAvatar>
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel>Repayment</IonLabel>
          </IonChip>
          <IonChip outline={true}>
            {" "}
            <IonAvatar>
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel>New Loan</IonLabel>
          </IonChip>
          <IonChip outline={true}>
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
          <IonChip outline={true}>
            {" "}
            <IonAvatar>
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel>Repayment</IonLabel>
          </IonChip>
          <IonChip outline={true}>
            {" "}
            <IonAvatar>
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel>New Loan</IonLabel>
          </IonChip>
          <IonChip outline={true}>
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
