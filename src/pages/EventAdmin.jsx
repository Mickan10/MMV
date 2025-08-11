import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import "./EventAdmin.css";

const EventAdmin = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
    link: "",
    image: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    date: "",
    description: "",
    link: "",
    image: "",
    hidden: false
  });

  // Hämta event från Firestore och sortera på datum
  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    let eventList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    eventList.sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(eventList);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Lägg till nytt event
  const handleAddEvent = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "events"), {
      title: form.title,
      date: form.date,
      description: form.description,
      link: form.link,
      image: form.image || "",
      hidden: false
    });

    setForm({
      title: "",
      date: "",
      description: "",
      link: "",
      image: ""
    });

    fetchEvents();
  };

  // Ta bort event
  const handleDeleteEvent = async (id) => {
    await deleteDoc(doc(db, "events", id));
    fetchEvents();
  };

  // Starta redigering - fyll editForm med valt event
  const handleEditClick = (event) => {
    setEditingId(event.id);
    setEditForm({
      title: event.title,
      date: event.date,
      description: event.description,
      link: event.link,
      image: event.image || "",
      hidden: event.hidden || false
    });
  };

  // Spara ändringar
  const handleSaveEdit = async (id) => {
    const eventRef = doc(db, "events", id);
    await updateDoc(eventRef, {
      title: editForm.title,
      date: editForm.date,
      description: editForm.description,
      link: editForm.link,
      image: editForm.image,
      hidden: editForm.hidden
    });
    setEditingId(null);
    fetchEvents();
  };

  // Avbryt redigering
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Dölj / visa event (toggle hidden)
  const handleToggleHidden = async (id, currentHidden) => {
    const eventRef = doc(db, "events", id);
    await updateDoc(eventRef, { hidden: !currentHidden });
    fetchEvents();
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin - Hantera Evenemang</h2>

      {/* Lägg till nytt event */}
      <form onSubmit={handleAddEvent}>
        <input
          className="admin-input"
          type="text"
          placeholder="Titel - Vad heter eventet? Gör det catchy så folk vill komma!"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="admin-input"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <textarea
          className="admin-textarea"
          placeholder="Beskriv eventet. Vad händer? Varför ska man komma? eller sno från någon annan sida."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          className="admin-input"
          type="text"
          placeholder="Länk till biljettsida eller annan info-sida/facebook-event"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />
        <input
          className="admin-input"
          type="text"
          placeholder="Bild-URL (webbadress till din bild, t.ex. https://...)"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <button type="submit" className="admin-button">Lägg till event</button>
      </form>

      <h3>Befintliga event</h3>
      <ul className="admin-event-list">
        {events.map((event) => (
          <li key={event.id} className="admin-event-item">
            {editingId === event.id ? (
              // Redigeringsläge
              <div style={{ width: "100%" }}>
                <input
                  className="admin-input"
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
                <input
                  className="admin-input"
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                />
                <textarea
                  className="admin-textarea"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
                <input
                  className="admin-input"
                  type="text"
                  value={editForm.link}
                  onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                />
                <input
                  className="admin-input"
                  type="text"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                />
                <label style={{ display: "block", margin: "10px 0", color: "#5a4c3e" }}>
                  <input
                    type="checkbox"
                    checked={editForm.hidden}
                    onChange={(e) => setEditForm({ ...editForm, hidden: e.target.checked })}
                  /> Dölj event
                </label>

                <button
                  className="admin-button"
                  onClick={() => handleSaveEdit(event.id)}
                  style={{ marginRight: "10px" }}
                >
                  Spara
                </button>
                <button className="admin-button" onClick={handleCancelEdit}>Avbryt</button>
              </div>
            ) : (
              <>
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="admin-event-image"
                  />
                )}
                <div style={{ flexGrow: 1 }}>
                  <p className="admin-event-name">{event.date} • {event.title}</p>
                  <p style={{ marginTop: 4, color: "#5a4c3e", fontSize: "0.95em" }}>
                    {event.description.length > 100
                      ? event.description.substring(0, 100) + "..."
                      : event.description}
                  </p>
                </div>
                <div className="admin-event-buttons">
                  <button onClick={() => handleEditClick(event)}>Redigera</button>
                  <button onClick={() => handleDeleteEvent(event.id)}>Ta bort</button>
                  <button onClick={() => handleToggleHidden(event.id, event.hidden)}>
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
