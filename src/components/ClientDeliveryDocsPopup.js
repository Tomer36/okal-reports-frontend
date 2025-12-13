import React, { useEffect, useState } from "react";

function ClientDeliveryDocsPopup({ clientNumber, onClose }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
   // const backendURL = "http://localhost:5000";
  const backendURL = "http://192.168.2.88:5000";

  useEffect(() => {
    if (!clientNumber) return;

    const fetchDocs = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${backendURL}/hashAPI/route-hashAPI/getClientDeliveryDocs`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientNumber }),
          }
        );

        if (!response.ok) throw new Error("Request failed");

        const data = await response.json();
        setDocs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        alert("שגיאה בקבלת תעודות משלוח");
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [clientNumber]);

  return (
    <div className="popup-overlay">
      <div className="popup-content popup-wide">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2 className="popup-title">תעודות משלוח פתוחות</h2>

        {loading && <p>טוען נתונים...</p>}

        {!loading && docs.length > 0 && (
          <div className="popup-table-wrapper">
            <table className="result-table">
              <thead>
                <tr>
                  {Object.keys(docs[0]).reverse().map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {docs.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.entries(row).reverse().map(([key, value]) => {
                      const formattedValue =
                        key.includes("תאריך")
                          ? new Date(value).toISOString().slice(0, 10)
                          : value;

                      return <td key={key}>{formattedValue}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && docs.length === 0 && <p>אין נתונים להצגה</p>}
      </div>
    </div>
  );
}

export default ClientDeliveryDocsPopup;
