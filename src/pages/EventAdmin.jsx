import { useState, useEffect, useRef } from "react";
import { db } from "../firebaseConfig";
import { auth } from "../firebaseAuth";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./EventAdmin.css";

function FormattedTextarea({ className, placeholder, value, onChange, required }) {
  const ref = useRef();

  const wrap = (marker) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const newVal = value.slice(0, start) + marker + selected + marker + value.slice(end);
    onChange(newVal);
    requestAnimationFrame(() => {
      el.selectionStart = start + marker.length;
      el.selectionEnd = end + marker.length;
      el.focus();
    });
  };

  return (
    <div className="formatted-textarea-wrap">
      <div className="format-toolbar">
        <button type="button" className="format-btn format-btn-bold" onMouseDown={(e) => e.preventDefault()} onClick={() => wrap("**")} title="Fet text">B</button>
        <button type="button" className="format-btn format-btn-italic" onMouseDown={(e) => e.preventDefault()} onClick={() => wrap("*")} title="Kursiv text">I</button>
      </div>
      <textarea ref={ref} className={className} placeholder={placeholder} value={value} required={required} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

const normalizeBillettoLink = (url = "") => {
  const s = url.trim();
  return s.replace(/(https?:\/\/(?:www\.)?billetto\.se)\/[a-z]{2}\/e\//i, "$1/e/");
};

const MAX_REVIEWS = 3;

const EMPTY_REVIEW = {
  name: "",
  rating: 5,
  text: "",
};

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  artist: "",
  genre: [],
  date: "",
  time: "",
  location: "",
  description: "",
  description2: "",
  description3: "",
  price: "",
  link: "",
  spotify: [],
  image: "",
  organizer: "",
  organizerEmail: "",
};

function GenreTagInput({ tags, onChange }) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  };

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="genre-tag-input">
      <div className="genre-tag-list">
        {tags.map((t) => (
          <span key={t} className="genre-tag-chip">
            {t}
            <button type="button" onClick={() => removeTag(t)} aria-label={`Ta bort ${t}`}>×</button>
          </span>
        ))}
        <input
          type="text"
          className="genre-tag-text"
          placeholder={tags.length === 0 ? "T.ex. Rock, Komedi…" : "Lägg till…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={addTag}
        />
      </div>
      <p className="genre-tag-hint">Tryck Enter eller komma för att lägga till</p>
    </div>
  );
}


function SpotifyTagInput({ links, onChange }) {
  const [input, setInput] = useState("");

  const addLink = () => {
    const val = input.trim();
    if (val && !links.includes(val)) onChange([...links, val]);
    setInput("");
  };

  const removeLink = (link) => onChange(links.filter((l) => l !== link));

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLink();
    } else if (e.key === "Backspace" && !input && links.length) {
      removeLink(links[links.length - 1]);
    }
  };

  return (
    <div className="genre-tag-input">
      <div className="genre-tag-list">
        {links.map((l, i) => (
          <span key={i} className="genre-tag-chip spotify-chip">
            🎵 {l.replace("https://open.spotify.com/", "").split("/").slice(0, 2).join("/")}
            <button type="button" onClick={() => removeLink(l)} aria-label="Ta bort länk">×</button>
          </span>
        ))}
        <input
          type="text"
          className="genre-tag-text"
          placeholder={links.length === 0 ? "https://open.spotify.com/artist/..." : "Lägg till länk…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={addLink}
        />
      </div>
      <p className="genre-tag-hint">Tryck Enter för att lägga till. Stöder artist, låt, album eller spellista.</p>
    </div>
  );
}

const UPLOAD_TOKEN = "lokstallet-upload-2024";

// Skalar ner + komprimerar bilden i webbläsaren innan uppladdning, så att t.ex.
// en 4000x3000 mobilbild (flera MB) inte skickas i fullstorlek till en liten eventkortsbild.
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

function downscaleImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => resolve(blob ? new File([blob], file.name, { type: "image/jpeg" }) : file),
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
    img.src = objectUrl;
  });
}

