import { useState } from "react";
import alertContext from "./alertContext";
import Alert from "../alert";

const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    alertType: 'none',
    alertMessage: ''
  });

  /**
   * A wrapper around the state mutator that will handle alert fade out after some time.
   * This is the function that will be used by context users to spawn alerts
   */

  const setAlertWrapper = (type, message) => {
    if (alert.alertType !== "none") return;

    setAlert({
      alertType: type,
      alertMessage: message,
    });
  };

  const clearAlert = () => {
    setAlert({
      alertType: "none",
      alertMessage: "",
    });
  };

  return (
    <alertContext.Provider
      value={{
        setAlert: setAlertWrapper,
      }}
    >
      <Alert
        alertType={alert.alertType}
        alertMessage={alert.alertMessage}
        clearAlert={clearAlert}
      />
      {children}
    </alertContext.Provider>
  );
};

export default AlertProvider;
