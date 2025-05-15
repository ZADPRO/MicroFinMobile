import React from "react";

interface BankAcDetails {
  createdAt: string;
  createdBy: string;
  refAccountType: number;
  refAccountTypeName: string;
  refBalance: string;
  refBankAccountNo: string;
  refBankAddress: string;
  refBankId: number;
  refBankName: string;
  refIFSCsCode: string;
  updatedAt: string;
  updatedBy: string;
}

interface Props {
  userLists: BankAcDetails[];
}

const BankCardList: React.FC<Props> = ({ userLists }) => {
  return (
    <div>
      {userLists.length === 0 ? (
        <p>No bank accounts found.</p>
      ) : (
        userLists.map((item, index) => {
          return (
            <div
              className="flex align-items-center justify-content-start shadow-2 p-3 m-3 border-round-xl"
              key={index}
            >
              <div
                className="flex align-items-center justify-content-center bg-primary text-black font-bold"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#4caf50",
                }}
              >
                {index + 1}
              </div>

              <div className="flex w-full justify-content-between pl-2">
                <div className="bankDetails">
                  <p className="m-0 text-lg font-medium">
                    {item.refBankName?.trim() || "-"}
                  </p>
                  <p className="m-0 pt-2 text-sm text-color-secondary">
                    {item.refBankAccountNo?.trim() || "-"}
                  </p>
                </div>
                <div className="bankBalance">
                  <p className="m-0 font-semibold">
                    ₹{" "}
                    {item.refBalance?.trim()
                      ? parseFloat(item.refBalance).toFixed(2)
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default BankCardList;
