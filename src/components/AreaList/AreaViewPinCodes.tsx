import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonAlert,
  IonTitle,
  IonToolbar,
  IonModal,
  IonButton,
  IonList,
  IonItem,
  IonInput,
  IonFooter,
  useIonRouter,
  IonToast,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { chevronBack, create, save, warningOutline } from "ionicons/icons";
import { useHistory, useLocation } from "react-router";
import { Dropdown } from "primereact/dropdown";
import decrypt from "../../services/helper";
import axios from "axios";

interface GroupedArea {
  refAreaId: number;
  refAreaName: string;
  refAreaPrefix: string;
  pinCodes: {
    pinCode: string;
    customerCount: number;
    refAreaPinCodeId: number | null;
  }[];
}

interface listArea {
  refAreaId: number;
  refAreaName: string;
  refAreaPrefix: string;
  refAreaPinCodeId: number | null;
  refAreaPinCode: string | null;
  customerCount: number;
}

interface editOption {
  label: string;
  value: number;
}

interface pincode {
  pinCode: string;
  customerCount: number;
  refAreaPinCodeId: number | null;
}

const AreaViewPinCodes: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ shouldReload?: boolean }>();
  const router = useIonRouter();

  const editOptions: editOption[] = [
    { label: "Move Area", value: 1 },
    { label: "New Area", value: 2 },
  ];

  const [groupedData, setGroupedData] = useState<GroupedArea>();
  const [areaOptions, setAreaOptions] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedPin, setSelectedPin] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState<
    "danger" | "success" | "warning"
  >("danger");

  const filteredAreas = areaOptions.filter((area) =>
    (area.refAreaPrefix + area.refAreaName)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const data = localStorage.getItem("areaPinCodeView");
    const areaOption = localStorage.getItem("areaOption");
    if (data && areaOption) {
      setGroupedData(JSON.parse(data));
      setAreaOptions(JSON.parse(areaOption));
    }
  }, []);

  useEffect(() => {
    if (location.state?.shouldReload) {
      const data = localStorage.getItem("areaPinCodeView");
      const areaOption = localStorage.getItem("areaOption");
      if (data && areaOption) {
        setGroupedData(JSON.parse(data));
        setAreaOptions(JSON.parse(areaOption));
      }
      history.replace({ ...location, state: {} });
    }
  }, [location.state?.shouldReload]);

  const handleEditOptionChange = (
    value: number,
    pin: number,
    pincode?: string
  ) => {
    if (value === 1) {
      setSelectedPin(pin);
      setShowAlert(true); // Trigger alert popup
    } else {
      localStorage.setItem("newPinCode", "true");
      if (!pincode) {
        console.warn("PinCode is undefined, cannot proceed.");
        return; // Exit early if pincode is not available
      }

      const existingData = localStorage.getItem("areaPinCodeView1");

      const pushData = {
        pinCode: pincode, // ✅ now guaranteed to be a string
        customerCount: 0, // ✅ match expected type: number
        refAreaPinCodeId: pin,
      };

      if (existingData) {
        try {
          const parsedData = JSON.parse(existingData) as GroupedArea;
          parsedData.pinCodes.push(pushData);
          localStorage.setItem("areaPinCodeView1", JSON.stringify(parsedData));
        } catch (e) {
          console.error("Failed to parse localStorage data:", e);
        }
      } else {
        const newData: GroupedArea = {
          refAreaId: 0,
          refAreaName: "",
          refAreaPrefix: "",
          pinCodes: [pushData],
        };
        localStorage.setItem("areaPinCodeView1", JSON.stringify(newData));
      }
    }
    router.push("/viewAreaPinCodes", "forward");
  };

  const handleMoveArea = (areaValue: string, pincodeId: number) => {
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/area/movePinCode",
          {
            areaId: Number(areaValue),
            pinCodeId: pincodeId,
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
            setGroupedData((prev) => {
              if (!prev) return prev;

              return {
                ...prev,
                pinCodes: prev.pinCodes.filter(
                  (item) => item.refAreaPinCodeId !== pincodeId
                ),
              };
            });

            setShowAlert(false);
            setSelectedPin(null);
            setToastMessage("Pin-Code Mover to another area successfully");
          } else {
            setToastMessage("Error in Moving pin-Code to another Area");
          }
        });
    } catch (error) {
      console.error("Error in handleMoveArea:", error);
      setToastMessage("Error in Moving pin-Code to another Area");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ paddingTop: "5px", paddingBottom: "5px" }}>
          <IonButtons slot="start">
            <IonIcon
              mode="md"
              style={{ fontSize: "1.7rem", marginLeft: "10px" }}
              icon={chevronBack}
              onClick={() => {
                history.replace("/areaList", { state: { shouldReload: true } });
              }}
            />{" "}
          </IonButtons>
          <IonTitle>
            {groupedData?.refAreaName} - [ {groupedData?.refAreaPrefix} ]
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        icon={warningOutline}
        className="custom-toast"
        // color={toastColor}
      />

      <IonContent>
        {groupedData?.pinCodes.map((item: pincode, idx) => (
          <div
            key={idx}
            className="flex p-2 shadow-3 p-3 my-2 mx-1 border-round-md align-items-center justify-content-between"
          >
            <div className="pl-3 flex flex-column w-[70%]">
              <div className="flex flex-row justify-content-between w-full">
                <div className="w-[80%]">
                  <p>Pin Code : {item.pinCode || "No data"}</p>
                  <p>Total Customer Count : {item.customerCount}</p>
                </div>
              </div>
            </div>
            <div className="w-[15%] flex justify-content-end">
              <Dropdown
                options={editOptions}
                placeholder="Edit"
                onChange={(e) => {
                  if (item.refAreaPinCodeId) {
                    handleEditOptionChange(
                      e.value,
                      item.refAreaPinCodeId,
                      item.pinCode
                    );
                  }
                }}
              />
            </div>
          </div>
        ))}

        {/* Alert that shows area options */}
        {/* <IonAlert
          isOpen={showAlert}
          header="Move Area"
          subHeader={`Select the Area to Move For Pin Code: ${selectedPin}`}
          buttons={[
            ...areaOptions.map((area) => ({
              text: area.refAreaName,
              handler: () => handleMoveArea(area.refAreaId),
            })),
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {
                setShowAlert(false);
                setSelectedPin(null);
              },
            },
          ]}
        /> */}

        <IonModal isOpen={showAlert} onDidDismiss={() => setShowAlert(false)}>
          <IonHeader>
            <IonToolbar className="py-1">
              <IonTitle>Move Area</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowAlert(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent>
            <IonList>
              <IonItem>
                <IonInput
                  placeholder="Search Area"
                  value={searchTerm}
                  onIonInput={(e) => {
                    console.log("e", e);

                    setSearchTerm(e.detail.value || "");
                  }}
                />
              </IonItem>

              <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                {filteredAreas.map((area) => (
                  <IonItem
                    button
                    key={area.refAreaId}
                    onClick={() => {
                      console.log("area line ------ 254", area);
                      if (selectedPin) {
                        handleMoveArea(area.refAreaId, selectedPin);
                      }
                      setShowAlert(false);
                    }}
                  >
                    {area.refAreaPrefix} - {area.refAreaName}
                  </IonItem>
                ))}
              </div>
            </IonList>
          </IonContent>

          <IonFooter>
            <IonToolbar>
              <IonButton
                expand="block"
                color="danger"
                onClick={() => setShowAlert(false)}
              >
                Cancel
              </IonButton>
            </IonToolbar>
          </IonFooter>
        </IonModal>

        {localStorage.getItem("newPinCode") !== "true" ? (
          <>
            <IonFab slot="fixed" vertical="bottom" horizontal="end">
              <IonFabButton onClick={() => history.push("/updateAreaDetails")}>
                <IonIcon icon={create} />
              </IonFabButton>
            </IonFab>
          </>
        ) : (
          <>
            <IonFab slot="fixed" vertical="bottom" horizontal="end">
              <IonFabButton onClick={() => history.push("/updateAreaDetails")}>
                <IonIcon icon={save}></IonIcon>
              </IonFabButton>
            </IonFab>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AreaViewPinCodes;
