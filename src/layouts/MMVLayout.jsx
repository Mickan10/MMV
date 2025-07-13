import Header from "../components/Header.jsx"; // MMV Header
import Footer from "../components/Footer.jsx"; // MMV Footer

export default function MMVLayout({ children }) {
  return (
    <>
      <Header />
      <div className="mmv-page">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
