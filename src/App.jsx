import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";

// MMV-sidor
import Events from "./pages/Events.jsx";
import MmvEvent from "./pages/MmvEvent.jsx";
import About from "./pages/About.jsx";
import Arkiv from "./pages/Arkiv.jsx";
import FAQ from "./pages/FAQ.jsx";
import Contact from "./pages/Contact.jsx";

// Lokstallet-sidor
import Lokstallet from "./pages/Lokstallet.jsx";
import BokaLokstallet from "./pages/BokaLokstallet.jsx";
import EvenemangLokstallet from "./pages/EvenemangLokstallet.jsx";
import LokalerLokstallet from "./pages/LokalerLokstallet.jsx";
import HistoriaLokstallet from "./pages/HistoriaLokstallet.jsx";
import KontaktLokstallet from "./pages/KontaktLokstallet.jsx";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import LokstalletHeader from "./components/LokstalletHeader.jsx";
import LokstalletFooter from "./components/LokstalletFooter.jsx";

// Layout för MMV
function MMVLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// Layout för Lokstallet
function LokstalletLayout({ children }) {
  return (
    <>
      <LokstalletHeader />
      <main>{children}</main>
      <LokstalletFooter />
    </>
  );
}

// Layout utan header/footer (t.ex. för startsidan)
function NoLayout({ children }) {
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Startsidan utan header/footer */}
        <Route path="/" element={<NoLayout><Home /></NoLayout>} />

        {/* MMV-relaterade sidor */}
        <Route path="/events" element={<MMVLayout><Events /></MMVLayout>} />
        <Route path="/mmvevent" element={<MMVLayout><MmvEvent /></MMVLayout>} />
        <Route path="/about" element={<MMVLayout><About /></MMVLayout>} />
        <Route path="/kundcase" element={<MMVLayout><Arkiv /></MMVLayout>} />
        <Route path="/faq" element={<MMVLayout><FAQ /></MMVLayout>} />
        <Route path="/contact" element={<MMVLayout><Contact /></MMVLayout>} />

        {/* Lokstallet-sidor med egen layout */}
        <Route path="/lokstallet" element={<LokstalletLayout><Lokstallet /></LokstalletLayout>} />
        <Route path="/boka-lokstallet" element={<LokstalletLayout><BokaLokstallet /></LokstalletLayout>} />
        <Route path="/evenemang-lokstallet" element={<LokstalletLayout><EvenemangLokstallet /></LokstalletLayout>} />
        <Route path="/lokaler" element={<LokstalletLayout><LokalerLokstallet /></LokstalletLayout>} />
        <Route path="/historia" element={<LokstalletLayout><HistoriaLokstallet /></LokstalletLayout>} />
        <Route path="/kontakt-lokstallet" element={<LokstalletLayout><KontaktLokstallet /></LokstalletLayout>} />
      </Routes>
    </Router>
  );
}
