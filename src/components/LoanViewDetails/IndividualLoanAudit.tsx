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

interface LoanDataProps {
  interestAmount: any;
  isInterestFirst: boolean;
  principal: string;
  refCustLoanId: number;
  refLoanDueDate: string;
  refLoanId: number;
  refLoanStartDate: string;
  refLoanStatus: string;
  refPayableAmount: null;
  refProductDuration: string;
  refProductId: number;
  refProductInterest: string;
  refProductName: string;
}

interface ProductListProps {
  createdAt: string;
  createdBy: string;
  refProductDescription: string;
  refProductDuration: string;
  refProductId: number;
  refProductInterest: string;
  refProductName: string;
  refProductStatus: string;
}

const IndividualLoanAudit: React.FC<IndividualLoanAuditProps> = ({
  loanDataDetails,
}) => {
  console.log("userData", loanDataDetails);

  //   MODAL HANDLER
  const [showModal, setShowModal] = useState<boolean>(false);

  //   STATE - FOR LOAN HANDLING
  const [loanDetails, setLoanDetails] = useState<LoanAuditProps[] | []>([]);
  const [loanData, setLoadData] = useState<LoanDataProps[] | []>([]);
  const [allBankAccountList, setAllBankAccountList] = useState([]);
  const [productList, setProductList] = useState<ProductListProps[] | []>([]);

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

          setLoadData(data.loanData);

          setAllBankAccountList(data.allBankAccountList);
          const productList = data.productList;
          data.productList.map((data: any, index: any) => {
            const name = `Name : ${data.refProductName} - Interest : ${data.refProductInterest} - Duration : ${data.refProductDuration}`;
            productList[index] = {
              ...productList[index],
              refProductName: name,
            };
          });
          console.log("productList", productList);
          setProductList(productList);
        }
      });
  };

  useEffect(() => {
    getLoanData();
    getLoanDatas(loanDataDetails.refUserId);
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
              onClick={() => setShowModal(true)}
              style={{ fontSize: "22px" }}
            />
          </div>
          {/*  */}
        </>
      ))}

      {/* Modal with Calendar */}
      <IonModal
        isOpen={showModal}
        onDidDismiss={() => setShowModal(false)}
        keepContentsMounted={true}
        initialBreakpoint={0.4}
        breakpoints={[0, 0.4, 0.75]}
        className="calendar-modal"
      >
        <div className="p-3 flex flex-column">
          <IonRow className="mt-2">
            <IonCol>
              <b>Total Loan</b>
            </IonCol>
            <IonCol>₹ %</IonCol>
          </IonRow>
        </div>
      </IonModal>
    </div>
  );
};

export default IndividualLoanAudit;
