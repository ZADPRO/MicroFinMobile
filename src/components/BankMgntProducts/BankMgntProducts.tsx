import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonSearchbar,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import axios from "axios";
import decrypt from "../../services/helper";
import { add } from "ionicons/icons";
import { useHistory, useLocation } from "react-router";

interface ProductDetailsProps {
  createdAt: string;
  createdBy: string;
  refProductDescription: string;
  refProductDuration: string;
  refProductId: number;
  refProductInterest: string;
  refProductName: string;
  refProductStatus: string;
  refProductDurationType: number;
  refProductMonthlyCal: number;
  updatedAt: string;
  updatedBy: string;
}

const BankMgntProducts: React.FC = () => {
  useEffect(() => {
    return () => {};
  }, []);

  //   HISTORY NAVIGATION
  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(true);

  //   SEARCH TERMS HANDLER
  const [searchTerm, setSearchTerm] = useState<string>("");

  //   PRODUCTS GET DATA FROM BACKEND
  const [userLists, setUserLists] = useState<ProductDetailsProps[] | []>([]);

  const location = useLocation<{ shouldReload?: boolean }>();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (location.state?.shouldReload) {
      loadData();
      // Clear the state to avoid unnecessary reload on further navigations
      history.replace("/productDetails", {});
    }
  }, [location.state]);

  const loadData = () => {
    setLoading(true);

    try {
      axios
        .get(import.meta.env.VITE_API_URL + "/adminRoutes/productList", {
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

          localStorage.setItem("token", "Bearer " + data.token);

          console.log(data);

          if (data.success) {
            setUserLists(data.products);
          }
          setLoading(false);
        });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (location.state?.shouldReload) {
      loadData();

      // Clear the state so it doesn't reload unnecessarily on further navigations
      history.replace("/productDetails", {});
    }
  }, [location.state]);

  // HANDLE EDIT PRODUCT
  const handleProductEdit = (item: ProductDetailsProps) => {
    history.push("/editProductDetails", { item });
    localStorage.setItem("editProductDetails", JSON.stringify(item));
  };

  const filteredProducts = userLists.filter((item) =>
    Object.values(item)
      .map((val) =>
        typeof val === "string" || typeof val === "number" ? val : ""
      )
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/bank" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Products</IonTitle>
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
          {loading
            ? // Show 4 skeletons as placeholders
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
            : filteredProducts.map((item: ProductDetailsProps, idx: number) => (
                <div
                  key={idx}
                  onClick={() => handleProductEdit(item)}
                  className="flex p-2 shadow-3 p-3 my-2 border-round-md"
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
                    {item.refProductName.charAt(0).toUpperCase()}
                  </div>
                  <div className="pl-3 flex flex-column w-full justify-content-between">
                    <div className="flex flex-row justify-content-between">
                      <p className="capitalize">{item.refProductName}</p>
                      <p
                        style={{
                          color:
                            item.refProductStatus.toLowerCase() === "active"
                              ? "green"
                              : "red",
                          textTransform: "uppercase",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {item.refProductStatus}
                      </p>
                    </div>

                    <div className="flex flex-row justify-content-between mt-1">
                      Duration: {item.refProductDuration}{" "}
                      {{
                        1: "Monthly",
                        2: "Weekly",
                        3: "Daily",
                      }[item.refProductDurationType] || ""}{" "}
                    </div>

                    <div className="flex flex-row justify-content-between mt-1">
                      Interest: {item.refProductInterest} %{" "}
                      {{
                        0: "",
                        1: "[ Day wise Calculation ]",
                        2: " [ Month wise Calculation ]",
                      }[item.refProductMonthlyCal] || ""}{" "}
                    </div>

                    <div className="flex text-sm w-full justify-content-end mt-2">
                      <p>{item.createdAt}</p>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* FAB BUTTON TO ADD NEW PRODUCTS */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => history.push("/addNewProduct")}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default BankMgntProducts;
