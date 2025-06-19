import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { add, chevronBack, arrowBack, save } from "ionicons/icons";
import decrypt from "../../services/helper";
import { useHistory, useLocation } from "react-router";

interface listArea {
  refAreaId: number;
  refAreaName: string;
  refAreaPrefix: string;
  refAreaPinCodeId: number | null;
  refAreaPinCode: string | null;
  customerCount: number;
}

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

const AreaList: React.FC = () => {
  // HANDLE NAV
  const history = useHistory();

  const location = useLocation<{ shouldReload?: boolean }>();
  console.log("location", location);

  const [loading, setLoading] = useState<boolean>(false);
  const [noDataFound, setNoDataFound] = useState<boolean>(false);

  const [areaList, setAreaList] = useState<listArea[]>([]);

  const getAreaList = () => {
    try {
      axios
        .get(import.meta.env.VITE_API_URL + "/area/listArea", {
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
          console.log("data line ------ 42", data);
          if (data.success) {
            setAreaList(data.data);
            setNoDataFound(false);
          }
        });
    } catch (error) {
      console.log("error", error);
      setNoDataFound(true);
    } finally {
      setLoading(false);
    }
  };

  const groupedData: GroupedArea[] = useMemo(() => {
    const map = new Map<number, GroupedArea>();

    areaList.forEach((item) => {
      if (!map.has(item.refAreaId)) {
        map.set(item.refAreaId, {
          refAreaId: item.refAreaId,
          refAreaName: item.refAreaName,
          refAreaPrefix: item.refAreaPrefix,
          pinCodes: [],
        });
      }

      if (item.refAreaPinCode && item.refAreaPinCode.trim() !== "") {
        map.get(item.refAreaId)?.pinCodes.push({
          pinCode: item.refAreaPinCode,
          customerCount: item.customerCount,
          refAreaPinCodeId: item.refAreaPinCodeId,
        });
      }
    });

    return Array.from(map.values());
  }, [areaList]);

  const ViewAreaPincode = (item: GroupedArea) => {
    console.log("item", item);
    const areaOptions = groupedData.filter(
      (e) => e.refAreaId != item.refAreaId
    );
    console.log("areaOptions line -------- 111", areaOptions);
    localStorage.setItem("areaPinCodeView", JSON.stringify(item));
    localStorage.setItem("areaOption", JSON.stringify(areaOptions));
    history.push("/viewAreaPinCodes", { item, shouldReload: true });
  };

  useEffect(() => {
    setLoading(true);
    getAreaList();
  }, []);

  useEffect(() => {
    if (location.state?.shouldReload) {
      console.log("Reloading data due to navigation flag.");
      getAreaList();

      // Clear the reload flag
      history.replace({ ...location, state: {} });
    } else {
      console.log("Normal data load.");
      getAreaList();
    }
  }, [location.state]); // Watch the whole state object

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{"paddingTop":"5px","paddingBottom":"5px"}}>
          <IonButtons slot="start">
            <IonIcon
              mode="md"
              style={{"fontSize" : "1.7rem","marginLeft":"10px" }}
              icon={arrowBack}
              onClick={() => {
                history.replace("/user", { state: { shouldReload: true } });
                localStorage.removeItem("newPinCode");
                localStorage.removeItem("areaPinCodeView1");
              }}
            />{" "}
          </IonButtons>
          <IonTitle>Area</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="productsDisplayCards m-3">
          {loading ? (
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
          ) : noDataFound ? (
            <div className="text-center text-gray-500 p-4">No data found</div>
          ) : (
            groupedData.map((item: GroupedArea, idx: number) => (
              <div
                key={idx}
                onClick={() => {
                  ViewAreaPincode(item);
                }}
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
                  {item.refAreaPrefix.toUpperCase() || "N"}
                </div>
                <div className="pl-3 flex flex-column w-full align-items-center justify-content-between">
                  <div className="flex flex-row justify-content-between w-full">
                    <div className="w-[80%]">
                      <p>{item.refAreaName || "No data"}</p>
                      <p>PinCode Count : {item.pinCodes.length}</p>
                    </div>
                    <div className="w-[20%] flex align-items-center">
                      <div className="flex flex-column align-items-center justify-center">
                        {/* <p>Cust Count</p> */}
                        <p>
                          {item.pinCodes.reduce(
                            (total: any, data: any) =>
                              parseInt(total) + parseInt(data.customerCount),
                            0
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {localStorage.getItem("newPinCode") !== "true" ? (
          <>
            <IonFab slot="fixed" vertical="bottom" horizontal="end">
              <IonFabButton onClick={() => history.push("/addNewArea")}>
                <IonIcon icon={add}></IonIcon>
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

export default AreaList;
