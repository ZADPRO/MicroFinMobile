import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import React, { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import decrypt from "../../services/helper";
import { useHistory, useLocation } from "react-router";

interface BankItemProps {
  createdAt: string;
  createdBy: string;
  refAccountType: number;
  refAccountTypeName: string;
  refBalance: string;
  refBankAccountNo: string;
  refBankAddress: string;
  refBankId: number;
  refBankName: string;
  refIFSCsCode: string;
}

interface BankFormState {
  refBankId: number;
  refBankName: string;
  refBankAccountNo: string;
  refBankAddress: string;
  refBalance: string;
  refAccountType: number;
  refAccountTypeName: string;
  refIFSCsCode: string;
}

const EditExistingBank: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  //   CAPTURE EXISTING BANK DATA STATE
  const location = useLocation();
  const bankItem =
    location.state?.bankItem ||
    JSON.parse(localStorage.getItem("editBankItem") || "null");

  // USE HISTORY
  const history = useHistory();

  // SET BANK DETAILS
  const [inputs, setInputs] = useState<BankFormState>({
    refBankId: bankItem.refBankId,
    refBankName: bankItem.refBankName,
    refBankAccountNo: bankItem.refBankAccountNo,
    refBankAddress: bankItem.refBankAddress,
    refBalance: bankItem.refBalance,
    refAccountType: bankItem.refAccountType,
    refAccountTypeName: bankItem.refAccountTypeName,
    refIFSCsCode: bankItem.refIFSCsCode,
  });

  const [bankType, setBankType] = useState<string>(
    bankItem.refAccountType === 1 ? "Bank" : "Cash"
  );

  // INPUT HANDLER
  const handleInput = (e: any) => {
    const { name, value } = e.target;

    setInputs((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBankTypeChange = (value: string) => {
    setBankType(value);
    setInputs((prevState) => ({
      ...prevState,
      refAccountType: value === "Bank" ? 1 : 2,
      refAccountTypeName: value,
    }));
  };

  // CALL TO BACKEND TO UPDATE THE BANK CREATION
  const handleNewUser = async () => {
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/adminRoutes/updateBankAccount",
          {
            refBankId: bankItem.refBankId,
            refBankName: inputs.refBankName,
            refBankAccountNo: inputs.refBankAccountNo,
            refBankAddress: inputs.refBankAddress,
            refBalance: inputs.refBalance,
            refAccountType: inputs.refAccountType,
            refAccountTypeName: inputs.refAccountTypeName,
            refIFSCsCode: inputs.refIFSCsCode,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response: any) => {
          const data = decrypt(
            response.data[1],
            response.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          );
          console.log("data", data);

          if (data.success) {
            localStorage.setItem("token", "Bearer " + data.token);
            history.replace("/bankDetails", { reload: true });
          }
        });
    } catch (e: any) {
      console.log(e);
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
                onChange={(e: RadioButtonChangeEvent) =>
                  handleBankTypeChange(e.value)
                }
                checked={bankType === "Bank"}
              />
              <label htmlFor="bankType1" className="ml-2">
                Bank
              </label>
            </div>
            <div className="flex align-items-center">
              <RadioButton
                value="Cash"
                onChange={(e: RadioButtonChangeEvent) =>
                  handleBankTypeChange(e.value)
                }
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
              maxLength={16}
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
              id="refIFSCsCode"
              name="refIFSCsCode"
              value={inputs.refIFSCsCode}
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
            Update
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditExistingBank;
