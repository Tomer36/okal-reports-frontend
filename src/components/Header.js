import "../App.css";

const Header = ({ onOpenWhatsapp }) => {
  return (
    <div className="taskbar">
      <div className="taskbar-left">
        <button className="whatsapp-button" onClick={onOpenWhatsapp}>
         WhatsApp
        </button>
      </div>

      <div className="taskbar-right">
        <div className="info">
          <h1>🧾 דוח אובליגו לפי מספר לקוח</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
