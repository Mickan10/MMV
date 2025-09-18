import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./EventAdmin.css";

const EventAdmin = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    link: "",
    image: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    link: "",
    image: "",
    hidden: false
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  // --- Kolla om användaren är admin ---
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

  // --- Hämta events ---
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

  // --- Lägg till nytt event ---
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      await addDoc(collection(db, "events"), { ...form, hidden: false });
      setForm({ title: "", date: "", time: "", location: "", description: "", link: "", image: "" });
      fetchEvents();
    } catch (err) {
      console.error("Add event error:", err);
    }
  };

  // --- Redigering ---
  const handleEditClick = (event) => {
    setEditingId(event.id);
    setEditForm({ ...event });
  };

  const handleSaveEdit = async (id) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, "events", id), { ...editForm });
      setEditingId(null);
      fetchEvents();
    } catch (err) {
      console.error("Update event error:", err);
    }
  };

  const handleCancelEdit = () => setEditingId(null);

  // --- Ta bort event ---
  const handleDeleteEvent = async (id) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, "events", id));
      fetchEvents();
    } catch (err) {
      console.error("Delete event error:", err);
    }
  };

  // --- Dölj / visa event ---
  const handleToggleHidden = async (id, currentHidden) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, "events", id), { hidden: !currentHidden });
      fetchEvents();
    } catch (err) {
      console.error("Toggle hidden error:", err);
    }
  };

  // --- Logga ut ---
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
      <h2 className="admin-title" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
      Hantera Evenemang
      </h2>

      <form onSubmit={handleAddEvent}>
        <input className="admin-input" type="text" placeholder="Titel" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="admin-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <input className="admin-input" type="text" placeholder="Tid" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
        <input className="admin-input" type="text" placeholder="Plats" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        <textarea className="admin-textarea" placeholder="Beskrivning" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input className="admin-input" type="text" placeholder="Länk" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        <input className="admin-input" type="text" placeholder="Bild-URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <button type="submit" className="admin-button">Lägg till event</button>
      </form>

      <h3>Befintliga event</h3>
      <ul className="admin-event-list">
        {events.map((event) => (
          <li key={event.id} className="admin-event-item">
            {editingId === event.id ? (
              <div style={{ width: "100%" }}>
                <input className="admin-input" type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                <input className="admin-input" type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
                <input className="admin-input" type="text" value={editForm.time} onChange={(e) => setEditForm({ ...editForm, time: e.target.value })} />
                <input className="admin-input" type="text" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
                <textarea className="admin-textarea" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                <input className="admin-input" type="text" value={editForm.link} onChange={(e) => setEditForm({ ...editForm, link: e.target.value })} />
                <input className="admin-input" type="text" value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} />
                <label style={{ display: "block", margin: "10px 0", color: "#5a4c3e" }}>
                  <input type="checkbox" checked={editForm.hidden} onChange={(e) => setEditForm({ ...editForm, hidden: e.target.checked })} /> Dölj event
                </label>
                <button className="admin-button" onClick={() => handleSaveEdit(event.id)} style={{ marginRight: "10px" }}>Spara</button>
                <button className="admin-button" onClick={handleCancelEdit}>Avbryt</button>
              </div>
            ) : (
              <>
                {event.image && <img src={event.image} alt={event.title} className="admin-event-image" />}
                <div style={{ flexGrow: 1 }}>
                  <p className="admin-event-name">{event.date} {event.time ? "• " + event.time : ""} • {event.title}</p>
                  <p style={{ margin: "3px 0", fontSize: "0.95em", color: "#5a4c3e" }}>
                    {event.location && <span>{event.location} • </span>}
                    {event.description.length > 100 ? event.description.substring(0, 100) + "..." : event.description}
                  </p>
                </div>
                <div className="admin-event-buttons">
                  <button onClick={() => handleEditClick(event)}>Redigera</button>
                  <button onClick={() => handleDeleteEvent(event.id)}>Ta bort</button>
                  <button onClick={() => handleToggleHidden(event.id, event.hidden)}>{event.hidden ? "Visa" : "Dölj"}</button>
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
