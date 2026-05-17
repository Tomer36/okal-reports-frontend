import "../App.css";
import whatsappIcon from "../assets/whatsapp-svg.svg";

const Header = () => {
  return (
    <header className="wa-header">
      <div className="wa-header-brand">
        <img src={whatsappIcon} alt="WhatsApp" className="wa-header-icon" />
        <span className="wa-header-title">Okal WhatsApp</span>
      </div>
    </header>
  );
};

export default Header;
