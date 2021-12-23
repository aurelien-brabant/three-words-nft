const alertColors = {
  danger: "#d32f2f",
  success: "#2e7d32",
  info: "#0288d1",
  warning: "#ed6c02",
};

const Alert = ({ alertType, alertMessage, clearAlert }) => {
  return alertType !== 'none' ? (
    <div className="alert-box">
      <div
        className={`alert`}
        style={{ backgroundColor: alertColors[alertType] }}
      >
        <button className="closeBtn" onClick={clearAlert} />
        {alertMessage}
      </div>
    </div>
  ) : null;
};

export default Alert;
