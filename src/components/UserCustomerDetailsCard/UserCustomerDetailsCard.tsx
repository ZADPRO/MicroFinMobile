import { IonList } from "@ionic/react";
import React from "react";
import userImg from "../../assets/users/userImg.png";
import agentImg from "../../assets/users/agentImg.png";
import { Divider } from "primereact/divider";

interface UserCustomerDetailsCardProps {
  refCustId: string;
  refUserFname: string;
  refUserLname: string;
  refUserMobileNo: string;
  refActiveStatus: string;
}

const UserCustomerDetailsCard: React.FC<UserCustomerDetailsCardProps> = ({
  refCustId,
  refUserFname,
  refUserLname,
  refUserMobileNo,
  refActiveStatus,
}) => {
  return (
    <div>
      <IonList inset={true} className="bg-white p-3 rounded shadow-1">
        <div className="flex w-full">
          <img src={userImg} alt="User" width={70} />
          <div className="w-full">
            <div className="flex w-full pl-3 justify-content-between">
              <p>
                <b>
                  {refUserFname} {refUserLname}
                </b>
              </p>
              <p>{refActiveStatus}</p>
            </div>
            <div className="flex w-full pl-3 pt-1">
              <p>
                <b>Customer ID:</b> {refCustId}
              </p>
            </div>
            <div className="flex w-full pl-3 pt-1">
              <p className="flex gap-1 align-items-center">
                <b>Mobile: </b> {refUserMobileNo}
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
