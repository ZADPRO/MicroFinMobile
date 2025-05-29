import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { StatusBar, Style } from "@capacitor/status-bar";
import axios from "axios";
import decrypt from "../../services/helper";
import { calendarOutline } from "ionicons/icons";
import { useHistory } from "react-router";

interface UserLoanDetailsProps {
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
}

const LoanViewDetails: React.FC = () => {
  // STATUS BAR
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  //   SEARCH TERMS HANDLER
  const [searchTerm, setSearchTerm] = useState<string>("");

  // NAVIGATION STATES
  const history = useHistory();

  // STATES FOR USER DATA
  const [userLists, setUserLists] = useState<UserLoanDetailsProps[] | []>([]);

  // USER LOAN GET DETAILS FROM DB
  const loadData = () => {
    try {
      axios
        .get(import.meta.env.VITE_API_URL + "/adminRoutes/getAllLoan", {
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
            console.log("data", data);
            setUserLists(data.AllLoanData);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const filteredProducts = userLists.filter((item) =>
    Object.values(item)
      .map((val) =>
        typeof val === "string" || typeof val === "number" ? val : ""
      )
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/user" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>User Loan Details</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchTerm}
            onIonInput={(e) => setSearchTerm(e.detail.value!)}
            placeholder="Search here..."
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="m-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => {
              const statusId = item.refLoanStatusId;

              return (
                <div
                  key={index}
                  onClick={() =>
                    history.push("/viewIndividualUserLoan", {
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
                      <p>
                        {item.refUserFname} {item.refUserLname}
                      </p>

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
                      <p>Loan ID: {item.refCustLoanId}</p>
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

export default LoanViewDetails;
