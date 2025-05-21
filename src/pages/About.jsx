import "./About.css";

import deImg from "../assets/de.jpg";
import historiaImg from "../assets/historia1.jpg";
import sallskapetLogo from "../assets/logotype.webp";
import varaKonserthusLogo from "../assets/varakonsert.png";
import backstageLogo from "../assets/backstage.png";
import svenskLiveLogo from "../assets/svensklive-logo.jpg";

export default function About() {
  return (
    <main>
      <section className="about-us-other">
        <div className="about">
          <div className="about-content">
            <div className="content left-aligned">
              <div className="image-containers">
                <img src={deImg} alt="MMV Event" />
              </div>

              <div className="text">
                <h2>SAGAN OM MMV EVENT</h2>
                <p>
                  MMV Event och Konsertproduktion är ett dynamiskt företag som
                  specialiserar sig på att arrangera och producera konserter och
                  evenemang av hög kvalitet.
                </p>
                <p>
                  Vårt mål är att främja och stödja musiklivet, både på landsbygden
                  och i större städer, och att skapa en plattform där talanger kan
                  blomstra och publiken kan njuta av en enastående liveupplevelse.
                </p>
                <p>
                  Med ett dedikerat team och en passion för musik arbetar vi hårt
                  för att leverera konserter och evenemang som uppfyller och
                  överträffar förväntningarna hos våra kunder och besökare.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr />

      <section className="about-us reverse">
        <div className="about">
          <div className="about-content">
            <div className="content left-aligned reverse-flex">
              <div className="text">
                <h2>HISTORIA</h2>
                <p>
                  MMV Event grundades av tre vänner med en gemensam passion för
                  musik, konst och gemenskap. Idén föddes en sen sommarkväll när de
                  satt vid en liten sjö och drömde om att skapa en plattform där
                  kreativa själar kunde mötas och dela sina talanger.
                </p>
                <p>
                  Det första evenemanget var en liten konsert i en lada på
                  landsbygden, men gensvaret var överväldigande. Folk från när och
                  fjärran strömmade till för att uppleva magin av livemusik i en
                  intim och genuin miljö. Detta blev startskottet för något mycket
                  större.
                </p>
                <p>
                  Idag är MMV Event en ledande aktör inom musik- och
                  evenemangsproduktion, men vi har aldrig glömt våra rötter. Vi tror
                  på kraften i att skapa mötesplatser där både artister och publik
                  kan känna sig hemma. Från små akustiska spelningar till stora
                  konserter i stadens hjärta – vår vision är densamma: att förmedla
                  äkta musikglädje och oförglömliga ögonblick.
                </p>
              </div>

              <div className="image-containers">
                <img src={historiaImg} alt="MMV Event" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr />

      <div className="partners">
        <h2>Partners</h2>
        <p>
          Vi är stolta över att samarbeta med några av de mest framstående
          aktörerna i eventbranschen. Tillsammans med våra partners skapar vi
          evenemang som inte bara engagerar, utan också gör varje tillfälle
          minnesvärt. Här är våra partners som hjälper oss att göra varje
          evenemang till en succé:
        </p>
        <ul>
          <li>
            <a href="https://sallskapetskovde.se/" target="_blank" rel="noreferrer">
              <img src={sallskapetLogo} alt="Sällskapet Skövde & Mariestad" />
              <span>
                <p>
                  <strong>Sällskapet Skövde & Mariestad</strong> är en mysig
                  restaurang där du kan njuta av god mat och en avslappnad atmosfär.
                  Perfekt för både vardagliga måltider och speciella tillfällen med
                  vänner eller familj.
                </p>
              </span>
            </a>
          </li>
          <li>
            <a href="https://www.varakonserthus.se/" target="_blank" rel="noreferrer">
              <img src={varaKonserthusLogo} alt="Vara konserthus" />
              <span>
                <p>
                  <strong>Vara Konserthus</strong> Västra Götalands konserthus är en
                  kulturell mötesplats som erbjuder en varierad program av
                  musikupplevelser, från klassiskt till modernt, i en inspirerande
                  miljö med fantastisk akustik.
                </p>
              </span>
            </a>
          </li>
          <li>
            <a href="http://www.backstagerockbar.se/" target="_blank" rel="noreferrer">
              <img src={backstageLogo} alt="Backstage Rockbar" />
              <span>
                <p>
                  <strong>Backstage Rockbar</strong> din lokala samlingsplats för
                  äkta rock, iskall öl och god stämning. Här bjuder vi på liveband,
                  temakvällar och en meny med rejäl mat för hungriga själar.
                </p>
              </span>
            </a>
          </li>
          <li>
            <a href="https://www.svensklive.se/" target="_blank" rel="noreferrer">
              <img src={svenskLiveLogo} alt="Svensk Live" />
              <span>Svensk Live</span>
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
}
