import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lokstallet-sidor
import Lokstallet from "./pages/Lokstallet.jsx";
import BokaLokstallet from "./pages/BokaLokstallet.jsx";
import EvenmangLokstallet from "./pages/EvenmangLokstallet.jsx";
import LokalerLokstallet from "./pages/LokalerLokstallet.jsx";
import HistoriaLokstallet from "./pages/HistoriaLokstallet.jsx";
import KontaktLokstallet from "./pages/KontaktLokstallet.jsx";

import Login from "./pages/Login.jsx";
import EventAdmin from "./pages/EventAdmin.jsx";

import LokstalletHeader from "./components/LokstalletHeader.jsx";
import LokstalletFooter from "./components/LokstalletFooter.jsx";


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

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Startsidan utan header/footer */}
        {/* Startsidan leder nu till Lokstallet */}
        <Route path="/" element={<LokstalletLayout><Lokstallet /></LokstalletLayout>} />

        {/* Lokstallet-sidor med egen layout */}
        <Route path="/lokstallet" element={<LokstalletLayout><Lokstallet /></LokstalletLayout>} />
        <Route path="/boka-lokstallet" element={<LokstalletLayout><BokaLokstallet /></LokstalletLayout>} />
        <Route path="/evenemang-lokstallet" element={<LokstalletLayout><EvenmangLokstallet /></LokstalletLayout>} />
        {/*<Route path="/lokaler" element={<LokstalletLayout><LokalerLokstallet /></LokstalletLayout>} />*/}
        {/*<Route path="/historia" element={<LokstalletLayout><HistoriaLokstallet /></LokstalletLayout>} />*/}
        <Route path="/kontakt-lokstallet" element={<LokstalletLayout><KontaktLokstallet /></LokstalletLayout>} />

        {/* Admin-sidor utan header/footer */}
        <Route path="/admin-panel" element={<Login />} />
        <Route path="/admin" element={<EventAdmin />} />

      </Routes>
    </Router>
  );
}
