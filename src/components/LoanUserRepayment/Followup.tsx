import axios from "axios";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useState } from "react";
import decrypt from "../../services/helper";

interface UserDataProps {
  refCustId: string;
  refLoanAmount: string;
  refLoanId: number;
  refPaymentDate: string;
  refProductDuration: string;
  refProductInterest: string;
  refProductName: string;
  refRpayId: number;
  refUserAddress: string;
  refUserDistrict: string;
  refUserFname: string;
  refUserId: number;
  refUserLname: string;
  refUserMobileNo: string;
  refUserPincode: string;
  refUserState: string;
}

interface FollowUpForm {
  Message: string;
  Date: any;
}
const Followup: React.FC<{ userData: UserDataProps }> = ({ userData }) => {
  // FOLLOW UP FORM
  const [followUpForm, setFollowUpForm] = useState<FollowUpForm>({
    Message: "",
    Date: null,
  });

  const updateFollowUp = () => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/rePayment/updateFollowUp",
        {
          rePayId: userData.refRpayId,
          message: followUpForm.Message,
          nextDate: followUpForm.Date,
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
        console.log("data line ------ 278", data);
        localStorage.setItem("token", "Bearer " + data.token);

        if (data.success) {
          console.log("data", data);
        } else {
          console.log("data", data);
        }
      });
  };

  return (
    <div className="m-3">
      <InputTextarea
        required
        className="h-full w-full mt-2"
        placeholder="Comment Given By User"
        value={followUpForm.Message}
        onChange={(e) =>
          setFollowUpForm({ ...followUpForm, Message: e.target.value ?? "" })
        }
        rows={5}
        cols={30}
      />{" "}
      <Calendar
        required
        className="w-full mt-2"
        placeholder="Date & Time Asked By The User"
        value={followUpForm.Date}
        onChange={(e) =>
          setFollowUpForm({ ...followUpForm, Date: e.target.value ?? "" })
        }
        showTime
        hourFormat="12"
      />
      <button
        className="px-5 mt-3 submitButton w-full"
        onClick={() => updateFollowUp()}
      >
        Submit
      </button>
    </div>
  );
};

export default Followup;
