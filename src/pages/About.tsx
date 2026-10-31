import Peek, { type Card } from "../components/Peek";
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
    {
      src: "/torre-de-hercules.webp",
      caption: "Torre de Hércules, A Coruña",
      aspect: "aspect-[3/4]",
    },
    {
      src: "/corne.webp",
      caption: "My custom DIY Corne keyboard",
      aspect: "aspect-[2/1]",
    },
  ],
  [
    { src: "/myphoto.webp", caption: "Me", aspect: "aspect-square" },
    {
      src: "/fatteh.webp",
      caption: "A beautiful plate of Fatteh",
      aspect: "aspect-[6/5]",
    },
  ],
];

// Hover cards for words in the text. Edit the captions here.
// ribeye.webp: "The Food at Davids Kitchen 061" by David Reber, CC BY-SA 2.0; zen.webp: "Ryoanji rock garden 857", CC BY-SA 3.0 (both Wikimedia Commons)
const CARDS = {
  amman: { image: "/amman.webp", caption: "Amman, Jordan." },
  ieTower: { image: "/ietower.webp", caption: "The IE Tower in Madrid.", tall: true },
  skoll: {
    image: "/projectphotos/skoll.webp",
    caption: "Skoll, an AI go-to-market engineer. My last venture.",
  },
  ribeye: { image: "/ribeye.webp", caption: "Ribeye steak." },
  chickenLiver: { image: "/chicken-liver.webp", caption: "Chicken liver sandwich.", tall: true },
  overheadPress: { image: "/overhead-press.webp", caption: "Overhead press." },
  zen: { image: "/zen.webp", caption: "The rock garden at Ryōan-ji, Kyoto." },
} satisfies Record<string, Card>;

function About() {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-12">
      <Reveal>
        <h2 className={SECTION_TITLE}>About</h2>
      </Reveal>

      <Reveal
        delay={80}
        className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-start md:gap-12"
      >
        <div className="flex flex-col gap-5 leading-relaxed">
          <p>
            I'm a software developer from{" "}
            <Peek card={CARDS.amman} className="font-bold">
              Amman, Jordan
            </Peek>
            . I studied Computer Science and AI at{" "}
            <Peek href="https://www.ie.edu/university/" card={CARDS.ieTower}>
              IE University
            </Peek>{" "}
            in Madrid, and I currently live there.
          </p>
          <p>
            I've founded and scaled a bunch of companies from 0 to serving B2B
            customers in production. My last venture was{" "}
            <Peek href="https://useskoll.com" card={CARDS.skoll}>
              Skoll
            </Peek>
            , where I built an AI native platform for GTM, reaching{" "}
            <b>$160K ARR</b>. After parting ways with that, I've been building
            GTM automations for companies under my own practice.
          </p>
          <p>
            On a more personal note, I'm really into{" "}
            <Peek card={CARDS.ribeye} className="italic">
              ribeye steaks
            </Peek>
            ,{" "}
            <Peek card={CARDS.chickenLiver} className="italic">
              chicken liver sandwiches
            </Peek>
            , computers, productivity workflows,{" "}
            <Peek card={CARDS.overheadPress}>overhead pressing</Peek>, and{" "}
            <Peek card={CARDS.zen}>zen</Peek>.
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
                  <figcaption className="text-xs leading-snug opacity-60">
                    {photo.caption}
                  </figcaption>
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
