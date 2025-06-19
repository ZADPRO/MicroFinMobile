import React, { useEffect, useRef, useState } from "react";

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import defaultProfilePic from "../../assets/users/userImg.png";

import { City, State } from "country-state-city";
import axios from "axios";
import decrypt from "../../services/helper";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useHistory } from "react-router";

const UserAddAgent: React.FC = () => {
  useEffect(() => {
    return () => {};
  }, []);

  // HISTORY NAVIAGTE
  const history = useHistory();

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

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

  // INPUT STATES
  const status = [
    { name: "Active", code: "active" },
    { name: "Inactive", code: "inactive" },
  ];

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const countryStates: any = State.getStatesOfCountry("IN");
    setStates(countryStates);
  }, []);

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
    password: "12345678",
  });

  // HANDLE DATA TO BACKEND TO ADD A NEW AGENT
  const handleNewUser = async () => {
    const formData = new FormData();
    formData.append("profile", inputs.profileImg?.data || "");
    formData.append("pan", inputs.panImg?.data || "");
    formData.append("aadhar", inputs.aadharImg?.data || "");

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
      console.log(data);

      localStorage.setItem("token", "Bearer " + data.token);

      if (data.success) {
        console.log(data.filePaths.images.aadhar);

        axios
          .post(
            import.meta.env.VITE_API_URL + "/adminRoutes/addPerson",
            {
              BasicInfo: {
                user: {
                  refRollId: 2,
                  refPerFName: inputs.fname,
                  refPerLName: inputs.lname,
                  refDOB: inputs.dob,
                  refAadharNo: inputs.aadharno,
                  refPanNo: inputs.panno,
                  activeStatus: inputs.status,
                  ProfileImgPath: data.filePaths.images.profile,
                  refPanPath: data.filePaths.images.pan,
                  refAadharPath: data.filePaths.images.aadhar,
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

            if (data.success) {
              history.replace("/agentList", { shouldReload: true });
            }
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/agentList" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Add New Agent</IonTitle>
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

          <InputText
            placeholder="Enter First Name"
            className="w-full"
            id="fname"
            name="fname"
            value={inputs.fname}
            onChange={(e: any) => {
              handleInput(e);
            }}
          />

          <InputText
            id="lname"
            name="lname"
            className="w-full mt-3"
            placeholder="Enter Last Name"
            value={inputs.lname}
            onChange={(e: any) => {
              handleInput(e);
            }}
            required
          />

          <Calendar
            dateFormat="dd/mm/yy"
            name="dob"
            className="w-full mt-3"
            placeholder="Enter Date of Birth"
            value={inputs.dob ? new Date(inputs.dob) : null}
            id="dob"
            onChange={(e: any) => {
              handleInput(e);
            }}
            required
          />

          <Dropdown
            name="status"
            className="w-full mt-3"
            value={inputs.status}
            options={status}
            optionLabel="name"
            optionValue="code"
            onChange={(e: any) => {
              handleInput(e);
            }}
            required
          />

          <InputText
            id="mobileno"
            name="mobileno"
            className="w-full mt-3"
            placeholder="Enter Mobile"
            value={inputs.mobileno}
            onChange={(e: any) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) {
                handleInput(e); // Only update if it's a number and max 12 digits
              }
            }}
            required
          />

          <InputText
            id="email"
            name="email"
            className="w-full mt-3"
            placeholder="Enter Email"
            type="email"
            onChange={(e: any) => {
              handleInput(e);
            }}
            value={inputs.email}
            required
          />

          <InputText
            id="aadharno"
            className="w-full mt-3"
            placeholder="Enter Aadhar Number"
            name="aadharno"
            onChange={(e: any) => {
              const value = e.target.value;
              if (/^\d{0,12}$/.test(value)) {
                handleInput(e); // Only update if it's a number and max 12 digits
              }
            }}
            value={inputs.aadharno}
            required
          />

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

          <InputText
            id="panno"
            className="w-full mt-3"
            placeholder="Enter PAN Number"
            name="panno"
            value={inputs.panno}
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
            required
          />

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

          <InputText
            className="w-full mt-3"
            placeholder="Enter Address"
            id="address"
            name="address"
            value={inputs.address}
            onChange={(e: any) => {
              handleInput(e);
            }}
            required
          />

          <Dropdown
            name="state"
            className="w-full mt-3"
            placeholder="Choose State"
            value={inputs.state}
            filter
            options={states}
            optionLabel="name" // Specifies the display text
            optionValue="isoCode" // Specifies the actual value
            onChange={(e) => handleInput(e)}
            required
          />

          <Dropdown
            name="district"
            className="w-full mt-3"
            placeholder="Choose District"
            value={inputs.district}
            filter
            options={districts}
            optionLabel="name" // Ensures dropdown displays district names
            optionValue="name" // Stores district name as the selected value
            onChange={(e) => handleInput(e)}
            required
          />

          <InputText
            type="text"
            name="pincode"
            className="w-full mt-3"
            placeholder="Enter Pincode"
            id="pincode"
            value={inputs.pincode && null}
            onChange={(e: any) => {
              const value = e.target.value;
              if (/^\d{0,6}$/.test(value)) {
                handleInput(e); // Only update if it's a number and max 12 digits
              }
            }}
            required
          />

          <button
            className="px-5 mt-3 submitButton w-full"
            onClick={handleNewUser}
          >
            Submit
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserAddAgent;
