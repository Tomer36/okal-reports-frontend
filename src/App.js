import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppHistory from "./components/WhatsappMessagesPopup";

function App() {
  return (
    <div className="App">
      <Header />
      <WhatsAppHistory />
      <Footer />
    </div>
  );
}

export default App;
