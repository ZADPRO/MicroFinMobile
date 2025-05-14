import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";
import { StatusBar, Style } from "@capacitor/status-bar";
import UserCustomerDetailsCard from "../UserCustomerDetailsCard/UserCustomerDetailsCard";

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

const UsersCustomerDetails: React.FC = () => {
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
            roleId: 3,
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
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Customer Details</IonTitle>
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
      </IonContent>
    </IonPage>
  );
};

export default UsersCustomerDetails;
