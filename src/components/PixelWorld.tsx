/** Original, grid-aligned artwork shared by the landing page and game scenes. */
export function PixelRider({ className = "" }: { className?: string }) {
  return <svg className={`pixel-rider ${className}`} viewBox="0 0 48 92" fill="none" shapeRendering="crispEdges" aria-hidden="true">
    <path fill="#273857" d="M15 1h18v3h6v6h4v9h2v12h-3v8h-6v6h-9v5h-6v-5h-8v-4H7v-7H4V16h3V9h4V4h4z" />
    <path fill="#e64050" d="M15 4h18v3h5v7h4v15h-3v8h-6v5H18v-3h-7v-6H7V17h3v-7h5z" />
    <path fill="#ff6470" d="M15 7h16v3h5v10H13v9H9V18h3v-6h3z" />
    <path fill="#b62b42" d="M39 24h3v7h-3v6h-6v5H18v-3h-6v-4h18v-4h6v-7z" />
    <path fill="#fff8de" d="M15 11h8v3h3v7h-4v3h-7v-3h-3v-7h3z" />
    <path fill="#ff6470" d="M23 44h3v4h-3z" />
    <path stroke="#fff2d2" strokeWidth="1" d="M24 50v21h-5v12h3v6" />
    <path fill="#233652" d="M30 48h10v3h4v5h2v20h-4v5h-6v4h-7v-3h-6v-5h-4v-9h3V55h4v-4h4z" />
    <path fill="#2e6bbd" d="M29 52h12v4h3v17h-5V62H27v-7h2z" />
    <path fill="#82ceef" d="M29 52h10v3H29zM25 56h5v5h-5zM40 57h3v11h-3z" />
    <path fill="#ffdda5" d="M25 61h12v4h3v8h-4v4H25v-4h-3v-7h3z" />
    <path fill="#fff9df" d="M25 61h11v3H25z" />
    <path fill="#263553" d="M33 66h3v5h-3zM23 65h3v4h-3z" />
    <path fill="#e7a96c" d="M25 72h6v3h-6z" />
    <path fill="#ffcc56" d="M28 77h9v5h-9zM21 70h4v4h-4z" />
    <path fill="#397db7" d="M23 76h5v7h-5zM29 82h7v4h-7z" />
    <path fill="#273857" d="M22 82h7v5h-7zM34 84h6v5h-6z" />
    <path fill="#97c85b" d="M40 75h4v6h-4z" />
  </svg>;
}

function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path fill="#b9def5" d="M0 16h8V8h12V0h24v6h12v10h12v8h8v16H8v-8H0z" />
    <path fill="#e5f5f9" d="M0 16h8V8h12V0h24v6h12v10h12v8H8v8H0z" />
    <path fill="#f7fcf2" d="M20 0h24v6H20zM8 8h12v8H8z" />
  </g>;
}

