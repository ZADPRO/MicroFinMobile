import axios from "axios";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";
import { useHistory } from "react-router";
import { useIonToast } from "@ionic/react";

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
  const [present] = useIonToast();

  const [handleSelfTransferFrom, setHandleSelfTransferFrom] = useState<
    number | null
  >(null);
  const [handleSelfTransferTo, setHandleSelfTransferTo] =
    useState<BankOptions | null>(null);
  const [transferAmount, setTransferAmount] = useState<number | null>(null);
  const [bankOptions, setBankOptions] = useState<BankOptions[]>([]);

  const filteredToOptions = bankOptions.filter(
    (bank) => bank?.refBankId !== handleSelfTransferFrom
  );

  const showToast = (msg: string) => {
    present({
      message: msg,
      duration: 2000,
      position: "top",
      color: "danger",
    });
  };

  const handleAmountChange = (e: InputNumberChangeEvent) => {
    const selectedBank = bankOptions.find(
      (bank) => bank.refBankId === handleSelfTransferFrom
    );

    const balance = parseFloat(selectedBank?.refBalance ?? "0");
    const enteredAmount = e.value ?? 0;

    if (enteredAmount > balance) {
      showToast(
        `You cannot transfer more than ₹${balance.toLocaleString("en-IN")}`
      );
      return;
    }

    setTransferAmount(enteredAmount);
  };

  const handleSelfTransferFunds = () => {
    if (!handleSelfTransferFrom) {
      showToast("Please select the 'From' account.");
      return;
    }

    if (!handleSelfTransferTo) {
      showToast("Please select the 'To' account.");
      return;
    }

    if (handleSelfTransferFrom === handleSelfTransferTo.refBankId) {
      showToast("'From' and 'To' accounts cannot be the same.");
      return;
    }

    if (!transferAmount || transferAmount <= 0) {
      showToast("Please enter a valid transfer amount.");
      return;
    }

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
          history.replace("/fundDetails", { shouldReload: true });
        } else {
          showToast("Transfer failed. Please try again.");
        }
      })
      .catch(() => {
        showToast("Something went wrong. Please try again.");
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

      if (data.success) {
        const filteredBankData = data.BankFund.map((item: any) => ({
          ...item,
          label: `Name: ${item.refBankName} | ₹ ${item.refBalance ?? 0}`,
        }));
        setBankOptions(filteredBankData);
      }
    } catch (error) {
      console.log("Error fetching bank details:", error);
      showToast("Failed to load bank details.");
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
        placeholder="Select From Account"
      />
      <Dropdown
        value={handleSelfTransferTo}
        onChange={(e: DropdownChangeEvent) => setHandleSelfTransferTo(e.value)}
        options={filteredToOptions}
        optionLabel="label"
        className="w-full mt-3"
        placeholder="Select To Account"
        disabled={!handleSelfTransferFrom}
      />
      <InputNumber
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
