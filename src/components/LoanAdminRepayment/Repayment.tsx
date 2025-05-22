import axios from "axios";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import React, { useEffect, useState } from "react";
import decrypt from "../../services/helper";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useHistory } from "react-router";

interface UserDataProps {
  refCustId: string;
  refLoanAmount: string;
  refLoanId: number;
  refPaymentDate: string;
  refProductDuration: string;
  refProductInterest: string;
  refProductName: string;
  refRpayId: number;
  refUserAddress: string;
  refUserDistrict: string;
  refUserFname: string;
  refUserId: number;
  refUserLname: string;
  refUserMobileNo: string;
  refUserPincode: string;
  refUserState: string;
}

interface RePaymentForm {
  interestAmt: number;
  BalanceAmount: number;
  BalanceStatus?: boolean;
  interestStatus?: boolean;
}

interface Bank {
  name: string;
  code: string;
}

interface LoanDetailsProps {
  InteresePay: string; // e.g., "1084.93"
  isInterestFirst: boolean;
  refBalanceAmt: number; // e.g., 50000
  refInitialInterest: string; // e.g., "756.16"
  refInterestMonthCount: number; // e.g., 0
  refInterestStatus: string; // e.g., "paid"
  refLoanAmount: string; // e.g., "50000.00"
  refLoanDueDate: string; // ISO date string e.g., "2026-04-05"
  refLoanStartDate: string; // ISO date string e.g., "2025-04-09"
  refNewDuration: string; // e.g., "12" (can also be number if you're sure it's always numeric)
  refPaymentDate: string; // e.g., "2025-05" (likely year-month format)
  refPrincipal: string; // e.g., "0.00"
  refPrincipalStatus: string; // e.g., "Pending"
  refProductDuration: string; // e.g., "12"
  refProductInterest: string; // e.g., "2.1"
  refProductName: string; // e.g., "Product 2"
  refRepaymentStartDate: string; // ISO date string e.g., "2025-05-05"
  refRepaymentTypeName: string; // e.g., "Monthly Interest"
  totalInterest: string; // e.g., "1085"
  totalPrincipal: string; // e.g., "0"
}

interface BankDetailsProps {
  refBankAccountNo: string;
  refBankId: number;
  refBankName: string;
  refIFSCsCode: string;
}

