import React, { useEffect, useState } from "react";

function ClientCardPopup({ clientNumber, onClose }) {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(false);
   // const backendURL = "http://localhost:5000";
  const backendURL = "http://192.168.2.88:5000";

  useEffect(() => {
    if (!clientNumber) return;

    const fetchCardData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${backendURL}/hashAPI/route-hashAPI/getClientCard`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientNumber }),
          }
        );

        if (!response.ok) throw new Error("Request failed");

        const json = await response.json();
        console.log("ClientCard RAW response:", json);

        let extracted = [];

        if (Array.isArray(json)) {
          extracted = json;
        } else if (json?.apiRes?.data) {
          extracted = Array.isArray(json.apiRes.data)
            ? json.apiRes.data
            : [json.apiRes.data];
        }

        setCardData(extracted);
      } catch (err) {
        console.error("ClientCard ERROR:", err);
        alert("שגיאה בקבלת נתוני יתרת חשבון");
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, [clientNumber]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2 className="popup-title">כרטסת לקוח</h2>

        {loading && <p>טוען נתונים...</p>}

        {!loading && cardData.length > 0 && (
          <table className="result-table">
            <thead>
              <tr>
                {Object.keys(cardData[0]).reverse().map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cardData.map((row, index) => (
                <tr key={index}>
                  {Object.entries(row).reverse().map(([key, value]) => {
                    const formattedValue =
                      key.includes("ת.")
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

        {!loading && cardData.length === 0 && (
          <p>אין נתונים להצגה</p>
        )}
      </div>
    </div>
  );
}

export default ClientCardPopup;
