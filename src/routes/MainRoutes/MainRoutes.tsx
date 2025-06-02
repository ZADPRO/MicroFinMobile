import {
  IonIcon,
  IonLabel,
  IonModal,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import "../../pages/04-Loan/Loan.css";
import React, { useEffect, useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import {
  card,
  cardOutline,
  home,
  homeOutline,
  newspaper,
  newspaperOutline,
  person,
  personOutline,
  wallet,
  walletOutline,
} from "ionicons/icons";
import Splash from "../../pages/00-Splash/Splash";
import Login from "../../pages/00-Splash/Login";
import Home from "../../pages/01-Home/Home";
import User from "../../pages/02-User/User";
import Bank from "../../pages/03-Bank/Bank";
import Loan from "../../pages/04-Loan/Loan";
import Report from "../../pages/05-Report/Report";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import UsersCustomerDetails from "../../components/UsersCustomerDetails/UsersCustomerDetails";
import UsersAgentDetails from "../../components/UsersAgentDetails/UsersAgentDetails";
import UserAddCustomer from "../../components/UserAddCustomer/UserAddCustomer";
import UserCustomerDetailsEdit from "../../components/UserCustomerDetailsEdit/UserCustomerDetailsEdit";
import BankMgntBankDetails from "../../components/BankMgntBankDetails/BankMgntBankDetails";
import BankMgntFunds from "../../components/BankMgntFunds/BankMgntFunds";
import BankMgntExpense from "../../components/BankMgntExpense/BankMgntExpense";
import AddNewBank from "../../components/BankMgntBankDetails/AddNewBank";
import EditExistingBank from "../../components/BankMgntBankDetails/EditExistingBank";
import BankMgntProducts from "../../components/BankMgntProducts/BankMgntProducts";
import AddNewProduct from "../../components/BankMgntProducts/AddNewProduct";
import EditExistingProduct from "../../components/BankMgntProducts/EditExistingProduct";
import LoanMenuModal from "../../components/LoanMenuModal/LoanMenuModal";
import LoanUserRepayment from "../../components/LoanUserRepayment/LoanUserRepayment";
import LoanNewCreation from "../../components/LoanNewCreation/LoanNewCreation";
import LoanViewDetails from "../../components/LoanViewDetails/LoanViewDetails";
import LoanAdminNewCreation from "../../components/LoanAdminNewCreation/LoanAdminNewCreation";
import LoanAdminRepayment from "../../components/LoanAdminRepayment/LoanAdminRepayment";
import LoanViewAdminDetails from "../../components/LoanViewAdminDetails/LoanViewAdminDetails";
import AddNewFunds from "../../components/BankMgntFunds/AddNewFunds";
import UserLoanRepaymentDetails from "../../components/LoanUserRepayment/UserLoanRepaymentDetails";
import IndividualUserLoan from "../../components/LoanViewDetails/IndividualUserLoan";
import UserAddAgent from "../../components/UserAddAgent/UserAddAgent";
import UserAgentEdit from "../../components/UserAddAgent/UserAgentEdit";
import UserListVendor from "../../components/UserListVendor/UserListVendor";
import UserAddVendor from "../../components/UserAddVendor/UserAddVendor";
import UserViewVendor from "../../components/UserListVendor/UserViewVendor";
import IndividualAdminLoanDetails from "../../components/LoanViewAdminDetails/IndividualAdminLoanDetails";
import RepaymentDetails from "../../components/LoanAdminRepayment/RepaymentDetails";
import AddNewExpense from "../../components/BankMgntExpense/AddNewExpense";
import ReportOverall from "../../components/ReportOverall/ReportOverall";
import ReportMonthly from "../../components/ReportMonthly/ReportMonthly";
import ReportExpense from "../../components/ReportExpense/ReportExpense";
import EditExpense from "../../components/BankMgntExpense/EditExpense";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";
import ForgotPassword from "../../pages/00-Splash/ForgotPassword";
import ProfilePage from "../../components/ProfilePage/ProfilePage";
import AboutUs from "../../components/ProfilePage/AboutUs";

const MainRoutes: React.FC = () => {
  // STATUS BAR CONFIG
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: false });

      StatusBar.setBackgroundColor({ color: "#0377de" });

      return () => {
        StatusBar.setOverlaysWebView({ overlay: true });
      };
    }
  }, []);

  const location = useLocation();

  // HIDE ROUTES BASED ON CONDITIONS
  const showTabBar = ["/home", "/user", "/bank", "/loan", "/report"].includes(
    location.pathname
  );

  const getIcon = (tab: string, filled: any, outline: any) =>
    location.pathname === tab ? filled : outline;

  const getActiveClass = (tab: string) =>
    location.pathname === tab ? "active-tab" : "";

  // SHOW MODAL HANDLER
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <IonTabs>
        <IonRouterOutlet>
          <PrivateRoute path="/splash">
            <Splash />
          </PrivateRoute>
          <PrivateRoute path="/login">
            <Login />
          </PrivateRoute>
          <PrivateRoute path="/forgotPassword">
            <ForgotPassword />
          </PrivateRoute>
          <PrivateRoute path="/home">
            <Home />
          </PrivateRoute>
          <PrivateRoute path="/user">
            <User />
          </PrivateRoute>
          <PrivateRoute path="/bank">
            <Bank />
          </PrivateRoute>
          <PrivateRoute path="/loan">
            <Loan />
          </PrivateRoute>
          <PrivateRoute path="/report">
            <Report />
          </PrivateRoute>

          <PrivateRoute path="/profile">
            <ProfilePage />
          </PrivateRoute>
          <PrivateRoute path="/aboutUs">
            <AboutUs />
          </PrivateRoute>

          {/* USER ROUTES */}
          <PrivateRoute path="/userList">
            <UsersCustomerDetails />
          </PrivateRoute>
          <PrivateRoute path="/addUserDetails">
            <UserAddCustomer />
          </PrivateRoute>
          <PrivateRoute path="/viewUserDetails">
            <UserCustomerDetailsEdit />
          </PrivateRoute>

          {/* VENDOR ROUTES */}
          <PrivateRoute path="/vendorLists">
            <UserListVendor />
          </PrivateRoute>
          <PrivateRoute path="/addNewVendor">
            <UserAddVendor />
          </PrivateRoute>
          <PrivateRoute path="/editExistingVendor">
            <UserViewVendor />
          </PrivateRoute>

          {/* AGENT ROUTES */}
          <PrivateRoute path="/agentList">
            <UsersAgentDetails />
          </PrivateRoute>
          <PrivateRoute path="/addAgentDetails">
            <UsersAgentDetails />
          </PrivateRoute>
          <PrivateRoute path="/addAgent">
            <UserAddAgent />
          </PrivateRoute>
          <PrivateRoute path="/editAgent">
            <UserAgentEdit />
          </PrivateRoute>

          {/* BANK ROUTES */}
          <PrivateRoute path="/bankDetails">
            <BankMgntBankDetails />
          </PrivateRoute>
          <PrivateRoute path="/addNewBank">
            <AddNewBank />
          </PrivateRoute>
          <PrivateRoute path="/editBank">
            <EditExistingBank />
          </PrivateRoute>

          <PrivateRoute path="/fundDetails">
            <BankMgntFunds />
          </PrivateRoute>

          {/* NEW EXPENSE */}
          <PrivateRoute path="/expenseDetails">
            <BankMgntExpense />
          </PrivateRoute>
          <PrivateRoute path="/addNewExpense">
            <AddNewExpense />
          </PrivateRoute>
          <PrivateRoute path="/editExpense">
            <EditExpense />
          </PrivateRoute>

          <PrivateRoute path="/addNewFunds">
            <AddNewFunds />
          </PrivateRoute>

          <PrivateRoute path="/productDetails">
            <BankMgntProducts />
          </PrivateRoute>
          <PrivateRoute path="/addNewProduct">
            <AddNewProduct />
          </PrivateRoute>
          <PrivateRoute path="/editProductDetails">
            <EditExistingProduct />
          </PrivateRoute>

          {/* LOAN ROUTES */}
          <PrivateRoute path="/userLoanRepayment">
            <LoanUserRepayment />
          </PrivateRoute>
          <PrivateRoute path="/userLoanRepaymentDetails">
            <UserLoanRepaymentDetails />
          </PrivateRoute>

          <PrivateRoute path="/userNewLoan">
            <LoanNewCreation />
          </PrivateRoute>
          <PrivateRoute path="/userViewLoan">
            <LoanViewDetails />
          </PrivateRoute>
          <PrivateRoute path="/viewIndividualUserLoan">
            <IndividualUserLoan />
          </PrivateRoute>

          <PrivateRoute path="/adminLoanRepayment">
            <LoanAdminRepayment />
          </PrivateRoute>
          <PrivateRoute path="/adminNewLoan">
            <LoanAdminNewCreation />
          </PrivateRoute>
          <PrivateRoute path="/adminViewLoan">
            <LoanViewAdminDetails />
          </PrivateRoute>
          <PrivateRoute path="/viewIndividualAdminLoan">
            <IndividualAdminLoanDetails />
          </PrivateRoute>
          <PrivateRoute path="/repaymentDetails">
            <RepaymentDetails />
          </PrivateRoute>

          {/* REPORT ROUTES */}
          <PrivateRoute path="/overallReport">
            <ReportOverall />
          </PrivateRoute>
          <PrivateRoute path="/montlyReport">
            <ReportMonthly />
          </PrivateRoute>
          <PrivateRoute path="/expenseReport">
            <ReportExpense />
          </PrivateRoute>

          <PrivateRoute exact path="/">
            <Redirect to="/splash" />
          </PrivateRoute>
        </IonRouterOutlet>

        {showTabBar && (
          <IonTabBar slot="bottom">
            <IonTabButton
              tab="home"
              href="/home"
              className={getActiveClass("/home")}
              style={{
                backgroundColor:
                  location.pathname === "/home" ? "#0478df" : "#ffffff",
                color: location.pathname === "/home" ? "white" : "#0478df",
              }}
            >
              <IonIcon
                aria-hidden="true"
                icon={getIcon("/home", home, homeOutline)}
                style={{
                  color: location.pathname === "/home" ? "white" : "#0478df",
                }}
              />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="user"
              href="/user"
              className={getActiveClass("/user")}
              style={{
                backgroundColor:
                  location.pathname === "/user" ? "#0478df" : "#ffffff",
                color: location.pathname === "/user" ? "white" : "#0478df",
              }}
            >
              <IonIcon
                aria-hidden="true"
                icon={getIcon("/user", person, personOutline)}
                style={{
                  color: location.pathname === "/user" ? "white" : "#0478df",
                }}
              />
              <IonLabel>User</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="loan"
              className={getActiveClass("/loan")}
              style={{
                backgroundColor: showModal ? "#0478df" : "#ffffff",
                color: showModal ? "white" : "#0478df",
              }}
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
            >
              <IonIcon
                aria-hidden="true"
                icon={getIcon("/loan", card, cardOutline)}
                style={{
                  color: showModal ? "white" : "#0478df",
                }}
              />
              <IonLabel>Loan</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="bank"
              href="/bank"
              className={getActiveClass("/bank")}
              style={{
                backgroundColor:
                  location.pathname === "/bank" ? "#0478df" : "#ffffff",
                color: location.pathname === "/bank" ? "white" : "#0478df",
              }}
            >
              <IonIcon
                aria-hidden="true"
                icon={getIcon("/bank", wallet, walletOutline)}
                style={{
                  color: location.pathname === "/bank" ? "white" : "#0478df",
                }}
              />
              <IonLabel>Bank</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="report"
              href="/report"
              className={getActiveClass("/report")}
              style={{
                backgroundColor:
                  location.pathname === "/report" ? "#0478df" : "#ffffff",
                color: location.pathname === "/report" ? "white" : "#0478df",
              }}
            >
              <IonIcon
                aria-hidden="true"
                icon={getIcon("/report", newspaper, newspaperOutline)}
                style={{
                  color: location.pathname === "/report" ? "white" : "#0478df",
                }}
              />
              <IonLabel>Report</IonLabel>
            </IonTabButton>
          </IonTabBar>
        )}
      </IonTabs>

      <IonModal
        isOpen={showModal}
        onDidDismiss={() => setShowModal(false)}
        keepContentsMounted={true}
        initialBreakpoint={0.6}
        breakpoints={[0, 0.4, 0.6, 1]}
        className="calendar-modal"
      >
        <LoanMenuModal onClose={() => setShowModal(false)} />
      </IonModal>
    </div>
  );
};

export default MainRoutes;
