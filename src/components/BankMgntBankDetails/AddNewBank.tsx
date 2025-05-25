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
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import decrypt from "../../services/helper";
import { useHistory } from "react-router";

const AddNewBank: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  // USE HISTORY
  const history = useHistory();

  const [toast, setToast] = useState({
    show: false,
    message: "",
    color: "danger", // use 'success' for success messages
  });

  // SET BANK DETAILS
  const [bankType, setBankType] = useState<string>("");

  const [inputs, setInputs]: any = useState({
    refBankName: "",
    refBankAccountNo: "",
    refBankAddress: "",
    refBalance: 0,
    refBankIFSCCode: "",
  });

  // INPUT HANDLER
  const handleInput = (e: any) => {
    const { name, value } = e.target;

    setInputs((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // CALL TO BACKEND TO UPDATE THE BANK CREATION
  const handleNewUser = async () => {
    const {
      refBankName,
      refBankAccountNo,
      refBankAddress,
      refBalance,
      refBankIFSCCode,
    } = inputs;

    if (!bankType) {
      return setToast({
        show: true,
        message: "Please select a bank type",
        color: "danger",
      });
    }

    if (!refBankName.trim()) {
      return setToast({
        show: true,
        message: "Bank name is required",
        color: "danger",
      });
    }

    if (bankType === "Bank") {
      if (!refBankAccountNo.trim()) {
        return setToast({
          show: true,
          message: "Account number is required",
          color: "danger",
        });
      }

      if (!refBankAddress.trim()) {
        return setToast({
          show: true,
          message: "Bank address is required",
          color: "danger",
        });
      }

      if (!refBankIFSCCode.trim()) {
        return setToast({
          show: true,
          message: "IFSC code is required",
          color: "danger",
        });
      }
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/addBankAccount",
        {
          refBankName,
          refBankAccountNo,
          refBankAddress,
          refBalance,
          refIFSCsCode: refBankIFSCCode,
          refAccountType: bankType === "Cash" ? 2 : 1,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setToast({
          show: true,
          message: "Bank added successfully",
          color: "success",
        });
        setTimeout(() => {
          history.replace("/bankDetails", { reload: true });
        }, 1000);
      } else {
        setToast({
          show: true,
          message: "Failed to add bank",
          color: "danger",
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: "Something went wrong!",
        color: "danger",
      });
      console.error(error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/bankDetails" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Add New Bank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="bankFormData flex flex-column m-3 p-2">
          <div className="flex gap-3">
            <div className="flex align-items-center">
              <RadioButton
                value="Bank"
                onChange={(e: RadioButtonChangeEvent) => setBankType(e.value)}
                checked={bankType === "Bank"}
              />
              <label htmlFor="bankType1" className="ml-2">
                Bank
              </label>
            </div>
            <div className="flex align-items-center">
              <RadioButton
                value="Cash"
                onChange={(e: RadioButtonChangeEvent) => setBankType(e.value)}
                checked={bankType === "Cash"}
              />
              <label htmlFor="bankType1" className="ml-2">
                Cash
              </label>
            </div>
          </div>
          <div className="mt-3">
            <InputText
              id="refBankName"
              placeholder="Enter Bank Name"
              className="w-full"
              name="refBankName"
              value={inputs.refBankName}
              onChange={(e: any) => {
                handleInput(e);
              }}
              required
            />
          </div>
          <div className="mt-3">
            <InputText
              type="number"
              id="refBankAccountNo"
              name="refBankAccountNo"
              value={inputs.refBankAccountNo}
              placeholder="Enter Bank A/C Number"
              className="w-full"
              disabled={bankType === "Cash"}
              style={{
                cursor: bankType === "Cash" ? "not-allowed" : "auto",
              }}
              onChange={(e: any) => {
                handleInput(e);
              }}
              required
            />
          </div>
          <div className="mt-3">
            <InputText
              id="refBankAddress"
              name="refBankAddress"
              placeholder="Enter Bank Address"
              value={inputs.refBankAddress}
              disabled={bankType === "Cash"}
              className={`w-full ${
                bankType === "Cash" ? "cursor-not-allowed" : ""
              }`}
              onChange={(e: any) => {
                handleInput(e);
              }}
              required
            />
          </div>
          <div className="mt-3">
            <InputText
              id="refBankIFSCCode"
              name="refBankIFSCCode"
              value={inputs.refBankIFSCCode}
              placeholder="Enter IFSC Code"
              className="w-full"
              disabled={bankType === "Cash"}
              style={{
                cursor: bankType === "Cash" ? "not-allowed" : "auto",
              }}
              onChange={(e: any) => {
                handleInput(e);
              }}
              required
            />
          </div>
          <button
            className="px-5 mt-3 submitButton w-full"
            onClick={handleNewUser}
          >
            Submit
          </button>
        </div>
        <IonToast
          isOpen={toast.show}
          onDidDismiss={() => setToast({ ...toast, show: false })}
          message={toast.message}
          duration={2000}
          // color={toast.color}
          className="custom-toast"
        />
      </IonContent>
    </IonPage>
  );
};

export default AddNewBank;
