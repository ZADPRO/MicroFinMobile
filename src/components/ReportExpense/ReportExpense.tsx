import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonSkeletonText,
  IonToolbar,
  IonModal,
  IonIcon,
  IonFooter,
  IonToast,
  IonButton,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Nullable } from "vitest";
import decrypt, { formatRupees } from "../../services/helper";
import axios from "axios";
import { Calendar } from "primereact/calendar";
import { funnel } from "ionicons/icons";

import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

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

const ReportExpense: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  // HANDLE NAV

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [noDataFound, setNoDataFound] = useState<boolean>(false);

  // MODAL HANDLER
  const [showModal, setShowModal] = useState<boolean>(false);

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

        if (data.success) {
          console.log("data", data);
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

  function formatToYearMonth(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
  }

  const handleExportCSV = async () => {
    const headers = [
      "S.No",
      "Date",
      "Expense",
      "Category",
      "Amount",
      "Amount Source",
      "Type",
    ];

    const rows = expense.map((row, index) => [
      index + 1,
      row.refExpenseDate,
      row.refExpenseCategory,
      row.refSubCategory,
      `INR ${row.refAmount}`,
      row.refBankName,
      row.refAccountTypeName,
    ]);

    const csvContent = [
      headers.join(","), // header row
      ...rows.map((row) => row.map((value) => `"${value}"`).join(",")), // data rows
    ].join("\n");

    const fileName = `Monthly_Expense_Report_${formatToYearMonth(
      date || new Date()
    )}.csv`;

    try {
      await Filesystem.writeFile({
        path: fileName,
        data: csvContent,
        directory: Directory.Documents, // Use Directory.External or Directory.Documents
        encoding: Encoding.UTF8,
      });

      setToastMessage(
        `CSV exported successfully to Documents folder as ${fileName}`
      );
      setShowToast(true);
    } catch (e) {
      console.error("Unable to save file", e);
      setToastMessage("Failed to export CSV.");
      setShowToast(true);
    }
  };

  useEffect(() => {
    setDate(new Date());
    expenseData(new Date());
  }, []);

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
            <IonBackButton defaultHref="/report" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Expense Report</IonTitle>
          <IonButtons slot="end">
            <IonIcon
              icon={funnel}
              onClick={() => setShowModal(true)}
              style={{ fontSize: "20px", paddingRight: "10px" }}
            />
          </IonButtons>
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
            expense.map((item: expense, idx: number) => (
              <div
                key={idx}
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
                  </div>
                  <div className="flex w-full justify-content-end">
                    <p className="mt-1 text-sm">
                      {item.refExpenseDate || "No data"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

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

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
        />
      </IonContent>{" "}
      <IonFooter>
        <IonButton expand="block" onClick={handleExportCSV}>
          Export CSV
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default ReportExpense;
