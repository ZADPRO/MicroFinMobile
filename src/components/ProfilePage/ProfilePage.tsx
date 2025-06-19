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
import React, { useEffect, useState } from "react";

import agentIcon from "../../assets/users/superAdmin.png";
import { useHistory } from "react-router";
import axios from "axios";
import decrypt from "../../services/helper";

interface Option {
  name: string;
  code: number;
}
const ProfilePage: React.FC = () => {
  const [settingCustomerIdOption, setCustomerIdOption] = useState<
    Option[] | []
  >([]);
  const [selectedCustomerIdOption, setSelectedCustomerIdOption] = useState<
    number | null
  >();
  const [settingLoanIdOption, setLoanIdOption] = useState<Option[] | []>([]);
  const [selectedLoanIdOption, setSelectedLoanIdOption] = useState<
    number | null
  >();
  const [edit, setEdit] = useState<boolean>(false);
  useEffect(() => {
    return () => {};
  }, []);

  const history = useHistory();
  const storedProfile = localStorage.getItem("profile");
  const userDetails = storedProfile ? JSON.parse(storedProfile) : null;

  const handleLogout = () => {
    localStorage.clear();
    history.push("/login");
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

  const getCustomerIdData = () => {
    try {
      axios
        .get(import.meta.env.VITE_API_URL + "/settings/CustomerId/getOption", {
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

          localStorage.setItem("token", "Bearer " + data.token);
          if (data.success) {
            console.log("data", data);
            const options = data.option.map((d: any) => ({
              name: d.refCustomerTypeIdName,
              code: d.refCustomerTypeId,
            }));
            setCustomerIdOption(options);
            const seetingData = data.settings.filter(
              (e: any) => e.refSettingId === 1
            );
            console.log("seetingData.refSettingValue", seetingData);
            setSelectedCustomerIdOption(seetingData[0].refSettingValue);
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateCustomerIdOption = (value: number) => {
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/settings/updateOption",
          {
            id: 1,
            value: value,
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
          if (data.success) {
            // toast.success("Customer Id Format Update Successfully", {
            //   position: "top-right",
            //   autoClose: 3599,
            //   hideProgressBar: false,
            //   closeOnClick: false,
            //   pauseOnHover: true,
            //   draggable: true,
            //   progress: undefined,
            //   theme: "light",
            //   transition: Slide,
            // });
            setEdit(false);
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  const getLoanIdData = () => {
    try {
      axios
        .get(import.meta.env.VITE_API_URL + "/settings/LoanId/getOption", {
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

          localStorage.setItem("token", "Bearer " + data.token);
          if (data.success) {
            console.log("data", data);
            const options = data.option.map((d: any) => ({
              name: d.refLoanIdName,
              code: d.refLoanTypeId,
            }));
            setLoanIdOption(options);
            const seetingData = data.settings.filter(
              (e: any) => e.refSettingId === 2
            );
            console.log("seetingData.refSettingValue", seetingData);
            setSelectedLoanIdOption(seetingData[0].refSettingValue);
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateLoanIdOption = (value: number) => {
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/settings/updateOption",
          {
            id: 2,
            value: value,
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
          if (data.success) {
            // toast.success("Customer Id Format Update Successfully", {
            //   position: "top-right",
            //   autoClose: 3599,
            //   hideProgressBar: false,
            //   closeOnClick: false,
            //   pauseOnHover: true,
            //   draggable: true,
            //   progress: undefined,
            //   theme: "light",
            //   transition: Slide,
            // });
            setEdit(false);
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getCustomerIdData();
    getLoanIdData();
  }, []);

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
          <IonItem>
            <IonSelect
              label="Customer Id"
              labelPlacement="floating"
              placeholder={
                selectedCustomerIdOption === 1 ? "Numeric Id" : "Area Prefix Id"
              }
              value={selectedCustomerIdOption}
              onIonChange={(e) => {
                const selectedValue = e.detail.value;
                console.log("e.detail.value", e.detail.value);
                setSelectedCustomerIdOption(selectedValue);
                updateCustomerIdOption(selectedValue);
              }}
            >
              {settingCustomerIdOption.map((data: Option, index) => {
                return (
                  <>
                    <IonSelectOption value={data.code}>
                      {data.name}
                    </IonSelectOption>
                  </>
                );
              })}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonSelect
              label="Loan Id"
              labelPlacement="floating"
              placeholder={
                selectedLoanIdOption === 1 ? "Numeric Id" : "Area Prefix Id"
              }
              value={selectedLoanIdOption}
              onIonChange={(e) => {
                const selectedValue = e.detail.value;
                console.log("e.detail.value", e.detail.value);
                setSelectedLoanIdOption(selectedValue);
                updateLoanIdOption(selectedValue);
              }}
            >
              {settingLoanIdOption.map((data: Option, index) => {
                return (
                  <>
                    <IonSelectOption value={data.code}>
                      {data.name}
                    </IonSelectOption>
                  </>
                );
              })}
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
