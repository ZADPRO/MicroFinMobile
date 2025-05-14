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
import UserCustomerDetailsCard from "../UserCustomerDetailsCard/UserCustomerDetailsCard";
import { add } from "ionicons/icons";

interface UserListProps {
  createdAt: string;
  createdBy: string;
  refAadharNo: string;
  refAadharPath: string;
  refActiveStatus: string;
  refComId: number;
  refCustId: string;
  refPanNo: string;
  refPanPath: number;
  refUserAddress: string;
  refUserDOB: string;
  refUserDistrict: string;
  refUserEmail: string;
  refUserFname: string;
  refUserId: number;
  refUserLname: string;
  refUserMobileNo: string;
  refUserPincode: string;
  refUserProfile: string;
  refUserRole: string;
  refUserState: string;
}

const UsersAgentDetails: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  const [userLists, setUserLists] = useState<UserListProps[] | []>([]);

  const loadData = () => {
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/adminRoutes/getPersonList",
          {
            roleId: 2,
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

          localStorage.setItem("token", "Bearer " + data.token);
          console.log(data);

          if (data.success) {
            setUserLists(data.data);
            console.log(data.data);
          }
        });
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/user" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Agent Details</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {userLists.length > 0 ? (
          userLists.map((data) => (
            <UserCustomerDetailsCard key={data.refComId} {...data} />
          ))
        ) : (
          <p className="ion-text-center">No results found</p>
        )}

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default UsersAgentDetails;
