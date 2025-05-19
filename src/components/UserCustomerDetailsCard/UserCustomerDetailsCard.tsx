import { IonList } from "@ionic/react";
import React from "react";
import userImg from "../../assets/users/userImg.png";
import { Divider } from "primereact/divider";
import { useHistory } from "react-router";

interface UserCustomerDetailsCardProps {
  refCustId: string;
  refUserFname: string;
  refUserLname: string;
  refUserMobileNo: string;
  refActiveStatus: string; // "Active" or "Inactive"
}

const UserCustomerDetailsCard: React.FC<UserCustomerDetailsCardProps> = ({
  refCustId,
  refUserFname,
  refUserLname,
  refUserMobileNo,
  refActiveStatus,
}) => {
  const history = useHistory();

  const handleCardClick = () => {
    history.push("/viewUserDetails", { refCustId });
  };

  return (
    <div>
      <IonList
        inset={true}
        className="bg-white p-3 rounded shadow-1"
        onClick={handleCardClick}
      >
        <div className="flex w-full">
          <img src={userImg} alt="User" width={70} />
          <div className="w-full">
            <div className="flex w-full pl-3 justify-content-between align-items-center">
              <p>
                <b>
                  {refUserFname} {refUserLname}
                </b>
              </p>
              <div className="flex align-items-center gap-2">
                <p
                  style={{
                    color: refActiveStatus === "active" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {refActiveStatus === "active" ? "ACTIVE" : "INACTIVE "}
                </p>
              </div>
            </div>
            <div className="flex w-full pl-3 pt-1">
              <p>
                <b>Customer ID:</b> {refCustId}
              </p>
            </div>
            <div className="flex w-full pl-3 pt-1">
              <p className="flex gap-1 align-items-center">
                <b>Mobile:</b> {refUserMobileNo}
              </p>
            </div>
          </div>
        </div>
      </IonList>
      <Divider />
    </div>
  );
};

export default UserCustomerDetailsCard;