function ImageInput({ value, onChange }) {
  const fileRef = useRef();
  const [progress, setProgress] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("upload");

  const switchMode = (m) => {
    setMode(m);
    onChange("");
    setError("");
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Välj en bildfil."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Max 5 MB."); return; }
    setError("");
    setProgress(true);

    const uploadFile = file.type === "image/gif" ? file : await downscaleImage(file);

    const data = new FormData();
    data.append("image", uploadFile);

    try {
      const res = await fetch("/upload.php", {
        method: "POST",
        headers: { "X-Upload-Token": UPLOAD_TOKEN },
        body: data,
      });
      const json = await res.json();
      if (json.url) {
        onChange(json.url);
      } else {
        setError(json.error || "Uppladdning misslyckades.");
      }
    } catch {
      setError("Kunde inte nå servern.");
    } finally {
      setProgress(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="image-input-wrap">
      <div className="image-input-tabs">
        <button type="button" className={`image-tab ${mode === "upload" ? "active" : ""}`} onClick={() => switchMode("upload")}>
          Ladda upp bild
        </button>
        <button type="button" className={`image-tab ${mode === "url" ? "active" : ""}`} onClick={() => switchMode("url")}>
          Bildadress (URL)
        </button>
      </div>

      {mode === "upload" ? (
        <div className="image-upload-area">
          {value ? (
            <div className="image-preview">
              <img src={value} alt="Förhandsgranskning" />
              <button type="button" className="image-remove-btn" onClick={handleRemove}>× Ta bort bild</button>
            </div>
          ) : (
            <>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="image-file-input" id="image-upload" />
              <label htmlFor="image-upload" className="image-upload-label">
                {progress ? "Laddar upp…" : "Välj bild från datorn"}
              </label>
            </>
          )}
          {error && <p className="image-error">{error}</p>}
        </div>
      ) : (
        <div className="image-url-area">
          <input
            className="admin-input"
            type="text"
            placeholder="https://..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && <img src={value} alt="Förhandsgranskning" className="image-url-preview" onError={(e) => e.target.style.display = "none"} />}
        </div>
      )}
    </div>
  );
}

