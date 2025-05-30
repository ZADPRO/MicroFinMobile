import { IonContent, IonPage } from "@ionic/react";
import React, { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";

const Loan: React.FC = () => {
  useEffect(() => {
    
    StatusBar.setStyle({ style: Style.Dark });
    

    return () => {
      
    };
  }, []);
  return (
    <IonPage>
      <IonContent></IonContent>
    </IonPage>
  );
};

export default Loan;
