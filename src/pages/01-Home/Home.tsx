import {
  IonContent,
  IonIcon,
  IonLabel,
  IonModal,
  IonPage,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import Header from "../../components/Header/Header";
import "./Home.css";
import UserLoanDashboard from "../../components/UserLoanDashboard/UserLoanDashboard";
import AdminLoanDashboard from "../../components/AdminLoanDashboard/AdminLoanDashboard";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { calendarOutline } from "ionicons/icons";

import { Chart } from "primereact/chart";

const Home: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<string>("user");
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: "#0478df" });

    // Set default date to today
    setDate(new Date());

    return () => {
      StatusBar.setOverlaysWebView({ overlay: true });
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  }, [selectedSegment, showModal]);

  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.chart?.update();
    }
  }, [selectedSegment, date]);

  const formatDate = (date: Date | null): string => {
    if (!date) return "Select Date";
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ["Salary", "Rent", "Travel"],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            documentStyle.getPropertyValue("--blue-500"),
            documentStyle.getPropertyValue("--yellow-500"),
            documentStyle.getPropertyValue("--green-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--blue-400"),
            documentStyle.getPropertyValue("--yellow-400"),
            documentStyle.getPropertyValue("--green-400"),
          ],
        },
      ],
    };
    const options = {
      cutout: "70%",
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <IonPage>
      <Header />
      <IonContent>
        {/* Date Display Row */}
        <div className="flex flex-row justify-content-between align-items-center px-3 pt-2">
          <p className="m-0">{formatDate(date)}</p>
          <IonIcon
            icon={calendarOutline}
            onClick={() => setShowModal(true)}
            style={{ cursor: "pointer", fontSize: "20px" }}
          />
        </div>

        {/* Tabs */}
        <div className="dashboardContentsTabSplit mx-2 pt-2 px-2 border-round-xl">
          <IonSegment
            value={selectedSegment}
            onIonChange={(e) => {
              const value = e.detail.value;
              if (value) setSelectedSegment(value);
            }}
          >
            <IonSegmentButton value="user">
              <IonLabel style={{ fontSize: "14px" }}>User Loan</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="admin">
              <IonLabel style={{ fontSize: "14px" }}>Admin Loan</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {selectedSegment === "user" && <UserLoanDashboard />}
          {selectedSegment === "admin" && <AdminLoanDashboard />}
        </div>

        {/* Chart Analysis for Profilt & Loss */}
        <div className="profiltAnalysis mt-5">
          <p>Expense Analysis</p>
          <Chart
            type="doughnut"
            key={selectedSegment}
            data={chartData}
            ref={chartRef}
            options={chartOptions}
            className="w-full md:w-30rem"
          />
        </div>

        {/* Modal with Calendar */}
        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
          keepContentsMounted={true}
          initialBreakpoint={0.4}
          breakpoints={[0, 0.4, 0.75]}
          className="calendar-modal"
        >
          <div className="p-3 flex justify-content-center">
            <Calendar
              value={date}
              onChange={(e) => {
                setDate(e.value);
                setShowModal(false); // Close on date select
              }}
              inline
              showWeek
              view="month"
              maxDate={new Date()}
            />
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
