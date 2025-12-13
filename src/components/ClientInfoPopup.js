import React, { useEffect, useState } from "react";

function ClientInfoPopup({ clientNumber, onClose }) {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(false);
   // const backendURL = "http://localhost:5000";
  const backendURL = "http://192.168.2.88:5000";

  useEffect(() => {
    if (!clientNumber) return;

    const fetchClientData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${backendURL}/hashAPI/route-hashAPI/getClientInfo`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientNumber }),
          }
        );

        if (!response.ok) throw new Error("Request failed");

        const json = await response.json();

        let extracted = null;

        if (json?.apiRes?.data) {
          extracted = Array.isArray(json.apiRes.data)
            ? json.apiRes.data[0]
            : json.apiRes.data;
        } else {
          extracted = Array.isArray(json) ? json[0] : json;
        }

        setClientData(extracted || null);
      } catch (err) {
        console.error(err);
        alert("שגיאה בקבלת מידע הלקוח");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientNumber]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>

        <h2 className="popup-title">אינדקס לקוח</h2>

        {loading && <p>טוען מידע...</p>}

        {!loading && clientData && (
          <table className="result-table">
            <thead>
              <tr>
                {Object.keys(clientData)
                  .reverse()
                  .map((key) => (
                    <th key={key}>{key}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.entries(clientData)
                  .reverse()
                  .map(([key, value], index) => {
                    const formattedValue = key.includes("ת.")
                      ? value
                        ? new Date(value).toISOString().slice(0, 10)
                        : ""
                      : value ?? "";

                    return <td key={index}>{formattedValue}</td>;
                  })}
              </tr>
            </tbody>
          </table>
        )}

        {!loading && !clientData && <p>אין נתונים להצגה</p>}
      </div>
    </div>
  );
}

export default ClientInfoPopup;
