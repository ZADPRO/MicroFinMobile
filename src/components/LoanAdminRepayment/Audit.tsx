import axios from "axios";
import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";
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
  const [selectedAuditItem, setSelectedAuditItem] = useState<AuditData | null>(
    null
  );

  const getAuditData = () => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/adminLoan/loanRePaymentAudit",
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
                background: "#0478df",
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
                <div
                  className="flex"
                  onClick={() => {
                    setSelectedAuditItem(item);
                    setShowModal(true);
                  }}
                >
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
        onDidDismiss={() => {
          setShowModal(false);
          setSelectedAuditItem(null);
        }}
        keepContentsMounted={true}
        initialBreakpoint={0.75}
        breakpoints={[0, 0.4, 0.75, 1]}
        className="calendar-modal"
      >
        <div className="p-3 flex flex-column justify-content-center">
          {selectedAuditItem && (
            <>
              <h3 className="text-center">Follow-up Details</h3>
              {selectedAuditItem.followup.map((fup, idx) => (
                <div key={idx} className="shadow-2 p-3 mb-2 border-round-lg">
                  <p>{fup.Message}</p>
                  <p className="flex justify-content-end text-xs mt-2">
                    {fup.date}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </IonModal>
    </div>
  );
};

export default Audit;
