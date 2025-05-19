import axios from "axios";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";
import { useHistory } from "react-router";

// interface for mode of payment
interface MoneyType {
  name: string;
  id: number;
}

interface BankOptions {
  refBankName: string;
  refBankId: number;
  label: string;
  refAccountType: number;
  refAccountTypeName: string;
  refBalance: string;
}

const AddFunds: React.FC = () => {
  const history = useHistory();
  // HANDLE INPUT STATES
  const [moneyType, setMoneyType] = useState<MoneyType | null>(null);
  // Need to maintain that the input amount was from in hand (liquid cash) or from bank
  const moneyOptions: MoneyType[] = [
    { name: "Bank", id: 1 },
    { name: "Cash", id: 2 },
  ];
  // Handle the from and to account with validation
  const [bankOptions, setBankOptions] = useState<BankOptions[] | []>([]);

  const [inputs, setInputs]: any = useState({
    refBankId: "",
    refbfTransactionDate: "",
    refbfTransactionType: "credit",
    refbfTransactionAmount: "",
    refBankName: "",
    refTxnId: "",
    refFundType: "fund",
  });

  const handleInput = (e: any) => {
    console.log("e", e);
    const { name, value } = e.target;
    console.log("value", value);
    console.log("name", name);

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setInputs((prevState) => ({
      ...prevState,
      refbfTransactionDate: today,
    }));
  }, []);

  //   ADD NEW FUNDS
  const handleNewUser = async () => {
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + "/adminRoutes/addBankFund",
          {
            refBankId: inputs.refBankId,
            refbfTransactionDate: inputs.refbfTransactionDate,
            refbfTransactionType: inputs.refbfTransactionType,
            refbfTransactionAmount: Number(inputs.refbfTransactionAmount),
            refTxnId: null,
            refFundType: inputs.refFundType,
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
            console.log(data);
            history.goBack();
          }
        });
    } catch (e: any) {
      console.log(e);
    }
  };

  //   fetch bank details
  const fetchBankDetails = async (e: any) => {
    console.log("e", e);
    setMoneyType(e.value);
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
      console.log("moneyType", moneyType);
      if (data.success) {
        console.log("moneyType", moneyType);

        const filteredBankData = data.BankFund.filter(
          (item: any) => item.refAccountType === e.value
        ).map((item: any) => ({
          ...item,
          label: `Name: ${item.refBankName} | ₹ ${item.refBalance ?? 0}`,
        }));

        console.log("Filtered Bank Data:", filteredBankData);
        setBankOptions(filteredBankData);
      }
    } catch (error) {
      console.log("Error fetching bank details:", error);
    }
  };
  return (
    <div>
      <div className="fundFormData m-3">
        <Dropdown
          name="moneyType"
          style={{ width: "100%", minWidth: "100%" }}
          value={moneyType}
          options={moneyOptions}
          optionLabel="name"
          className="mt-3"
          placeholder="Choose Bank Type"
          optionValue="id"
          onChange={(e: DropdownChangeEvent) => {
            fetchBankDetails(e);
          }}
          required
        />
        <Dropdown
          name="refBankId"
          style={{ width: "100%", minWidth: "100%" }}
          value={inputs.refBankId}
          options={bankOptions}
          className="mt-3"
          optionLabel="label"
          placeholder="Choose Bank"
          optionValue="refBankId"
          onChange={(e: any) => handleInput(e)}
          required
        />
        <InputNumber
          id="refbfTransactionAmount"
          name="refbfTransactionAmount"
          mode="currency"
          currency="INR"
          placeholder="Transaction Amount"
          currencyDisplay="symbol"
          className="w-full mt-3"
          locale="en-IN"
          value={inputs.refbfTransactionAmount}
          onValueChange={(e: any) => handleInput(e)}
          required
        />
        <button
          className="px-5 mt-3 submitButton w-full"
          onClick={handleNewUser}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddFunds;