const Repayment: React.FC<{ userData: UserDataProps }> = ({ userData }) => {
  console.log("userData", userData);
  const history = useHistory();
  // STATES HANDLED FOR LOAN DETAILS
  const [rePaymentForm, setRePaymentForm] = useState<RePaymentForm>({
    interestAmt: 0,
    BalanceAmount: 0,
  });
  const [priamt, setPriAmt] = useState<number>(0);
  const [bankOption, setBankOption] = useState([]);
  const [paymentType, setPaymentType] = useState<string>("");
  const [loanDetails, setLoanDetails] = useState<LoanDetailsProps | null>(null);
  const [selectBank, setSelectBank] = useState<Bank | null>(null);

  // GET LOAN DETAILS FROM DB
  const getLoanData = () => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/AdminRePayment/rePaymentCalculation",
        {
          loanId: userData.refLoanId,
          rePayId: userData.refRpayId,
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
        console.log("data line ----- 205", data);
        localStorage.setItem("token", "Bearer " + data.token);

        if (data.success) {
          console.log("data", data);
          setLoanDetails(data.data[0]);

          setRePaymentForm({
            ...rePaymentForm,
            interestAmt: Number(data.data[0].InteresePay),
            BalanceAmount: Number(data.data[0].refPrincipal),
            BalanceStatus:
              data.data[0].refPrincipalStatus === "paid" ? true : false,
            interestStatus:
              data.data[0].refInterestStatus === "paid" ? true : false,
          });
          setPriAmt(
            data.data[0].refPrincipalStatus === "paid"
              ? 0
              : Number(data.data[0].refPrincipal)
          );

          const options = data.bank.map((data: BankDetailsProps) => ({
            label: `${data.refBankName}`,
            value: data.refBankId,
          }));
          console.log("options", options);
          setBankOption(options);
        }
      });
  };
  useEffect(() => {
    getLoanData();
  }, []);

  // UPDATE REPAYMENT DATA TO BACKEND
  const updateRepayment = () => {
    console.log("paymentType line ----- 101", paymentType);
    axios
      .post(
        import.meta.env.VITE_API_URL + "/AdminRePayment/updateRePayment",
        {
          priAmt: rePaymentForm.BalanceAmount,
          interest: rePaymentForm.interestAmt,
          bankId: selectBank,
          paymentType: paymentType === "online" ? 1 : 2,
          rePayId: userData.refRpayId,
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
        console.log("data line ------ 246", data);
        localStorage.setItem("token", "Bearer " + data.token);

        if (data.success) {
          console.log("data", data);
          history.goBack();
        } else {
          console.log("data", data);
        }
      });
  };

  return (
    <div className="m-3">
      <p>Repayment Form</p>
      <InputNumber
        disabled
        className="w-full mt-3"
        inputId="percent"
        value={
          rePaymentForm.interestStatus ? 0 : Number(rePaymentForm.interestAmt)
        }
        onValueChange={(e) =>
          setRePaymentForm({
            ...rePaymentForm,
            interestAmt: e.value ?? 0,
          })
        }
        prefix="&#8377; "
      />

      <InputNumber
        required
        className="w-full mt-3"
        inputId="percent"
        value={rePaymentForm.BalanceStatus ? 0 : rePaymentForm.BalanceAmount}
        min={priamt}
        max={loanDetails?.refBalanceAmt}
        onChange={(e) => {
          let val = e.value ?? 0;

          const min = rePaymentForm.BalanceAmount;
          const max = loanDetails?.refBalanceAmt ?? Number.MAX_SAFE_INTEGER;

          if (val < min) val = min;
          if (val > max) val = max;

          setRePaymentForm({
            ...rePaymentForm,
            BalanceAmount: val,
          });
        }}
        prefix="₹ "
      />

      <InputNumber
        required
        className="w-full mt-3"
        inputId="percent"
        value={
          rePaymentForm.BalanceAmount +
          (rePaymentForm.interestStatus ? 0 : rePaymentForm.interestAmt)
        }
        disabled
        prefix="&#8377; "
      />

      <p className="mt-3">Payment Type</p>
      <div className="flex mt-3 gap-3">
        <div className="flex align-items-center">
          <RadioButton
            required
            inputId="ingredient1"
            name="pizza"
            value="online"
            onChange={(e: RadioButtonChangeEvent) => setPaymentType(e.value)}
            checked={paymentType === "online"}
          />
          <label htmlFor="ingredient1" className="ml-2">
            Online
          </label>
        </div>
        <div className="flex align-items-center">
          <RadioButton
            required
            inputId="ingredient2"
            name="pizza"
            value="cash"
            onChange={(e: RadioButtonChangeEvent) => setPaymentType(e.value)}
            checked={paymentType === "cash"}
          />
          <label htmlFor="ingredient2" className="ml-2">
            Cash
          </label>
        </div>
      </div>

      {paymentType === "online" && (
        <div className="mt-3">
          <label htmlFor="Interest" className="mb-2">
            Select Bank
          </label>

          <Dropdown
            filter
            required
            value={selectBank}
            onChange={(e: DropdownChangeEvent) => {
              console.log("line --------------------- 452", e.value);
              setSelectBank(e.value);
            }}
            options={bankOption}
            optionLabel="label"
            placeholder="Select a Bank"
            className="w-full mt-3"
            checkmark={true}
            highlightOnSelect={false}
          />
        </div>
      )}

      <button
        className="px-5 mt-3 submitButton w-full"
        onClick={() => updateRepayment()}
      >
        Submit
      </button>
    </div>
  );
};

export default Repayment;
