import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { funnel } from "ionicons/icons";
import { Nullable } from "vitest";
import { Calendar } from "primereact/calendar";
import { useHistory } from "react-router";
import axios from "axios";
import decrypt, { formatRupees } from "../../services/helper";

interface UserListProps {
  refLoanAmount: string;
  refLoanId: number;
  refPaymentDate: string;
  refProductDuration: number;
  refProductInterest: string;
  refRpayId: number;
  refUserAddress: string;
  refUserId: number;
  refUserMobileNo: string;
  refVendorName: string;
}

const LoanAdminRepayment: React.FC = () => {
  // STATUS BAR
  useEffect(() => {
    return () => {};
  }, []);

  // HISTORY FOR NAVIGATE
  const history = useHistory();

  // SHOW MODAL
  const [showModal, setShowModal] = useState<boolean>(false);

  // STATES FOR USER LISTING
  const [userLists, setUserLists] = useState<UserListProps[] | []>([]);

  const [userListType, setUserListType] = useState({
    name: "Over All",
    code: 0,
  });

  // FORMAT THE YEAR TO MONTH
  function formatToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const [startDate, setStartDate] = useState<Nullable<Date>>(null);
  const [endDate, setEndDate] = useState<Nullable<Date>>(null);

  // USER LIST - IN REPAYMENT
  const loadData = () => {
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/AdminRePayment/userList",
          {
            ifMonth: userListType.code === 0 ? false : true,
            startDate: startDate ? formatToDDMMYYYY(startDate) : "",
            endDate: endDate ? formatToDDMMYYYY(endDate) : "",
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

          const list = data.data;
          console.log("list line ------ 87", list);

          if (data.success) {
            setUserLists(list);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/user" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Admin Repayment</IonTitle>
          <IonButtons slot="end">
            <IonIcon
              icon={funnel}
              onClick={() => setShowModal(true)}
              style={{ marginRight: "10px", fontSize: "16px" }}
            />
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar />
        </IonToolbar>{" "}
      </IonHeader>
      <IonContent>
        {/* LIST THE USERS */}

        {userLists.length > 0 ? (
          userLists.map((item, index) => (
            <div
              key={index}
              onClick={() =>
                history.push("/repaymentDetails", { userData: item })
              }
              className="flex flex-row align-items-center m-3 shadow-1 p-3 border-round-2xl"
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
                {item.refVendorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-column w-full">
                <div className="pl-3 flex flex-row w-full align-items-center justify-content-between">
                  <div className="contents">
                    <p>{item.refVendorName}</p>
                  </div>
                  <div className="monthDetails">
                    <p>{formatToYearMonth(item.refPaymentDate)}</p>
                  </div>
                </div>
                <div className="pl-3 mt-2 flex flex-row w-full align-items-center justify-content-between">
                  <div className="contents">
                    <p>{formatRupees(item.refLoanAmount)}</p>
                  </div>
                  <div className="monthDetails">
                    <p>{item.refProductInterest}%</p>
                  </div>
                </div>
                <div className="pl-3 mt-2 flex flex-row w-full align-items-center justify-content-between">
                  <p>{item.refUserMobileNo}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center m-4">No user data available.</p>
        )}
        {/* FILTER MODAL */}
        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
          keepContentsMounted={true}
          initialBreakpoint={0.75}
          breakpoints={[0, 0.4, 0.75, 1]}
          className="calendar-modal"
        >
          <div className="p-3 flex flex-column justify-content-center">
            <Calendar
              value={startDate}
              placeholder="Select Start Range"
              className="mt-3"
              onChange={(e) => {
                setStartDate(e.value);
                if (endDate && e.value && endDate < e.value) {
                  setEndDate(e.value);
                }
              }}
              view="month"
              dateFormat="dd-mm-yy"
            />
            <Calendar
              value={endDate}
              placeholder="Select End Range"
              onChange={(e) => {
                setEndDate(e.value);
              }}
              dateFormat="dd-mm-yy"
              view="month"
              className="mt-3"
              minDate={startDate || undefined}
              disabled={!startDate}
            />
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default LoanAdminRepayment;
