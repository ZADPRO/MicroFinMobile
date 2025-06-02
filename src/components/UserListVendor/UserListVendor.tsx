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
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";


import axios from "axios";
import decrypt from "../../services/helper";
import { add } from "ionicons/icons";
import { useHistory } from "react-router";

interface Vendor {
  refVendorId: number;
  refVendorName: string | null;
  refVendorMobileNo: string | null;
  refVenderType: number | null;
  refVendorEmailId: string | null;
  refDescription: string | null;
  vendorBank?: Bank[]; // Optional field for storing associated bank details
}

interface Bank {
  refBankId?: number; // Optional, as it might be null or not available when creating a new bank entry
  refBankName: string;
  refAccountNo: string;
  refIFSCCode: string;
  refUPICode: string;
}

const UserListVendor: React.FC = () => {
  // STATUS BAR
  useEffect(() => {
    
    
    

    return () => {
      
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState<string>("");

  //   HISTORY PUSH
  const history = useHistory();

  //   USE STATE TO GET THE VENDOR LISTS
  const [vendorList, setVendorList] = useState<Vendor[]>([]);

  const getVendorList = () => {
    axios
      .get(import.meta.env.VITE_API_URL + "/adminLoan/vendor/list", {
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

        if (data.success) {
          console.log(data);
          setVendorList(data.data);
        }
      });
  };

  useEffect(() => {
    // Call API on load or reload
    console.log("location", location.state);
    if (location.state?.shouldReload) {
      getVendorList();
      // Clear the reload flag so it doesn’t trigger again unnecessarily
      history.replace({ ...location, state: {} });
    } else {
      getVendorList();
    }
  }, [location.state?.shouldReload]);

  const filteredProducts = vendorList.filter((item) =>
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
            <IonBackButton defaultHref="/user" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Vendor Details</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchTerm}
            onIonInput={(e) => setSearchTerm(e.detail.value!)}
            placeholder="Search here..."
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="m-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => {
              return (
                <div
                  key={`${index}`}
                  onClick={() =>
                    history.push("/editExistingVendor", {
                      vendorData: filteredProducts[index],
                    })
                  }
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
                    {" "}
                    <p>
                      {" "}
                      {item.refVenderType === 1
                        ? "O"
                        : item.refVenderType === 2
                        ? "B"
                        : item.refVenderType === 3
                        ? "D"
                        : "?"}
                    </p>{" "}
                  </div>
                  <div className="pl-3 flex flex-column w-full justify-content-between">
                    <div className="flex w-full flex-row align-items-center justify-content-between">
                      <p>{item.refVendorName}</p>
                      <p>
                        {" "}
                        {item.refVenderType === 1
                          ? "Outside Vendor"
                          : item.refVenderType === 2
                          ? "Bank"
                          : item.refVenderType === 3
                          ? "Depositor"
                          : "-"}
                      </p>{" "}
                    </div>
                    <p>{item.refVendorMobileNo}</p>
                    <p>{item.refVendorEmailId}</p>

                    <p className="flex justify-content-end text-sm mt-1"></p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex">No Data Found</div>
          )}
        </div>

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => history.push("/addNewVendor")}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};
export default UserListVendor;
