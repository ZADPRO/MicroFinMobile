import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonSearchbar,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import axios from "axios";
import decrypt, { formatRupees } from "../../services/helper";
import { Nullable } from "vitest";
import { add, funnel } from "ionicons/icons";
import { useHistory, useLocation } from "react-router";
import { Calendar } from "primereact/calendar";

interface expense {
  refExpenseDate: string;
  refVoucherNo: string;
  refExpenseCategory: string;
  refSubCategory: string;
  refAmount: string;
  refBankName: string;
  refAccountTypeName: string;
  refExpenseId: number;
  refCategoryId: number;
  refBankId: number;
}

const BankMgntExpense: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  const location = useLocation<{ shouldReload?: boolean }>();

  const [loading, setLoading] = useState<boolean>(false);
  const [noDataFound, setNoDataFound] = useState<boolean>(false);

  // MODAL HANDLER
  const [showModal, setShowModal] = useState<boolean>(false);

  // HANDLE NAV
  const history = useHistory();

  const [searchTerm, setSearchTerm] = useState<string>("");

  // SET DATE - FOR BACKEND API TRIGGER
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [expense, setExpense] = useState<expense[]>([]);

  // FOR THE DATE FUNC - HANDLER
  const formatDate = (data) => {
    const date = new Date(data);
    const formatted = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    return formatted;
  };

  const expenseData = (month) => {
    const date = formatDate(month);
    setLoading(true);
    setNoDataFound(false);

    axios
      .post(
        import.meta.env.VITE_API_URL + "/expense/expenseData",
        { month: date },
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

        console.log("data", data);
        if (data.success) {
          setExpense(data.data);
          setNoDataFound(data.data.length === 0);
        }
      })
      .catch((error) => {
        console.error("error", error);
        setNoDataFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleProductEdit = (item: expense) => {
    history.push("/editExpense", { item });
    localStorage.setItem("editExpense", JSON.stringify(item));
  };

  useEffect(() => {
    setDate(new Date());
    expenseData(new Date());
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    setDate(currentDate);

    // Call API on load or reload
    if (location.state?.shouldReload) {
      expenseData(currentDate);

      // Clear the reload flag so it doesn’t trigger again unnecessarily
      history.replace({ ...location, state: {} });
    } else {
      expenseData(currentDate);
    }
  }, [location.state?.shouldReload]);

  const filteredProducts = expense.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (date) {
      expenseData(date);
    }
  }, [date]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/bank" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Expense Management</IonTitle>
          <IonButtons slot="end">
            <IonIcon
              icon={funnel}
              onClick={() => setShowModal(true)}
              style={{ fontSize: "20px", paddingRight: "10px" }}
            />
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchTerm}
            onIonInput={(e) => setSearchTerm(e.detail.value!)}
            placeholder="Search by Product Name, Status, Interest..."
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="productsDisplayCards m-3">
          {loading ? (
            [...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="flex p-2 shadow-3 p-3 my-2 border-round-md"
              >
                <IonSkeletonText
                  animated
                  style={{
                    width: "40px",
                    height: "35px",
                    borderRadius: "50%",
                  }}
                />
                <div className="pl-3 flex flex-column w-full">
                  <IonSkeletonText animated style={{ width: "60%" }} />
                  <IonSkeletonText
                    animated
                    style={{ width: "40%", marginTop: "6px" }}
                  />
                </div>
              </div>
            ))
          ) : noDataFound ? (
            <div className="text-center text-gray-500 p-4">No data found</div>
          ) : (
            filteredProducts.map((item: expense, idx: number) => (
              <div
                key={idx}
                onClick={() => handleProductEdit(item)}
                className="flex p-2 shadow-3 p-3 my-2 border-round-md align-items-center"
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
                  {item.refExpenseCategory?.charAt(0).toUpperCase() || "N"}
                </div>
                <div className="pl-3 flex flex-column w-full align-items-center justify-content-between">
                  <div className="flex flex-row justify-content-between w-full">
                    <p>{item.refExpenseCategory || "No data"}</p>
                  </div>
                  <div className="flex flex-row justify-content-between w-full">
                    <p>{item.refBankName || "No data"}</p>
                    <p>{formatRupees(item.refAmount ?? "No data")}</p>
                  </div>
                  <div className="flex flex-row justify-content-between w-full mt-1">
                    <p>{item.refSubCategory || "No data"}</p>
                    <p>{item.refExpenseDate || "No data"}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => history.push("/addNewExpense")}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
          keepContentsMounted={true}
        initialBreakpoint={0.75}
        breakpoints={[0, 0.4, 0.75, 1]}
          className="calendar-modal"
        >
          <div className="p-3 flex justify-content-center">
            <Calendar
              value={date}
              onChange={(e) => {
                setDate(e.value);
                setShowModal(false); // Close on date select
              }}
              inline
              showWeek
              view="month"
              maxDate={new Date()}
            />
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default BankMgntExpense;
