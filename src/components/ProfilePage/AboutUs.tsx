import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect } from "react";


const AboutUs: React.FC = () => {
  useEffect(() => {
    
    
    

    return () => {
      
    };
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" mode="md"></IonBackButton>
          </IonButtons>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light" className="ion-padding">
        <p>App Name: ZAd Microfin</p>
        <p>App Version: 1.0.0</p>
      </IonContent>
    </IonPage>
  );
};

export default AboutUs;
