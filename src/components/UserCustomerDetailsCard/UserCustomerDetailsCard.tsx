import { IonList } from "@ionic/react";
import React from "react";

import userImg from "../../assets/users/agent.svg";

const UserCustomerDetailsCard: React.FC = () => {
  return (
    <div>
      <IonList inset={true} className="bg-white p-3 rounded shadow-1">
        <div className="flex w-full">
          <img src={userImg} alt="Image" width={70} />
          <div className="w-full">
            <div className="flex w-full pl-3 justify-content-between">
              <p>
                <b>refCustId</b>
              </p>
              <p>
                <b>Name</b>
              </p>
            </div>
            <div className="flex w-full pl-3">
              <p className="flex gap-1 align-items-center">Phone</p>
            </div>
            <div className="flex w-full pl-3">
              <p className="flex gap-1 align-items-center">Status</p>
            </div>
          </div>
        </div>
      </IonList>
    </div>
  );
};

export default UserCustomerDetailsCard;
