import React, { useEffect, useState } from "react";

function ClientPostponedChecksPopup({ clientNumber, onClose }) {
  const [checksData, setChecksData] = useState([]);
  const [loading, setLoading] = useState(false);

  // const backendURL = "http://localhost:5000";
  const backendURL = "http://192.168.2.88:5000";

  useEffect(() => {
    if (!clientNumber) return;

    const fetchChecks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${backendURL}/hashAPI/route-hashAPI/getClientPostponedChecks`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientNumber }),
          }
        );

        if (!response.ok) throw new Error("Request failed");

        const json = await response.json();
        console.log("Postponed Checks RAW:", json);

        setChecksData(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error(err);
        alert("שגיאה בקבלת שיקים דחויים");
      } finally {
        setLoading(false);
      }
    };

    fetchChecks();
  }, [clientNumber]);

  return (
    <div className="popup-overlay">
      <div className="popup-content popup-wide">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2 className="popup-title">שיקים דחויים</h2>

        {loading && <p>טוען נתונים...</p>}

        {!loading && checksData.length > 0 && (
          <table className="result-table">
            <thead>
              <tr>
                {Object.keys(checksData[0])
                  .reverse()
                  .map((key) => (
                    <th key={key}>{key}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {checksData.map((row, index) => (
                <tr key={index}>
                  {Object.entries(row)
                    .reverse()
                    .map(([key, value]) => {
                      const formattedValue = key.includes("תאריך")
                        ? value
                          ? new Date(value).toISOString().slice(0, 10)
                          : ""
                        : value ?? "";

                      return <td key={key}>{formattedValue}</td>;
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && checksData.length === 0 && <p>אין שיקים דחויים</p>}
      </div>
    </div>
  );
}

export default ClientPostponedChecksPopup;
