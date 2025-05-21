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

import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";

import React, { useEffect, useRef, useState } from "react";
import decrypt from "../../services/helper";
import axios from "axios";
import { IonToast } from "@ionic/react";

import { City, State } from "country-state-city";

import defaultProfilePic from "../../assets/users/userImg.png";

interface UserAuditProps {
  refUserId: number;
}

const UserDataEdit: React.FC<UserAuditProps> = ({ refUserId }) => {
  // STATUS
  const status = [
    { name: "Active", code: "active" },
    { name: "Inactive", code: "inactive" },
  ];

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

  // STATE AND CITY HANDLING
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  // INPUT STATE HANDLED
  const [inputs, setInputs]: any = useState({
    fname: "",
    lname: "",
    dob: "",
    status: "",
    mobileno: "",
    email: "",
    aadharno: "",
    panno: "",
    aadharImg: "",
    panImg: "",
    address: "",
    state: "",
    district: "",
    pincode: "",
    profileImg: "",
    ProfileImgBase64: "",
    PanImgBase64: "",
    AadharImgBase64: "",
    updateprofileImg: "",
    updatepanImg: "",
    updatedaadharImg: "",
    refUserId: "",
    refRName: "",
    refRPhoneNumber: "",
    refRAddress: "",
    refAadharNumber: "",
    refPanNumber: "",
  });

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

  // HANDLE SUBMIT UPDATE FOR USER DETAILS TO BACKEND
  const submitUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("profile", inputs.updateprofileImg?.data || "");
      formData.append("pan", inputs.updatepanImg?.data || "");
      formData.append("aadhar", inputs.updatedaadharImg?.data || "");

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
        axios
          .post(
            import.meta.env.VITE_API_URL + "/adminRoutes/updatePerson",
            {
              userId: refUserId,
              BasicInfo: {
                user: {
                  refPerFName: inputs.fname,
                  refPerLName: inputs.lname,
                  refDOB: inputs.dob,
                  refAadharNo: inputs.aadharno,
                  refPanNo: inputs.panno,
                  refRollId: "3",
                  activeStatus: inputs.status,
                  ProfileImgPath:
                    data.filePaths.images.profile.length > 0
                      ? data.filePaths.images.profile
                      : inputs.profileImg,
                  refPanPath:
                    data.filePaths.images.pan.length > 0
                      ? data.filePaths.images.pan
                      : inputs.panImg,
                  refAadharPath:
                    data.filePaths.images.aadhar.length > 0
                      ? data.filePaths.images.aadhar
                      : inputs.aadharImg,
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

            console.log(data);

            if (data.success) {
              console.log("data", data);
            }
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUserDetailsFromDB = () => {
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
        .then((response: any) => {
          const data = decrypt(
            response.data[1],
            response.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          );

          localStorage.setItem("token", "Bearer " + data.token);

          if (data.success) {
            console.log("data", data);
            const userData = data.data[0];
            console.log(data);

            setInputs({
              fname: userData.refUserFname,
              lname: userData.refUserLname,
              dob: userData.refUserDOB,
              status: userData.refActiveStatus,
              mobileno: userData.refUserMobileNo,
              email: userData.refUserEmail,
              aadharno: userData.refAadharNo,
              panno: userData.refPanNo,
              aadharImg: userData.refAadharPath,
              panImg: userData.refPanPath,
              address: userData.refUserAddress,
              state: userData.refUserState,
              district: userData.refUserDistrict,
              pincode: userData.refUserPincode,
              profileImg: userData.refUserProfile,
              ProfileImgBase64: userData.ProfileImgBase64,
              PanImgBase64: userData.PanImgBase64,
              AadharImgBase64: userData.AadharImgBase64,
            });

            const countryStates: any = State.getStatesOfCountry("IN");
            setStates(countryStates);

            if (userData.refUserState) {
              const districts: any = City.getCitiesOfState(
                "IN",
                userData.refUserState
              );
              setDistricts(districts);
            }
          }
        });
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUserDetailsFromDB();
    const countryStates: any = State.getStatesOfCountry("IN");
    setStates(countryStates);
  }, [refUserId]);

  return (
    <div>
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

        <button
          className="px-5 mt-3 submitButton w-full"
          onClick={submitUpdate}
        >
          Update
        </button>

        <Divider />
      </div>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        // color={toastColor}
      />
    </div>
  );
};

export default UserDataEdit;
