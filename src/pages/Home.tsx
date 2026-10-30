import { MapPin } from "pixelarticons/react/MapPin.js";
import { lazy, Suspense } from "react";
import CopyEmail from "../components/CopyEmail";

// Split out so three.js loads after the page instead of blocking it
const Smiley = lazy(() => import("../components/Smiley"));

const SMILEY_SIZE = "-mb-6 size-[clamp(9rem,36vw,14rem)]";

function Home() {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Fallback holds the same space so nothing shifts when the smiley loads */}
      <Suspense fallback={<div className={SMILEY_SIZE} />}>
        <Smiley className={SMILEY_SIZE} />
      </Suspense>
      <h1 className="flex flex-col items-center leading-none">
        <span className="text-center text-[clamp(2rem,16vw,6rem)] font-bold tracking-tighter">
          Zaid Alsaheb
        </span>
      </h1>
      <div className="flex flex-col items-center gap-2">
        <p className="flex items-center gap-2 opacity-80">
          <MapPin
            width={24}
            height={24}
            shapeRendering="crispEdges"
            aria-hidden="true"
          />
          Madrid, Spain
        </p>
        <CopyEmail />
      </div>
    </div>
  );
}

export default Home;
