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
import { StatusBar, Style } from "@capacitor/status-bar";
import axios from "axios";
import decrypt from "../../services/helper";
import BankCardList from "./BankCardList";
import { add } from "ionicons/icons";
import { useHistory, useLocation } from "react-router";

interface BankAcDetails {
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
  updatedAt: string;
  updatedBy: string;
}

const BankMgntBankDetails: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  //   SEARCH TERMS
  const [searchTerm, setSearchTerm] = useState<string>("");

  //   BANK DETAILS FETCH API
  const [userLists, setUserLists] = useState<BankAcDetails[] | []>([]);

  const loadData = () => {
    try {
      axios
        .get(import.meta.env.VITE_API_URL + "/adminRoutes/getBankAccountList", {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        })
        .then((response: any) => {
          const data = decrypt(
            response.data[1],
            response.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          );

          console.log("data", data);

          localStorage.setItem("token", "Bearer " + data.token);

          if (data.success) {
            setUserLists(data.BankAccount);
          }
        });
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.reload) {
      console.log("Reloading due to redirect state...");
      loadData();

      // Clear the state so it doesn't retrigger on re-render
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/bank" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Bank Management</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchTerm}
            onIonInput={(e) => setSearchTerm(e.detail.value!)}
            placeholder="Search by Bank, A/C, IFSC..."
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <BankCardList userLists={userLists} />
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => history.push("/addNewBank")}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default BankMgntBankDetails;
