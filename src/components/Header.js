import "../App.css";
import whatsappIcon from "../assets/whatsapp-svg.svg";

const Header = ({ onOpenWhatsapp }) => {
  return (
    <div className="taskbar">
      <div className="taskbar-left">
        <button className="whatsapp-button" onClick={onOpenWhatsapp}>
          <img
            src={whatsappIcon}
            alt="WhatsApp"
            className="whatsapp-icon"
          />
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
