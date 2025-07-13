import LokstalletHeader from "../components/LokstalletHeader.jsx";
import LokstalletFooter from "../components/LokstalletFooter.jsx";

export default function LokstalletLayout({ children }) {
  return (
    <>
      <LokstalletHeader />
      <div className="lokstallet-page">
        <main>{children}</main>
      </div>
      <LokstalletFooter />
    </>
  );
}
