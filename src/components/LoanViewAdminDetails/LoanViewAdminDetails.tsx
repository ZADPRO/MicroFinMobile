import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";


import axios from "axios";
import decrypt from "../../services/helper";
import { calendarOutline } from "ionicons/icons";
import { useHistory } from "react-router";

interface LoanData {
  refLoanId: number;
  refVendorId: number;
  refVendorName: string;
  refVendorMobileNo: string;
  refVendorEmailId: string;
  refDescription: string;
  refLoanAmount: string; // If you plan to use this for calculations, consider changing to number
  refLoanDuration: number;
  refLoanInterest: number;
  refLoanStartDate: string; // Format: 'YYYY-MM-DD'
  refLoanStatus: string;
  refVenderType: number;
  refLoanStatusId: number;
}

const LoanViewAdminDetails: React.FC = () => {
  // STATUS BAR
  useEffect(() => {
    
    
    

    return () => {
      
    };
  }, []);

  // NAVIGATION STATES
  const history = useHistory();

  // HANDLE LOAN DETALIS STATE
  const [loanList, setLoanList] = useState<LoanData[]>([]);

  // GET LAON DETAILS FORM DB
  const getLoanList = () => {
    axios
      .get(import.meta.env.VITE_API_URL + "/adminLoan/allLoan", {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        localStorage.setItem("token", "Bearer " + data.token);

        if (data.success) {
          console.log("Data line ---------------- 65", data);
          setLoanList(data.data);
        }
      });
  };

  // LOAN STATUS FOR CARD
  const statusClassMap = {
    1: "loan-status-opened",
    2: "loan-status-closed",
    3: "loan-status-top-up",
    4: "loan-status-extend",
  } as const;

  // PREVIEW
  const statusCharMap: Record<number, string> = {
    1: "O", // Opened
    2: "C", // Closed
    3: "T", // Top-Up
    4: "E", // Extend
  };

  const statusBgMap: Record<number, string> = {
    1: "#28a745", // Opened - dark gray
    2: "#ff0000", // Closed - gray
    3: "#0000ff", // Top-Up - blue
    4: "#ffa500", // Extend - green
  };

  useEffect(() => {
    getLoanList();
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/user" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Admin Loan List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="m-3">
          {loanList.length > 0 ? (
            loanList.map((item, index) => {
              const statusId = item.refLoanStatusId;

              return (
                <div
                  key={index}
                  onClick={() =>
                    history.push("/viewIndividualAdminLoan", {
                      userData: item,
                    })
                  }
                  className="flex p-2 shadow-3 p-3 my-2 border-round-md align-items-center"
                >
                  <div
                    style={{
                      width: "40px",
                      height: "35px",
                      borderRadius: "50%",
                      color: "white",
                      background: statusBgMap[statusId] || "#ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {statusCharMap[statusId] || "-"}
                  </div>

                  <div className="pl-3 flex flex-column w-full justify-content-between">
                    <div className="flex w-full flex-row align-items-center justify-content-between">
                      <p>{item.refVendorName}</p>

                      <p
                        className={`capitalize ${
                          statusClassMap[
                            item.refLoanStatusId as keyof typeof statusClassMap
                          ] || ""
                        }`}
                      >
                        {item.refLoanStatus.toUpperCase()}
                      </p>
                    </div>

                    <div className="mt-1">
                      <p>
                        {" "}
                        {item.refVenderType === 1
                          ? "Outside Vendor"
                          : item.refVenderType === 2
                          ? "Bank"
                          : item.refVenderType === 3
                          ? "Depositor"
                          : "-"}{" "}
                      </p>
                    </div>

                    <div className="flex mt-1 flex-row justify-content-between">
                      <p className="flex align-items-center gap-1">
                        <IonIcon icon={calendarOutline} />{" "}
                        {item.refLoanStartDate}
                      </p>
                      <p>₹ {item.refLoanAmount}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex">No Data Found</div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoanViewAdminDetails;
