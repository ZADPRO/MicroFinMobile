import React, { useEffect, useState } from "react";
import "./AdminLoanDashboard.css";
import { Carousel } from "react-responsive-carousel";
import { useHistory } from "react-router";
import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { Nullable } from "vitest";
import axios from "axios";
import decrypt from "../../services/helper";
import { IonSkeletonText } from "@ionic/react";

interface dashboardCount {
  total_loans?: string;
  total_loan_amount?: string;
  paid_count?: string;
  total_paid_principal?: string;
  total_paid_interest?: string;
  not_paid_count?: string;
  total_not_paid_principal?: string;
  total_not_paid_interest?: string;
  Total_initial_interest?: string;
  admin_total_loans?: string;
  admin_total_loan_amount?: string;
  admin_paid_count?: string;
  admin_total_paid_principal?: string;
  admin_total_paid_interest?: string;
  admin_not_paid_count?: string;
  admin_total_not_paid_principal?: string;
  admin_total_not_paid_interest?: string;
  admin_Total_initial_interest?: string;
}

interface UserLoanDashboardProps {
  date: Date | null;
}

const AdminLoanDashboard: React.FC<UserLoanDashboardProps> = ({ date }) => {
  const history = useHistory();
  console.log("history", history);

  const [dashboardCount, setDashboardCount] = useState<dashboardCount>();
  // const [date, setDate] = useState<Nullable<Date>>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const formatDate = (data: any) => {
    const date = new Date(data);
    const formatted = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    return formatted;
  };

  const DashBoardData = () => {
    const selectedDate = date ?? new Date();
    setLoading(true);

    axios
      .post(
        import.meta.env.VITE_API_URL + "/refDashboard/Count",
        {
          month: formatDate(selectedDate),
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
          setDashboardCount({
            ...dashboardCount,
            total_loans: data.loanCount[0].total_loans,
            total_loan_amount: data.loanCount[0].total_loan_amount,
            paid_count: data.paidLoan[0].paid_count,
            total_paid_principal: data.paidLoan[0].total_paid_principal,
            total_paid_interest: data.paidLoan[0].total_paid_interest,
            not_paid_count: data.loanNotPaid[0].not_paid_count,
            total_not_paid_principal:
              data.loanNotPaid[0].total_not_paid_principal,
            total_not_paid_interest:
              data.loanNotPaid[0].total_not_paid_interest,
            Total_initial_interest: data.loanCount[0].Total_initial_interest,

            admin_total_loans: data.adminLoanCountData[0].total_loans,
            admin_total_loan_amount:
              data.adminLoanCountData[0].total_loan_amount,
            admin_paid_count: data.adminPaidLoanData[0].paid_count,
            admin_total_paid_principal:
              data.adminPaidLoanData[0].total_paid_principal,
            admin_total_paid_interest:
              data.adminPaidLoanData[0].total_paid_interest,
            admin_not_paid_count: data.adminLoanNotPaidData[0].not_paid_count,
            admin_total_not_paid_principal:
              data.adminLoanNotPaidData[0].total_not_paid_principal,
            admin_total_not_paid_interest:
              data.adminLoanNotPaidData[0].total_not_paid_interest,
            admin_Total_initial_interest:
              data.adminLoanCountData[0].Total_initial_interest,
          });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    DashBoardData();
  }, [date]);

  const formatCurrencyINR = (amount: number | string | undefined | null) => {
    if (!amount || isNaN(Number(amount))) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0, // or 2 if you want paisa
    }).format(Number(amount));
  };

  return (
    <div>
      <div className="home-carousel">
        {loading ? (
          <IonSkeletonText
            animated
            style={{ width: "100%", height: "150px", borderRadius: "10px" }}
          />
        ) : (
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showArrows={false}
            showStatus={false}
            stopOnHover={false}
            interval={3000}
            preventMovementUntilSwipeScrollTolerance
            swipeScrollTolerance={50}
          >
            <div className="carouselDiv">
              <div className="cardsForCarousel">
                <div className="flex w-full h-full">
                  <div className="flex-1 flex flex-column shadow-1 bg-white border-round-xl m-1 align-items-center justify-content-center">
                    <p>Total Loan Count</p>
                    <p>{dashboardCount?.admin_total_loans}</p>
                  </div>
                  <div className="flex flex-1 flex-column">
                    <div className="flex-1 p-3 flex flex-column bg-white align-items-center shadow-1 border-round-xl m-1 justify-content-center">
                      <p>Total Amount</p>
                      <p>
                        {formatCurrencyINR(
                          dashboardCount?.admin_total_loan_amount
                        )}
                      </p>
                    </div>
                    <div className="flex-1 p-3 flex flex-column bg-white align-items-center shadow-1 border-round-xl m-1 justify-content-center">
                      <p>Initial Interst</p>
                      <p>
                        {formatCurrencyINR(
                          dashboardCount?.admin_Total_initial_interest
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>{" "}
            </div>
            <div className="carouselDiv">
              <div className="cardsForCarousel">
                <div className="flex w-full h-full">
                  <div className="flex-1 flex flex-column shadow-1 bg-white border-round-xl m-1 align-items-center justify-content-center">
                    <p>Loan Paid</p>
                    <p>{dashboardCount?.admin_paid_count}</p>
                  </div>
                  <div className="flex flex-1 flex-column">
                    <div className="flex-1 p-3 flex flex-column bg-white align-items-center shadow-1 border-round-xl m-1 justify-content-center">
                      <p>Total Amount</p>
                      <p>
                        {formatCurrencyINR(
                          dashboardCount?.admin_total_paid_interest
                        )}
                      </p>
                    </div>
                    <div className="flex-1 p-3 flex flex-column bg-white align-items-center shadow-1 border-round-xl m-1 justify-content-center">
                      <p>Initial Interst</p>
                      <p>
                        {" "}
                        {formatCurrencyINR(
                          dashboardCount?.admin_total_paid_principal
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>{" "}
            </div>
            <div className="carouselDiv">
              <div className="cardsForCarousel">
                <div className="flex w-full h-full">
                  <div className="flex-1 flex flex-column shadow-1 bg-white border-round-xl m-1 align-items-center justify-content-center">
                    <p>Loan Not Paid</p>
                    <p>{dashboardCount?.admin_not_paid_count}</p>
                  </div>
                  <div className="flex flex-1 flex-column">
                    <div className="flex-1 p-3 flex flex-column bg-white align-items-center shadow-1 border-round-xl m-1 justify-content-center">
                      <p>Interest Amt</p>
                      <p>
                        {" "}
                        {formatCurrencyINR(
                          dashboardCount?.admin_total_not_paid_interest
                        )}
                      </p>
                    </div>
                    <div className="flex-1 p-3 flex flex-column bg-white align-items-center shadow-1 border-round-xl m-1 justify-content-center">
                      <p>Principal Amt</p>
                      <p>
                        {" "}
                        {formatCurrencyINR(
                          dashboardCount?.admin_total_not_paid_principal
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>{" "}
            </div>
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default AdminLoanDashboard;
