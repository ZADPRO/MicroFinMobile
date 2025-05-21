import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { StatusBar, Style } from "@capacitor/status-bar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { add, trash } from "ionicons/icons";
import axios from "axios";
import decrypt from "../../services/helper";
import { useHistory, useLocation } from "react-router";

const vendorTypeOptions = [
  { label: "Outside Vendor", value: 1 },
  { label: "Bank", value: 2 },
  { label: "Depositor ", value: 3 },
];

const UserViewVendor: React.FC = () => {
  //   GET THE DATA FROM STATE
  const location = useLocation();
  const { vendorData } = location.state || {};
  console.log("vendorData", vendorData);

  // STATUS BAR
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    setVendorData();

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, [vendorData]);

  //   HISTORY
  const history = useHistory();

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

  const [vendorId, setVendorId] = useState<number | null>();
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [vendorType, setVendorType] = useState<number | null>(null);
  const [description, setDescription] = useState("");

  //   HANDLE UPDATE VENDOR
  const handleUpdate = async () => {
    if (!name || !contactNumber || !email || !address || !vendorType) {
      return;
    }

    const hasEmptyBankField = accountDetails.some(
      (item) =>
        !item.refAccountNo ||
        !item.refIFSCCode ||
        !item.refBankName ||
        !item.upiCode
    );

    if (hasEmptyBankField) {
      return;
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminLoan/vendor/update",
        {
          refVendorId: vendorId,
          vendorName: name,
          mobileNo: contactNumber,
          emailId: email,
          vendorType: vendorType,
          address: address,
          description: description,
          vendorBank: accountDetails.map((detail) => ({
            refBankId: detail.refBankId || null,
            refBankName: detail.refBankName || "",
            refAccountNo: detail.refAccountNo || "",
            refIFSCCode: detail.refIFSCCode || "",
            refUPICode: detail.upiCode || "",
          })),
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

      console.log("data line ----- 195", data);
      if (data.success) {
        console.log("data", data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setVendorData = () => {
    console.log("vendorData", vendorData);
    if (vendorData) {
      setVendorId(vendorData.vendorId);
      setName(vendorData.vendorName || "");
      setContactNumber(vendorData.mobileNo || "");
      setEmail(vendorData.emailId || "");
      setAddress(vendorData.address || "");
      setDescription(vendorData.description || "");
      setVendorType(vendorData.vendorType || 1);

      setAccountDetails(
        vendorData.vendorBank && vendorData.vendorBank.length > 0
          ? vendorData.vendorBank.map((detail: any) => ({
              refAccountNo: detail.refAccountNo || "",
              refIFSCCode: detail.refIFSCCode || "",
              refBankName: detail.refBankName || "",
              upiCode: detail.refUPICode || "",
              refBankId: String(detail.refBankId) || "",
            }))
          : [
              {
                refAccountNo: "",
                refIFSCCode: "",
                refBankName: "",
                upiCode: "",
                refBankId: "",
              },
            ]
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/user" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Edit Vendor</IonTitle>
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
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
          <InputText
            placeholder="Email"
            className="w-full mt-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
                value={detail.refAccountNo}
                onChange={(e) =>
                  handleInputChange(index, "refAccountNo", e.target.value)
                }
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
          <button className="px-5 submitButton w-full" onClick={handleUpdate}>
            Submit
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserViewVendor;
