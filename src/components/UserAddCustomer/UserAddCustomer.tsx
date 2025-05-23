import React, { useEffect, useRef, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import {
  CalendarDays,
  CreditCard,
  IdCard,
  Mail,
  Map,
  MapPinHouse,
  MapPinned,
  Navigation,
  PhoneCall,
  ToggleRight,
  UserRound,
} from "lucide-react";
import { City, State } from "country-state-city";
import { IonToast } from "@ionic/react";

import defaultProfilePic from "../../assets/users/userImg.png";

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { add, trash } from "ionicons/icons";
import axios from "axios";
import decrypt from "../../services/helper";
import { useHistory } from "react-router";

interface StatusProps {
  name: string;
  code: string;
}

const UserAddCustomer: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  const status: StatusProps[] = [
    { name: "Active", code: "active" },
    { name: "Inactive", code: "inactive" },
  ];

  // HISTORY
  const history = useHistory();

  // FORM DATA
  const [inputs, setInputs]: any = useState({
    fname: "",
    lname: "",
    dob: null,
    status: "active",
    mobileno: "",
    email: "",
    aadharno: "",
    panno: "",
    aadharImg: "",
    panImg: "",
    address: "",
    state: "",
    district: "",
    pincode: null,
    profileImg: "",
    password: "",
    refRName: "",
    refRPhoneNumber: "",
    refRAddress: "",
    refAadharNumber: "",
    refPanNumber: "",
  });

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

  const removeReference = (index: number) => {
    const updated = references.filter((_, i) => i !== index);
    setReferences(updated);
  };

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  // const [toastColor, setToastColor] = useState("success");

  // STATE AND CITY HANDLING
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const countryStates: any = State.getStatesOfCountry("IN");
    setStates(countryStates);
  }, []);

  // IMAGE UPLOAD API

  const [previewProfile, setPreviewProfile] = useState(defaultProfilePic);
  const [previewAadhar, setPreviewAadhar] = useState(null);
  const [previewPan, setPreviewPan] = useState(null);

  // Separate refs for each input
  const fileInputRefProfile = useRef(null);
  const fileInputRefAadhar = useRef(null);
  const fileInputRefPan = useRef(null);

  const handleInput = (e: any) => {
    const { name, value } = e.target;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "state") {
      const districts: any = City.getCitiesOfState("IN", value);
      setDistricts(districts);
    }
  };

  // IMAGE UPLOAD HANDLING
  const handleImageClick = (type) => {
    if (type === "profile") fileInputRefProfile.current?.click();
    else if (type === "aadhar") fileInputRefAadhar.current?.click();
    else if (type === "pan") fileInputRefPan.current?.click();
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "profile") {
        setInputs((prev) => ({
          ...prev,
          profileImg: { file, data: reader.result },
        }));
        setPreviewProfile(reader.result);
      } else if (type === "aadhar") {
        setInputs((prev) => ({
          ...prev,
          aadharImg: { file, data: reader.result },
        }));
        setPreviewAadhar(reader.result);
      } else if (type === "pan") {
        setInputs((prev) => ({
          ...prev,
          panImg: { file, data: reader.result },
        }));
        setPreviewPan(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (
      !inputs.profileImg?.file &&
      !inputs.panImg?.file &&
      !inputs.aadharImg?.file
    ) {
      alert("Please select at least one image to upload!");
      return;
    }

    const formData = new FormData();
    if (inputs.profileImg?.file)
      formData.append("profile", inputs.profileImg.file);
    if (inputs.panImg?.file) formData.append("pan", inputs.panImg.file);
    if (inputs.aadharImg?.file)
      formData.append("aadhar", inputs.aadharImg.file);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/adminRoutes/profileUpload",
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("data profile api - 170 ", data.filePaths.images);

      setInputs((prev) => ({
        ...prev,
        profileImg: data.filePaths.images.profile || prev.profileImg,
        panImg: data.filePaths.images.pan || prev.panImg,
        aadharImg: data.filePaths.images.aadhar || prev.aadharImg,
      }));

      setToastMessage("Upload successful!");
      setShowToast(true);
    } catch (error) {
      console.error("Upload failed:", error);
      setToastMessage("Upload failed.");
      setShowToast(true);
    }
  };

  // ADD NEW CUSTOMER HANDLER
  const handleNewUser = async () => {
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/adminRoutes/addPerson",
          {
            BasicInfo: {
              user: {
                refRollId: 3,
                refPerFName: inputs.fname,
                refPerLName: inputs.lname,
                refDOB: inputs.dob,
                refAadharNo: inputs.aadharno,
                refPanNo: inputs.panno,
                activeStatus: inputs.status,
                ProfileImgPath: inputs.profileImg ? inputs.profileImg : "",
                refPanPath: inputs.panImg ? inputs.panImg : "",
                refAadharPath: inputs.aadharImg ? inputs.aadharImg : "",
              },
              Communtication: {
                refPerMob: inputs.mobileno,
                refPerEmail: inputs.email,
                refPerAddress: inputs.address,
                refPerDistrict: inputs.district,
                refPerState: inputs.state,
                refPerPincode: inputs.pincode,
              },
            },
            DomainInfo: {
              refUserPassword: inputs.password,
            },
            reference: references,
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
          console.log("data----------------------", data);

          if (data.success) {
            setToastMessage("Customer Added Successfully !");
            setShowToast(true);

            // Clear form state
            setInputs({
              fname: "",
              lname: "",
              dob: null,
              status: "active",
              mobileno: "",
              email: "",
              aadharno: "",
              panno: "",
              aadharImg: "",
              panImg: "",
              address: "",
              state: "",
              district: "",
              pincode: null,
              profileImg: "",
              password: "",
              refRName: "",
              refRPhoneNumber: "",
              refRAddress: "",
              refAadharNumber: "",
              refPanNumber: "",
            });

            // Clear references
            setReferences([
              {
                refRName: "",
                refRPhoneNumber: "",
                refRAddress: "",
                refAadharNumber: "",
                refPanNumber: "",
              },
            ]);

            // Optionally reset image previews if needed
            setPreviewProfile(defaultProfilePic);
            setPreviewAadhar(null);
            setPreviewPan(null);
            history.goBack();
          } else {
            setToastMessage("Customer Added Failed !" + data.message);
            setShowToast(true);
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/userList" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Add New Customer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="formData p-3">
          <div className="flex flex-column align-items-center mb-3">
            <p className="py-1 font-semibold">Profile Pic</p>
            <img
              src={previewProfile}
              alt="Profile Preview"
              style={{ width: "30%", borderRadius: "50%" }}
              className="object-cover cursor-pointer shadow-lg"
              onClick={() => handleImageClick("profile")}
            />
            <input
              type="file"
              ref={fileInputRefProfile}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => handleFileChange(e, "profile")}
            />
            <button onClick={handleUpload}>Upload</button>
            <p className="py-2 text-gray-500 text-sm">
              Click the image to choose file, then click Upload
            </p>
          </div>

          <label htmlFor="">Basic Details</label>

          <div className="p-inputgroup flex-1 mt-3">
            <span className="p-inputgroup-addon">
              <UserRound />
            </span>
            <InputText
              placeholder="First Name"
              id="fname"
              name="fname"
              value={inputs.fname}
              onChange={(e: any) => {
                handleInput(e);
              }}
            />
          </div>
          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <UserRound />
            </span>
            <InputText
              placeholder="Last Name"
              id="lname"
              name="lname"
              value={inputs.lname}
              onChange={(e: any) => {
                handleInput(e);
              }}
            />
          </div>

          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <CalendarDays />{" "}
            </span>
            <Calendar
              dateFormat="dd/mm/yy"
              name="dob"
              style={{ width: "100%" }}
              value={inputs.dob ? new Date(inputs.dob) : null}
              id="dob"
              onChange={(e: any) => {
                handleInput(e);
              }}
              placeholder="Date of Birth"
            />
          </div>
          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <ToggleRight />
            </span>
            <Dropdown
              name="status"
              value={inputs.status}
              options={status}
              optionLabel="name"
              optionValue="code"
              onChange={(e: any) => {
                handleInput(e);
              }}
              placeholder="Select a Status"
              className="w-full md:w-14rem"
            />
          </div>

          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <PhoneCall />{" "}
            </span>
            <InputText
              placeholder="Enter Mobile"
              id="mobileno"
              name="mobileno"
              value={inputs.mobileno}
              onChange={(e: any) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  handleInput(e); // Only update if it's a number and max 12 digits
                }
              }}
            />
          </div>
          <div className="p-inputgroup flex-1 mt-2 mb-2">
            <span className="p-inputgroup-addon">
              <Mail />{" "}
            </span>
            <InputText
              placeholder="Enter Email"
              id="email"
              name="email"
              type="email"
              onChange={(e: any) => {
                handleInput(e);
              }}
              value={inputs.email}
            />
          </div>

          <Divider />

          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <IdCard />{" "}
            </span>
            <InputText
              placeholder="Aadhar Number"
              id="aadharno"
              name="aadharno"
              keyfilter="pint" // PrimeReact built-in to allow only positive integers
              maxLength={12}
              onChange={(e: any) => {
                const value = e.target.value;
                if (/^\d{0,12}$/.test(value)) {
                  handleInput(e); // Only update if it's a number and max 12 digits
                }
              }}
              value={inputs.aadharno}
            />
          </div>

          <div className="flex flex-column align-items-center mb-3 mt-3">
            <p className="py-1 font-semibold">Aadhar Image</p>
            <img
              src={previewAadhar || defaultProfilePic}
              alt="Aadhar Preview"
              style={{ width: "20%" }}
              className="object-cover cursor-pointer shadow-lg"
              onClick={() => handleImageClick("aadhar")}
            />
            <input
              type="file"
              ref={fileInputRefAadhar}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => handleFileChange(e, "aadhar")}
            />
            <button onClick={handleUpload}>Upload</button>
            <p className="py-2 text-gray-500 text-sm">
              Click the image to choose file, then click Upload
            </p>
          </div>

          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <CreditCard />
            </span>
            <InputText
              placeholder="Pan Number"
              id="panno"
              name="panno"
              value={inputs.panno}
              maxLength={10}
              onChange={(e: any) => {
                const value = e.target.value.toUpperCase(); // Always uppercase
                let valid = true;

                // Enforce character-by-character format
                for (let i = 0; i < value.length; i++) {
                  const char = value[i];

                  if (i < 5 && !/[A-Z]/.test(char)) {
                    valid = false; // First 5 should be A-Z
                    break;
                  } else if (i >= 5 && i < 9 && !/[0-9]/.test(char)) {
                    valid = false; // Next 4 should be 0-9
                    break;
                  } else if (i === 9 && !/[A-Z]/.test(char)) {
                    valid = false; // Last one should be A-Z
                    break;
                  }
                }

                if (valid && value.length <= 10) {
                  e.target.value = value;
                  handleInput(e);
                }
              }}
            />
          </div>
          <div className="flex flex-column align-items-center mb-3 mt-3">
            <p className="py-1 font-semibold">PAN Card Image</p>
            <img
              src={previewPan || defaultProfilePic}
              alt="PAN Preview"
              style={{ width: "20%" }}
              className="object-cover cursor-pointer shadow-lg"
              onClick={() => handleImageClick("pan")}
            />
            <input
              type="file"
              ref={fileInputRefPan}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => handleFileChange(e, "pan")}
            />
            <button onClick={handleUpload}>Upload</button>
            <p className="py-2 text-gray-500 text-sm">
              Click the image to choose file, then click Upload
            </p>
          </div>

          <Divider />

          <label htmlFor="">Communication Details</label>

          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <MapPinHouse />{" "}
            </span>
            <InputText
              placeholder="Address"
              id="address"
              name="address"
              value={inputs.address}
              onChange={(e: any) => {
                handleInput(e);
              }}
            />
          </div>

          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <Map />{" "}
            </span>
            <Dropdown
              name="state"
              value={inputs.state}
              filter
              options={states}
              placeholder="Select State"
              optionLabel="name"
              optionValue="isoCode"
              onChange={(e) => handleInput(e)}
              required
            />{" "}
          </div>

          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <MapPinned />
            </span>
            <Dropdown
              className="dropDown"
              name="district"
              value={inputs.district}
              filter
              options={districts}
              placeholder="Select City"
              optionLabel="name"
              optionValue="name"
              onChange={(e) => handleInput(e)}
              required
            />
          </div>
          <div className="p-inputgroup flex-1 mt-2 mb-2">
            <span className="p-inputgroup-addon">
              <Navigation />
            </span>
            <InputText
              placeholder="Enter Pincode"
              type="text" // Use text instead of number to allow maxlength to work
              name="pincode"
              maxLength={6}
              style={{ width: "100%" }}
              id="pincode"
              value={inputs.pincode || ""} // Corrected this
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,6}$/.test(value)) {
                  handleInput(e); // Only update if it's 0-6 digits
                }
              }}
            />
          </div>

          <Divider />

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
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          // color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default UserAddCustomer;
