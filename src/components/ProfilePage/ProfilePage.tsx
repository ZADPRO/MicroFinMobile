import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import agentIcon from "../../assets/users/superAdmin.png";
import { useHistory } from "react-router";
import axios from "axios";
import decrypt from "../../services/helper";

const ProfilePage: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  const history = useHistory();
  const storedProfile = localStorage.getItem("profile");
  const userDetails = storedProfile ? JSON.parse(storedProfile) : null;

  const handleLogout = () => {
    localStorage.clear();
    history.push("/");
  };

  const handleAboutUs = () => {
    history.push("/aboutUs");
  };

  const handelCashFlow = (data: boolean) => {
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/cashFlow/updateCashFlow",
          {
            cashFlow: data,
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
        });
    } catch (error) {
      console.log("error in Header in Cash Flow", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" className="">
        <div className="shadow-1 py-2 m-3 px-3 border-round-lg bg-white">
          <div className="flex align-items-center">
            <img
              src={agentIcon}
              alt="Users"
              style={{ width: "80px", height: "auto" }}
            />
            <div className="flex flex-column pl-3">
              <p className="text-lg font-semibold">Hello 👋,</p>
              <p className="font-semibold text-lg pt-1">
                {userDetails?.name || "User"}
              </p>
            </div>
          </div>
        </div>

        <IonList inset={true} className="shadow-1">
          <IonItem button onClick={handleAboutUs}>
            <IonLabel>About</IonLabel>
          </IonItem>
          <IonItem>
            <IonSelect
              label="Privacy"
              placeholder="Show Cash"
              onIonChange={(e) => {
                const selectedValue = e.detail.value;
                if (selectedValue === "on") {
                  handelCashFlow(true);
                } else {
                  handelCashFlow(false);
                }
              }}
            >
              <IonSelectOption value="on">On</IonSelectOption>
              <IonSelectOption value="off">Off</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem button onClick={handleLogout}>
            <IonLabel>Logout</IonLabel>
          </IonItem>
        </IonList>

        {/* Footer fixed at bottom */}
        <div
          className="footer-text text-center mt-auto"
          style={{ position: "absolute", bottom: 20, width: "100%" }}
        >
          <p>Made in ❤️ with ZAdroit IT Solutions</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
