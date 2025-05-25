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
import { InputText } from "primereact/inputtext";
import decrypt from "../../services/helper";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { useHistory } from "react-router";
import { warningOutline } from "ionicons/icons";

const AddNewProduct: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  const history = useHistory();

  const status = [
    { name: "Active", code: "active" },
    { name: "Inactive", code: "inactive" },
  ];

  const [inputs, setInputs]: any = useState({
    refProductName: "",
    refProductInterest: "",
    refProductDuration: "",
    refProductStatus: "active",
    refProductDescription: "",
  });

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const showValidationToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNewProductDB = async () => {
    // Step-by-step validation
    if (!inputs.refProductName.trim()) {
      return showValidationToast("Please enter Product Name");
    }
    if (!inputs.refProductDuration.trim()) {
      return showValidationToast("Please enter Product Duration");
    }
    if (!inputs.refProductInterest.trim()) {
      return showValidationToast("Please enter Interest (%)");
    }
    if (!inputs.refProductDescription.trim()) {
      return showValidationToast("Please enter Product Description");
    }
    if (!inputs.refProductStatus) {
      return showValidationToast("Please select Product Status");
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/addProduct",
        {
          refProductName: inputs.refProductName,
          refProductInterest: inputs.refProductInterest,
          refProductDuration: inputs.refProductDuration,
          refProductStatus: inputs.refProductStatus,
          refProductDescription: inputs.refProductDescription,
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
      console.log(data);
      localStorage.setItem("token", "Bearer " + data.token);

      if (data.success) {
        history.replace("/productDetails", { shouldReload: true });
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productDetails" mode="md" />
          </IonButtons>
          <IonTitle>Add New Product</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="addNewProductFormData m-3">
          <InputText
            id="refProductName"
            name="refProductName"
            className="w-full"
            placeholder="Enter Product Name"
            value={inputs.refProductName}
            onChange={handleInput}
            required
          />
          <InputText
            id="refProductDuration"
            name="refProductDuration"
            placeholder="Enter Product Duration (Months)"
            className="w-full mt-3"
            value={inputs.refProductDuration}
            onChange={handleInput}
            required
          />
          <InputText
            id="refProductInterest"
            name="refProductInterest"
            className="w-full mt-3"
            placeholder="Enter Interest (%)"
            value={inputs.refProductInterest}
            onChange={handleInput}
            required
          />
          <InputText
            id="refProductDescription"
            name="refProductDescription"
            className="w-full mt-3"
            placeholder="Enter Description"
            value={inputs.refProductDescription}
            onChange={handleInput}
            required
          />
          <Dropdown
            name="refProductStatus"
            value={inputs.refProductStatus}
            options={status}
            className="w-full mt-3"
            optionLabel="name"
            placeholder="Select Active Status"
            optionValue="code"
            onChange={handleInput}
            required
          />
          <button
            className="px-5 mt-3 submitButton w-full"
            onClick={handleNewProductDB}
          >
            Submit
          </button>
        </div>

        {/* Toast Component */}
        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={15000}
          className="custom-toast"
          icon={warningOutline}
          onDidDismiss={() => setShowToast(false)}
          position="bottom"
          // color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default AddNewProduct;
