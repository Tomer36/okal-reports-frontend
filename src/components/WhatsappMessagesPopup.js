import React, { useEffect, useState } from "react";
import "../App.css";

/* ================= TRANSLATIONS ================= */

const STATUS_HE = {
  success: "נשלח בהצלחה",
  failed: "נכשל",
};

const ERROR_HE = {
  invalid_phone: "מספר טלפון לא תקין",
  missing_pdf: "קובץ PDF חסר",
  whatsapp_api_error: "שגיאה בשליחת וואטסאפ",
};

const WhatsAppMessagesPopup = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendURL = "http://localhost:5000";

  /* ================= FETCH ================= */

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${backendURL}/whatsappMessages/route-messages`
      );
      const json = await res.json();
      setMessages(json.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load WhatsApp messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const renderStatus = (status) => STATUS_HE[status] || status;
  const renderError = (error) => ERROR_HE[error] || error || "-";

  return (
    <div className="popup-overlay">
      <div className="popup-content popup-wide">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>

        {/* ===== HEADER ===== */}
        <div className="popup-header">
          <h2 className="popup-title">הודעות</h2>

          <button
            className="refresh-button"
            onClick={fetchMessages}
            disabled={loading}
          >
            🔄 רענן
          </button>
        </div>

        {loading && <p>טוען נתונים...</p>}

        {!loading && messages.length > 0 && (
          <div className="popup-table-wrapper">
            <table className="result-table">
              <thead>
                <tr>
                  <th>תאריך</th>
                  <th>טלפון</th>
                  <th>סטטוס</th>
                  <th>שגיאה</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id}>
                    <td>{new Date(m.created_at).toLocaleString("he-IL")}</td>
                    <td>{m.phone_number}</td>

                    <td
                      className={
                        m.status === "failed"
                          ? "status-failed"
                          : "status-success"
                      }
                    >
                      {renderStatus(m.status)}
                    </td>

                    <td className="error-cell">
                      {renderError(m.error_message)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && messages.length === 0 && <p>אין נתונים</p>}
      </div>
    </div>
  );
};

export default WhatsAppMessagesPopup;
