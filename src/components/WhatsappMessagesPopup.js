import React, { useEffect, useState, useMemo } from "react";
import "../App.css";

const STATUS_HE = {
  success: "נשלח בהצלחה",
  failed: "נכשל",
};

const ERROR_HE = {
  invalid_phone: "מספר טלפון לא תקין",
  missing_pdf: "קובץ PDF חסר",
  whatsapp_api_error: "שגיאה בשליחת וואטסאפ",
};

const GENERIC_WHATSAPP_ERROR_HE = "שגיאה בשליחת וואטסאפ";

const backendURL = "http://localhost:5000";
const MESSAGES_ENDPOINT = `${backendURL}/whatsappMessages/route-messages`;

const renderStatus = (status) => STATUS_HE[status] || status;

const renderError = (error) => {
  if (!error) return "—";
  return ERROR_HE[error] || GENERIC_WHATSAPP_ERROR_HE;
};

const SortIcon = ({ field, sortField, sortDir }) => {
  if (sortField !== field)
    return <span className="wa-sort-icon wa-sort-inactive">⇅</span>;
  return <span className="wa-sort-icon">{sortDir === "asc" ? "↑" : "↓"}</span>;
};

const WhatsAppHistory = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchPhone, setSearchPhone] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [allTotal, setAllTotal] = useState(null);
  const [failedTotal, setFailedTotal] = useState(null);

  const fetchStats = async () => {
    try {
      const [allRes, failedRes] = await Promise.all([
        fetch(`${MESSAGES_ENDPOINT}?page=1&pageSize=1`),
        fetch(`${MESSAGES_ENDPOINT}?page=1&pageSize=1&status=failed`),
      ]);
      const [allJson, failedJson] = await Promise.all([
        allRes.json(),
        failedRes.json(),
      ]);
      setAllTotal(allJson.total ?? 0);
      setFailedTotal(failedJson.total ?? 0);
    } catch (e) {
      console.error("stats fetch failed", e);
    }
  };

  const fetchMessages = async (
    nextPage = page,
    nextPhone = searchPhone,
    tab = activeTab
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      params.set("pageSize", String(pageSize));
      if (nextPhone?.trim()) params.set("phone", nextPhone.trim());
      if (tab === "failed") params.set("status", "failed");

      const res = await fetch(`${MESSAGES_ENDPOINT}?${params}`);
      const json = await res.json();

      setMessages(json.data || []);
      setPage(json.page || nextPage);
      setTotalPages(json.totalPages || 1);
      setTotal(json.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchMessages(1, "", "all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchPhone("");
    fetchMessages(1, "", tab);
  };

  const handleSearch = () => fetchMessages(1, searchPhone, activeTab);

  const handleClear = () => {
    setSearchPhone("");
    fetchMessages(1, "", activeTab);
  };

  const handleRefresh = () => fetchMessages(page, searchPhone, activeTab);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      let av = a[sortField];
      let bv = b[sortField];
      if (sortField === "created_at") {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      } else {
        av = String(av ?? "").toLowerCase();
        bv = String(bv ?? "").toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [messages, sortField, sortDir]);

  const successTotal =
    allTotal !== null && failedTotal !== null ? allTotal - failedTotal : null;

  return (
    <main className="wa-page" dir="rtl">

      {/* ── Stats bar ── */}
      <div className="wa-stats-bar">
        <div className="wa-stat-card wa-stat-card--total">
          <span className="wa-stat-icon wa-stat-icon--total">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
            </svg>
          </span>
          <div className="wa-stat-text">
            <span className="wa-stat-num">{allTotal ?? "…"}</span>
            <span className="wa-stat-label">סה״כ הודעות</span>
          </div>
        </div>
        <div className="wa-stat-card wa-stat-card--success">
          <span className="wa-stat-icon wa-stat-icon--success">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM9.29 16.29L5.7 12.7C5.31 12.31 5.31 11.68 5.7 11.29C6.09 10.9 6.72 10.9 7.11 11.29L10 14.17L16.88 7.29C17.27 6.9 17.9 6.9 18.29 7.29C18.68 7.68 18.68 8.31 18.29 8.7L10.7 16.29C10.32 16.68 9.68 16.68 9.29 16.29Z" fill="currentColor"/>
            </svg>
          </span>
          <div className="wa-stat-text">
            <span className="wa-stat-num">{successTotal !== null ? successTotal : "…"}</span>
            <span className="wa-stat-label">נשלחו בהצלחה</span>
          </div>
        </div>
        <div className="wa-stat-card wa-stat-card--failed">
          <span className="wa-stat-icon wa-stat-icon--failed">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 13C11.45 13 11 12.55 11 12V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V12C13 12.55 12.55 13 12 13ZM13 17H11V15H13V17Z" fill="currentColor"/>
            </svg>
          </span>
          <div className="wa-stat-text">
            <span className="wa-stat-num">{failedTotal ?? "…"}</span>
            <span className="wa-stat-label">נכשלו</span>
          </div>
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="wa-card">

        {/* Tabs */}
        <div className="wa-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "all"}
            className={`wa-tab ${activeTab === "all" ? "wa-tab--active" : ""}`}
            onClick={() => switchTab("all")}
          >
            כל ההודעות
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "failed"}
            className={`wa-tab wa-tab--failed ${
              activeTab === "failed" ? "wa-tab--active wa-tab--active-failed" : ""
            }`}
            onClick={() => switchTab("failed")}
          >
            {failedTotal !== null && failedTotal > 0 && (
              <span className="wa-tab-badge">{failedTotal}</span>
            )}
            הודעות שנכשלו
          </button>
        </div>

        {/* Toolbar */}
        <div className="wa-toolbar">
          <div className="wa-search-group">
            <input
              className="wa-search-input"
              type="text"
              placeholder="חיפוש לפי מספר טלפון..."
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="wa-btn wa-btn--primary"
              onClick={handleSearch}
              disabled={loading}
            >
              חפש
            </button>
            {searchPhone && (
              <button
                className="wa-btn wa-btn--ghost"
                onClick={handleClear}
                disabled={loading}
              >
                נקה
              </button>
            )}
          </div>

          <button
            className="wa-btn wa-btn--refresh"
            onClick={handleRefresh}
            disabled={loading}
            title="רענן"
          >
            {loading ? (
              <span className="wa-spinner-sm" />
            ) : (
              <svg className="wa-refresh-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4C7.58 4 4.01 7.58 4.01 12S7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12S8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
              </svg>
            )}
            רענן
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="wa-content">

          {loading && (
            <div className="wa-loading">
              <span className="wa-spinner" />
              טוען נתונים...
            </div>
          )}

          {!loading && sortedMessages.length > 0 && (
            <div className="wa-table-wrap">
              <table className="wa-table">
                <thead>
                  <tr>
                    <th
                      className="wa-th wa-th--sortable"
                      onClick={() => handleSort("created_at")}
                    >
                      תאריך{" "}
                      <SortIcon field="created_at" sortField={sortField} sortDir={sortDir} />
                    </th>
                    <th
                      className="wa-th wa-th--sortable"
                      onClick={() => handleSort("phone_number")}
                    >
                      טלפון{" "}
                      <SortIcon field="phone_number" sortField={sortField} sortDir={sortDir} />
                    </th>
                    <th
                      className="wa-th wa-th--sortable"
                      onClick={() => handleSort("status")}
                    >
                      סטטוס{" "}
                      <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
                    </th>
                    <th className="wa-th">שגיאה</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMessages.map((m) => (
                    <tr
                      key={m.id}
                      className={`wa-row${m.status === "failed" ? " wa-row--failed" : ""}`}
                    >
                      <td className="wa-td wa-td--date">
                        {new Date(m.created_at).toLocaleString("he-IL")}
                      </td>
                      <td className="wa-td wa-td--phone">{m.phone_number}</td>
                      <td className="wa-td">
                        <span
                          className={`wa-badge ${
                            m.status === "failed"
                              ? "wa-badge--failed"
                              : "wa-badge--success"
                          }`}
                        >
                          {renderStatus(m.status)}
                        </span>
                      </td>
                      <td
                        className="wa-td wa-td--error"
                        title={m.error_message || ""}
                      >
                        {renderError(m.error_message)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && sortedMessages.length === 0 && (
            <div className="wa-empty">
              <span style={{ fontSize: 32 }}>🔍</span>
              אין נתונים להצגה
            </div>
          )}

        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="wa-pagination">
            <span className="wa-pagination-info">
              עמוד {page} מתוך {totalPages} &nbsp;·&nbsp; {total} רשומות
            </span>
            <div className="wa-pagination-btns">
              <button
                className="wa-btn wa-btn--page"
                onClick={() => fetchMessages(page - 1, searchPhone, activeTab)}
                disabled={loading || page <= 1}
              >
                 ▶ הקודם
              </button>
              <button
                className="wa-btn wa-btn--page"
                onClick={() => fetchMessages(page + 1, searchPhone, activeTab)}
                disabled={loading || page >= totalPages}
              >
                הבא ◀ 
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default WhatsAppHistory;
