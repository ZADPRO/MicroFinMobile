import axios from "axios";
import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";
import { Panel } from "primereact/panel";
import { IonModal } from "@ionic/react";
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

interface followupData {
  FollowId: number;
  Message: string;
  date: any;
  UpdateAt: any;
}
interface AuditData {
  RpayId: number;
  LoanId: number;
  Month: string;
  Interest: number;
  Principal: number;
  PrincipalStatus: string;
  InterestStatus: string;
  followup: followupData[];
}

const Audit: React.FC<{ userData: UserDataProps }> = ({ userData }) => {
  console.log("userData", userData);
  const [auditData, setAuditData] = useState<AuditData[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const renderFollowup = (rowData: AuditData) => {
    if (
      !rowData.followup ||
      rowData.followup.length === 0 ||
      rowData.followup[0].UpdateAt === null
    ) {
      return <span>No follow-ups</span>;
    }

    return (
      <>
        {rowData.followup.map((item, index) => (
          <Panel
            key={index}
            header={item.UpdateAt}
            toggleable
            collapsed={true}
            expandIcon="pi pi-chevron-down"
            collapseIcon="pi pi-times"
          >
            <p>
              <b>Message</b>
            </p>
            <p>{item.Message}</p>
            <p>
              <b>Date & Time given By User</b>
            </p>
            <p>{item.date}</p>
          </Panel>
        ))}
      </>
    );
  };

  const getAuditData = () => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/rePayment/loanAudit",
        {
          loanId: userData.refLoanId,
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
          setAuditData(data.data);
        }
      });
  };

  useEffect(() => {
    getAuditData();
  }, []);

  return (
    <div className="m-3">
      {auditData.length > 0 ? (
        auditData.map((item, index) => (
          <div
            key={index}
            className="flex p-2 shadow-3 p-3 my-2 border-round-md"
          >
            <div
              style={{
                width: "40px",
                height: "35px",
                borderRadius: "50%",
                background: "#3a3a3e",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              I
            </div>
            <div className="pl-3 flex flex-column w-full justify-content-between">
              <div className="flex w-full flex-row align-items-center justify-content-between">
                <p>Interest: ₹ {item.Interest}</p>
                <p
                  className={`capitalize ${
                    item.InterestStatus.toLowerCase() === "paid"
                      ? "status-paid"
                      : "status-unpaid"
                  }`}
                >
                  {item.InterestStatus}
                </p>
              </div>
              <div className="flex w-full flex-row align-items-center justify-content-between">
                <p>Principal: ₹ {item.Principal}</p>
                <p
                  className={`capitalize ${
                    item.PrincipalStatus.toLowerCase() === "paid"
                      ? "status-paid"
                      : "status-unpaid"
                  }`}
                >
                  {item.PrincipalStatus}
                </p>
              </div>
              {!item.followup ||
              item.followup.length === 0 ||
              item.followup[0].UpdateAt === null ? (
                <span>No follow-ups</span>
              ) : (
                <div className="flex" onClick={() => setShowModal(true)}>
                  <p>Follow Up</p>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center m-4">No user data available.</p>
      )}

      <IonModal
        isOpen={showModal}
        onDidDismiss={() => setShowModal(false)}
        keepContentsMounted={true}
        initialBreakpoint={0.5}
        breakpoints={[0, 0.5, 0.75]}
        className="calendar-modal"
      >
        <div className="p-3 flex justify-content-center"></div>
      </IonModal>
    </div>
  );
};

export default Audit;
