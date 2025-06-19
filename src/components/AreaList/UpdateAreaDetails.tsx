import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";
import { warningOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import { useIonRouter } from "@ionic/react";

interface updatePicode {
  pinCode: string;
  refAreaPinCodeId: number | null;
}

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
const UpdateAreaDetails: React.FC = () => {
  const [inputErrors, setInputErrors] = useState<boolean[]>([]);
  const [areaName, setAreaName] = useState<string>();
  const [areaPrefix, setAreaPrefix] = useState<string>();
  const [prefixInputs, setPrefixInputs] = useState<string[]>([""]);
  const [updatePincode, setUpdatePincode] = useState<updatePicode[]>([]);
  const [inputErrorMessages, setInputErrorMessages] = useState<string[]>([]);
  const [addArea, setAddArea] = useState<boolean>();
  const [areaList, setAreaList] = useState<listArea[]>([]);
  const [areaId, setAreaId] = useState<number | null>();
  const [updateArea, setUpdateArea] = useState<boolean>();
  const router = useIonRouter();
  const history = useHistory();

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState<
    "danger" | "success" | "warning"
  >("danger");

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
          console.log("data line ------ 177", data);
          if (data.success) {
            setAreaList(data.data);
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  const onUpdatesubmit = () => {
    console.log("prefixInputs line ------ > 44", prefixInputs);
    const pincode = updatePincode.filter((data) => data.pinCode.length === 6);

    console.log("pincode", pincode);
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/area/updateArea",
          {
            areaId: areaId,
            areaName: areaName,
            areaPrefix: areaPrefix,
            areaPinCode: pincode,
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
            setAddArea(false);
            setUpdateArea(false);
            getAreaList();
            setUpdatePincode([{ pinCode: "", refAreaPinCodeId: null }]);
            setAreaId(null);
            setAreaName("");
            setAreaPrefix("");
            setToastMessage("Area Update Successfully");
            setToastColor("success");
            setShowToast(true);
            localStorage.removeItem("areaPinCodeView1");
            localStorage.removeItem("newPinCode");
            history.replace("/areaList", { shouldReload: true });

            // toast.success("Area details is Updated Successfully", {
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
          } else {
            setToastMessage("Error in Updating the Area Details");
            setToastColor("danger");
            setShowToast(true);
            // toast.error("Error in Updating the Area Details", {
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
          }
        });
    } catch (e: any) {
      console.log(e);
    }
  };

  const updateHandleInputChange = (value: string, index: number) => {
    const updatedInputs = [...updatePincode];
    updatedInputs[index] = {
      pinCode: value,
      refAreaPinCodeId: updatedInputs[index].refAreaPinCodeId,
    };
    setUpdatePincode(updatedInputs);

    // Initialize errors array if needed
    const newErrors = [...inputErrors];
    const newErrorMessages = [...inputErrorMessages];

    if (value.length === 6) {
      try {
        axios
          .post(
            import.meta.env.VITE_API_URL + "/area/checkPinCode",
            {
              pinCode: value,
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
              if (!data.validation) {
                // set error for this index
                if (data.pinCodeId === updatedInputs[index].refAreaPinCodeId) {
                  newErrors[index] = false;
                  newErrorMessages[index] = "";
                } else {
                  newErrors[index] = true;
                  newErrorMessages[
                    index
                  ] = `The Area "${data.data}" already contains this Pincode`;
                }
              } else {
                newErrors[index] = false;
                newErrorMessages[index] = "";
              }

              setInputErrors(newErrors);
              setInputErrorMessages(newErrorMessages);
            }
          });
      } catch (error) {
        console.log("error", error);
      }
    } else {
      // If input is not complete 6 digits, clear error for this index
      newErrors[index] = false;
      newErrorMessages[index] = "";
      setInputErrors(newErrors);
      setInputErrorMessages(newErrorMessages);
    }

    // Add new empty box if last and valid
    if (
      index === updatePincode.length - 1 &&
      value.length === 6 &&
      /^[0-9]{6}$/.test(value)
    ) {
      setUpdatePincode([
        ...updatedInputs,
        { pinCode: "", refAreaPinCodeId: null },
      ]);
      setInputErrors([...newErrors, false]);
      setInputErrorMessages([...newErrorMessages, ""]);
    }
  };

  const updateRenderInputRows = () => {
    return updatePincode.map((val, index) => {
      const showError = val.pinCode.length > 0 && val.pinCode.length !== 6;

      return (
        <div
          key={index}
          className="flex flex-column w-full justify-center items-center mt-2"
        >
          <div className="flex flex-column w-full justify-around items-center mb-1">
            <label htmlFor={`area-code-${index}`} className="w-full">
              Enter Area Code {index + 1}
            </label>

            <InputText
              id={`area-code-${index}`}
              className="w-full my-2"
              value={val.pinCode}
              required={updatePincode[index].pinCode.length > 0}
              maxLength={6}
              minLength={6}
              onChange={(e) => {
                updateHandleInputChange(e.target.value, index);
              }}
              placeholder="Enter 6 digit Pincode"
            />
          </div>

          {showError && (
            <div className="w-[40%] text-[red] text-sm text-left">
              Area code must be exactly 6 digits.
            </div>
          )}

          {/* API error */}
          {inputErrors[index] && (
            <div className="w-[60%] flex justify-end text-[red] text-sm text-left mt-1">
              {inputErrorMessages[index]}
            </div>
          )}
        </div>
      );
    });
  };

  const setAreaDataToEdit = (data: GroupedArea) => {
    setAreaName(data.refAreaName);
    setAreaPrefix(data.refAreaPrefix);
    setUpdatePincode(data.pinCodes);
    setAreaId(data.refAreaId);
    setUpdatePincode([
      ...data.pinCodes,
      {
        pinCode: "",
        refAreaPinCodeId: null,
      },
    ]);
  };

  useEffect(() => {
    setUpdateArea(true);
    let data;
    if (localStorage.getItem("newPinCode") === "true") {
      data = localStorage.getItem("areaPinCodeView1");
    } else {
      data = localStorage.getItem("areaPinCodeView");
    }
    if (data) {
      setAreaDataToEdit(JSON.parse(data));
    }
    setAddArea(false);
  }, []);

  const clearUpdate = () => {
    localStorage.removeItem("areaPinCodeView1");
    localStorage.removeItem("newPinCode");
    router.push("/areaList", "root");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/areaList" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Update Area Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="mt-2">
          <form
            className="shadow p-3 rounded-md"
            onSubmit={(e) => {
              e.preventDefault();
              onUpdatesubmit();
            }}
          >
            <div className="flex flex-column justify-around w-full">
              <div className="flex flex-column my-2 gap-2 w-full">
                <label htmlFor="username">Enter Area Name</label>
                <InputText
                  className="w-full capitalize"
                  id="username"
                  value={areaName}
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAreaName(e.target.value);
                  }}
                  aria-describedby="username-help"
                />
              </div>
              <div className="flex flex-column gap-2 w-full">
                <label htmlFor="username">Enter Area Prefix</label>
                <InputText
                  className="w-full uppercase"
                  value={areaPrefix}
                  id="username"
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAreaPrefix(e.target.value.toUpperCase());
                  }}
                  aria-describedby="username-help"
                />
              </div>
            </div>
            <div className="flex flex-column justify-start align-items-start w-full mt-3">
              <div className="w-[95%]">
                <label className="mb-2">
                  <b>Area Pin-Codes</b>
                </label>
              </div>
              <div className="flex w-full justify-center align-items-center flex-column gap-y-2">
                {updateRenderInputRows()}
              </div>
            </div>

            {inputErrors.filter((data) => data === true).length === 0 && (
              <div className="w-full flex flex-column justify-center my-3 gap-x-5">
                <button type="submit" className="submitButton my-2 w-full">
                  Update Area
                </button>
                {localStorage.getItem("newPinCode") === "true" && (
                  <button
                    onClick={() => {
                      clearUpdate();
                    }}
                    className="warningButton my-2 w-full"
                  >
                    Clear Updation
                  </button>
                )}
                {/* <button
                  onClick={() => {
                    setUpdateArea(false);
                    setUpdatePincode([]);
                    setAreaId(null);
                    setAreaName("");
                    setAreaPrefix("");
                  }}
                  className="bg-[red] text-white hover:bg-[#ff0000e1] px-10 py-1 rounded-md"
                >
                  close
                </button> */}
              </div>
            )}
          </form>
        </div>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          icon={warningOutline}
          className="custom-toast"
          // color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default UpdateAreaDetails;
