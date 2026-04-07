import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CookieBanner from "./components/CookieBanner.jsx";

import Lokstallet from "./pages/Lokstallet.jsx";
import BokaLokstallet from "./pages/BokaLokstallet.jsx";
import EvenmangLokstallet from "./pages/EvenmangLokstallet.jsx";
import KontaktLokstallet from "./pages/KontaktLokstallet.jsx";
import BraAttVeta from "./pages/BraAttVeta.jsx";
import Login from "./pages/Login.jsx";
import EventAdmin from "./pages/EventAdmin.jsx";
import LokstalletHeader from "./components/LokstalletHeader.jsx";
import LokstalletFooter from "./components/LokstalletFooter.jsx";

function LokstalletLayout({ children }) {
  return (
    <>
      <LokstalletHeader />
      <main id="main-content">{children}</main>
      <LokstalletFooter />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <CookieBanner />
      <Routes>
        <Route path="/" element={<LokstalletLayout><Lokstallet /></LokstalletLayout>} />
        <Route path="/lokstallet" element={<LokstalletLayout><Lokstallet /></LokstalletLayout>} />
        <Route path="/boka-lokstallet" element={<LokstalletLayout><BokaLokstallet /></LokstalletLayout>} />
        <Route path="/evenemang-lokstallet" element={<LokstalletLayout><EvenmangLokstallet /></LokstalletLayout>} />
        <Route path="/kontakt-lokstallet" element={<LokstalletLayout><KontaktLokstallet /></LokstalletLayout>} />
        <Route path="/bra-att-veta" element={<LokstalletLayout><BraAttVeta /></LokstalletLayout>} />
        <Route path="/admin-panel" element={<Login />} />
        <Route path="/admin" element={<EventAdmin />} />
      </Routes>
    </Router>
  );
}
