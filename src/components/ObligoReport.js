import React, { useState } from "react";
import ClientInfoPopup from "./ClientInfoPopup";
import ClientCardPopup from "./ClientCardPopup";
import ClientPostponedChecksPopup from "./ClientPostponedChecksPopup";
import ClientDeliveryDocsPopup from "./ClientDeliveryDocsPopup";
import "../App.css";

function ObligoReport() {
  const [clientNumber, setClientNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [popupClientNumber, setPopupClientNumber] = useState(null);
  const [popupCardClientNumber, setPopupCardClientNumber] = useState(null);
  const [popupChecksClientNumber, setPopupChecksClientNumber] = useState(null);
  const [popupDeliveryClientNumber, setPopupDeliveryClientNumber] =
    useState(null);

  // const backendURL = "http://localhost:5000";
  const backendURL = "http://192.168.2.88:5000";

  const handleSearch = async () => {
    if (!clientNumber) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${backendURL}/hashAPI/route-hashAPI/obligo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientNumber }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();

      // Backend returns ARRAY → take first object
      setResult(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      console.error(err);
      alert("שגיאה בקבלת הנתונים");
    } finally {
      setLoading(false);
    }
  };

  const specialColumns = ["שם חשבון", "מפתח חשבון", "מספר כרטיס חשבון"];

  const handleCellClick = (key) => {
    if (!result) return;

    if (key === "מפתח חשבון") {
      setPopupClientNumber(result["מפתח חשבון"]);
    }

    if (key === "יתרת חשבון") {
      setPopupCardClientNumber(result["מפתח חשבון"]);
    }

    if (key === "שיקים דחויים") {
      setPopupChecksClientNumber(result["מפתח חשבון"]);
    }

    if (key === "יתרת תעודות משלוח פתוחות") {
      setPopupDeliveryClientNumber(result["מפתח חשבון"]);
    }
  };

  return (
    <div className="report-container">
      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="הכנס מספר לקוח..."
          value={clientNumber}
          onChange={(e) => setClientNumber(e.target.value)}
          className="search-input"
        />
        <button className="search-button" onClick={handleSearch}>
          חפש
        </button>
      </div>

      {loading && <p className="loading-text">טוען נתונים...</p>}

      {/* Main Table */}
      {result && (
        <div className="result-table-wrapper">
          <table className="result-table">
            <thead>
              <tr>
                {Object.keys(result)
                  .reverse()
                  .map((key) => (
                    <th key={key}>{key}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.entries(result)
                  .reverse()
                  .map(([key, value], index) => {
                    const isSpecial = specialColumns.includes(key);

                    const isClickable =
                      key === "מפתח חשבון" ||
                      key === "יתרת חשבון" ||
                      key === "שיקים דחויים" ||
                      key === "יתרת תעודות משלוח פתוחות";

                    const formattedValue = isSpecial
                      ? value
                      : typeof value === "number"
                      ? value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : value;

                    return (
                      <td
                        key={index}
                        className={`${isSpecial ? "special-column" : ""} ${
                          isClickable ? "clickable-cell" : ""
                        }`}
                        onClick={() => isClickable && handleCellClick(key)}
                      >
                        {formattedValue}
                      </td>
                    );
                  })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Popups */}
      {popupClientNumber && (
        <ClientInfoPopup
          clientNumber={popupClientNumber}
          onClose={() => setPopupClientNumber(null)}
        />
      )}

      {popupCardClientNumber && (
        <ClientCardPopup
          clientNumber={popupCardClientNumber}
          onClose={() => setPopupCardClientNumber(null)}
        />
      )}

      {popupChecksClientNumber && (
        <ClientPostponedChecksPopup
          clientNumber={popupChecksClientNumber}
          onClose={() => setPopupChecksClientNumber(null)}
        />
      )}

      {popupDeliveryClientNumber && (
        <ClientDeliveryDocsPopup
          clientNumber={popupDeliveryClientNumber}
          onClose={() => setPopupDeliveryClientNumber(null)}
        />
      )}
    </div>
  );
}

export default ObligoReport;
