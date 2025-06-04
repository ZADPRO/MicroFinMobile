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
import axios from "axios";
import decrypt from "../../services/helper";
import { Nullable } from "primereact/ts-helpers";
import { Calendar } from "primereact/calendar";
import { useHistory } from "react-router";

interface UserListProps {
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

const LoanUserRepayment: React.FC = () => {
  // STATUS BAR
  useEffect(() => {
    return () => {};
  }, []);

  // HISTORY FOR NAVIGATE
  const history = useHistory();
  // SHOW MODAL
  const [showModal, setShowModal] = useState<boolean>(false);

  //   SEARCH TERMS
  const [searchTerm, setSearchTerm] = useState<string>("");

  // STATES FOR USER LISTING
  const [userLists, setUserLists] = useState<UserListProps[] | []>([]);

  const [userListType, setUserListType] = useState({
    name: "Over All",
    code: 0,
  });
  const [startDate, setStartDate] = useState<Nullable<Date>>(null);
  const [endDate, setEndDate] = useState<Nullable<Date>>(null);

  // FORMAT THE YEAR TO MONTH
  function formatToYearMonth(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
    return `${year}-${month}`;
  }

  function formatToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  // USER LIST - IN REPAYMENT
  const loadData = () => {
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/rePayment/userList",
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
          console.log("data", data);

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

  const filteredProducts = userLists.filter((item) =>
    Object.values(item)
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
          <IonTitle>User Loan Repayment</IonTitle>
          <IonButtons slot="end">
            <IonIcon
              icon={funnel}
              onClick={() => setShowModal(true)}
              style={{ marginRight: "10px", fontSize: "16px" }}
            />
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchTerm}
            onIonInput={(e) => setSearchTerm(e.detail.value!)}
            placeholder="Search by Bank, A/C, IFSC..."
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* LIST THE USERS */}

        {filteredProducts.length > 0 ? (
          filteredProducts.map((item, index) => (
            <div
              key={index}
              onClick={() =>
                history.push("/userLoanRepaymentDetails", { userData: item })
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
                {item.refUserFname.charAt(0).toUpperCase()}
              </div>
              <div className="pl-3 flex flex-row w-full align-items-center justify-content-between">
                <div className="contents w-full">
                  <div className="flex justify-content-between w-full">
                    <p>{item.refCustId}</p>
                    <p className="">₹{item.refLoanAmount}</p>
                  </div>
                  <p className="mt-1">
                    {item.refUserFname} {item.refUserLname}
                  </p>
                  <div className="mt-1 flex justify-content-between">
                    <p>Interest: {item.refProductInterest}%</p>
                    <p>Duration: {item.refProductDuration}</p>
                  </div>
                  <div className="flex w-full justify-content-end">
                    <p className="text-sm">
                      {formatToYearMonth(item.refPaymentDate)}
                    </p>
                  </div>
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
          <div
            className="p-3 flex flex-column justify-content-center gap-3"
            tabIndex={-1}
          >
            <p>Start Date</p>
            <Calendar
              value={startDate}
              onChange={(e) => {
                setStartDate(e.value);
                if (endDate && e.value && endDate < e.value) {
                  setEndDate(e.value);
                }
              }}
              placeholder="Start Date"
              showIcon
              touchUI
              dateFormat="dd/mm/yy"
            />
            <p>End Date</p>
            <Calendar
              placeholder="End Date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.value);
              }}
              touchUI
              dateFormat="dd/mm/yy"
              showIcon
              minDate={startDate || undefined}
              disabled={!startDate}
            />
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default LoanUserRepayment;
