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
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import decrypt from "../../services/helper";
import { useHistory } from "react-router";

const EditExistingProduct: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  //   HANDLE HISTORY FOR NAVIGATION
  const history = useHistory();

  //   CAPTURE EXISTING PRODUCT DATA FOR EDIT
  const productItems = JSON.parse(
    localStorage.getItem("editProductDetails") || "null"
  );
  console.log("productItems", productItems.refProductMonthlyCal);

  const durationType = [
    { name: "Monthly", code: 1 },
    { name: "Weekly", code: 2 },
    { name: "Daily", code: 3 },
  ];

  const interestCalculationType = [
    { name: "DayWise Monthly Calculation", code: 1 },
    { name: "Monthly Calculation", code: 2 },
  ];

  const [selectedDurationType, setSelectedDurationType] = useState({
    name: "Monthly",
    code: 1,
  });
  const [selectedInterestCal, setSelectedInterestCal] = useState<number>(1);

  //   SET PRODUCT DETAILS
  const [inputs, setInputs] = useState({
    refProductId: productItems.refProductId,
    refProductName: productItems.refProductName,
    refProductDuration: productItems.refProductDuration,
    refProductInterest: productItems.refProductInterest,
    refProductDescription: productItems.refProductDescription,
    refProductStatus: productItems.refProductStatus,
    refProductDurationType: productItems.refProductDurationType,
    refProductMonthlyCal: productItems.refProductMonthlyCal,
  });

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Set Duration Type from productItems
    const matchedDuration = durationType.find(
      (d) => d.code === productItems.refProductDurationType
    );
    if (matchedDuration) {
      setSelectedDurationType(matchedDuration);
    }

    // Set Interest Calculation Type
    setSelectedInterestCal(productItems.refProductMonthlyCal || 1);
  }, []);

  const status = [
    { name: "Active", code: "active" },
    { name: "Inactive", code: "inactive" },
  ];

  const handleUpdateLoans = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/updateProduct",
        {
          refProductId: inputs.refProductId,
          refProductName: inputs.refProductName,
          refProductInterest: inputs.refProductInterest,
          refProductDuration: inputs.refProductDuration,
          refProductStatus: inputs.refProductStatus,
          refProductDescription: inputs.refProductDescription,
          refProductDurationType: selectedDurationType.code,
          refProductMonthlyCal: selectedInterestCal,
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
        console.log("data", data);
        history.replace("/productDetails", { shouldReload: true });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/productDetails"
              mode="md"
            ></IonBackButton>
          </IonButtons>
          <IonTitle>Edit Product</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="editProductDataForm m-3">
          <InputText
            id="refProductName"
            name="refProductName"
            placeholder="Update Product Name"
            className="w-full"
            value={inputs.refProductName}
            onChange={handleInput}
            required
          />
          <Dropdown
            inputId="durationType"
            value={selectedDurationType}
            onChange={(e) => {
              setSelectedDurationType(e.value);
              if (e.value.code === 1) {
                setSelectedInterestCal(1);
              } else {
                setSelectedInterestCal(0);
              }
            }}
            options={durationType}
            optionLabel="name"
            placeholder="Select Duration"
            className="mt-3 w-full"
            required
          />
          <InputText
            id="refProductDuration"
            name="refProductDuration"
            placeholder="Update Product Duration"
            className="w-full mt-3"
            value={inputs.refProductDuration}
            onChange={handleInput}
            required
          />
          <InputText
            id="refProductInterest"
            name="refProductInterest"
            placeholder="Update Product Interest"
            className="w-full mt-3"
            value={inputs.refProductInterest}
            onChange={handleInput}
            required
          />
          <InputText
            id="refProductDescription"
            name="refProductDescription"
            placeholder="Update Product Description"
            className="w-full mt-3"
            value={inputs.refProductDescription}
            onChange={handleInput}
            required
          />

          {selectedDurationType.code === 1 && (
            <Dropdown
              value={selectedInterestCal}
              options={interestCalculationType}
              optionLabel="name"
              optionValue="code"
              onChange={(e) => {
                setSelectedInterestCal(e.value);
              }}
              className="w-full mt-3"
              required
            />
          )}

          <Dropdown
            id="refProductStatus"
            name="refProductStatus"
            placeholder="Update Product Status"
            className="w-full mt-3"
            value={inputs.refProductStatus}
            options={status}
            optionLabel="name"
            optionValue="code"
            onChange={handleInput}
          />
          <button
            className="px-5 mt-3 submitButton w-full"
            onClick={handleUpdateLoans}
          >
            Update
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditExistingProduct;
