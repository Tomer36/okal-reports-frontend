import "./App.css";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ObligoReport from "./components/ObligoReport";
import WhatsappMessagesPopup from "./components/WhatsappMessagesPopup";

function App() {
  const [showWhatsapp, setShowWhatsapp] = useState(false);

  return (
    <div className="App">
      <Header onOpenWhatsapp={() => setShowWhatsapp(true)} />

      <ObligoReport />

      {showWhatsapp && (
        <WhatsappMessagesPopup
          onClose={() => setShowWhatsapp(false)}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
