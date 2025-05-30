import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { StatusBar, Style } from "@capacitor/status-bar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { add, trash } from "ionicons/icons";
import axios from "axios";
import decrypt from "../../services/helper";
import { useHistory } from "react-router";

const vendorTypeOptions = [
  { label: "Outside Vendor", value: 1 },
  { label: "Bank", value: 2 },
  { label: "Depositor ", value: 3 },
];

const UserAddVendor: React.FC = () => {
  // STATUS BAR
  useEffect(() => {
    
    StatusBar.setStyle({ style: Style.Dark });
    

    return () => {
      
    };
  }, []);

  //   HISTORY
  const history = useHistory();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  //   STATES FOR HANDLE INPUT DETAILS
  const [accountDetails, setAccountDetails] = useState([
    {
      refAccountNo: "",
      refIFSCCode: "",
      refBankName: "",
      upiCode: "",
      refBankId: "",
    },
  ]);

  const handleAddBankField = () => {
    setAccountDetails([
      ...accountDetails,
      {
        refAccountNo: "",
        refIFSCCode: "",
        refBankName: "",
        upiCode: "",
        refBankId: "",
      },
    ]);
  };

  const removeReference = (index: number) => {
    const updated = accountDetails.filter((_, i) => i !== index);
    setAccountDetails(updated);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updated = [...accountDetails];
    updated[index][field as keyof (typeof updated)[number]] = value;
    setAccountDetails(updated);
  };

  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [vendorType, setVendorType] = useState<number | null>(null);
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      triggerToast("Please enter the name");
      return;
    }

    if (!contactNumber.trim()) {
      triggerToast("Please enter the contact number");
      return;
    }

    if (!email.trim()) {
      triggerToast("Please enter the email");
      return;
    }

    if (!address.trim()) {
      triggerToast("Please enter the address");
      return;
    }

    if (!vendorType) {
      triggerToast("Please select vendor type");
      return;
    }

    const hasEmptyBankField = accountDetails.some((item, index) => {
      if (!item.refAccountNo.trim()) {
        triggerToast(`Please enter account number for bank ${index + 1}`);
        return true;
      }
      if (!item.refIFSCCode.trim()) {
        triggerToast(`Please enter IFSC code for bank ${index + 1}`);
        return true;
      }
      if (!item.refBankName.trim()) {
        triggerToast(`Please enter bank name for bank ${index + 1}`);
        return true;
      }
      if (!item.upiCode.trim()) {
        triggerToast(`Please enter UPI code for bank ${index + 1}`);
        return true;
      }
      return false;
    });

    if (hasEmptyBankField) {
      return;
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminLoan/Vendor/add",
        {
          vendorName: name,
          mobileNo: contactNumber,
          emailId: email,
          vendorType: vendorType,
          address: address,
          description: description,
          vendorBank: accountDetails,
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
      localStorage.setItem("token", "Bearer " + data.token);

      if (data.success) {
        console.log("data", data);
        history.replace("/vendorLists", { shouldReload: true });
      } else {
        triggerToast("Error adding vendor.");
      }
    } catch (error) {
      console.error(error);
      triggerToast("Something went wrong. Please try again.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/user" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Add Vendor</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="m-3">
          <InputText
            placeholder="Name"
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputText
            placeholder="Contact Number"
            className="w-full mt-3"
            maxLength={10}
            value={contactNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // allow only digits
              setContactNumber(value);
            }}
          />
          <InputText
            placeholder="Email"
            className="w-full mt-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (email && !emailPattern.test(email)) {
                alert("Invalid email format");
              }
            }}
          />
          <InputText
            placeholder="Address"
            className="w-full mt-3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Dropdown
            value={vendorType}
            className="w-full mt-3"
            options={vendorTypeOptions}
            onChange={(e) => setVendorType(e.value)}
            placeholder="Select Vendor Type"
          />
          <InputText
            placeholder="Description"
            className="w-full mt-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-content-between align-items-center mt-3">
            <label htmlFor="">Bank Details</label>
            <IonButton shape="round" onClick={handleAddBankField}>
              <IonIcon slot="icon-only" icon={add}></IonIcon>
            </IonButton>
          </div>

          {accountDetails.map((detail, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "20px",
                position: "relative",
              }}
            >
              {/* Delete button */}
              {index > 0 && (
                <IonButton
                  color="danger"
                  size="small"
                  style={{ position: "absolute", top: "0px", right: "0px" }}
                  onClick={() => removeReference(index)}
                >
                  <IonIcon icon={trash} slot="icon-only" />
                </IonButton>
              )}

              <InputText
                placeholder="A/C Number"
                className="w-full"
                maxLength={16}
                value={detail.refAccountNo}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 16) {
                    handleInputChange(index, "refAccountNo", value);
                  }
                }}
                onBlur={() => {
                  if (
                    detail.refAccountNo &&
                    (detail.refAccountNo.length < 5 ||
                      detail.refAccountNo.length > 16)
                  ) {
                    alert("Account number must be between 5 to 16 digits");
                  }
                }}
              />
              <InputText
                placeholder="IFSC Code"
                className="w-full mt-3"
                value={detail.refIFSCCode}
                onChange={(e) =>
                  handleInputChange(index, "refIFSCCode", e.target.value)
                }
              />
              <InputText
                placeholder="Bank Name"
                className="w-full mt-3"
                value={detail.refBankName}
                onChange={(e) =>
                  handleInputChange(index, "refBankName", e.target.value)
                }
              />
              <InputText
                placeholder="UPI Code"
                className="w-full mt-3"
                value={detail.upiCode}
                onChange={(e) =>
                  handleInputChange(index, "upiCode", e.target.value)
                }
              />
            </div>
          ))}
          <button className="px-5 submitButton w-full" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          // color="danger"
          className="custom-toast"
        />
      </IonContent>
    </IonPage>
  );
};

export default UserAddVendor;
