

const events = [
  {
    id: 1,
    date: "2025-06-15",
    title: "Sommarkonsert med Jazztrion",
    location: "Lokstallet, Halmstad",
    description: "En kväll fylld med sköna jazztoner och sommardrinkar.",
  },
  {
    id: 2,
    date: "2025-07-02",
    title: "Barnens teaterdag",
    location: "Lokstallet, Halmstad",
    description: "Familjeföreställningar och aktiviteter för alla åldrar.",
  },
  {
    id: 3,
    date: "2025-08-10",
    title: "Vintage- & Antikmarknad",
    location: "Lokstallet, Halmstad",
    description: "Upptäck unika fynd bland lokala utställare.",
  },
];

export default function EvenemangLokstallet() {
  return (
    <main className="evenemang-main">
      <h1>Kommande Evenemang</h1>
      <div className="event-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <p className="event-date">{event.date}</p>
            <h2>{event.title}</h2>
            <p className="event-location">{event.location}</p>
            <p className="event-description">{event.description}</p>
            <button className="event-btn">Läs mer</button>
          </div>
        ))}
      </div>
    </main>
  );
}
