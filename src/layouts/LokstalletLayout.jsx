import LokstalletHeader from "../components/LokstalletHeader.jsx";
import LokstalletFooter from "../components/LokstalletFooter.jsx";

export default function LokstalletLayout({ children }) {
  return (
    <>
      <LokstalletHeader />
      <main>{children}</main>
      <LokstalletFooter />
    </>
  );
}
