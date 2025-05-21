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
import axios from "axios";
import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";
import { StatusBar, Style } from "@capacitor/status-bar";
import UserCustomerDetailsCard from "../UserCustomerDetailsCard/UserCustomerDetailsCard";
import { add } from "ionicons/icons";
import { useHistory } from "react-router";

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
  const [userLists, setUserLists] = useState<UserListProps[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const history = useHistory();

  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

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
        .then((response) => {
          const data = decrypt(
            response.data[1],
            response.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          );

          localStorage.setItem("token", "Bearer " + data.token);

          if (data.success) {
            setUserLists(data.data);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered user list based on searchTerm
  const filteredUsers = userLists.filter((user) => {
    console.log("userLists", userLists);
    const fullName = `${user.refUserFname} ${user.refUserLname}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      user.refUserMobileNo.includes(searchTerm) ||
      user.refCustId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/user" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Customer Details</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchTerm}
            onIonInput={(e) => setSearchTerm(e.detail.value!)}
            placeholder="Search by name, mobile, or ID"
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((data) => (
            <UserCustomerDetailsCard key={data.refComId} {...data} />
          ))
        ) : (
          <p className="ion-text-center mt-4">No results found</p>
        )}

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => history.push("/addUserDetails")}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default UsersCustomerDetails;