export function PixelLandscape({ variant = "forest", className = "" }: { variant?: "forest" | "clouds" | "space"; className?: string }) {
  return <svg className={`pixel-landscape landscape-${variant} ${className}`} viewBox="0 0 960 480" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" aria-hidden="true">
    <g className="landscape-clouds" opacity={variant === "space" ? 0.15 : 1}>
      <Cloud x={40} y={68} scale={1.2} /><Cloud x={330} y={40} scale={0.55} />
      <Cloud x={730} y={58} scale={1.4} /><Cloud x={570} y={180} scale={0.55} />
      <Cloud x={-25} y={280} scale={1.5} /><Cloud x={860} y={255} scale={1.7} />
      <Cloud x={270} y={210} scale={0.45} />
    </g>
    <g fill="#d7f2ff" opacity=".55">
      <path d="M205 88h4v4h4v4h-4v4h-4v-4h-4v-4h4zM660 88h3v3h3v3h-3v3h-3v-3h-3v-3h3zM820 178h4v4h4v4h-4v4h-4v-4h-4v-4h4zM430 152h3v6h-3zM160 236h4v4h-4zM700 290h4v4h-4zM500 32h4v4h-4z" />
    </g>
    <g fill="#fffce9"><path d="M640 130h4v4h4v4h4v-4h4v-4h4v4h-4v4h-4v4h-4v-4h-4v-4h-4zM685 107h3v3h3v3h3v-3h3v-3h3v3h-3v3h-3v3h-3v-3h-3v-3h-3zM710 134h3v3h3v3h3v-3h3v-3h3v3h-3v3h-3v3h-3v-3h-3v-3h-3z" /></g>
    {variant === "space" && <g fill="#fff2b5"><path d="M340 60h4v8h8v4h-8v8h-4v-8h-8v-4h8zM770 240h4v8h8v4h-8v8h-4v-8h-8v-4h8z" /><path fill="#f1dc9e" d="M90 120h24v8h8v24h-8v8H90v-8h-8v-24h8z" /><path fill="#c6b9c5" d="M93 128h8v8h-8zM106 145h8v8h-8z" /></g>}
    {variant === "forest" && <g className="landscape-ground">
      <path fill="#82bdb6" d="M0 395h40v-25h40v-30h50v-35h60v20h30v30h55v30h60v-18h50v-35h40v-30h60v30h50v30h70v-30h30v-40h60v-40h65v40h35v45h45v30h35v-20h60v-25h60v55h40v103H0z" />
      <path fill="#529b86" d="M0 440v-38h50v-28h30v-20h45v20h35v30h70v25h55v-35h45v-20h40v30h60v25h90v-18h55v-25h50v-20h50v20h50v25h85v-35h55v-25h45v25h50v44z" />
      {[15, 65, 190, 245, 735, 800, 875, 930].map((x, i) => <g key={x} transform={`translate(${x} ${390 + (i % 3) * 12})`}>
        <path fill="#256b61" d="M-4 0h8v12h8v12h8v12h8v12H5v22H-5V48h-23V36h8V24h8V12h8z" />
        <path fill="#39876d" d="M-4 0h4v40h-20v-4h8V24h8z" />
      </g>)}
      <path fill="#397866" d="M0 456h140v-8h80v12h120v-9h90v6h160v-9h80v7h130v-8h80v9h80v24H0z" />
      <path fill="#a8cd6c" d="M0 468h130v-4h110v8h130v-4h130v4h140v-8h140v4h180v12H0z" />
      <path fill="#e8dcaa" d="M0 478h960v2H0z" />
    </g>}
  </svg>;
}

export function PixelBadge({ kind }: { kind: "star" | "tree" | "house" }) {
  return <svg viewBox="0 0 32 32" className="pixel-badge" shapeRendering="crispEdges" aria-hidden="true">
    {kind === "star" ? <><path fill="#a36236" d="M13 2h6v9h11v8h-7v11h-7v-5h-6v5H4V18H1v-7h12z" /><path fill="#ffcd55" d="M13 4h5v9h10v4h-8v10h-3v-5h-7v5H7V16H3v-3h10z" /><path fill="#fff2ad" d="M13 7h3v8h-6v-2h3z" /></> : kind === "tree" ? <><path fill="#6f503b" d="M14 20h5v11h-5z" /><path fill="#266a57" d="M13 1h7v5h4v5h4v6h3v8H2v-8h3v-6h4V6h4z" /><path fill="#81b95d" d="M13 3h5v7h-5v6H7v-4h4V7h2z" /><path fill="#4b945d" d="M15 12h8v7h5v3H6v-3h9z" /></> : <><path fill="#35476b" d="M2 13h4V9h5V5h10v4h5v4h4v6h-4v11H6V19H2z" /><path fill="#ed735a" d="M7 12h5V8h8v4h5v4H7z" /><path fill="#ffe8b3" d="M9 18h14v10H9z" /><path fill="#548bc1" d="M12 20h5v8h-5zM19 20h3v4h-3z" /></>}
  </svg>;
}
