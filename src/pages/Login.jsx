import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseAuth";
import { useNavigate } from "react-router-dom";
import { useNoIndex } from "../hooks/useNoIndex";
import "./Login.css";

export default function Login() {
  useNoIndex();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resetSending, setResetSending] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Admin-behörigheten kontrolleras av EventAdmin.jsx via onAuthStateChanged,
      // som väntar in det fullständigt etablerade inloggningsläget innan den frågar
      // Firestore. Att göra samma kontroll här riskerar ett race där Firestore
      // nekar läsningen ("permission-denied") innan auth-token hunnit kopplas,
      // vilket felaktigt visades som "fel lösenord".
      navigate("/admin");
    } catch (err) {
      console.error("Login error:", err.code, err);
      if (err.code === "auth/too-many-requests") {
        setError("För många inloggningsförsök på det här kontot. Vänta en stund och försök igen.");
      } else if (err.code === "auth/user-disabled") {
        setError("Kontot är inaktiverat.");
      } else {
        setError("Felaktig e-post eller lösenord. Försök igen.");
      }
    }
  };

  const openReset = () => {
    setShowReset(true);
    setResetEmail(email);
    setResetMsg("");
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetSending(true);
    setResetMsg("");
    try {
      await sendPasswordResetEmail(auth, resetEmail);
    } catch (err) {
      // Visa samma meddelande oavsett om kontot finns eller ej, så att inloggningssidan
      // inte kan användas för att lista ut vilka e-postadresser som har admin-konton.
      console.error("Password reset error:", err.code, err);
    } finally {
      setResetSending(false);
      setResetMsg("Om ett konto med den adressen finns har vi skickat en återställningslänk dit.");
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>

      {!showReset ? (
        <form onSubmit={handleLogin}>
          <label htmlFor="login-email" className="sr-only">E-post</label>
          <input
            id="login-email"
            type="email"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
          <label htmlFor="login-password" className="sr-only">Lösenord</label>
          <input
            id="login-password"
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && <p className="error" role="alert" aria-live="assertive">{error}</p>}
          <button type="submit">Logga in</button>
          <button type="button" className="login-link-btn" onClick={openReset}>
            Glömt lösenord?
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordReset}>
          <label htmlFor="reset-email" className="sr-only">E-post</label>
          <input
            id="reset-email"
            type="email"
            placeholder="E-post"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
            autoComplete="username"
          />
          {resetMsg && <p role="status" aria-live="polite">{resetMsg}</p>}
          <button type="submit" disabled={resetSending}>
            {resetSending ? "Skickar…" : "Skicka återställningslänk"}
          </button>
          <button type="button" className="login-link-btn" onClick={() => setShowReset(false)}>
            Tillbaka till inloggning
          </button>
        </form>
      )}
    </div>
  );
}
