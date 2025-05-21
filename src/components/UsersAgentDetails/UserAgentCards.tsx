import { IonList } from "@ionic/react";
import React from "react";
import userImg from "../../assets/users/userImg.png";

interface UserAgentCardsProps {
  refUserFname: string;
  refUserLname: string;
  refActiveStatus: string;
  refCustId: string;
  refUserMobileNo: string;
}

const UserAgentCards: React.FC<UserAgentCardsProps> = ({
  refUserFname,
  refUserLname,
  refActiveStatus,
  refCustId,
  refUserMobileNo,
}) => {
  return (
    <div>
      <IonList
        inset={true}
        className="bg-white p-3 rounded shadow-1"
        // onClick={handleCardClick}
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
                <b>ID:</b> {refCustId}
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
    </div>
  );
};

export default UserAgentCards;
