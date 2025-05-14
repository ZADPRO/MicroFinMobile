import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import React from "react";
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

const MainRoutes: React.FC = () => {
  const location = useLocation();

  const showTabBar = ["/home", "/user", "/bank", "/loan", "/report"].includes(
    location.pathname
  );

  const getIcon = (tab: string, filled: any, outline: any) =>
    location.pathname === tab ? filled : outline;

  const getActiveClass = (tab: string) =>
    location.pathname === tab ? "active-tab" : "";
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
              tab="loan"
              href="/loan"
              className={getActiveClass("/loan")}
              style={{
                backgroundColor:
                  location.pathname === "/loan" ? "#0478df" : "#ffffff",
                color: location.pathname === "/loan" ? "white" : "#0478df",
              }}
            >
              <IonIcon
                aria-hidden="true"
                icon={getIcon("/loan", card, cardOutline)}
                style={{
                  color: location.pathname === "/loan" ? "white" : "#0478df",
                }}
              />
              <IonLabel>Loan</IonLabel>
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
    </div>
  );
};

export default MainRoutes;
