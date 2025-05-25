import React from "react";
import { useHistory } from "react-router";

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
  const history = useHistory();
  const handleEditBankData = (item: BankAcDetails) => {
    // In the previous page when navigating to EditExistingBank:
    history.push("/editBank", { item });
    localStorage.setItem("editBankItem", JSON.stringify(item));
  };

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
              onClick={() => handleEditBankData(item)}
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
                {item.refBankName?.charAt(0).toUpperCase() || "N"}
              </div>

              <div className="flex w-full pl-2 align-items-center justify-content-between pl-2">
                <div className="bankDetails">
                  <p className="m-0 text-lg font-medium">
                    {item.refBankName?.trim() || "-"}
                  </p>
                  {item.refBankAccountNo?.trim() ? (
                    <>
                      <p className="m-0 pt-2 text-sm text-color-secondary">
                        {item.refBankAccountNo?.trim()
                          ? item.refBankAccountNo.trim().slice(0, 16)
                          : ""}
                      </p>
                    </>
                  ) : (
                    <>{}</>
                  )}
                </div>
                <div className="bankBalance">
                  <p className="m-0 font-semibold" style={{ textAlign: "end" }}>
                    ₹{" "}
                    {item.refBalance?.trim()
                      ? new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                          .format(parseFloat(item.refBalance))
                          .replace("₹", "")
                          .trim()
                      : "-"}
                  </p>

                  <p className="m-0 pt-2" style={{ textAlign: "end" }}>
                    {item.refAccountType === 1 ? "Bank" : "Cash"}
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
