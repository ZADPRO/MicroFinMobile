import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import axios from "axios";
import decrypt from "../../services/helper";
import { useHistory } from "react-router";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { warningOutline } from "ionicons/icons";

interface option {
  label: string;
  value: number;
  refAccountType?: number;
  amount?: string;
}

const AddNewExpense: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState<
    "danger" | "success" | "warning"
  >("danger");

  // HANDLE NAV
  const history = useHistory();

  //   STATES HANDLED
  const [date, setDate] = useState<any>(new Date());
  const [vocherId, setVoucherId] = useState<string>();
  const [category, setCategory] = useState<number>();
  const [categoryName, setCategoryName] = useState<string | null>();
  const [subCategory, setSubCategory] = useState<string>();
  const [amount, setAmount] = useState<number | null>();
  const [bank, setBank] = useState<number | null>();
  const [categoryOption, setCategoryOption] = useState<option[]>([]);
  const [bankOption, setBankOption] = useState<option[]>([]);

  //   FORMAT DATE
  function formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  //   GET OPTIONS
  const getOption = () => {
    try {
      axios
        .get(import.meta.env.VITE_API_URL + "/expense/expenseOption", {
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
          console.log("data line -------------- > 42", data);

          localStorage.setItem("token", "Bearer " + data.token);

          if (data.success) {
            const options = data.bank.map((d: any) => ({
              label: `${d.refBankName} - ₹ ${d.refBalance}`,
              value: d.refBankId,
              refAccountType: d.refAccountType,
              amount: d.refBalance,
            }));
            setBankOption(options);
            const options1: option[] = data.category.map((item: any) => ({
              label: item.refExpenseCategory,
              value: item.refExpenseCategoryId,
            }));

            // Add "Others" option
            options1.push({ label: "Others", value: 0 });
            setCategoryOption(options1);
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  const validateForm = (): boolean => {
    if (!date) {
      setToastMessage("Please select a date.");
      setToastColor("danger");
      setShowToast(true);
      return false;
    }

    if (!vocherId || vocherId.trim() === "") {
      setToastMessage("Please enter Voucher ID.");
      setToastColor("danger");
      setShowToast(true);
      return false;
    }

    if (category === undefined || category === null) {
      setToastMessage("Please select an Expense Category.");
      setToastColor("danger");
      setShowToast(true);
      return false;
    }

    // If category is "Others" (value 0), categoryName must be entered
    if (category === 0 && (!categoryName || categoryName.trim() === "")) {
      setToastMessage("Please enter the new Category Name.");
      setToastColor("danger");
      setShowToast(true);
      return false;
    }

    if (!subCategory || subCategory.trim() === "") {
      setToastMessage("Please enter Sub-Category.");
      setToastColor("danger");
      setShowToast(true);
      return false;
    }

    if (amount === null || amount === undefined || amount <= 0) {
      setToastMessage("Please enter a valid Amount.");
      setToastColor("danger");
      setShowToast(true);
      return false;
    }

    if (!bank) {
      setToastMessage("Please select Amount Source.");
      setToastColor("danger");
      setShowToast(true);
      return false;
    }

    // Check if amount is less than bank balance
    let bankBalance = 0;
    bankOption.forEach((data) => {
      if (data.value === bank) {
        bankBalance = Number(data.amount || 0);
      }
    });

    if (amount > bankBalance) {
      setToastMessage("Amount cannot be greater than bank balance.");
      setToastColor("danger");
      setShowToast(true);
      return false;
    }

    return true;
  };

  //   SUBMIT PAYLOAD TO BACKEND

  const handelSubmit = () => {
    if (!validateForm()) return; // If validation fails, exit early

    let bankBalance;
    bankOption.map((data) => {
      if (data.value === bank) {
        console.log("data.amount line ------- 94", data.amount);
        bankBalance = data.amount;
      }
    });
    console.log("bankBalance", bankBalance);
    if (Number(bankBalance) < Number(amount)) {
      console.log("bankBalance", bankBalance);
    } else {
      try {
        axios
          .post(
            import.meta.env.VITE_API_URL + "/expense/addExpense",
            {
              expenseDate: formatDateToDDMMYYYY(date),
              voucherNo: vocherId,
              categoryId: category,
              categoryName: categoryName,
              newCategory: category === 0 ? true : false,
              subCategory: subCategory,
              Amount: amount,
              BankID: bank,
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
            console.log("data line -------------- > 101", data);

            localStorage.setItem("token", "Bearer " + data.token);

            if (data.success) {
              console.log("data", data);
              setToastMessage("Expense added successfully!");
              setToastColor("success");
              setShowToast(true);
              history.goBack();
            }
          });
      } catch (error) {
        console.log("error", error);
        setToastMessage("An error occurred while submitting the expense.");
        setToastColor("danger");
        setShowToast(true);
      }
    }
  };

  useEffect(() => {
    getOption();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/expenseDetails"
              mode="md"
            ></IonBackButton>
          </IonButtons>
          <IonTitle>Add New Expense</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="m-3">
          <Calendar
            value={date}
            required
            className="w-full mt-3"
            placeholder="Select Date"
            onChange={(e) => setDate(e.value)}
            dateFormat="dd / mm / yy"
            maxDate={new Date()}
            readOnlyInput
          />
          <InputText
            placeholder="Enter Voucher ID"
            value={vocherId}
            className="w-full mt-3"
            required
            onChange={(e) => setVoucherId(e.target.value)}
          />

          <Dropdown
            filter
            value={category}
            required
            className="w-full mt-3"
            onChange={(e) => {
              setCategory(e.value);
              categoryOption.map((data) => {
                if (data.value == e.value) {
                  setCategoryName(data.label);
                  console.log("data.label", data.label);
                }
              });
            }}
            options={categoryOption}
            optionLabel="label"
            placeholder="Select Expense Category"
          />

          {category === 0 && (
            <div className="flex flex-col">
              <InputText
                placeholder="Category Name"
                className="w-full mt-3"
                value={categoryName}
                required
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
          )}

          <InputText
            placeholder="Enter Sub-Category"
            value={subCategory}
            className="w-full mt-3"
            required
            onChange={(e) => setSubCategory(e.target.value)}
          />

          <InputNumber
            placeholder="Enter Amount"
            inputId="currency-india"
            value={amount}
            className="w-full mt-3"
            required
            onValueChange={(e) => setAmount(e.value)}
            mode="currency"
            currency="INR"
            currencyDisplay="symbol"
            locale="en-IN"
          />

          <Dropdown
            filter
            value={bank}
            onChange={(e) => {
              setBank(e.value);
            }}
            options={bankOption}
            required
            className="w-full mt-3"
            optionLabel="label"
            placeholder="Select Amount Source"
          />

          <button
            className="px-5 mt-3 submitButton w-full"
            onClick={handelSubmit}
          >
            Submit
          </button>
        </div>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          icon={warningOutline}
          className="custom-toast"
          // color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default AddNewExpense;
