import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./EventAdmin.css";

const normalizeBillettoLink = (url = "") => {
  const s = url.trim();
  return s.replace(/(https?:\/\/(?:www\.)?billetto\.se)\/[a-z]{2}\/e\//i, "$1/e/");
};

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  artist: "",
  genre: "",
  date: "",
  time: "",
  location: "",
  description: "",
  description2: "",
  description3: "",
  price: "",
  link: "",
  image: "",
};

const EventAdmin = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM, hidden: false });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/admin-panel");
        return;
      }
      try {
        const adminDoc = await getDoc(doc(db, "admins", user.uid));
        if (adminDoc.exists()) {
          setIsAdmin(true);
          setLoading(false);
        } else {
          await signOut(auth);
          navigate("/admin-panel");
        }
      } catch (err) {
        console.error("Admin check error:", err);
        await signOut(auth);
        navigate("/admin-panel");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "events"));
      const eventList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      eventList.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(eventList);
    } catch (err) {
      console.error("Fetch events error:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      await addDoc(collection(db, "events"), {
        ...form,
        link: normalizeBillettoLink(form.link),
        hidden: false,
      });
      setForm(EMPTY_FORM);
      fetchEvents();
      setSaveMsg("Event tillagt!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      console.error("Add event error:", err);
    }
  };

  const handleEditClick = (event) => {
    setEditingId(event.id);
    setEditForm({ ...EMPTY_FORM, hidden: false, ...event });
  };

  const handleSaveEdit = async (id) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, "events", id), {
        ...editForm,
        link: normalizeBillettoLink(editForm.link),
      });
      setEditingId(null);
      fetchEvents();
      setSaveMsg("Ändringarna sparades!")
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      console.error("Update event error:", err);
    }
  };

  const handleCancelEdit = () => setEditingId(null);

  const handleDeleteEvent = async (id) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, "events", id));
      fetchEvents();
    } catch (err) {
      console.error("Delete event error:", err);
    }
  };

  const handleToggleHidden = async (id, currentHidden) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, "events", id), { hidden: !currentHidden });
      fetchEvents();
    } catch (err) {
      console.error("Toggle hidden error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin-panel");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-container">
      <button className="admin-button logout" onClick={handleLogout}>Logga ut</button>
      <h2 className="admin-title">Hantera Evenemang</h2>

      <form onSubmit={handleAddEvent} className="admin-form">
        <div className="admin-form-section">
          <h3 className="admin-section-title">Grundinfo</h3>
          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">Titel *</label>
              <input className="admin-input" type="text" placeholder="T.ex. Johan Glans" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Undertitel / tagline</label>
              <input className="admin-input" type="text" placeholder="T.ex. En kväll med humor" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Artist / akt</label>
              <input className="admin-input" type="text" placeholder="T.ex. Johan Glans" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Genre / kategori</label>
              <input className="admin-input" type="text" placeholder="T.ex. Komedi, Rock, Jazz" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title">Tid & Plats</h3>
          <div className="admin-grid-3">
            <div className="admin-field">
              <label className="admin-label">Datum *</label>
              <input className="admin-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Tid *</label>
              <input className="admin-input" type="text" placeholder="T.ex. 19:00" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Plats *</label>
              <input className="admin-input" type="text" placeholder="T.ex. Stora scenen" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title">Beskrivning</h3>
          <div className="admin-field">
            <label className="admin-label">Stycke 1 *</label>
            <textarea className="admin-textarea" placeholder="Inledning – vad är evenemanget? Sätt tonen direkt." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="admin-field" style={{ marginTop: "12px" }}>
            <label className="admin-label">Stycke 2</label>
            <textarea className="admin-textarea" placeholder="Mer info – artist, program eller vad som ingår." value={form.description2} onChange={(e) => setForm({ ...form, description2: e.target.value })} />
          </div>
          <div className="admin-field" style={{ marginTop: "12px" }}>
            <label className="admin-label">Stycke 3</label>
            <textarea className="admin-textarea" placeholder="Praktiskt – ålder, inträde, garderob eller annat att tänka på." value={form.description3} onChange={(e) => setForm({ ...form, description3: e.target.value })} />
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title">Biljetter & Bild</h3>
          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">Pris</label>
              <input className="admin-input" type="text" placeholder="T.ex. 250 kr · Fri entré" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Biljetlänk (Billetto eller annan)</label>
              <input className="admin-input" type="text" placeholder="https://..." value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
            </div>
            <div className="admin-field admin-field--full">
              <label className="admin-label">Bild-URL</label>
              <input className="admin-input" type="text" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
          </div>
        </div>

        <button type="submit" className="admin-button admin-submit-btn">Lägg till event</button>
      </form>

      {saveMsg && (
        <p className="admin-save-msg" role="status" aria-live="polite">{saveMsg}</p>
      )}

      <div className="admin-list-header">
        <h3>Befintliga event</h3>
      </div>

      <ul className="admin-event-list">
        {events.map((event) => (
          <li key={event.id} className={`admin-event-item ${event.hidden ? "is-hidden" : ""}`}>
            {editingId === event.id ? (
              <div className="admin-edit-form">
                <div className="admin-form-section">
                  <h3 className="admin-section-title">Grundinfo</h3>
                  <div className="admin-grid-2">
                    <div className="admin-field">
                      <label className="admin-label">Titel</label>
                      <input className="admin-input" type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Undertitel</label>
                      <input className="admin-input" type="text" value={editForm.subtitle || ""} onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Artist / akt</label>
                      <input className="admin-input" type="text" value={editForm.artist || ""} onChange={(e) => setEditForm({ ...editForm, artist: e.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Genre</label>
                      <input className="admin-input" type="text" value={editForm.genre || ""} onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="admin-form-section">
                  <h3 className="admin-section-title">Tid & Plats</h3>
                  <div className="admin-grid-3">
                    <div className="admin-field">
                      <label className="admin-label">Datum</label>
                      <input className="admin-input" type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Tid</label>
                      <input className="admin-input" type="text" value={editForm.time} onChange={(e) => setEditForm({ ...editForm, time: e.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Plats</label>
                      <input className="admin-input" type="text" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="admin-form-section">
                  <h3 className="admin-section-title">Beskrivning</h3>
                  <div className="admin-field">
                    <label className="admin-label">Stycke 1</label>
                    <textarea className="admin-textarea" placeholder="Inledning – vad är evenemanget? Sätt tonen direkt." value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                  </div>
                  <div className="admin-field" style={{ marginTop: "12px" }}>
                    <label className="admin-label">Stycke 2</label>
                    <textarea className="admin-textarea" placeholder="Mer info – artist, program eller vad som ingår." value={editForm.description2 || ""} onChange={(e) => setEditForm({ ...editForm, description2: e.target.value })} />
                  </div>
                  <div className="admin-field" style={{ marginTop: "12px" }}>
                    <label className="admin-label">Stycke 3</label>
                    <textarea className="admin-textarea" placeholder="Praktiskt – ålder, inträde, garderob eller annat att tänka på." value={editForm.description3 || ""} onChange={(e) => setEditForm({ ...editForm, description3: e.target.value })} />
                  </div>
                </div>

                <div className="admin-form-section">
                  <h3 className="admin-section-title">Biljetter & Bild</h3>
                  <div className="admin-grid-2">
                    <div className="admin-field">
                      <label className="admin-label">Pris</label>
                      <input className="admin-input" type="text" value={editForm.price || ""} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Biljetlänk</label>
                      <input className="admin-input" type="text" value={editForm.link} onChange={(e) => setEditForm({ ...editForm, link: e.target.value })} />
                    </div>
                    <div className="admin-field admin-field--full">
                      <label className="admin-label">Bild-URL</label>
                      <input className="admin-input" type="text" value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} />
                    </div>
                  </div>
                </div>

                <label className="admin-hidden-toggle">
                  <input type="checkbox" checked={editForm.hidden} onChange={(e) => setEditForm({ ...editForm, hidden: e.target.checked })} />
                  Dölj event
                </label>

                <div className="admin-edit-actions">
                  <button className="admin-button" onClick={() => handleSaveEdit(event.id)}>Spara</button>
                  <button className="admin-button admin-button--cancel" onClick={handleCancelEdit}>Avbryt</button>
                </div>
              </div>
            ) : (
              <>
                {event.image && <img src={event.image} alt={event.title} className="admin-event-image" />}
                <div className="admin-event-info">
                  <p className="admin-event-name">{event.title}</p>
                  {event.subtitle && <p className="admin-event-subtitle">{event.subtitle}</p>}
                  <div className="admin-event-meta">
                    <span>{event.date}</span>
                    {event.time && <span>{event.time}</span>}
                    {event.location && <span>{event.location}</span>}
                    {event.genre && <span className="admin-genre-tag">{event.genre}</span>}
                    {event.price && <span className="admin-price-tag">{event.price}</span>}
                  </div>
                  {event.description && (
                    <p className="admin-event-desc">
                      {event.description.length > 120 ? event.description.substring(0, 120) + "…" : event.description}
                    </p>
                  )}
                  {event.hidden && <span className="admin-hidden-badge">Dold</span>}
                </div>
                <div className="admin-event-buttons">
                  <button className="btn-edit" onClick={() => handleEditClick(event)}>Redigera</button>
                  <button className="btn-delete" onClick={() => handleDeleteEvent(event.id)}>Ta bort</button>
                  <button className="btn-toggle" onClick={() => handleToggleHidden(event.id, event.hidden)}>
                    {event.hidden ? "Visa" : "Dölj"}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventAdmin;
