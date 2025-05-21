import Header from "../components/Header.jsx"; // Använd rätt header för MMV
import Footer from "../components/Footer.jsx"; // Använd rätt footer för MMV

export default function MMVLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
