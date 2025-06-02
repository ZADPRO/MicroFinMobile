import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import React from "react";

import "./AboutUs.css";

const AboutUs: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md" />
          </IonButtons>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="about-page" color="light">
        <div className="about-container mx-3">
          <h2 className="about-heading underline">ZAd Microfin</h2>
          <p className="about-subtitle">Empowering Financial Freedom</p>

          <IonGrid>
            <IonRow className="about-row">
              <IonCol size="5" className="about-label">
                App Version
              </IonCol>
              <IonCol size="7" className="about-value">
                1.0.3
              </IonCol>
            </IonRow>

            <IonRow className="about-row">
              <IonCol size="5" className="about-label">
                Developed By
              </IonCol>
              <IonCol size="7" className="about-value">
                ZAdroit IT Solutions
              </IonCol>
            </IonRow>

            <IonRow className="about-row">
              <IonCol size="5" className="about-label">
                Description
              </IonCol>
              <IonCol size="7" className="about-value text-justify">
                A user centric microfinancing solution designed to simplify and
                streamline your financial management securely.
              </IonCol>
            </IonRow>

            <IonRow className="about-row">
              <IonCol size="5" className="about-label">
                Contact
              </IonCol>
              <IonCol size="7" className="about-value">
                support@zadmicrofin.com
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AboutUs;
