import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import axios from "axios";
import decrypt, { getDateAfterMonths } from "../../services/helper";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import {
  CalculateFirstInterest,
  CalculateInitialInterest,
  FirstInterest,
  getRemainingDaysInCurrentMonth,
} from "../../services/loanCalc";
import { Calendar } from "primereact/calendar";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputTextarea } from "primereact/inputtextarea";
import { useHistory } from "react-router";
import { Nullable } from "primereact/ts-helpers";
import { InputText } from "primereact/inputtext";

interface LoanType {
  name: string;
  value: number;
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

interface ProductListProps {
  createdAt: string;
  createdBy: string;
  refProductDescription: string;
  refProductDuration: string;
  refProductId: number;
  refProductInterest: string;
  refProductName: string;
  refProductStatus: string;
  updatedAt: string;
  updatedBy: string;
}

const formatINR = (amount: string | number) => {
  const number = Number(amount.toString().replace(/[^0-9]/g, ""));
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(number);
};

const LoanNewCreation: React.FC = () => {
  // STATUS BAR
  useEffect(() => {
    return () => {};
  }, []);

  // HANDLE NAVIGATION
  const history = useHistory();

  // USER LOAN CREATION - STATES
  const [minDate, setMinDate] = useState<Date | undefined>();
  const [maxDate, setMaxDate] = useState<Date | undefined>();
  const [viewDate, setViewDate] = useState<Date | undefined>();

  const [newLoanAmt, setNewLoanAmt] = useState<string>("");
  const [tempLoanAmt, setTempLoanAmt] = useState<number>(0); // track parsed loan separately

  const today = new Date();
  const [customerId, setCustomerId] = useState<number>();
  const [customerList, setCustomerList] = useState<UserDetails[]>([]);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const [rePaymentDate, setRePaymentDate] = useState<Nullable<Date>>(nextMonth);
  const [oldBalanceAmt, setOldBalanceAmt] = useState<number | null>(0);
  const [FinalLoanAmt, setFinalLoanAmt] = useState<number>(0);
  const [interestFirst, setInterestFirst] = useState<boolean | null>(false);
  const [monthCount, setMonthCount] = useState<number>(0);
  const [bankId, setBankId] = useState<number | null | any>(null);
  const [productId, setProductId] = useState<number | null | any>(null);
  const [interestFirstAmt, setInterestFirstAmt] = useState<number>(0);
  const [initialInterestAmt, setInitialInterestAmt] = useState<number>(0);

  const [docFee, setDocFee] = useState<number | null>(null);
  const [formattedDocFee, setFormattedDocFee] = useState<string>("");

  const [security, setSecurity] = useState<string>();
  const [loadDetailsResponse, setLoanDetailsReponse] =
    useState<LoadDetailsResponseProps | null>(null);
  const [selectedLoanType, setSelectedLoanType] = useState<number>(0);
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
  const [loanProduct, setLoanProduct] = useState<ProductListProps[] | []>([]);
  const [bankList, setBankList] = useState<BankListProps[] | []>([]);
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  const [step, setStep] = useState(0);

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
      .get(import.meta.env.VITE_API_URL + "/newLoan/userListOption", {
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
          const userList = data.data;
          userList.map((data: any, index: number) => {
            userList[index] = {
              ...data,
              label: `${data.refUserFname} ${data.refUserLname} || ${data.refUserMobileNo}`,
              value: data.refUserId,
            };
          });

          setCustomerList(userList);
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
        { userId: customerId },
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
          name: `₹ ${d.refLoanAmount || "0"} || ${
            d.refProductInterest || "0"
          }% || ${d.refProductDuration || "0"}
          ${
            d.refProductDurationType === 1
              ? "Month"
              : d.refProductDurationType === 2
              ? "Weeks"
              : "Days"
          }`,
          value: d.refLoanId,
          loanAmount: d.refLoanAmount || "0",
          productInterest: d.refProductInterest || "0",
          productDuration: d.refProductDuration || "0",
        }));

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
        import.meta.env.VITE_API_URL + "/adminRoutes/getLoan",
        {
          userId: customerId,
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
          const formattedProductOptions = data.productList.map((item) => ({
            label: `${item.refProductName} || ${item.refProductInterest}% || ${
              item.refProductDuration
            } ${
              item.refProductDurationType === 1
                ? "Month"
                : item.refProductDurationType === 2
                ? "Weeks"
                : item.refProductDurationType === 3
                ? "Days"
                : ""
            }`,
            value: item,
            labelParts: {
              name: item.refProductName,
              interest: `${item.refProductInterest}%`,
              duration: `${item.refProductDuration} ${
                item.refProductDurationType === 1
                  ? "Month"
                  : item.refProductDurationType === 2
                  ? "Weeks"
                  : "Days"
              }`,
              refProductMonthlyCal: item.refProductMonthlyCal,
            },
          }));
          console.log("productList", formattedProductOptions);
          setLoanProduct(formattedProductOptions);

          const bankList = data.allBankAccountList;
          console.log("bankList line ------ 202", bankList);
          bankList.map((data, index) => {
            const bankName = data.refBankName || "0";
            const balance =
              data.refBalance != null ? `₹ ${data.refBalance}` : "₹ 0";

            bankList[index] = {
              ...bankList[index],
              labelParts: {
                name: bankName,
                balance: balance,
              },
              refBankName: `${bankName} || ${balance}`,
            };
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
        import.meta.env.VITE_API_URL + "/newLoan/selectedLoanDetailsV1",
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
    const days = getRemainingDaysInCurrentMonth(
      productId.refProductDurationType
    );
    const amt: number = CalculateInitialInterest({
      annualInterest: Number(productId?.refProductInterest),
      principal: Pamt,
      totalDays: days,
      interestCal: Number(productId?.refProductMonthlyCal),
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
    console.log("rePaymentDate", rePaymentDate);
    axios
      .post(
        import.meta.env.VITE_API_URL + "/newLoan/CreateNewLoan",
        {
          refUserId: customerId,
          refProductId: productId?.refProductId,
          refLoanAmount: FinalLoanAmt.toFixed(2),
          refLoanDueDate: getDateAfterMonths(
            String(rePaymentDate),
            parseInt(productId?.refProductDuration)
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
          oldBalanceAmt: oldBalanceAmt ?? 0,
          refDocFee: docFee,
          refSecurity: security,
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
          history.goBack();
        }
      });
  };

  useEffect(() => {
    if (step === 3) {
      const balance = oldBalanceAmt ?? 0;
      const total = tempLoanAmt + Number(balance);
      setFinalLoanAmt(total);
      initialInterest(total);
    }
  }, [step, tempLoanAmt, oldBalanceAmt]);

  const rawAmountRef = useRef<number>(0); // Store the actual number

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e", e);
    const input = e.target.value;
    console.log("input", input);
    const numericValue = input.replace(/[^0-9]/g, ""); // strip non-digits

    const number = parseInt(numericValue || "0", 10);
    rawAmountRef.current = number;

    const formatted = formatINR(number);
    setNewLoanAmt(formatted);
    setTempLoanAmt(number);
    setStep(3);
    setBankId(null);
  };

  const handleDocFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numericValue = input.replace(/[^0-9]/g, ""); // strip non-digits

    const number = parseInt(numericValue || "0", 10);
    setDocFee(number);

    const formatted = formatINR(number);
    setFormattedDocFee(formatted);

    setSecurity("");
    setStep(7);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>User Loan Creation</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="loanCreationForm m-3">
          <Dropdown
            value={customerId}
            className="w-full mt-3"
            filter
            onChange={(e: DropdownChangeEvent) => {
              console.log("e line ----------- 405", e);
              setCustomerId(e.target.value);
              setStep(0.5);
              setSelectedLoanType(0);
            }}
            required
            options={customerList}
            optionLabel="label"
            placeholder="Select Customer To Provide Loan"
            itemTemplate={(option) => (
              <div className="p-dropdown-item-custom">
                <div className="font-bold text-sm">
                  <p>{`${option.refUserFname} ${option.refUserLname}`}</p>
                </div>
                <small className="text-gray-500">
                  {option.refUserMobileNo} | {option.refUserEmail}
                </small>
              </div>
            )}
          />

          <Dropdown
            value={selectedLoanType}
            className="w-full mt-3"
            disabled={step < 0.5}
            onChange={(e: DropdownChangeEvent) => {
              setSelectedLoanType(e.value);
              getUserLoanData();
              getAllLoanData();
              setSelectedLoan(null);
              show(e.value, null);
              setStep(0);
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
            placeholder="Select Old Loan"
            optionLabel="name" // fallback label if itemTemplate not used for display in input
            itemTemplate={(option) => (
              <div className="p-dropdown-item-custom flex flex-col">
                <div className="font-bold">₹ {option.loanAmount || "0"}</div>
                <small className="text-gray-500">
                  Interest: {option.productInterest || "0"}%
                </small>
                <small className="text-gray-500">
                  Duration: {option.productDuration || "0"}
                </small>
              </div>
            )}
          />

          {showLoanInfo && (
            <IonCard className="loan-summary-card shadow-2">
              <IonCardHeader>
                <IonCardTitle className="text-center text-xl underline">
                  LOAN DETAILS
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="loan-summary-table">
                  <div className="row">
                    <div className="label">Total Loan Amount</div>
                    <div className="value">
                      ₹{loadDetailsResponse?.totalLoanAmt}
                    </div>
                  </div>
                  <div className="row">
                    <div className="label">Loan Interest</div>
                    <div className="value">
                      {loadDetailsResponse?.loanInterest} %
                    </div>
                  </div>
                  <div className="row">
                    <div className="label">Loan Duration</div>
                    <div className="value">
                      {loadDetailsResponse?.loanDuration}{" "}
                      {loadDetailsResponse?.durationType === 1
                        ? "Months"
                        : loadDetailsResponse?.durationType === 2
                        ? "Weeks"
                        : "Days"}
                    </div>
                  </div>
                  <div className="row">
                    <div className="label">Initial Interest</div>
                    <div className="value">
                      ₹{loadDetailsResponse?.initialInterest}
                    </div>
                  </div>
                  <div className="row">
                    <div className="label">Interest Paid (1st)</div>
                    <div className="value">
                      {loadDetailsResponse?.interestFirst ? "Yes" : "No"}
                    </div>
                  </div>
                  <div className="row">
                    <div className="label">Interest Paid </div>
                    <div className="value">
                      {" "}
                      {loadDetailsResponse?.interestFirstMonth}{" "}
                      {loadDetailsResponse?.durationType === 1
                        ? "Months"
                        : loadDetailsResponse?.durationType === 2
                        ? "Weeks"
                        : "Days"}{" "}
                    </div>
                  </div>
                  <div className="row">
                    <div className="label">Total Principal Amount</div>
                    <div className="value">
                      ₹{loadDetailsResponse?.totalPrincipal}
                    </div>
                  </div>
                  <div className="row">
                    <div className="label">Total Interest Amount</div>
                    <div className="value">
                      ₹{loadDetailsResponse?.totalInterest}
                    </div>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {showLoanInfo && (
            <IonCard className="loan-summary-card shadow-2 mt-3">
              <IonCardHeader>
                <IonCardTitle className="text-center text-xl underline">
                  LOAN CALCULATIONS
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="loan-summary-table">
                  <div className="row">
                    <div className="label">Total Principal Paid</div>
                    <div className="value">
                      ₹{loadDetailsResponse?.totalPrincipal}
                    </div>
                  </div>
                  <div className="row">
                    <div className="label">Total Interest Paid</div>
                    <div className="value">
                      ₹{loadDetailsResponse?.totalInterestPaid}
                    </div>
                  </div>
                  <div className="row">
                    <div className="label">Initial Interest Paid</div>
                    <div className="value">
                      ₹{loadDetailsResponse?.totalInitialInterest}
                    </div>
                  </div>
                  <div className="row">
                    <div className="label">Loan Duration</div>
                    <div className="value">
                      {loadDetailsResponse?.loanDuration}{" "}
                      {loadDetailsResponse?.durationType === 1
                        ? "Months"
                        : loadDetailsResponse?.durationType === 2
                        ? "Weeks"
                        : "Days"}
                    </div>
                  </div>
                  <div className="row total">
                    <div className="label">Balance Amount</div>
                    <div className="value">
                      ₹{loadDetailsResponse?.finalBalanceAmt}
                    </div>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          )}

          <Divider />

          {showForm && (
            <div>
              <Dropdown
                value={productId}
                filter
                options={loanProduct}
                onChange={(e: DropdownChangeEvent) => {
                  setProductId(e.value);
                  setStep(1);
                  setSelectedRepaymentType(null);
                  getDateRange(e.value.refProductDurationType);
                }}
                itemTemplate={(option) => (
                  <div className="p-dropdown-item-custom">
                    <div className="font-bold">
                      <p>{option.labelParts.name}</p>
                    </div>
                    <small className="text-gray-500">
                      {option.labelParts.interest} |{" "}
                      {option.labelParts.duration}
                      {option.labelParts.refProductMonthlyCal === 0
                        ? " "
                        : option.labelParts.refProductMonthlyCal === 1
                        ? " | Daywise Interest Calculation"
                        : option.labelParts.refProductMonthlyCal === 2
                        ? " | Monthwise Interest Calculation"
                        : " "}
                    </small>
                  </div>
                )}
                placeholder="Select Product"
                className="w-full mt-3"
              />

              <Dropdown
                value={selectedRepaymentType}
                disabled={step < 1}
                required
                className="w-full mt-3"
                onChange={(e: DropdownChangeEvent) => {
                  setSelectedRepaymentType(e.value);
                  setStep(2);
                  setNewLoanAmt(null);
                }}
                options={rePaymentTypeOptions}
                optionLabel="name"
                placeholder="Select Re-payment Type"
              />

              <InputText
                placeholder="Enter Loan Amount"
                value={newLoanAmt}
                className="w-full mt-3"
                onChange={handleInputChange}
                disabled={step < 2}
              />

              {/* <InputNumber
                className="w-full mt-3"
                placeholder="Enter Loan Amount"
                inputId="currency-india"
                required
                disabled={step < 2}
                value={newLoanAmt}
                onChange={(e) => {
                  console.log("e", e.value);
                  const value = e.value || 0;
                  console.log("value", value);
                  setNewLoanAmt(e.value);
                  setTempLoanAmt(value);
                  console.log("value", value);
                  setStep(3);
                  setBankId(null);
                }}
                mode="currency"
                currency="INR"
                currencyDisplay="symbol"
                locale="en-IN"
              /> */}

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
                filter
                disabled={step < 3}
                className="w-full mt-3"
                required
                onChange={(e: DropdownChangeEvent) => {
                  console.log("e", e);
                  setBankId(e.value); // e.value is the selected full object
                  setStep(4);
                  setRePaymentDate(nextMonth);
                }}
                options={bankList}
                optionLabel="refBankName" // 👈 Shows `refBankName` when selected
                placeholder="Select Amount From"
                itemTemplate={(option) => (
                  <div className="p-dropdown-item-custom">
                    <div className="font-bold">
                      {option.labelParts?.name || "0"}
                    </div>
                    <small className="text-gray-500">
                      {option.labelParts?.balance || "₹ 0"}
                    </small>
                  </div>
                )}
              />

              <Calendar
                placeholder="Repayment Schedule Date"
                disabled={step < 4}
                dateFormat="dd/mm/yy"
                className="w-full mt-3"
                required
                value={rePaymentDate}
                onChange={(e: any) => {
                  console.log("e", e);
                  setRePaymentDate(e.value);
                  setStep(5);
                  setInterestFirst(null);
                }}
                minDate={minDate}
                maxDate={maxDate}
                viewDate={viewDate}
              />

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
                      setDocFee(0);
                      setMonthCount(1);
                      setStep(6);
                      calculateInterest({
                        Interest: Number(productId?.refProductInterest),
                        PrincipalAmt: Number(FinalLoanAmt),
                        monthCount: 1,
                        rePaymentDate: rePaymentDate?.toString() || "",
                        rePaymentType:
                          (selectedRepaymentType as any)?.value ??
                          selectedRepaymentType ??
                          1,
                        loanDuration: Number(productId?.refProductDuration),
                        durationType: productId.refProductDurationType,
                        interestCal: productId.refProductMonthlyCal,
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
                    inputId="ingredient2"
                    name="pizza"
                    disabled={step < 5}
                    value="Mushroom"
                    required
                    onChange={(e: RadioButtonChangeEvent) => {
                      setInterestFirst(false);
                      setDocFee(0);
                      setMonthCount(0);
                      setInterestFirstAmt(0);
                      setStep(6);
                    }}
                    checked={interestFirst === false}
                  />
                  <label htmlFor="ingredient2" className="ml-2">
                    No
                  </label>
                </div>
              </div>

              {interestFirst && (
                <div className="">
                  <label className="font-bold block mb-2">
                    Enter Number Of{" "}
                    {productId.refProductDurationType === 1
                      ? "Month"
                      : productId.refProductDurationType === 2
                      ? "Weeks"
                      : "Days"}
                  </label>
                  <InputNumber
                    className="w-full mt-3"
                    inputId="expiry"
                    disabled={step < 6}
                    value={monthCount}
                    required
                    onChange={(e: any) => {
                      setMonthCount(e.value);
                      setDocFee(0);
                      calculateInterest({
                        Interest: Number(productId?.refProductInterest),
                        PrincipalAmt: Number(FinalLoanAmt),
                        monthCount: e.value || 1,
                        rePaymentDate: rePaymentDate?.toString() || "",
                        rePaymentType:
                          (selectedRepaymentType as any)?.value ??
                          selectedRepaymentType ??
                          1,
                        loanDuration: Number(productId?.refProductDuration),
                        durationType: productId.refProductDurationType,
                        interestCal: productId.refProductMonthlyCal,
                      });
                    }}
                    suffix={
                      productId.refProductDurationType === 1
                        ? " Month"
                        : productId.refProductDurationType === 2
                        ? " Weeks"
                        : " Days"
                    }
                  />
                </div>
              )}

              {/* <InputNumber
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
              /> */}

              <InputText
                className="w-full mt-3"
                placeholder="Document Fee"
                disabled={step < 6}
                value={formattedDocFee}
                required
                onChange={handleDocFeeChange}
              />

              <InputTextarea
                className="w-full mt-3"
                value={security}
                placeholder="Security"
                disabled={step < 7}
                onChange={(e) => {
                  setSecurity(e.target.value);
                  setStep(8);
                }}
              />
            </div>
          )}

          {step >= 7 && (
            <>
              <Divider />
              <IonCard className="loan-summary-card shadow-2">
                <IonCardHeader>
                  <IonCardTitle className="text-center text-xl underline">
                    LOAN SUMMARY
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div className="loan-summary-table">
                    <div className="row">
                      <div className="label">Total Loan Amount</div>
                      <div className="value">₹{FinalLoanAmt.toFixed(2)}</div>
                    </div>
                    <div className="row">
                      <div className="label">New Loan Amount</div>
                      <div className="value">{newLoanAmt}.00</div>
                    </div>
                    <div className="row">
                      <div className="label">Old Loan Amount</div>
                      <div className="value">₹{oldBalanceAmt}.00</div>
                    </div>
                    <div className="row">
                      <div className="label">Interest (This Month)</div>
                      <div className="value">
                        ₹{initialInterestAmt.toFixed(2)}
                      </div>
                    </div>
                    <div className="row">
                      <div className="label">
                        Interest for {monthCount}{" "}
                        {productId.refProductDurationType === 1
                          ? "Month"
                          : productId.refProductDurationType === 2
                          ? "Weeks"
                          : "Days"}
                      </div>
                      <div className="value">
                        ₹{interestFirstAmt.toFixed(2)}
                      </div>
                    </div>
                    <div className="row">
                      <div className="label">Documentation Fee</div>
                      <div className="value">₹{(docFee ?? 0).toFixed(2)}</div>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
              <div className="formula-container mt-3 shadow-2">
                <p className="formula-title underline">Formula:</p>
                <p className="formula-text mt-2">
                  <b>
                    [Total Loan - Initial Interest - Interest for {monthCount}{" "}
                    {productId.refProductDurationType === 1
                      ? "Month"
                      : productId.refProductDurationType === 2
                      ? "Weeks"
                      : "Days"}{" "}
                    - Documentation Fee]
                  </b>
                </p>
                <hr />
                <p className="final-amount-label underline">
                  Final Amount to User:
                </p>
                <p className="final-amount-value mt-2">
                  ₹{" "}
                  <b>
                    {(
                      (tempLoanAmt ?? 0) -
                      (initialInterestAmt ?? 0) -
                      (interestFirstAmt ?? 0) -
                      (docFee ?? 0)
                    ).toFixed(2)}
                  </b>
                </p>
              </div>
            </>
          )}

          {step >= 6 && (
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

export default LoanNewCreation;
