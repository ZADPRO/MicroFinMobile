import axios from "axios";
import { Divider } from "primereact/divider";
import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";
import { IonCol, IonIcon, IonModal, IonRow } from "@ionic/react";
import { informationCircleOutline } from "ionicons/icons";

interface IndividualLoanAuditProps {
  loanDataDetails: {
    refDescription: string;
    refLoanAmount: string;
    refLoanDuration: number;
    refLoanId: number;
    refLoanInterest: string;
    refLoanStartDate: string;
    refLoanStatus: string;
    refLoanStatusId: number;
    refVenderType: number;
    refVendorEmailId: string;
    refVendorId: number;
    refVendorMobileNo: string;
    refVendorName: string;
  };
}

interface LoanAuditProps {
  isInterestFirst: boolean;
  refBalanceAmt: number;
  refInitialInterest: string;
  refInterestMonthCount: number;
  refLoanAmount: string;
  refLoanDueDate: string;
  refLoanId: number;
  refLoanStartDate: string;
  refLoanStatus: string;
  refProductDuration: number;
  refProductInterest: string;
  refRepaymentStartDate: string;
  refRepaymentTypeName: string;
  refVendorName: string;
  totalInterest: string;
  totalPrincipal: string;
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

const AdminLoanAudit: React.FC<IndividualLoanAuditProps> = ({
  loanDataDetails,
}) => {
  console.log("userData", loanDataDetails);

  //   MODAL HANDLER
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  //   MODAL FOR FOLLOW UP
  const [showFollowUpModal, setShowFollowUpModal] = useState<boolean>(false);
  const [selectedAuditItem, setSelectedAuditItem] = useState<AuditData | null>(
    null
  );

  //   STATE - FOR LOAN HANDLING
  const [loanDetails, setLoanDetails] = useState<LoanAuditProps | null>(null);

  //   LOAN AUDIT DATA HANDLER
  const [auditData, setAuditData] = useState<AuditData[]>([]);

  //   GET ALL LOAN DATA FROM DB
  const getLoanData = () => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/adminRoutes/getLoan",
        {
          userId: loanDataDetails.refVendorId,
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
        localStorage.setItem("token", "Bearer " + data.token);

        if (data.success) {
          // setLoadData(data.loanData);

          // setAllBankAccountList(data.allBankAccountList);
          const productList = data.productList;
          data.productList.map((data: any, index: any) => {
            const name = `Name : ${data.refProductName} - Interest : ${data.refProductInterest} - Duration : ${data.refProductDuration}`;
            productList[index] = {
              ...productList[index],
              refProductName: name,
            };
          });
          console.log("productList", productList);
          //   setProductList(productList);
        }
      });
  };

  //   FORMAT DATE
  function formatToFirstOfMonth(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = "01";

    return `${year}-${month}-${day}`;
  }

  //   GET LOAN AUDIT DATA
  const getAuditData = () => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/adminLoan/loanRePaymentAudit",
        {
          loanId: loanDataDetails.refLoanId,
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

  const getLoanDatas = async () => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/adminLoan/loanAudit",
        {
          loanId: loanDataDetails.refLoanId,
          userId: loanDataDetails.refVendorId,
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
        console.log("data line ------ 278", data);
        localStorage.setItem("token", "Bearer " + data.token);

        if (data.success) {
          setLoanDetails(data.data[0]);
        }
      });
  };

  useEffect(() => {
    getLoanDatas();
    getAuditData();
  }, []);
  return (
    <div>
      <Divider align="left">
        <div className="inline-flex align-items-center">
          <i className="pi pi-wallet mr-2 text-[#007bff]"></i>
          <b className="text-[#007bff]">
            {/* Loan {loanDetails[index].refCustLoanId} */}
          </b>
        </div>
      </Divider>{" "}
      {/* DISPLAY LOAN DETAILS IN MODAL */}
      <div className="flex shadow-1 p-3 justify-content-between align-items-center">
        <p>Vendor Name: {loanDetails?.refVendorName}</p>
        <IonIcon
          icon={informationCircleOutline}
          onClick={() => {
            setShowModal(true); // Open the modal
          }}
          style={{ fontSize: "22px" }}
        />
      </div>
      {/* LOAN CARD DETAILS */}
      {auditData.length > 0 ? (
        auditData.map((item, index) => {
          return (
            <div
              key={index}
              className="flex p-2 shadow-3 p-3 my-2 border-round-md align-items-center"
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
                  <div
                    className="flex"
                    onClick={() => {
                      setSelectedAuditItem(item);
                      setShowFollowUpModal(true);
                    }}
                  >
                    <p>Follow Up</p>
                  </div>
                )}

                <p className="mt-2 flex justify-content-end text-sm">
                  {item.Month}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex">No Data Found</div>
      )}
      {/* Modal for producct info */}
      <IonModal
        isOpen={showModal}
        onDidDismiss={() => setShowModal(false)}
        keepContentsMounted={true}
        initialBreakpoint={0.75}
        breakpoints={[0, 0.4, 0.75, 1]}
      >
        <div
          className="p-3 flex flex-column overflow-auto"
          style={{ marginBottom: "10px" }}
        >
          <IonRow className="mt-2">
            <IonCol>
              <b>Vendor Name</b>
            </IonCol>
            <IonCol>{loanDetails?.refVendorName}</IonCol>
          </IonRow>
          <IonRow className="mt-2">
            <IonCol>
              <b>Total Amount</b>
            </IonCol>
            <IonCol> ₹ {loanDetails?.refLoanAmount}</IonCol>
          </IonRow>
          <IonRow className="mt-2">
            <IonCol>
              <b>Balance Amount</b>
            </IonCol>
            <IonCol> ₹ {loanDetails?.refBalanceAmt}</IonCol>
          </IonRow>
          {/* =============== */}
          <IonRow className="mt-2">
            <IonCol>
              <b>Loan Duration</b>
            </IonCol>
            <IonCol>{loanDetails?.refProductDuration}</IonCol>
          </IonRow>
          <IonRow className="mt-2">
            <IonCol>
              <b>Interest</b>
            </IonCol>
            <IonCol>{loanDetails?.refRepaymentTypeName}</IonCol>
          </IonRow>
          <IonRow className="mt-2">
            <IonCol>
              <b>Repayment Type</b>
            </IonCol>
            <IonCol>{loanDetails?.refProductInterest}</IonCol>
          </IonRow>
          {/* =============== */}
          <IonRow className="mt-2">
            <IonCol>
              <b>Interst Paid Initial</b>
            </IonCol>
            <IonCol>
              {loanDetails?.isInterestFirst === true ? "Yes" : "No"}
            </IonCol>
          </IonRow>
          <IonRow className="mt-2">
            <IonCol>
              <b>No Of Month Paid First</b>
            </IonCol>
            <IonCol>{loanDetails?.refInterestMonthCount}</IonCol>
          </IonRow>
          <IonRow className="mt-2">
            <IonCol>
              <b>Initial Interest</b>
            </IonCol>
            <IonCol> ₹ {loanDetails?.refInitialInterest}</IonCol>
          </IonRow>
          {/* =============== */}
          <IonRow className="mt-2">
            <IonCol>
              <b>Loan Get Date</b>
            </IonCol>
            <IonCol>{loanDetails?.refLoanStartDate}</IonCol>
          </IonRow>
          <IonRow className="mt-2">
            <IonCol>
              <b>Loan Start Month</b>
            </IonCol>
            <IonCol>
              {" "}
              {loanDetails?.refRepaymentStartDate
                ? formatToFirstOfMonth(loanDetails.refRepaymentStartDate)
                : " -"}
            </IonCol>
          </IonRow>
          <IonRow className="mt-2">
            <IonCol>
              <b>Loan End Month</b>
            </IonCol>
            <IonCol>{loanDetails?.refLoanDueDate}</IonCol>
          </IonRow>
          {/* =============== */}
          <IonRow className="mt-2">
            <IonCol>
              <b>Total Interest Paid</b>
            </IonCol>
            <IonCol>₹ {loanDetails?.totalInterest}</IonCol>
          </IonRow>
          <IonRow className="mt-2">
            <IonCol>
              <b>Total Principal Paid</b>
            </IonCol>
            <IonCol>₹ {loanDetails?.totalPrincipal}</IonCol>
          </IonRow>
          <IonRow className="mt-2">
            <IonCol>
              <b>Loan Status</b>
            </IonCol>
            <IonCol>
              {" "}
              {loanDetails?.refLoanStatus
                ? loanDetails.refLoanStatus.charAt(0).toUpperCase() +
                  loanDetails.refLoanStatus.slice(1)
                : "N/A"}
            </IonCol>
          </IonRow>
          {/* =============== */}
        </div>
      </IonModal>
      {/* Modal for follow up */}
      <IonModal
        isOpen={showFollowUpModal}
        onDidDismiss={() => setShowFollowUpModal(false)}
        keepContentsMounted={true}
        initialBreakpoint={0.75}
        breakpoints={[0, 0.4, 0.75, 1]}
      >
        <div
          className="p-3 flex flex-column overflow-auto"
          style={{ marginBottom: "10px" }}
        >
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

export default AdminLoanAudit;
