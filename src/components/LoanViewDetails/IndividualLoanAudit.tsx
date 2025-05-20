import axios from "axios";
import { Divider } from "primereact/divider";
import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";
import { IonCol, IonIcon, IonModal, IonRow } from "@ionic/react";
import { informationCircleOutline } from "ionicons/icons";

interface IndividualLoanAuditProps {
  loanDataDetails: {
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

interface LoanAuditProps {
  isInterestFirst: boolean;
  refBalanceAmt: number;
  refCustLoanId: number;
  refDocFee: any;
  refInitialInterest: string;
  refInterestMonthCount: number;
  refLoanAmount: string;
  refLoanDueDate: string;
  refLoanId: number;
  refLoanStartDate: string;
  refLoanStatus: string;
  refProductDuration: string;
  refProductInterest: string;
  refProductName: string;
  refRepaymentStartDate: string;
  refRepaymentTypeName: string;
  refSecurity: any;
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

const IndividualLoanAudit: React.FC<IndividualLoanAuditProps> = ({
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
  const [loanDetails, setLoanDetails] = useState<LoanAuditProps[] | []>([]);

  //   LOAN AUDIT DATA HANDLER
  const [auditData, setAuditData] = useState<AuditData[]>([]);

  //   GET LOAN DATA
  const getLoanDatas = async (loanId: any) => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/rePayment/loanDetails",
        {
          loanId: loanId,
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
          console.log("data.data -------> 288", data.data);
          data.data.map((audit) => {
            console.log("audit line 62DD", audit);
            if (audit.refLoanId === loanDataDetails.refLoanId) {
              console.log(
                " -> Line Number ----------------------------------- 289 \n\n\n"
              );
              console.log("data ------------ > 291", data.data);
              console.log("audit line ------ 290", audit);
              setLoanDetails([audit]);
            }
          });
        }
      });
  };

  //   GET ALL LOAN DATA FROM DB
  const getLoanData = () => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/adminRoutes/getLoan",
        {
          userId: loanDataDetails.refUserId,
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
          console.log(data);

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
          // setProductList(productList);
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
        import.meta.env.VITE_API_URL + "/rePayment/loanAudit",
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

  useEffect(() => {
    getLoanData();
    getLoanDatas(loanDataDetails.refUserId);
    getAuditData();
  }, []);

  return (
    <div>
      {loanDetails.map((item, index) => (
        <>
          <Divider align="left">
            <div className="inline-flex align-items-center">
              <i className="pi pi-wallet mr-2 text-[#007bff]"></i>
              <b className="text-[#007bff]">
                Loan {loanDetails[index].refCustLoanId}
              </b>
            </div>
          </Divider>{" "}
          {/* DISPLAY LOAN DETAILS IN MODAL */}
          <div className="flex shadow-1 p-3 justify-content-between align-items-center">
            <p>Product Name: {loanDetails[index]?.refProductName}</p>
            <IonIcon
              icon={informationCircleOutline}
              onClick={() => {
                setSelectedIndex(index); // Store the current index
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
        </>
      ))}

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
          {selectedIndex !== null && (
            <>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Product Name</b>
                </IonCol>
                <IonCol>{loanDetails[selectedIndex]?.refProductName}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Total Amount</b>
                </IonCol>
                <IonCol>₹ {loanDetails[selectedIndex]?.refLoanAmount}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Balance Amount</b>
                </IonCol>
                <IonCol>₹ {loanDetails[selectedIndex]?.refBalanceAmt}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Loan Duration</b>
                </IonCol>
                <IonCol>
                  {loanDetails[selectedIndex]?.refProductDuration}
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Interest</b>
                </IonCol>
                <IonCol>
                  {loanDetails[selectedIndex]?.refProductInterest} %
                </IonCol>
              </IonRow>
              {/* =============== */}
              <IonRow className="mt-2">
                <IonCol>
                  <b>Re-Payment Type</b>
                </IonCol>
                <IonCol>
                  ₹ {loanDetails[selectedIndex]?.refRepaymentTypeName}
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Interest Paid Initial</b>
                </IonCol>
                <IonCol>
                  ₹{" "}
                  {loanDetails[selectedIndex]?.isInterestFirst === true
                    ? "Yes"
                    : "No"}
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>No of Month Paid First</b>
                </IonCol>
                <IonCol>
                  ₹ {loanDetails[selectedIndex]?.refInterestMonthCount}
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Initial Interst</b>
                </IonCol>
                <IonCol>
                  ₹ {loanDetails[selectedIndex]?.refInitialInterest}
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Loan Get Date</b>
                </IonCol>
                <IonCol>
                  ₹ {loanDetails[selectedIndex]?.refLoanStartDate}
                </IonCol>
              </IonRow>
              {/* =========================== */}
              <IonRow className="mt-2">
                <IonCol>
                  <b>Loan Start Month</b>
                </IonCol>
                <IonCol>
                  ₹{" "}
                  {loanDetails[selectedIndex]?.refRepaymentStartDate
                    ? formatToFirstOfMonth(
                        loanDetails[selectedIndex].refRepaymentStartDate
                      )
                    : " -"}
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Loan End Month</b>
                </IonCol>
                <IonCol>₹ {loanDetails[selectedIndex]?.refLoanDueDate}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Total Interest Paid</b>
                </IonCol>
                <IonCol>₹ {loanDetails[selectedIndex]?.totalInterest}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Total Principal Paid</b>
                </IonCol>
                <IonCol>₹ {loanDetails[selectedIndex]?.totalPrincipal}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Loan Status</b>
                </IonCol>
                <IonCol>
                  ₹{" "}
                  {loanDetails[selectedIndex]?.refLoanStatus
                    ?.charAt(0)
                    .toUpperCase() +
                    loanDetails[selectedIndex]?.refLoanStatus?.slice(1)}
                </IonCol>
              </IonRow>
              {/* ====================== */}
              <IonRow className="mt-2">
                <IonCol>
                  <b>Documentation Fees</b>
                </IonCol>
                <IonCol>
                  ₹{" "}
                  {loanDetails[selectedIndex]?.refDocFee === null
                    ? 0.0
                    : loanDetails[selectedIndex]?.refDocFee}
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Security</b>
                </IonCol>
                <IonCol>
                  ₹{" "}
                  {loanDetails[selectedIndex]?.refSecurity === null
                    ? "No Security Provide"
                    : loanDetails[selectedIndex]?.refSecurity}
                </IonCol>
              </IonRow>
            </>
          )}
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

export default IndividualLoanAudit;
