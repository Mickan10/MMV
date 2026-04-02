import "./BraAttVeta.css";

const sections = [
  {
    heading: "Bokning och köp",
    paragraphs: [
      "Biljettköp är bindande och kan inte ångras eller ändras. Förlorad biljett eller värdebevis ersätts inte. Distansavtalslagens regler om ångerrätt gäller inte vid köp av evenemangsbiljetter eller värdebevis. Biljetter får endast köpas för personligt bruk och får inte säljas vidare eller användas kommersiellt.",
      "Biljett eller värdebevis har en säkerhetsfunktion och kan användas endast en gång. Du ansvarar för att förvara din biljett eller värdebevis på ett säkert sätt för att förhindra duplicering eller otillbörlig användning.",
    ],
  },
  {
    heading: "Samtycke och profilering",
    paragraphs: [
      'Genom köp samtycker du till att arrangören och systemleverantören använder dina uppgifter för att skicka information och erbjudanden om våra evenemang. Vi sparar dina kontaktuppgifter så länge du är en "aktiv" kund.',
      "Vi kan använda dina uppgifter för analys och profilering för att bättre förstå dina preferenser och ge mer relevant kommunikation. Dina uppgifter delas inte med externa företag och du kan när som helst be att få dem raderade.",
    ],
  },
  {
    heading: "Inställt evenemang",
    paragraphs: [
      "Vid inställt evenemang sker återbetalning automatiskt senast 30 dagar efter att arrangören meddelat inställningen till den e-postadress som angetts vid köpet. Utbetalning görs endast till det kort eller konto som användes vid köpet. Försäkrings-, service-, leverans- och distributionsavgifter återbetalas inte.",
    ],
  },
  {
    heading: "Uppskjutet evenemang",
    paragraphs: [
      "Om ett evenemang skjuts upp meddelas detta inom 14 dagar till e-postadressen som angetts vid köpet. Din biljett gäller automatiskt till det nya datumet. Om du inte vill behålla biljetten behöver du meddela arrangören inom 14 dagar för återköp. Utbetalning sker endast till det kort eller konto som användes vid köpet. Service- och distributionsavgifter återbetalas inte.",
    ],
  },
  {
    heading: "Flyttat eller ändrat evenemang",
    paragraphs: [
      "Arrangören kan flytta evenemanget till annan likvärdig spelplats inom samma stad eller ort om huvudinnehållet eller din plats inte väsentligt förändras. Vid väsentliga förändringar har du rätt till återköp av biljett.",
      "För festivaler gäller ingen rätt till återköp vid ändringar av artistiskt innehåll, program eller upplägg. För ensembleföreställningar har du rätt till återköp om evenemanget väsentligt förändras.",
    ],
  },
  {
    heading: "Om evenemangets genomförande",
    paragraphs: [
      "Om evenemanget måste ställas in, avbrytas eller flyttas på grund av omständigheter arrangören inte kan påverka, är arrangörens skyldigheter begränsade till det som framgår av dessa villkor. Arrangören ansvarar inte för direkta eller indirekta kostnader som boende, mat, resor eller utebliven lön. Detta gäller även om du nekas entré eller avhyses av säkerhetsskäl, exempelvis alkohol- eller drogpåverkan, risk för dig själv eller andra eller vägran att genomgå säkerhetskontroll.",
    ],
  },
  {
    heading: "Force majeure",
    paragraphs: [
      "Arrangören är befriad från skyldigheter vid händelser som denne inte kan påverka och som förhindrar eller väsentligt försvårar evenemangets genomförande. Exempel på sådana händelser är krig, omfattande arbetskonflikt, blockad, eldsvåda, miljökatastrof eller allvarlig smittspridning.",
    ],
  },
  {
    heading: "Fotografering och filmning",
    paragraphs: [
      "Observera att det kan pågå fotografering och filmning i lokalen. Genom att delta samtycker du till att bilder och film kan användas i marknadsföring och dokumentation av evenemanget.",
    ],
  },
  {
    heading: "Ledsagare",
    paragraphs: [
      "Vi erbjuder gratis biljett till ledsagare för besökare som behöver hjälp. Meddela oss i förväg för att säkerställa plats.",
    ],
  },
  {
    heading: "Garderob",
    paragraphs: [
      "Hos oss hanteras garderoben av den ideella kulturföreningen Kulturkollektivet Beardmen. Avgiften är 25 kr per person. Arrangören ansvarar inte för värdesaker, pengar, smycken, elektronik eller andra personliga tillhörigheter som lämnas i garderoben. Vi rekommenderar att du tar med dig det viktigaste och förvarar det på ett säkert sätt.",
    ],
  },
];

const BraAttVeta = () => {
  return (
    <main className="brav-main">
      <div className="brav-hero">
        <h1 className="brav-title">Bra att veta</h1>
        <p className="brav-lead">
          Mellan biljettköpare och arrangör gäller följande villkor. Villkoren är framtagna enligt Svensk Live. Genom bokning eller köp accepterar du dessa villkor.
        </p>
      </div>

      <div className="brav-container">
        <nav className="brav-toc" aria-label="Innehållsförteckning">
          <p className="brav-toc-heading">Innehåll</p>
          <ol>
            {sections.map((s) => (
              <li key={s.heading}>
                <a href={`#${s.heading.toLowerCase().replace(/\s+/g, "-").replace(/[åä]/g, "a").replace(/ö/g, "o")}`}>
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="brav-content">
          {sections.map((s, index) => {
            const id = s.heading.toLowerCase().replace(/\s+/g, "-").replace(/[åä]/g, "a").replace(/ö/g, "o");
            return (
              <section key={s.heading} className={`brav-section${index === 0 ? " brav-section--first" : ""}`} id={id}>
                <h2 className="brav-section-heading">{s.heading}</h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="brav-paragraph">{p}</p>
                ))}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default BraAttVeta;
