import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";
import axios from "axios";

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
  const [referenceDetails, setReferenceDetails] = useState<
    ReferenceEditProps[] | []
  >([]);

  useEffect(() => {
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
  }, []);

  return (
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
                  background: "#3a3a3e",
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
  );
};

export default UserReferenceEdit;
