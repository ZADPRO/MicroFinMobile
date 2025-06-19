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

const AddNewArea: React.FC = () => {
  const [inputErrors, setInputErrors] = useState<boolean[]>([]);
  const [areaName, setAreaName] = useState<string>();
  const [areaPrefix, setAreaPrefix] = useState<string>();
  const [prefixInputs, setPrefixInputs] = useState<string[]>([""]);
  const [updatePincode, setUpdatePincode] = useState<updatePicode[]>([]);
  const [inputErrorMessages, setInputErrorMessages] = useState<string[]>([]);
  const [addArea, setAddArea] = useState<boolean>();
  const [areaList, setAreaList] = useState<listArea[]>([]);
  const [areaId, setAreaId] = useState<number | null>();

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState<
    "danger" | "success" | "warning"
  >("danger");

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

  const handleInputChange = (value: string, index: number) => {
    const updatedInputs = [...prefixInputs];
    updatedInputs[index] = value;
    setPrefixInputs(updatedInputs);

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
                newErrors[index] = true;
                newErrorMessages[
                  index
                ] = `The Area "${data.data}" already contains this Pincode`;
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
      index === prefixInputs.length - 1 &&
      value.length === 6 &&
      /^[0-9]{6}$/.test(value)
    ) {
      setPrefixInputs([...updatedInputs, ""]);
      setInputErrors([...newErrors, false]); // Add empty error slot
      setInputErrorMessages([...newErrorMessages, ""]); // Add empty error message slot
    }
  };

  const renderInputRows = () => {
    return prefixInputs.map((val, index) => {
      const showError = val.length > 0 && val.length !== 6;

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
              value={val}
              required={prefixInputs[index].length > 0}
              maxLength={6}
              minLength={6}
              onChange={(e) => {
                handleInputChange(e.target.value, index);
              }}
              placeholder="Enter 6 digit Pincode"
            />
          </div>

          {showError && (
            <div className="w-full text-[red] text-sm text-left">
              Area code must be exactly 6 digits.
            </div>
          )}

          {/* API error */}
          {inputErrors[index] && (
            <div className="w-full flex justify-end text-[red] text-sm text-left mt-1">
              {inputErrorMessages[index]}
            </div>
          )}
        </div>
      );
    });
  };

  const onsubmit = () => {
    const pincode = prefixInputs.filter((data) => data.length === 6);

    console.log("pincode", pincode);
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/area/addArea",
          {
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
          console.log("data line ----- 82", data);

          if (data.success) {
            setAddArea(false);
            getAreaList();
            setPrefixInputs([""]);
            setAreaId(null);
            setAreaName("");
            setAreaPrefix("");
            setToastMessage("New Area Added Successfully");
            setToastColor("success");
            setShowToast(true);
            // toast.success("New Area is Created Successfully", {
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
            setToastMessage("Error in Adding New Area");
            setToastColor("danger");
            setShowToast(true);
            // toast.error("Error In Creating the New Area", {
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

  useEffect(() => {
    setPrefixInputs([""]);
    // setAreaId(null);
    setAreaName("");
    setAreaPrefix("");
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/areaList" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Create New Area</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="mt-2">
          <form
            className="shadow p-3 rounded-md"
            onSubmit={(e) => {
              e.preventDefault();
              onsubmit();
            }}
          >
            {/* <div className='w-full flex justify-center mb-2'>
                <b className='text-[1.2rem]'>Add New Area</b>
              </div> */}

            <div className="flex flex-column justify-around w-full">
              <div className="flex flex-column gap-2 my-2 w-[45%]">
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
              <div className="flex flex-column gap-2 w-[45%]">
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
            <div className="flex flex-column justify-start align-items-start w-full mt-2">
              <div className="w-[95%]">
                <label className="mb-2">
                  <b>Area Pin-Codes: {prefixInputs.length}</b>
                </label>
              </div>
              <div className="flex w-full justify-center align-items-center flex-column gap-y-2">
                {renderInputRows()}
              </div>
            </div>

            {inputErrors.filter((data) => data === true).length === 0 && (
              <div className="w-full flex justify-center my-3 gap-x-5">
                <button type="submit" className=" submitButton w-full">
                  Add New Area
                </button>
                {/* <button className="bg-[red] text-white hover:bg-[#ff0000e1] px-10 py-1 rounded-md">
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

export default AddNewArea;
