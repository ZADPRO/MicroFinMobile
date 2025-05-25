import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";
import axios from "axios";
import {
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonToast,
} from "@ionic/react";
import { add, trash } from "ionicons/icons";
import { InputText } from "primereact/inputtext";
import {
  CreditCard,
  IdCard,
  MapPinHouse,
  PhoneCall,
  UserRound,
} from "lucide-react";

interface ReferenceEditProps {
  createdAt: string;
  createdBy: string;
  refAadharNumber: string;
  refPanNumber: string;
  refRAddress: string;
  refRName: string;
  refRPhoneNumber: string;
  refRefId: number;
  refUserId: number;
  updatedAt: null;
  updatedBy: null;
}

interface UserAuditProps {
  refUserId: number;
}

const UserReferenceEdit: React.FC<UserAuditProps> = ({ refUserId }) => {
  console.log("refUserId", refUserId);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  //   MODAL HANDLER
  const [showModal, setShowModal] = useState<boolean>(false);

  //   SET REFERENCE DETAILS IN STATES
  const [referenceDetails, setReferenceDetails] = useState<
    ReferenceEditProps[] | []
  >([]);

  // REFERENCES
  const [references, setReferences] = useState([
    {
      refRName: "",
      refRPhoneNumber: "",
      refRAddress: "",
      refAadharNumber: "",
      refPanNumber: "",
    },
  ]);

  //   REMOVE HANDLER FOR THE REFERENCE STATES
  const removeReference = (index: number) => {
    const updated = references.filter((_, i) => i !== index);
    setReferences(updated);
  };

  //   HANDLE REFERNEC EINPUT
  const handleReferenceInput = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedReferences = [...references];
    updatedReferences[index][name] = value;
    setReferences(updatedReferences);
  };

  const addReference = () => {
    setReferences([
      ...references,
      {
        refRName: "",
        refRPhoneNumber: "",
        refRAddress: "",
        refAadharNumber: "",
        refPanNumber: "",
      },
    ]);
  };

  // ADD NEW CUSTOMER HANDLER
  const handleNewUser = () => {
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/adminRoutes/addReference",
          {
            refUserId: refUserId,
            references: references,
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
            if (data.refUserId) {
              setReferences((prevReferences) => [
                ...prevReferences,
                {
                  refUserId: data.refUserId, // Ensure refUserId is set
                  refRName: "",
                  refRPhoneNumber: "",
                  refRAddress: "",
                  refAadharNumber: "",
                  refPanNumber: "",
                },
              ]);
            }

            setShowModal(false);
            getAllReferenceData();
          }
        });
    } catch (e) {
      console.error("Error adding reference:", e);
    }
  };

  const getAllReferenceData = () => {
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/adminRoutes/getPerson",
          {
            roleId: 3,
            refUserId: refUserId,
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
            console.log("data", data);
            setReferenceDetails(data.getReference);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAllReferenceData();
  }, []);

  return (
    <div>
      <div className="m-3">
        {referenceDetails.length > 0 ? (
          referenceDetails.map((item, index) => {
            return (
              <div
                key={`${index}`}
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
                  {item.refRName?.charAt(0) || "?"}
                </div>
                <div className="pl-3 flex flex-column w-full justify-content-between">
                  <p>Name: {item.refRName}</p>
                  <div className="flex w-full flex-row align-items-center justify-content-between">
                    <p>{item.refRPhoneNumber}</p>
                    <p>{item.refPanNumber}</p>
                  </div>
                  <p className="flex justify-content-end text-sm mt-1">
                    {item.refRAddress}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex">No Data Found</div>
        )}
      </div>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton onClick={() => setShowModal(true)}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
      <IonModal
        isOpen={showModal}
        onDidDismiss={() => setShowModal(false)}
        keepContentsMounted={true}
        initialBreakpoint={0.75}
        breakpoints={[0, 0.4, 0.75, 1]}
      >
        <div
          className="p-3 flex flex-column overflow-auto"
          style={{ marginBottom: "10px" }}
        >
          <div className="flex justify-content-between align-items-center">
            <label htmlFor="">Reference Details</label>
            <IonButton shape="round" onClick={addReference}>
              <IonIcon slot="icon-only" icon={add}></IonIcon>
            </IonButton>
          </div>
          {references.map((reference, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "20px",
                position: "relative",
              }}
            >
              {/* Delete button */}
              {index > 0 && (
                <IonButton
                  color="danger"
                  size="small"
                  style={{ position: "absolute", top: "0px", right: "0px" }}
                  onClick={() => removeReference(index)}
                >
                  <IonIcon icon={trash} slot="icon-only" />
                </IonButton>
              )}

              <div className="p-inputgroup flex-1 mt-2 mb-2">
                <span className="p-inputgroup-addon">
                  <UserRound />
                </span>
                <InputText
                  placeholder="Enter Name"
                  name="refRName"
                  value={reference.refRName}
                  onChange={(e) => handleReferenceInput(index, e)}
                />
              </div>

              <div className="p-inputgroup flex-1 mt-2 mb-2">
                <span className="p-inputgroup-addon">
                  <PhoneCall />
                </span>
                <InputText
                  placeholder="Enter Mobile"
                  name="refRPhoneNumber"
                  value={reference.refRPhoneNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value))
                      handleReferenceInput(index, e);
                  }}
                />
              </div>

              <div className="p-inputgroup flex-1 mt-2 mb-2">
                <span className="p-inputgroup-addon">
                  <MapPinHouse />
                </span>
                <InputText
                  placeholder="Enter Address"
                  name="refRAddress"
                  value={reference.refRAddress}
                  onChange={(e) => handleReferenceInput(index, e)}
                />
              </div>

              <div className="p-inputgroup flex-1 mt-2 mb-2">
                <span className="p-inputgroup-addon">
                  <IdCard />
                </span>
                <InputText
                  placeholder="Enter Aadhar Number"
                  name="refAadharNumber"
                  value={reference.refAadharNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,12}$/.test(value))
                      handleReferenceInput(index, e);
                  }}
                />
              </div>

              <div className="p-inputgroup flex-1 mt-2 mb-2">
                <span className="p-inputgroup-addon">
                  <CreditCard />
                </span>
                <InputText
                  placeholder="Enter PAN Number"
                  name="refPanNumber"
                  value={reference.refPanNumber}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    let valid = true;

                    for (let i = 0; i < value.length; i++) {
                      const char = value[i];
                      if (i < 5 && !/[A-Z]/.test(char)) valid = false;
                      else if (i >= 5 && i < 9 && !/[0-9]/.test(char))
                        valid = false;
                      else if (i === 9 && !/[A-Z]/.test(char)) valid = false;
                    }

                    if (valid && value.length <= 10) {
                      e.target.value = value;
                      handleReferenceInput(index, e);
                    }
                  }}
                />
              </div>
            </div>
          ))}

          <button className="px-5 submitButton w-full" onClick={handleNewUser}>
            Submit
          </button>

          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={2000}
            // color={toastColor}
          />
        </div>
      </IonModal>
    </div>
  );
};

export default UserReferenceEdit;
