import Peek from "../components/Peek";
import Reveal from "../components/Reveal";
import { MUTED, PANEL, SECTION_TITLE } from "../surface";

const NOW = [
  "Screwing around in the robotics lab.",
  "Getting into homelabbing and self-hosting.",
  "Making software with friends.",
];

// Two columns of two photos; the crops are chosen so both columns end on the same line
const PHOTO_COLUMNS = [
  [
    { src: "/torre-de-hercules.jpeg", caption: "Torre de Hércules, A Coruña", aspect: "aspect-[3/4]" },
    { src: "/corne.jpeg", caption: "Corne keyboard", aspect: "aspect-[2/1]" },
  ],
  [
    { src: "/myphoto.jpeg", caption: "Me", aspect: "aspect-square" },
    { src: "/fatteh.jpg", caption: "Fatteh", aspect: "aspect-[6/5]" },
  ],
];

// Hand-picked Wikimedia Commons photos for cards whose article lead image is a logo, a diagram or a crop
const IMAGES = {
  ieTower: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Madrid_-_CTBA%2C_Torre_Caleido_01.jpg/960px-Madrid_-_CTBA%2C_Torre_Caleido_01.jpg", // File:Madrid - CTBA, Torre Caleido 01.jpg (CC0)
  ribeye: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/The_Food_at_Davids_Kitchen_061.jpg/960px-The_Food_at_Davids_Kitchen_061.jpg", // File:The Food at Davids Kitchen 061.jpg (CC BY-SA 2.0)
  overheadPress: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Attractive_sporty_woman_doing_overhead_press_in_gym_with_barbell.jpg/960px-Attractive_sporty_woman_doing_overhead_press_in_gym_with_barbell.jpg", // File:Attractive sporty woman doing overhead press in gym with barbell.jpg (CC BY 2.0)
};

const SKOLL = { image: "/projectphotos/skoll.webp", caption: "Skoll, an AI go-to-market engineer. My last venture." };

function About() {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-12">
      <Reveal>
        <h2 className={SECTION_TITLE}>About</h2>
      </Reveal>

      <Reveal delay={80} className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-start md:gap-12">
        <div className="flex flex-col gap-5 leading-relaxed">
          <p>
            I'm a software developer from{" "}
            <Peek href="https://en.wikipedia.org/wiki/Amman" wiki="Amman" className="font-bold">
              Amman, Jordan
            </Peek>
            . I studied Computer Science and AI at{" "}
            <Peek href="https://www.ie.edu/university/" wiki="IE_University" image={IMAGES.ieTower} tall>
              IE University
            </Peek>{" "}
            in Madrid, and I currently live there.
          </p>
          <p>
            I've founded and scaled a bunch of companies from 0 to serving B2B
            customers in production. My last venture was{" "}
            <Peek href="https://useskoll.com" card={SKOLL}>
              Skoll
            </Peek>
            , where I built an AI native platform for GTM, reaching{" "}
            <b>$160K ARR</b>. After parting ways with that, I've been building
            GTM automations for companies under my own practice.
          </p>
          <p>
            On a more personal note, I'm really into{" "}
            <Peek href="https://en.wikipedia.org/wiki/Rib_eye_steak" wiki="Rib_eye_steak" image={IMAGES.ribeye} className="italic">
              ribeye steaks
            </Peek>
            ,{" "}
            <Peek href="https://en.wikipedia.org/wiki/Liver_(food)" wiki="Liver_(food)" image="/chicken-liver.jpg" tall className="italic">
              chicken liver sandwiches
            </Peek>
            , computers, productivity workflows,{" "}
            <Peek href="https://en.wikipedia.org/wiki/Overhead_press" wiki="Overhead_press" image={IMAGES.overheadPress} tall>
              overhead pressing
            </Peek>
            , and{" "}
            <Peek href="https://en.wikipedia.org/wiki/Zen" wiki="Zen">
              zen
            </Peek>
            .
          </p>
          <div className="flex flex-col gap-2">
            <span className={MUTED}>now</span>
            <ul className="flex list-['→_'] flex-col gap-1 pl-6">
              {NOW.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Photos lead on wider screens; on phones the text comes first */}
        <div className="grid grid-cols-2 gap-3 md:order-first">
          {PHOTO_COLUMNS.map((column, c) => (
            <div key={c} className="flex flex-col gap-3">
              {column.map((photo) => (
                <figure key={photo.src} className="flex flex-col gap-1.5">
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className={`${PANEL} w-full object-cover ${photo.aspect}`}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="text-xs leading-snug opacity-60">{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

export default About;
