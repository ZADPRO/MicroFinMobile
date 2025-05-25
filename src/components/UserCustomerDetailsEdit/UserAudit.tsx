import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";
import axios from "axios";

interface AuditDataProps {
  refTransactionId: number;
  refUserId: number;
  transData: string;
  updatedAt: string;
  updatedBy: string;
}

interface UserAuditProps {
  refUserId: number;
}

const UserAudit: React.FC<UserAuditProps> = ({ refUserId }) => {
  console.log("refUserId", refUserId);
  const [audit, setAudit] = useState<AuditDataProps[] | []>([]);

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
            setAudit(data.getAudit);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className="m-3">
      {audit.length > 0 ? (
        audit.map((item, index) => {
          let parsedData = [];

          try {
            parsedData = JSON.parse(item.transData);
          } catch (error) {
            console.error("Invalid JSON in transData:", item.transData);
          }

          return parsedData.map((dataItem, subIndex) => (
            <div
              key={`${index}-${subIndex}`}
              className="flex p-2 shadow-3 p-3 my-2 border-round-md align-items-center"
            >
              <div
                style={{
                  width: "40px",
                  height: "35px",
                  borderRadius: "50%",
                  background: "#0478df",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {dataItem.label?.charAt(0) || "?"}
              </div>
              <div className="pl-3 flex flex-column w-full justify-content-between">
                <p>{dataItem.label}</p>
                <div className="flex w-full flex-row align-items-center justify-content-between">
                  <p>Old Data: {dataItem.data.oldValue}</p>
                  <p>New Data: {dataItem.data.newValue}</p>
                </div>
                <p className="flex justify-content-end text-sm mt-1">
                  {item.updatedAt}
                </p>
              </div>
            </div>
          ));
        })
      ) : (
        <div className="flex">No Data Found</div>
      )}
    </div>
  );
};

export default UserAudit;
