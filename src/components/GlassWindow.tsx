import { Dithering } from '@paper-design/shaders-react'
import { Folder } from 'pixelarticons/react/Folder.js'
import type { ReactNode } from 'react'

const ORB_COLORS = ['#ff5f57', '#febc2e', '#28c840']

/** Glossy traffic-light orb: base color, a soft top highlight and an inner rim */
function Orb({ color }: { color: string }) {
  return (
    <span
      className="relative size-3.5 rounded-full shadow-[inset_0_-1px_2px_rgba(0,0,0,0.35),inset_0_0_0_0.5px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.3)]"
      style={{
        background: `radial-gradient(circle at 50% 75%, color-mix(in oklab, ${color}, white 25%) 0%, ${color} 55%, color-mix(in oklab, ${color}, black 30%) 100%)`,
      }}
    >
      <span className="absolute inset-x-[18%] top-[8%] h-[42%] rounded-full bg-linear-to-b from-white/90 to-white/0" />
    </span>
  )
}

function GlassWindow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative isolate w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white/[0.06] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.08),0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-[1.8]">
      {/* Dither texture behind the content, on a transparent background */}
      <Dithering
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        colorBack="#00000000"
        colorFront="#ffffff33"
        shape="warp"
        type="4x4"
        size={2}
        speed={0.25}
      />
      {/* Specular sheen across the top-left of the glass */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-135 from-white/15 via-transparent via-40% to-transparent" />

      <div className="relative flex items-center border-b border-white/10 px-4 py-3">
        <div className="flex gap-2" aria-hidden="true">
          {ORB_COLORS.map((color) => (
            <Orb key={color} color={color} />
          ))}
        </div>
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-sm opacity-90">
          <Folder width={24} height={24} shapeRendering="crispEdges" aria-hidden="true" />
          {title}
        </div>
      </div>

      <div className="p-6 leading-relaxed">{children}</div>
    </div>
  )
}

export default GlassWindow
