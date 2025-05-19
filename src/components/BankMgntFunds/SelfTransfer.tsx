import axios from "axios";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";
import { useHistory } from "react-router";

interface BankOptions {
  refBankName: string;
  refBankId: number;
  label: string;
  refAccountType: number;
  refAccountTypeName: string;
  refBalance: string;
}

const SelfTransfer: React.FC = () => {
  const history = useHistory();
  // Handle the from and to account with validation
  const [handleSelfTransferFrom, setHandleSelfTransferFrom] = useState<
    number | null
  >(null);
  console.log("handleSelfTransferFrom", handleSelfTransferFrom);
  const [handleSelfTransferTo, setHandleSelfTransferTo] = useState<
    BankOptions[] | []
  >([]);
  const [transferAmount, setTransferAmount] = useState<number | null>(null);

  const [bankOptions, setBankOptions] = useState<BankOptions[] | []>([]);

  const filteredToOptions = bankOptions.filter(
    (bank) => bank?.refBankId !== handleSelfTransferFrom
  );
  console.log("bankOptions", bankOptions);
  console.log("filteredToOptions", filteredToOptions);

  //   HANDLE AMOUNT CHANGE FOR FROM AND TO AC
  const handleAmountChange = (e: InputNumberChangeEvent) => {
    const selectedBank = bankOptions.find(
      (bank: any) => bank.refBankId === handleSelfTransferFrom
    );

    const balance = parseFloat(selectedBank?.refBalance ?? "0");
    console.log("balance", balance);
    const enteredAmount = e.value ?? 0;
    console.log("enteredAmount", enteredAmount);

    if (enteredAmount > balance) {
      //   toast.warn(
      //     `You cannot transfer more than ₹${balance.toLocaleString("en-IN")}`
      //   );
      return;
    }

    setTransferAmount(enteredAmount);
  };

  //   SELF TRANSFER FUNDS HANDLER
  const handleSelfTransferFunds = () => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/fund/selfTransfer",
        {
          fromId: handleSelfTransferFrom,
          toId: handleSelfTransferTo?.refBankId,
          amt: transferAmount,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      )
      .then((response: any) => {
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );

        localStorage.setItem("token", "Bearer " + data.token);
        if (data.success) {
          console.log("data", data);
          history.goBack();
        }
      });
  };

  const selfTransferAccAPI = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/adminRoutes/getBankList",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      localStorage.setItem("token", "Bearer " + data.token);

      console.log("data", data);
      if (data.success) {
        const filteredBankData = data.BankFund.map((item: any) => ({
          ...item,
          label: `Name:  ${item.refBankName} | ₹ ${item.refBalance ?? 0}`,
        }));

        console.log("Filtered Bank Data:", filteredBankData);
        setBankOptions(filteredBankData);
      }
    } catch (error) {
      console.log("Error fetching bank details:", error);
    }
  };

  useEffect(() => {
    selfTransferAccAPI();
  }, []);

  return (
    <div className="m-3">
      <Dropdown
        value={handleSelfTransferFrom}
        onChange={(e: DropdownChangeEvent) =>
          setHandleSelfTransferFrom(e.value)
        }
        options={bankOptions}
        optionLabel="label"
        optionValue="refBankId"
        className="w-full mt-3"
        placeholder="Select from"
      />
      <Dropdown
        value={handleSelfTransferTo}
        onChange={(e: DropdownChangeEvent) => setHandleSelfTransferTo(e.value)}
        options={filteredToOptions}
        optionLabel="label"
        className="w-full mt-3"
        placeholder="Select to"
        disabled={!handleSelfTransferFrom}
      />
      <InputNumber
        id="username"
        value={transferAmount}
        mode="currency"
        currency="INR"
        currencyDisplay="symbol"
        locale="en-IN"
        placeholder="Transfer Amount"
        className="w-full mt-3"
        onChange={handleAmountChange}
      />

      <button
        className="px-5 mt-3 submitButton w-full"
        onClick={handleSelfTransferFunds}
      >
        Submit
      </button>
    </div>
  );
};

export default SelfTransfer;
