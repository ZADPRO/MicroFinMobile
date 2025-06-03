import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import axios from "axios";
import decrypt, { getDateAfterMonths } from "../../services/helper";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import {
  CalculateFirstInterest,
  CalculateInterest,
  CalculateInitialInterest,
  FirstInterest,
  getRemainingDaysInCurrentMonth,
} from "../../services/loanCalc";
import { Calendar } from "primereact/calendar";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputTextarea } from "primereact/inputtextarea";
import { useHistory } from "react-router";
import { Nullable } from "primereact/ts-helpers";

interface DurationType {
  name: string;
  code: number;
}

interface OptionsProps {
  name: string;
  value: number;
}

interface LoadDetailsResponseProps {
  initialInterest: string;
  interestFirst: boolean;
  interestFirstMonth: string;
  loanDuration: string;
  loanInterest: string;
  totalInitialInterest: number;
  totalInterest: string;
  totalInterestPaid: string;
  totalLoanAmt: string;
  totalLoanPaidDuration: string;
  totalPrincipal: string;
  finalBalanceAmt: string;
  durationType: number;
  interestCalType: number;
}

interface UserDetails {
  refAadharNo: string;
  refCustId: string;
  refPanNo: string;
  refUserAddress: string;
  refUserDistrict: string;
  refUserEmail: string;
  refUserFname: string;
  refUserId: number;
  refUserLname: string;
  refUserMobileNo: string;
  refUserPincode: string;
  refUserState: string;
  label: string;
  value: number;
}

