import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import CookieBanner from "./components/CookieBanner.jsx";

import Lokstallet from "./pages/Lokstallet.jsx";
import EvenmangLokstallet from "./pages/EvenmangLokstallet.jsx";
import LokstalletHeader from "./components/LokstalletHeader.jsx";
import LokstalletFooter from "./components/LokstalletFooter.jsx";

// Mindre besökta sidor och admin-panelen laddas bara in när de faktiskt besöks,
// så startsidan/evenemangssidan slipper ladda ner den koden i förväg.
const BokaLokstallet = lazy(() => import("./pages/BokaLokstallet.jsx"));
const KontaktLokstallet = lazy(() => import("./pages/KontaktLokstallet.jsx"));
const BraAttVeta = lazy(() => import("./pages/BraAttVeta.jsx"));
const EvenemangArkiv = lazy(() => import("./pages/EvenemangArkiv.jsx"));
const IntegritetspolicyLokstallet = lazy(() => import("./pages/IntegritetspolicyLokstallet.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const EventAdmin = lazy(() => import("./pages/EventAdmin.jsx"));

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
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LokstalletLayout><Lokstallet /></LokstalletLayout>} />
          <Route path="/lokstallet" element={<LokstalletLayout><Lokstallet /></LokstalletLayout>} />
          <Route path="/boka-lokstallet" element={<LokstalletLayout><BokaLokstallet /></LokstalletLayout>} />
          <Route path="/evenemang-lokstallet" element={<LokstalletLayout><EvenmangLokstallet /></LokstalletLayout>} />
          <Route path="/kontakt-lokstallet" element={<LokstalletLayout><KontaktLokstallet /></LokstalletLayout>} />
          <Route path="/bra-att-veta" element={<LokstalletLayout><BraAttVeta /></LokstalletLayout>} />
          <Route path="/evenemang-lokstallet/arkiv" element={<LokstalletLayout><EvenemangArkiv /></LokstalletLayout>} />
          <Route path="/integritetspolicy" element={<LokstalletLayout><IntegritetspolicyLokstallet /></LokstalletLayout>} />
          <Route path="/admin-panel" element={<Login />} />
          <Route path="/admin" element={<EventAdmin />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