const EventAdmin = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM, hidden: false });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState(EMPTY_REVIEW);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewForm, setEditReviewForm] = useState(EMPTY_REVIEW);

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
      const today = new Date(new Date().toDateString());
      const isPast = (e) => new Date(e.date) < today;
      eventList.sort((a, b) => {
        const aPast = isPast(a), bPast = isPast(b);
        if (aPast !== bPast) return aPast ? 1 : -1;
        return new Date(a.date) - new Date(b.date);
      });
      setEvents(eventList);
    } catch (err) {
      console.error("Fetch events error:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reviews"));
      setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  };

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

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAdmin || reviews.length >= MAX_REVIEWS) return;
    try {
      await addDoc(collection(db, "reviews"), reviewForm);
      setReviewForm(EMPTY_REVIEW);
      fetchReviews();
      setSaveMsg("Recension tillagd!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      console.error("Add review error:", err);
    }
  };

  const handleEditReviewClick = (review) => {
    setEditingReviewId(review.id);
    setEditReviewForm({ ...EMPTY_REVIEW, ...review });
  };

  const handleSaveReviewEdit = async (id) => {
    if (!isAdmin) return;
    try {
      await updateDoc(doc(db, "reviews", id), editReviewForm);
      setEditingReviewId(null);
      fetchReviews();
      setSaveMsg("Ändringarna sparades!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      console.error("Update review error:", err);
    }
  };

  const handleCancelReviewEdit = () => setEditingReviewId(null);

  const handleDeleteReview = async (id) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, "reviews", id));
      fetchReviews();
    } catch (err) {
      console.error("Delete review error:", err);
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
              <input className="admin-input" type="text" placeholder="T.ex. Roger Pontare på turne" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Undertitel / tagline</label>
              <input className="admin-input" type="text" placeholder="T.ex. En kväll med vargar" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Artist / akt</label>
              <input className="admin-input" type="text" placeholder="T.ex. Roger Pontare" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Genre / kategori</label>
              <GenreTagInput
                tags={Array.isArray(form.genre) ? form.genre : (form.genre ? [form.genre] : [])}
                onChange={(tags) => setForm({ ...form, genre: tags })}
              />
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
              <input className="admin-input" type="text" placeholder="Lokstallet" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title">Beskrivning</h3>
          <div className="admin-field">
            <label className="admin-label">Stycke 1 *</label>
            <FormattedTextarea className="admin-textarea" placeholder="Inledning – vad är evenemanget?" value={form.description} onChange={(v) => setForm({ ...form, description: v })} required />
          </div>
          <div className="admin-field" style={{ marginTop: "12px" }}>
            <label className="admin-label">Stycke 2</label>
            <FormattedTextarea className="admin-textarea" placeholder="Mer info – artist, program eller vad som ingår." value={form.description2} onChange={(v) => setForm({ ...form, description2: v })} />
          </div>
          <div className="admin-field" style={{ marginTop: "12px" }}>
            <label className="admin-label">Stycke 3</label>
            <FormattedTextarea className="admin-textarea" placeholder="Praktiskt – ålder, inträde, garderob eller annat att tänka på." value={form.description3} onChange={(v) => setForm({ ...form, description3: v })} />
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
              <label className="admin-label">Spotify-länk(ar)</label>
              <SpotifyTagInput
                links={Array.isArray(form.spotify) ? form.spotify : (form.spotify ? [form.spotify] : [])}
                onChange={(links) => setForm({ ...form, spotify: links })}
              />
            </div>
            <div className="admin-field admin-field--full">
              <label className="admin-label">Bild</label>
              <ImageInput value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title">Arrangör</h3>
          <div className="admin-grid-2">
            <div className="admin-field">
              <label className="admin-label">Arrangörens namn</label>
              <input className="admin-input" type="text" placeholder="T.ex. Lokstallet" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Arrangörens e-post</label>
              <input className="admin-input" type="email" placeholder="T.ex. info@lokstallet.se" value={form.organizerEmail} onChange={(e) => setForm({ ...form, organizerEmail: e.target.value })} />
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
          <li key={event.id} className={`admin-event-item ${event.hidden ? "is-hidden" : ""} ${new Date(event.date) < new Date(new Date().toDateString()) ? "is-past" : ""}`}>
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
                      <GenreTagInput
                        tags={Array.isArray(editForm.genre) ? editForm.genre : (editForm.genre ? [editForm.genre] : [])}
                        onChange={(tags) => setEditForm({ ...editForm, genre: tags })}
                      />
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
                    <FormattedTextarea className="admin-textarea" placeholder="Inledning – vad är evenemanget? Sätt tonen direkt." value={editForm.description} onChange={(v) => setEditForm({ ...editForm, description: v })} />
                  </div>
                  <div className="admin-field" style={{ marginTop: "12px" }}>
                    <label className="admin-label">Stycke 2</label>
                    <FormattedTextarea className="admin-textarea" placeholder="Mer info – artist, program eller vad som ingår." value={editForm.description2 || ""} onChange={(v) => setEditForm({ ...editForm, description2: v })} />
                  </div>
                  <div className="admin-field" style={{ marginTop: "12px" }}>
                    <label className="admin-label">Stycke 3</label>
                    <FormattedTextarea className="admin-textarea" placeholder="Praktiskt – ålder, inträde, garderob eller annat att tänka på." value={editForm.description3 || ""} onChange={(v) => setEditForm({ ...editForm, description3: v })} />
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
                      <label className="admin-label">Spotify-länk(ar)</label>
                      <SpotifyTagInput
                        links={Array.isArray(editForm.spotify) ? editForm.spotify : (editForm.spotify ? [editForm.spotify] : [])}
                        onChange={(links) => setEditForm({ ...editForm, spotify: links })}
                      />
                    </div>
                    <div className="admin-field admin-field--full">
                      <label className="admin-label">Bild</label>
                      <ImageInput value={editForm.image} onChange={(url) => setEditForm({ ...editForm, image: url })} />
                    </div>
                  </div>
                </div>

                <div className="admin-form-section">
                  <h3 className="admin-section-title">Arrangör</h3>
                  <div className="admin-grid-2">
                    <div className="admin-field">
                      <label className="admin-label">Arrangörens namn</label>
                      <input className="admin-input" type="text" value={editForm.organizer || ""} onChange={(e) => setEditForm({ ...editForm, organizer: e.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Arrangörens e-post</label>
                      <input className="admin-input" type="email" value={editForm.organizerEmail || ""} onChange={(e) => setEditForm({ ...editForm, organizerEmail: e.target.value })} />
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
                  <p className="admin-event-name">
                    {event.title}
                    {new Date(event.date) < new Date(new Date().toDateString()) && (
                      <span className="admin-past-badge">Passerat</span>
                    )}
                  </p>
                  {event.subtitle && <p className="admin-event-subtitle">{event.subtitle}</p>}
                  <div className="admin-event-meta">
                    <span>{event.date}</span>
                    {event.time && <span>{event.time}</span>}
                    {event.location && <span>{event.location}</span>}
                    {(Array.isArray(event.genre) ? event.genre : (event.genre ? [event.genre] : [])).map((g) => (
                      <span key={g} className="admin-genre-tag">{g}</span>
                    ))}
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

      <div className="admin-list-header" style={{ marginTop: "60px" }}>
        <h2 className="admin-title" style={{ marginBottom: "6px" }}>Hantera Recensioner</h2>
        <p style={{ textAlign: "center", marginTop: 0 }}>
          {reviews.length} av {MAX_REVIEWS} recensioner används på startsidan.
        </p>
      </div>

      {reviews.length < MAX_REVIEWS ? (
        <form onSubmit={handleAddReview} className="admin-form">
          <div className="admin-form-section">
            <div className="admin-grid-2">
              <div className="admin-field">
                <label className="admin-label">Namn *</label>
                <input className="admin-input" type="text" placeholder="T.ex. Anna Svensson" value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} required />
              </div>
              <div className="admin-field">
                <label className="admin-label">Betyg *</label>
                <select className="admin-input" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} av 5</option>)}
                </select>
              </div>
              <div className="admin-field admin-field--full">
                <label className="admin-label">Recensionstext *</label>
                <textarea className="admin-textarea" placeholder="Vad tyckte gästen?" value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} required />
              </div>
            </div>
          </div>
          <button type="submit" className="admin-button admin-submit-btn">Lägg till recension</button>
        </form>
      ) : (
        <p style={{ textAlign: "center" }}>Max antal recensioner uppnått — ta bort en för att lägga till en ny.</p>
      )}

      <ul className="admin-event-list">
        {reviews.map((review) => (
          <li key={review.id} className="admin-event-item">
            {editingReviewId === review.id ? (
              <div className="admin-edit-form">
                <div className="admin-form-section">
                  <div className="admin-grid-2">
                    <div className="admin-field">
                      <label className="admin-label">Namn</label>
                      <input className="admin-input" type="text" value={editReviewForm.name} onChange={(e) => setEditReviewForm({ ...editReviewForm, name: e.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Betyg</label>
                      <select className="admin-input" value={editReviewForm.rating} onChange={(e) => setEditReviewForm({ ...editReviewForm, rating: Number(e.target.value) })}>
                        {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} av 5</option>)}
                      </select>
                    </div>
                    <div className="admin-field admin-field--full">
                      <label className="admin-label">Recensionstext</label>
                      <textarea className="admin-textarea" value={editReviewForm.text} onChange={(e) => setEditReviewForm({ ...editReviewForm, text: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="admin-edit-actions">
                  <button className="admin-button" onClick={() => handleSaveReviewEdit(review.id)}>Spara</button>
                  <button className="admin-button admin-button--cancel" onClick={handleCancelReviewEdit}>Avbryt</button>
                </div>
              </div>
            ) : (
              <>
                <div className="admin-event-info">
                  <p className="admin-event-name">
                    {review.name} <span className="admin-price-tag">{review.rating} av 5</span>
                  </p>
                  <p className="admin-event-desc">{review.text}</p>
                </div>
                <div className="admin-event-buttons">
                  <button className="btn-edit" onClick={() => handleEditReviewClick(review)}>Redigera</button>
                  <button className="btn-delete" onClick={() => handleDeleteReview(review.id)}>Ta bort</button>
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