interface BankListProps {
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

interface CustomerDetailsProps {
  refAddress: string;
  refDescription: string;
  refVenderType: number;
  refVendorEmailId: string;
  refVendorId: number;
  refVendorMobileNo: string;
  refVendorName: string;
}

const LoanAdminNewCreation: React.FC = () => {
  // STATUS BAR
  useEffect(() => {
    return () => {};
  }, []);

  // HANDLE NAVIGATION
  const history = useHistory();

  // USER LOAN CREATION - STATES
  const today = new Date();
  const [customerId, setCustomerId] = useState<CustomerDetailsProps | null>(
    null
  );
  const [customerList, setCustomerList] = useState<UserDetails[]>([]);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const [rePaymentDate, setRePaymentDate] = useState<any>(nextMonth);
  const [newLoanAmt, setNewLoanAmt] = useState<number | null>();
  const [oldBalanceAmt, setOldBalanceAmt] = useState<number | null>(0);
  const [FinalLoanAmt, setFinalLoanAmt] = useState<number>(0);
  const [interestFirst, setInterestFirst] = useState<boolean | null>(false);
  const [monthCount, setMonthCount] = useState<number>(0);
  const [bankId, setBankId] = useState<number | null | any>(null);
  const [loanDuration, setLoanDuration] = useState<number | null>();
  const [loanInterest, setLoanInterest] = useState<number | null>();
  const [interestFirstAmt, setInterestFirstAmt] = useState<number>(0);
  const [initialInterestAmt, setInitialInterestAmt] = useState<number>(0);
  const [docFee, setDocFee] = useState<number | null>();
  const [security, setSecurity] = useState<string>();
  const [loadDetailsResponse, setLoanDetailsReponse] =
    useState<LoadDetailsResponseProps | null>(null);

  const [selectedInterestCal, setSelectedInterestCal] = useState<
    number | null
  >();

  const [selectedLoanType, setSelectedLoanType] = useState<number>(0);

  const [selectedDurationType, setSelectedDurationType] =
    useState<DurationType>({
      name: "Monthly",
      code: 1,
    });

  const durationType = [
    { name: "Monthly", code: 1 },
    { name: "Weekly", code: 2 },
    { name: "Daily", code: 3 },
  ];

  const interestCalculationType = [
    { name: "DayWise Monthly Calculation", code: 1 },
    { name: "Monthly Calculation", code: 2 },
  ];

  const [showForm, setShowForm] = useState<boolean>(false);
  const [showLoanInfo, setShowLoanInfo] = useState<boolean>(false);
  const loanTypeOptions: LoanType[] = [
    { name: "New Loan", value: 1 },
    { name: "Loan TopUp", value: 2 },
    { name: "Loan Extension", value: 3 },
  ];
  const [selectedRepaymentType, setSelectedRepaymentType] =
    useState<LoanType | null>(null);
  const rePaymentTypeOptions: LoanType[] = [
    { name: "Flat Loan", value: 1 },
    { name: "Diminishing Loan", value: 2 },
    { name: "Monthly Interest", value: 3 },
  ];
  const [userLoan, setUserLoan] = useState<OptionsProps[] | []>([]);
  const [selectedLoan, setSelectedLoan] = useState<any[] | null>([]);
  const [bankList, setBankList] = useState<BankListProps[] | []>([]);
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  const [step, setStep] = useState(0);

  const [minDate, setMinDate] = useState<Date | null>();
  const [maxDate, setMaxDate] = useState<Date | null>();
  const [viewDate, setViewDate] = useState<Date | null>();

  const getDateRange = (durationType: number) => {
    console.log(" -> Line Number ----------------------------------- 105");
    console.log("durationType", durationType);
    const nextWeekStart = new Date(today);
    const nextWeekEnd = new Date(nextWeekStart);
    const nextDay = new Date(today);
    switch (durationType) {
      case 1: // Next Month
        console.log(" -> Line Number ----------------------------------- 108");
        setMinDate(new Date(today.getFullYear(), today.getMonth() + 1, 1));
        setMaxDate(new Date(today.getFullYear(), today.getMonth() + 2, 0));
        setViewDate(new Date(today.getFullYear(), today.getMonth() + 1, 1));
        setRePaymentDate(
          new Date(today.getFullYear(), today.getMonth() + 1, 1)
        );
        break;
      case 2: // Next Week
        console.log(" -> Line Number ----------------------------------- 114");
        nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
        setMinDate(nextWeekStart);
        setMaxDate(nextWeekEnd);
        setViewDate(nextWeekStart);
        setRePaymentDate(nextWeekStart);
        break;

      case 3: // Next Day
        console.log(" -> Line Number ----------------------------------- 124");
        nextDay.setDate(today.getDate() + 1);
        setMinDate(nextDay);
        setMaxDate(nextDay);
        setViewDate(nextDay);
        setRePaymentDate(nextDay);
        break;

      default:
        console.log(" -> Line Number ----------------------------------- 132");
        setMinDate(null);
        setMaxDate(null);
        setViewDate(null);
    }
  };

  // GET ALL USER DATA FOR NEW LOAN CREATIONS
  const getUserList = () => {
    axios
      .get(import.meta.env.VITE_API_URL + "/adminLoan/vendorList", {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("response", response);
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("data line ------ 350 ", data);
        if (data.success) {
          const venList = data.data;
          venList.map((data, index) => {
            const labelParts = {
              name: data.refVendorName,
              mobile: data.refVendorMobileNo,
              type: data.refVenderType === 1 ? "Outside Vendor" : "Bank",
            };

            const label = `Name: ${labelParts.name} | Mobile: ${labelParts.mobile} | Vendor Type: ${labelParts.type}`;

            venList[index] = {
              ...data,
              label,
              value: data.refUserId,
              labelParts,
            };
          });

          setCustomerList(venList);
        }
      });
  };

  useEffect(() => {
    // setCustomerId(id);
    getUserList();
  }, []);

  // GET AL USER LOAN DATA TO SELECT THE LOAN TYPE OF PARTICULAR USER
  const getUserLoanData = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/adminRoutes/addLoanOption`,
        { userId: customerId?.refVendorId },
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
        const options = data.data.map((d: any) => ({
          name: `${d.refLoanAmount} - ${d.refProductInterest} - ${
            d.refProductDuration
          } ${
            d.refProductDurationType === 1
              ? "Month"
              : d.refProductDurationType === 2
              ? "Weeks"
              : "Days"
          }`,
          value: d.refLoanId,
        }));
        console.log("options", options);
        setUserLoan(options);
      }
    } catch (error) {
      console.error("Error loading loan data", error);
      setShowForm(false);
    }
  };

  // GET ALL LOAN DATA FOR PARTICULAR USER
  const getAllLoanData = () => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/adminLoan/getLoan",
        {
          userId: customerId?.refVendorId,
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
          console.log("data =======> ", data);

          const bankList = data.allBankAccountList;
          console.log("bankList line ------ 202", bankList);
          bankList.map((data, index) => {
            const name = `Name : ${data.refBankName} | Balance : ₹ ${data.refBalance}`;
            bankList[index] = { ...bankList[index], refBankName: name };
          });
          console.log("bankList", bankList);
          setBankList(bankList);
        }
      });
  };

  // HANDLE OLD LOAN DETAILS
  const getLoanEntireDetails = (value?: number) => {
    axios
      .post(
        import.meta.env.VITE_API_URL + "/adminLoan/selectedLoanDetailsV1",
        {
          loanId: value,
          loanTypeId: selectedLoanType,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("response", response);
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        console.log("data line ------- 194", data.data);
        localStorage.setItem("token", "Bearer " + data.token);
        setLoanDetailsReponse(data.data);
        setOldBalanceAmt(Number(data.data.finalBalanceAmt));
        const balance = data.data.finalBalanceAmt ?? 0;
        console.log("balance line -------- 201", balance);
        setFinalLoanAmt(0 + Number(balance));
        getAllLoanData();
      })
      .catch(() => {
        setShowForm(false);
      });
  };

  // CALC INITIAL INTEREST
  const initialInterest = (Pamt) => {
    const days = getRemainingDaysInCurrentMonth(selectedDurationType.code);
    console.log("days", days);
    const amt = CalculateInitialInterest({
      annualInterest: Number(loanInterest),
      principal: Pamt,
      totalDays: days,
      interestCal: Number(selectedInterestCal),
    });
    console.log("amt line ----- 175", amt);
    // setNewLoan({ ...newLoan, initialInterestAmt: amt })
    setInitialInterestAmt(amt);
  };

  // CALCULATE INTEREST
  const calculateInterest = async (data: FirstInterest) => {
    console.log("data", data);
    const firstInterestAmt = await CalculateFirstInterest(data);
    console.log("firstInterestAmt line ---- 149", firstInterestAmt);
    // setNewLoan({ ...newLoan, interestFirstAmt: firstInterestAmt })
    setInterestFirstAmt(firstInterestAmt);
  };

  // SHOW FORM HANDLER
  const show = (LoanType: number, Loan: number | null) => {
    console.log("selectedLoanType line ------ 208", LoanType);
    console.log("selectedLoan line ------ 209", Loan);
    setShowForm(false);
    setShowLoanInfo(false);
    if (LoanType === 1) {
      setShowForm(true);
    } else if (
      (LoanType === 2 || LoanType === 3) &&
      Loan !== null &&
      Loan !== undefined
    ) {
      setShowForm(true);
      setShowLoanInfo(true);
    } else {
      setShowForm(false);
      setShowLoanInfo(false);
    }
  };

  // HANDLE LOAN SUBMIT
  const handelSubmit = () => {
    console.log("selectedLoan", selectedLoan);
    axios
      .post(
        import.meta.env.VITE_API_URL + "/adminLoan/CreateNewLoan",
        {
          refUserId: customerId?.refVendorId,
          refLoanDuration: loanDuration,
          refLoanInterest: loanInterest,
          refLoanAmount: FinalLoanAmt.toFixed(2),
          refLoanDueDate: getDateAfterMonths(
            rePaymentDate,
            Number(loanDuration)
          ),
          refPayementType: "bank",
          refRepaymentStartDate: rePaymentDate.toLocaleDateString("en-CA"),
          refBankId: bankId?.refBankId,
          refLoanBalance: FinalLoanAmt.toFixed(2),
          isInterestFirst: interestFirst,
          refExLoanId: selectedLoan,
          refLoanExt: selectedLoanType,
          refLoanStatus: 1,
          refInterestMonthCount: monthCount,
          refInitialInterest: initialInterestAmt.toFixed(2),
          refRepaymentType: selectedRepaymentType,
          refTotalInterest: (
            (initialInterestAmt ?? 0) + (interestFirstAmt ?? 0)
          ).toFixed(2),
          refToUseAmt: parseFloat(
            (
              (newLoanAmt ?? 0) -
              (initialInterestAmt ?? 0) -
              (interestFirstAmt ?? 0)
            ).toFixed(2)
          ),
          oldBalanceAmt: (Number(oldBalanceAmt) ?? 0).toFixed(2),
          refDocFee: docFee,
          refSecurity: security,
          refProductDurationType: selectedDurationType.code,
          refProductMonthlyCal: selectedInterestCal,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("response", response);
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        console.log("data line ----------- 269", data);
        localStorage.setItem("token", "Bearer " + data.token);
        if (data.success) {
          console.log("data", data);
          history.goBack();
        }
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/user" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>Admin Loan Creation</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="loanCreationForm m-3">
          <Dropdown
            value={customerId}
            className="w-full mt-3"
            filter
            required
            options={customerList}
            onChange={(e: DropdownChangeEvent) => {
              console.log("e line ----------- 405", e);
              setCustomerId(e.value);
              setSelectedLoanType(0);
            }}
            placeholder="Select Vendor"
            itemTemplate={(option) => (
              <div className="p-dropdown-item-custom">
                <div className="font-bold">{option.labelParts?.name}</div>
                <small className="text-gray-500">
                  {option.labelParts?.mobile} | {option.labelParts?.type}
                </small>
              </div>
            )}
          />

          <Dropdown
            value={selectedLoanType}
            className="w-full mt-3"
            onChange={(e: DropdownChangeEvent) => {
              setSelectedLoanType(e.value);
              getUserLoanData();
              getAllLoanData();
              setSelectedLoan(null);
              setStep(0);
              show(e.value, null);
            }}
            required
            options={loanTypeOptions}
            optionLabel="name"
            placeholder="Select Loan Type"
          />

          <Dropdown
            value={selectedLoan}
            disabled={selectedLoanType === 1 || selectedLoanType === 0}
            className="w-full mt-3"
            onChange={(e: DropdownChangeEvent) => {
              setSelectedLoan(e.value);
              getLoanEntireDetails(e.value);
              show(selectedLoanType, e.value);
            }}
            filter
            options={userLoan}
            optionLabel="name"
            placeholder="Select Old Loan"
          />

          {showLoanInfo && (
            <div className="mt-3">
              <Divider>LOAN DETAILS</Divider>

              <IonRow className="mt-2">
                <IonCol>
                  <b>Total Loan</b>
                </IonCol>
                <IonCol>₹ {loadDetailsResponse?.loanInterest} %</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Loan Interest</b>
                </IonCol>
                <IonCol>
                  {loadDetailsResponse?.loanDuration}{" "}
                  {loadDetailsResponse?.durationType === 1
                    ? "Months"
                    : loadDetailsResponse?.durationType === 2
                    ? "Weeks"
                    : "Days"}
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Loan Duration</b>
                </IonCol>
                <IonCol>{loadDetailsResponse?.totalLoanAmt}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Initial Interest</b>
                </IonCol>
                <IonCol>₹ {loadDetailsResponse?.initialInterest}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Interest Paid (1st)</b>
                </IonCol>
                <IonCol>
                  {loadDetailsResponse?.interestFirst === true ? "Yes" : "No"}
                </IonCol>{" "}
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Interest Paid</b>
                </IonCol>
                <IonCol>
                  {loadDetailsResponse?.interestFirstMonth}{" "}
                  {loadDetailsResponse?.durationType === 1
                    ? "Months"
                    : loadDetailsResponse?.durationType === 2
                    ? "Weeks"
                    : "Days"}{" "}
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Total Principal Amt</b>
                </IonCol>
                <IonCol> ₹ {loadDetailsResponse?.totalPrincipal} </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Total Interest Amt</b>
                </IonCol>
                <IonCol>₹ {loadDetailsResponse?.totalInterest}</IonCol>
              </IonRow>

              <Divider>LOAN CALCULATIONS</Divider>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Total Principal Paid</b>
                </IonCol>
                <IonCol>₹ {loadDetailsResponse?.totalPrincipal}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Total Interest Paid</b>
                </IonCol>
                <IonCol>₹ {loadDetailsResponse?.totalInterestPaid}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Initial Interest Paid</b>
                </IonCol>
                <IonCol>₹ {loadDetailsResponse?.totalInitialInterest}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Loan Duration</b>
                </IonCol>
                <IonCol>
                  {" "}
                  {loadDetailsResponse?.loanDuration}{" "}
                  {loadDetailsResponse?.durationType === 1
                    ? "Months"
                    : loadDetailsResponse?.durationType === 2
                    ? "Weeks"
                    : "Days"}
                </IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Balance Amt</b>
                </IonCol>
                <IonCol>₹ {loadDetailsResponse?.finalBalanceAmt}</IonCol>
              </IonRow>
            </div>
          )}

          <Divider />

          {showForm && (
            <div>
              <InputNumber
                className="w-full"
                placeholder="Enter Loan Duration"
                required
                disabled={step < 0}
                value={loanDuration}
                onChange={(e: any) => {
                  setStep(0.3);
                  setLoanDuration(e.value);
                  setSelectedDurationType({ name: "Monthly", code: 1 });
                }}
                locale="en-IN"
                suffix=" Month"
              />

              <Dropdown
                inputId="durationType"
                value={selectedDurationType}
                onChange={(e) => {
                  setStep(0.5);
                  setSelectedDurationType(e.value);
                  setLoanInterest(0);
                  getDateRange(e.value.code);
                  if (e.value.code === 1) {
                    setSelectedInterestCal(1);
                  } else {
                    setSelectedInterestCal(0);
                  }
                }}
                options={durationType}
                disabled={step < 0.3}
                optionLabel="name"
                placeholder="Select Duration"
                className="w-full mt-3"
                required
              />

              <InputNumber
                className="w-full mt-3"
                placeholder="Enter Loan Interest"
                required
                disabled={step < 0.5}
                value={loanInterest}
                onChange={(e: any) => {
                  setLoanInterest(e.value);
                  setStep(1);
                  setBankId(null);
                  setSelectedRepaymentType(null);
                  const value = parseFloat(e.value) || 0;
                  const balance = oldBalanceAmt ?? 0;
                  setFinalLoanAmt(Number(value) + Number(balance));
                  initialInterest(Number(value) + Number(balance));
                }}
                suffix=" %"
                locale="en-IN"
                mode="decimal" // ✅ Enable decimal mode
                minFractionDigits={1} // ✅ Allow at least 1 decimal place
                maxFractionDigits={2} // ✅ Allow up to 2 decimal places
              />

              <Dropdown
                value={selectedRepaymentType}
                disabled={step < 1}
                required
                className="w-full mt-3"
                onChange={(e: DropdownChangeEvent) => {
                  setSelectedRepaymentType(e.value);
                  setStep(2);
                  if (selectedDurationType.code !== 1) {
                    setStep(2.5);
                  }
                  setNewLoanAmt(null);
                }}
                options={rePaymentTypeOptions}
                optionLabel="name"
                placeholder="Select Re-payment Type"
              />

              {selectedDurationType.code === 1 && (
                <Dropdown
                  value={selectedInterestCal}
                  options={interestCalculationType}
                  optionLabel="name"
                  optionValue="code"
                  placeholder="Interest Calculation Type"
                  disabled={step < 2 || selectedDurationType.code !== 1}
                  onChange={(e: any) => {
                    console.log("e", e);
                    setStep(2.5);
                    setSelectedInterestCal(e.value);
                  }}
                  className="w-full"
                  required
                />
              )}

              <InputNumber
                className="w-full mt-3"
                placeholder="Enter Loan Amount"
                inputId="currency-india"
                required
                disabled={step < 2.5}
                value={newLoanAmt}
                onChange={(e: any) => {
                  setNewLoanAmt(e.value);
                  setStep(3);
                  setBankId(null);
                  const value = parseFloat(e.value) || 0;
                  const balance = oldBalanceAmt ?? 0;
                  setFinalLoanAmt(value + Number(balance));
                  initialInterest(value + Number(balance));
                }}
                mode="currency"
                currency="INR"
                currencyDisplay="symbol"
                locale="en-IN"
              />

              {(selectedLoanType === 2 || selectedLoanType === 3) && (
                <div className="w-full mt-3">
                  <label className="font-bold block mb-2">Balance Amount</label>
                  <InputNumber
                    className="w-full mt-3"
                    disabled
                    placeholder="Old Loan Amount"
                    inputId="currency-india"
                    value={oldBalanceAmt}
                    required
                    mode="currency"
                    currency="INR"
                    currencyDisplay="symbol"
                    locale="en-IN"
                  />
                </div>
              )}

              <Dropdown
                value={bankId}
                disabled={step < 3}
                className="w-full mt-3"
                required
                onChange={(e: DropdownChangeEvent) => {
                  setBankId(e.value);
                  setStep(4);
                }}
                options={bankList}
                optionLabel="refBankName"
                placeholder="Select Amount To"
              />

              <Calendar
                placeholder="Repayment Schedule Date"
                disabled={step < 4}
                dateFormat="dd/mm/yy"
                className="w-full mt-3"
                required
                value={rePaymentDate ?? undefined}
                onChange={(e: any) => {
                  console.log("e", e);
                  setRePaymentDate(e.value);
                  setStep(5);
                  setInterestFirst(null);
                }}
                minDate={minDate ?? undefined}
                maxDate={maxDate ?? undefined}
                viewDate={viewDate}
              />

              <p className="mt-3">Interest First</p>
              <div className="flex flex-row gap-x-5 mt-3 gap-3">
                <div className="flex align-items-center">
                  <RadioButton
                    inputId="ingredient1"
                    name="pizza"
                    value="true"
                    required
                    disabled={step < 5}
                    onChange={(e: RadioButtonChangeEvent) => {
                      setInterestFirst(true);
                      setMonthCount(1);
                      setStep(6);
                      calculateInterest({
                        Interest: Number(loanInterest),
                        PrincipalAmt: Number(FinalLoanAmt),
                        monthCount: 1,
                        rePaymentDate: rePaymentDate?.toString() || "",
                        rePaymentType:
                          (selectedRepaymentType as any)?.value ??
                          selectedRepaymentType ??
                          1,
                        loanDuration: Number(loanDuration),
                      });
                    }}
                    checked={interestFirst === true}
                  />
                  <label htmlFor="ingredient1" className="ml-2">
                    Yes
                  </label>
                </div>
                <div className="flex align-items-center">
                  <RadioButton
                    inputId="ingredient1"
                    name="pizza"
                    value="true"
                    required
                    disabled={step < 5}
                    onChange={(e: RadioButtonChangeEvent) => {
                      setInterestFirst(true);
                      setMonthCount(1);
                      setStep(6);
                      calculateInterest({
                        Interest: Number(loanInterest),
                        PrincipalAmt: Number(FinalLoanAmt),
                        monthCount: 1,
                        rePaymentDate: rePaymentDate?.toString() || "",
                        rePaymentType:
                          (selectedRepaymentType as any)?.value ??
                          selectedRepaymentType ??
                          1,
                        loanDuration: Number(loanDuration),
                        durationType: selectedDurationType.code,
                        interestCal: selectedInterestCal || 0,
                      });
                    }}
                    checked={interestFirst === true}
                  />
                  <label htmlFor="ingredient2" className="ml-2">
                    No
                  </label>
                </div>
              </div>

              {interestFirst && (
                <div className="mt-3">
                  <label className="font-bold block mb-2">
                    Enter Number Of{" "}
                    {selectedDurationType.code === 1
                      ? "Month"
                      : selectedDurationType.code === 2
                      ? "Weeks"
                      : "Days"}
                  </label>
                  <InputNumber
                    className="w-full"
                    inputId="expiry"
                    disabled={step < 6}
                    value={monthCount}
                    required
                    onChange={(e: any) => {
                      setMonthCount(e.value);
                      setStep(7);
                      calculateInterest({
                        Interest: Number(loanInterest),
                        PrincipalAmt: Number(FinalLoanAmt),
                        monthCount: e.value || 1,
                        rePaymentDate: rePaymentDate?.toString() || "",
                        rePaymentType:
                          (selectedRepaymentType as any)?.value ??
                          selectedRepaymentType ??
                          1,
                        loanDuration: Number(loanDuration),
                        durationType: selectedDurationType.code,
                        interestCal: selectedInterestCal || 0,
                      });
                    }}
                    suffix={
                      selectedDurationType.code === 1
                        ? " Month"
                        : selectedDurationType.code === 2
                        ? " Weeks"
                        : " Days"
                    }
                  />
                </div>
              )}

              <InputNumber
                className="w-full mt-3"
                placeholder="Document Fee"
                inputId="currency-india"
                disabled={step < 6}
                value={docFee}
                required
                mode="currency"
                currency="INR"
                currencyDisplay="symbol"
                locale="en-IN"
                onChange={(e: any) => {
                  setDocFee(e.value);
                  setSecurity("");
                  setStep(7);
                }}
              />

              <InputTextarea
                className="w-full mt-3"
                value={security}
                disabled={step < 7}
                onChange={(e) => {
                  setSecurity(e.target.value);
                  setStep(8);
                }}
              />
            </div>
          )}

          {step >= 7 && (
            <IonCard className="loan-summary-card shadow-2 mt-3">
              <IonCardHeader>
                <IonCardTitle className="text-center text-xl underline">
                  LOAN DETAILS
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="loan-summary-table">
                  <div className="row">
                    <div className="label">Total Loan Amount</div>
                    <div className="value">₹ {FinalLoanAmt.toFixed(2)}</div>
                  </div>
                  <div className="row">
                    <div className="label">New Loan Amount</div>
                    <div className="value">₹ {newLoanAmt}</div>
                  </div>
                  <div className="row">
                    <div className="label">Old Loan Amount</div>
                    <div className="value">₹ {oldBalanceAmt}</div>
                  </div>
                  <div className="row">
                    <div className="label">
                      Interest For This{" "}
                      {selectedDurationType.code === 1
                        ? "Month"
                        : selectedDurationType.code === 2
                        ? "Weeks"
                        : "Days"}
                    </div>
                    <div className="value">
                      ₹ {initialInterestAmt.toFixed(2)}
                    </div>
                  </div>
                  <div className="row">
                    <div className="label">
                      Interest for {monthCount}{" "}
                      {selectedDurationType.code === 1
                        ? "Month"
                        : selectedDurationType.code === 2
                        ? "Weeks"
                        : "Days"}
                    </div>
                    <div className="value">₹ {interestFirstAmt.toFixed(2)}</div>
                  </div>
                  <div className="row total">
                    <div className="label">Amount to User</div>
                    <div className="value">
                      ₹
                      {(
                        (newLoanAmt ?? 0) -
                        (initialInterestAmt ?? 0) -
                        (interestFirstAmt ?? 0)
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {step >= 7 && (
            <button
              className="px-5 mt-3 submitButton w-full"
              onClick={handelSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoanAdminNewCreation;
