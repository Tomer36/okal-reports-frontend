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
  whatsapp_api_error: "שגיאה בשליחת וואטסאפ", // old rows support
};

const GENERIC_WHATSAPP_ERROR_HE = "שגיאה בשליחת וואטסאפ";

const WhatsAppMessagesPopup = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // server-side pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // search by phone
  const [searchPhone, setSearchPhone] = useState("");

  // const backendURL = "http://localhost:5000";
  const backendURL = "http://192.168.2.88:5000";

  const renderStatus = (status) => STATUS_HE[status] || status;

  // workers see generic WhatsApp error
  const renderError = (error) => {
    if (!error) return "-";
    if (ERROR_HE[error]) return ERROR_HE[error];
    return GENERIC_WHATSAPP_ERROR_HE;
  };

  const fetchMessages = async (nextPage = page, nextPhone = searchPhone) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      params.set("pageSize", String(pageSize));
      if (nextPhone && nextPhone.trim()) params.set("phone", nextPhone.trim());

      const res = await fetch(
        `${backendURL}/whatsappMessages/route-messages?${params.toString()}`
      );
      const json = await res.json();

      setMessages(json.data || []);
      setPage(json.page || nextPage);
      setTotalPages(json.totalPages || 1);
      setTotal(json.total || 0);
    } catch (err) {
      console.error(err);
      alert("Failed to load WhatsApp messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = () => fetchMessages(page, searchPhone);

  const onSearch = () => {
    // new search => back to first page
    fetchMessages(1, searchPhone);
  };

  const onClearSearch = () => {
    setSearchPhone("");
    fetchMessages(1, "");
  };

  const goPrev = () => {
    if (page > 1) fetchMessages(page - 1, searchPhone);
  };

  const goNext = () => {
    if (page < totalPages) fetchMessages(page + 1, searchPhone);
  };

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
            onClick={onRefresh}
            disabled={loading}
          >
            🔄 רענן
          </button>
        </div>

        {/* ===== SEARCH + PAGINATION CONTROLS ===== */}
        <div className="search-bar whatsapp-search">
          <input
            className="search-input"
            type="text"
            placeholder="חיפוש לפי מספר..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />

          <button
            className="search-button"
            onClick={onSearch}
            disabled={loading}
          >
            🔎 חפש
          </button>

          <button
            className="search-button clear-button"
            onClick={onClearSearch}
            disabled={loading}
          >
            ✖ נקה
          </button>
        </div>

        {!loading && (
          <div className="pagination-bar">
            <div className="pagination-info">
              סה״כ: {total} | עמוד {page} / {totalPages}
            </div>

            <div className="pagination-controls">
              <button
                className="pagination-button"
                onClick={goPrev}
                disabled={loading || page <= 1}
              >
                ◀ הקודם
              </button>

              <button
                className="pagination-button"
                onClick={goNext}
                disabled={loading || page >= totalPages}
              >
                הבא ▶
              </button>
            </div>
          </div>
        )}

        {loading && <p className="loading-text">טוען נתונים...</p>}

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
                    <td data-date="true">
                      {new Date(m.created_at).toLocaleString("he-IL")}
                    </td>
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

                    <td className="error-cell" title={m.error_message || ""}>
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
