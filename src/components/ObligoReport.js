import React, { useState } from "react";
import "../App.css";

function ObligoReport() {
  const [clientNumber, setClientNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!clientNumber) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/hashAPI/route-hashAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientNumber }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("שגיאה בקבלת הנתונים");
    } finally {
      setLoading(false);
    }
  };

  // Keys of the special columns
  const specialColumns = ["שם חשבון", "מפתח חשבון", "מספר כרטיס חשבון"];

  return (
    <div className="report-container">
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
                    const isSpecialColumn = specialColumns.includes(key);

                    const formattedValue = isSpecialColumn
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
                        className={isSpecialColumn ? "special-column" : ""}
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
    </div>
  );
}

export default ObligoReport;
