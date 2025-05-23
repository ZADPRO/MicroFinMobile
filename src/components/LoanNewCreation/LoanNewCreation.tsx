import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { StatusBar, Style } from "@capacitor/status-bar";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import axios from "axios";
import decrypt, { getDateAfterMonths } from "../../services/helper";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import {
  CalculateFirstInterest,
  CalculateInterest,
  FirstInterest,
  getRemainingDaysInCurrentMonth,
} from "../../services/loanCalc";
import { Calendar } from "primereact/calendar";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputTextarea } from "primereact/inputtextarea";
import { useHistory } from "react-router";

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

const LoanNewCreation: React.FC = () => {
  // STATUS BAR
  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  // HANDLE NAVIGATION
  const history = useHistory();

  // USER LOAN CREATION - STATES
  const today = new Date();
  const [customerId, setCustomerId] = useState<number>();
  const [customerList, setCustomerList] = useState<UserDetails[]>([]);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const [rePaymentDate, setRePaymentDate] = useState<Date>(nextMonth);
  const [newLoanAmt, setNewLoanAmt] = useState<number | null>();
  const [oldBalanceAmt, setOldBalanceAmt] = useState<number | null>(0);
  const [FinalLoanAmt, setFinalLoanAmt] = useState<number>(0);
  const [interestFirst, setInterestFirst] = useState<boolean | null>(false);
  const [monthCount, setMonthCount] = useState<number>(0);
  const [bankId, setBankId] = useState<number | null | any>(null);
  const [productId, setProductId] = useState<number | null | any>(null);
  const [interestFirstAmt, setInterestFirstAmt] = useState<number>(0);
  const [initialInterestAmt, setInitialInterestAmt] = useState<number>(0);
  const [docFee, setDocFee] = useState<number | null>();
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
          userList.map((data: any, index: any) => {
            const name = `${data.refUserFname} ${data.refUserLname} | ${data.refUserMobileNo}`;
            userList[index] = {
              ...userList[index],
              label: name,
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
        console.log("data", data);
        const options = data.data.map((d: any) => ({
          name: `${d.refLoanAmount} - ${d.refProductInterest} - ${d.refProductDuration}`,
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
          const productList = data.productList;
          data.productList.map((data, index) => {
            const name = `Name : ${data.refProductName} - Interest : ${data.refProductInterest} %- Duration : ${data.refProductDuration} Months`;
            productList[index] = {
              ...productList[index],
              refProductName: name,
            };
          });
          console.log("productList", productList);
          setLoanProduct(productList);

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
    const days = getRemainingDaysInCurrentMonth();
    console.log("days", days);
    const amt: number = CalculateInterest({
      annualInterest: Number(productId?.refProductInterest),
      principal: Pamt,
      totalDays: days,
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
              setSelectedLoanType(0);
            }}
            required
            options={customerList}
            optionLabel="label"
            placeholder="Select Customer To Provide Loan"
          />
          <Dropdown
            value={selectedLoanType}
            className="w-full mt-3"
            onChange={(e: DropdownChangeEvent) => {
              setSelectedLoanType(e.value);
              getUserLoanData();
              getAllLoanData();
              setSelectedLoan(null);
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
                <IonCol>{loadDetailsResponse?.loanDuration} Month</IonCol>
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
                  <b>Interest Paid (Month)</b>
                </IonCol>
                <IonCol>
                  {loadDetailsResponse?.interestFirstMonth} Month{" "}
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
                <IonCol>{loadDetailsResponse?.loanDuration} Month</IonCol>
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
              <Dropdown
                filter
                value={productId}
                required
                className="w-full"
                onChange={(e: DropdownChangeEvent) => {
                  setProductId(e.value);
                  setStep(1);
                  setSelectedRepaymentType(null);
                }}
                options={loanProduct}
                optionLabel="refProductName"
                placeholder="Select Product"
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

              <InputNumber
                className="w-full mt-3"
                placeholder="Enter Loan Amount"
                inputId="currency-india"
                required
                disabled={step < 2}
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
                filter
                disabled={step < 3}
                className="w-full mt-3"
                required
                onChange={(e: DropdownChangeEvent) => {
                  setBankId(e.value);
                  setStep(4);
                  setRePaymentDate(nextMonth);
                }}
                options={bankList}
                optionLabel="refBankName"
                placeholder="Select Amount From"
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
                minDate={nextMonthStart}
                maxDate={nextMonthEnd}
                viewDate={nextMonthStart}
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
                    Enter Number Of Month
                  </label>
                  <InputNumber
                    className="w-full mt-3"
                    inputId="expiry"
                    disabled={step < 6}
                    value={monthCount}
                    required
                    onChange={(e: any) => {
                      setMonthCount(e.value);
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
                      });
                    }}
                    suffix=" Month"
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
            <div>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Total Loan Amount</b>
                </IonCol>
                <IonCol>₹ {FinalLoanAmt.toFixed(2)}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>New Loan Amount</b>
                </IonCol>
                <IonCol>₹ {newLoanAmt}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Old Loan Amount</b>
                </IonCol>
                <IonCol>₹ {oldBalanceAmt}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Interest For This Month</b>
                </IonCol>
                <IonCol>₹ {initialInterestAmt.toFixed(2)}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b> Interest for {monthCount} Month</b>
                </IonCol>
                <IonCol>₹ {interestFirstAmt.toFixed(2)}</IonCol>
              </IonRow>
              <IonRow className="mt-2">
                <IonCol>
                  <b>Amount to User</b>
                </IonCol>
                <IonCol>
                  ₹{" "}
                  {(
                    (newLoanAmt ?? 0) -
                    (initialInterestAmt ?? 0) -
                    (interestFirstAmt ?? 0)
                  ).toFixed(2)}
                </IonCol>
              </IonRow>
            </div>
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
