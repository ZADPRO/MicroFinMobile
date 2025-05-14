import React, { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import {
  CalendarDays,
  CreditCard,
  IdCard,
  Map,
  MapPinHouse,
  MapPinned,
  Navigation,
  ToggleRight,
  UserRound,
} from "lucide-react";
import { City, State } from "country-state-city";

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

interface StatusProps {
  name: string;
  code: string;
}

const UserAddCustomer: React.FC = () => {
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  const status: StatusProps[] = [
    { name: "Active", code: "active" },
    { name: "Inactive", code: "inactive" },
  ];

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

  const [date, setDate] = useState<Nullable<Date>>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusProps | null>(
    null
  );
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const countryStates: any = State.getStatesOfCountry("IN");
    setStates(countryStates);
  }, []);

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
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <UserRound />
            </span>
            <InputText placeholder="First Name" />
          </div>
          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <UserRound />
            </span>
            <InputText placeholder="Last Name" />
          </div>

          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <CalendarDays />{" "}
            </span>
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value)}
              placeholder="Date of Birth"
            />
          </div>
          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <ToggleRight />
            </span>
            <Dropdown
              value={selectedStatus}
              onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)}
              options={status}
              optionLabel="name"
              placeholder="Select a Status"
              className="w-full md:w-14rem"
            />
          </div>

          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <IdCard />{" "}
            </span>
            <InputText placeholder="Aadhar Number" />
          </div>
          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <CreditCard />
            </span>
            <InputText placeholder="Pan Number" />
          </div>

          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <MapPinHouse />{" "}
            </span>
            <InputText placeholder="Address" />
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
          <div className="p-inputgroup flex-1 mt-2">
            <span className="p-inputgroup-addon">
              <Navigation />
            </span>
            <InputText placeholder="Enter Pincode" />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserAddCustomer;
