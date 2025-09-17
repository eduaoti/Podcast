// src/components/Podcast.jsx
import { useEffect, useMemo, useRef, useState } from "react";

/* ===== Helper para rutas (funciona en / y en /Podcast/) ===== */
const ASSET = (p) => `${import.meta.env.BASE_URL}${p.startsWith("/") ? p.slice(1) : p}`;

/* ========= Catálogo por voces ========= */
const data = [
  {
    title: "Voz 1 – Edu",
    folder: "podcasts/V1",
    tracks: [
      { file: "EduV1.mp3", label: "Sección 1 – Intro" },
      { file: "EduV2.mp3", label: "Sección 2 – Patrones (MVC)" },
      { file: "EduV3.mp3", label: "Sección 2 – MVP" },
      { file: "EduV4.mp3", label: "Sección 2 – MVVM" },
      { file: "EduV5.mp3", label: "Sección 3 – Nube" },
      { file: "EduV6.mp3", label: "Sección 4 – Offline/Sync" },
    ],
  },
  {
    title: "Voz 2 – Cris",
    folder: "podcasts/V2",
    tracks: [
      { file: "CrisV1.mp3", label: "Sección 1 – Características" },
      { file: "CrisV2.mp3", label: "Sección 2 – MVC" },
      { file: "CrisV3.mp3", label: "Sección 2 – MVP" },
      { file: "CrisV4.mp3", label: "Sección 2 – MVVM" },
      { file: "CrisV5.mp3", label: "Sección 3 – Nube (ejemplos)" },
      { file: "CrisV6.mp3", label: "Sección 4 – Offline/Sync (prácticas)" },
      { file: "CrisV7.mp3", label: "Sección 5 – Microservicios" },
      { file: "CrisV8.mp3", label: "Cierre/Créditos" },
    ],
  },
  {
    title: "Voz 3 – Schos",
    folder: "podcasts/V3",
    tracks: [
      { file: "SchosV1.mp3", label: "Sección 1 – Importancia" },
      { file: "SchosV2.mp3", label: "Sección 2 – Patrones / Clean Architecture" },
      { file: "SchosV3.mp3", label: "Sección 3 – Nube (retos)" },
      { file: "SchosV4.mp3", label: "Sección 4 – Offline/Sync" },
      { file: "SchosV5.mp3", label: "Sección 5 – Microservicios (ejemplos)" },
      { file: "SchosV6.mp3", label: "Retos – IA/IoT/AR" },
      { file: "SchosV7.mp3", label: "Cierre/Conclusión" },
    ],
  },
];

/* ========= Orden del guion (hasta Sección 5) ========= */
const playlist = [
  // Sección 1
  { label: "Intro – Arquitectura móvil (Edu)",  url: ASSET("podcasts/V1/EduV1.mp3") },
  { label: "Características (Cris)",             url: ASSET("podcasts/V2/CrisV1.mp3") },
  { label: "Importancia (Schos)",               url: ASSET("podcasts/V3/SchosV1.mp3") },
  // Sección 2 – Patrones
  { label: "Patrones – MVC (Edu)",              url: ASSET("podcasts/V1/EduV2.mp3") },
  { label: "Patrones – MVP (Cris)",             url: ASSET("podcasts/V2/CrisV3.mp3") },
  { label: "Patrones – MVVM (Edu)",             url: ASSET("podcasts/V1/EduV4.mp3") },
  { label: "Clean Architecture (Schos)",        url: ASSET("podcasts/V3/SchosV2.mp3") },
  // Sección 3 – Nube
  { label: "La nube en apps (Edu)",             url: ASSET("podcasts/V1/EduV5.mp3") },
  { label: "Nube – ejemplos (Cris)",            url: ASSET("podcasts/V2/CrisV5.mp3") },
  { label: "Nube – retos (Schos)",              url: ASSET("podcasts/V3/SchosV3.mp3") },
  // Sección 4 – Offline/Sync
  { label: "Offline & sincronización (Edu)",    url: ASSET("podcasts/V1/EduV6.mp3") },
  { label: "Offline – prácticas (Cris)",        url: ASSET("podcasts/V2/CrisV6.mp3") },
  { label: "Offline – complementos (Schos)",    url: ASSET("podcasts/V3/SchosV4.mp3") },
  // Sección 5 – Microservicios
  { label: "Microservicios (Cris)",             url: ASSET("podcasts/V2/CrisV7.mp3") },
  { label: "Microservicios – ejemplos (Schos)", url: ASSET("podcasts/V3/SchosV5.mp3") },
];

export default function Podcast() {
  /* ====== Dark mode puro ====== */
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  /* ====== Player continuo ====== */
  const audioRef = useRef(null);
  const [index, setIndex] = useState(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const current = useMemo(() => (index === null ? null : playlist[index]), [index]);

  const urlIndex = useMemo(() => {
    const m = new Map();
    playlist.forEach((t, i) => m.set(t.url, i));
    return m;
  }, []);

  const prev = () => setIndex((i) => (i === null ? 0 : Math.max(i - 1, 0)));
  const next = () => setIndex((i) => (i === null ? 0 : Math.min(i + 1, playlist.length - 1)));
  const playUrl = (url) => { if (urlIndex.has(url)) { setIndex(urlIndex.get(url)); setAutoPlay(true); } };

  useEffect(() => {
    if (!current?.url || !autoPlay) return;
    const t = setTimeout(() => audioRef.current?.play().catch(() => {}), 0);
    return () => clearTimeout(t);
  }, [current?.url, autoPlay]);

  const handleEnded = () => setIndex((i) => (i === null ? null : Math.min(i + 1, playlist.length - 1)));
  const handleError = () => { console.warn("No se pudo cargar el audio, saltando:", current?.url); handleEnded(); };

  return (
    <div className="site">
      {/* ===== NAV ===== */}
      <header className="nav">
        <div className="nav__brand"><span className="logo">🎧</span><span className="brand">Arquitectura Móvil</span></div>
        <nav className="nav__links">
          <a href="#podcast">Podcast</a>
          <a href="#resumen">Resumen</a>
          <a href="#diagramas">Diagramas</a>
          <a href="#galeria">Galería</a>
        </nav>
        <button className="btn btn--ghost" onClick={() => setDark((v) => !v)}>{dark ? "☀️ Light" : "🌙 Dark"}</button>
      </header>

      {/* ===== HERO ===== */}
      <section className="hero" id="home">
        <div className="hero__text">
          <h1>Arquitectura de <span className="grad">Apps Móviles</span></h1>
          <p>Un showcase con <strong>podcast</strong>, textos curados con IA y <strong>diagramas</strong> modernos:
            MVVM, Clean, sincronización <em>offline-first</em> y microservicios en la nube.</p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#podcast">Escuchar podcast</a>
            <a className="btn btn--ghost" href="#diagramas">Ver diagramas</a>
          </div>
        </div>

        <div className="hero__card card">
          <div className="card__header"><div className="pill">PODCAST</div><div className="card__title">Arquitectura móvil — hasta Sección 5</div></div>
          <div className="player">
            <div className="player__title">
              {current ? `${String(index + 1).padStart(2, "0")}/${playlist.length} · ${current.label}` : "Selecciona una pista más abajo o presiona Play."}
            </div>
            <audio ref={audioRef} key={current?.url || "empty-hero"} controls preload="auto" className="player__audio"
                   src={current?.url || undefined} onEnded={handleEnded} onError={handleError}/>
            <div className="player__controls">
              <button className="btn" onClick={prev} disabled={index === null || index === 0}>⟵ Anterior</button>
              <button className="btn" onClick={() => (index === null ? setIndex(0) : audioRef.current?.play())}>▶︎ Play</button>
              <button className="btn" onClick={() => audioRef.current?.pause()} disabled={index === null}>⏸ Pausa</button>
              <button className="btn" onClick={next} disabled={index === null || index === playlist.length - 1}>Siguiente ⟶</button>
            </div>
            <div className="hint">Coloca tus MP3 en <code>/public/podcasts/V1|V2|V3</code>. El reproductor avanza automáticamente.</div>
          </div>
        </div>
      </section>

      {/* ===== PODCAST ===== */}
      <section id="podcast" className="section">
        <div className="container">
          <h2 className="h2">Podcast – Arquitectura de Aplicaciones Móviles (hasta Sección 5)</h2>
          <p className="muted">Reproduce en <b>orden continuo</b> según el guion. Puedes saltar a cualquier parte.</p>

          <div className="card">
            <div className="player">
              <div className="player__title">
                {current ? `${String(index + 1).padStart(2, "0")}/${playlist.length} · ${current.label}` : "Selecciona una pista para comenzar."}
              </div>
              <audio ref={audioRef} key={current?.url || "empty"} controls preload="auto" className="player__audio"
                     src={current?.url || undefined} onEnded={handleEnded} onError={handleError}/>
              <div className="player__controls">
                <button className="btn" onClick={prev} disabled={index === null || index === 0}>⟵ Anterior</button>
                <button className="btn" onClick={() => (index === null ? setIndex(0) : audioRef.current?.play())}>▶︎ Play</button>
                <button className="btn" onClick={() => audioRef.current?.pause()} disabled={index === null}>⏸ Pausa</button>
                <button className="btn" onClick={next} disabled={index === null || index === playlist.length - 1}>Siguiente ⟶</button>
                <label className="auto"><input type="checkbox" checked={autoPlay} onChange={(e) => setAutoPlay(e.target.checked)} /> Continuar automáticamente</label>
              </div>
            </div>
          </div>

          <div className="grid">
            {data.map((voice) => {
              return (
                <section key={voice.title} className="card">
                  <h3 className="h3">{voice.title}</h3>
                  <ul className="list">
                    {voice.tracks.map((t, i) => {
                      const url = ASSET(`${voice.folder}/${t.file}`);
                      const inPlaylist = urlIndex.has(url);
                      return (
                        <li key={url} className={`item ${inPlaylist ? "" : "item--muted"}`}>
                          <span className="item__label">
                            {String(i + 1).padStart(2, "0")} · {t.label}{!inPlaylist && " (fuera del guion)"}
                          </span>
                          <div className="item__actions">
                            <button className="btn" onClick={() => playUrl(url)} disabled={!inPlaylist}>▶︎ Reproducir</button>
                            <a className="btn" href={url} download>⤓ Descargar</a>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== RESUMEN ===== */}
      <section id="resumen" className="section">
        <div className="container">
          <div className="grid">
            <article className="card" style={{gridColumn: "1 / -1"}}>
              <h2 className="h2">Descripción &amp; reflexión</h2>
              <p className="muted" style={{marginTop: 6}}>
                Una arquitectura móvil organiza capas (presentación, dominio, datos), define dependencias y
                la interacción con la nube: autenticación, sincronización en tiempo real, notificaciones, funciones
                <em> serverless</em> y analítica. Busca <strong>mantenibilidad</strong>, <strong>seguridad</strong> y <strong>experiencia</strong> con costos controlados.
              </p>
              <ul className="list" style={{marginTop: 12}}>
                <li className="item"><b>Nube:</b>&nbsp;Auth (Firebase/Auth0/Cognito), Realtime (Firestore/RTDB), FCM/OneSignal, Functions/Lambda, Analytics.</li>
                <li className="item"><b>Local + Sync:</b>&nbsp;Room/Core Data/Realm + <em>offline-first</em> y reconciliación de conflictos.</li>
                <li className="item"><b>Backend:</b>&nbsp;APIs REST/GraphQL tras API Gateway; microservicios; contenedores y orquestación.</li>
                <li className="item"><b>Emergentes:</b>&nbsp;IA (TFLite/Core ML), IoT (MQTT/BLE), AR (ARKit/ARCore).</li>
              </ul>
            </article>

            <aside className="card">
              <h3 className="h3">Puntos clave</h3>
              <ul className="list">
                <li className="item">⚡ <b>Escalabilidad</b> con microservicios y colas: cada módulo escala independiente.</li>
                <li className="item">🛰️ <b>Offline-first</b>: funciona sin red y sincroniza con control de conflictos.</li>
                <li className="item">🔐 <b>Seguridad</b>: OAuth/OIDC, JWT, cifrado y mínimo privilegio.</li>
                <li className="item">📈 <b>Métricas</b> para decisiones (retención, funnels, performance).</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* ===== DIAGRAMAS ===== */}
      <section id="diagramas" className="section">
        <div className="container">
          <h2 className="h2">Diagramas de arquitectura</h2>
          <div className="grid">
            {/* MVVM */}
            <figure className="card">
              <figcaption className="h3" style={{marginBottom: 10}}>MVVM con repositorio y servicios en la nube</figcaption>
              {/* … (SVGs iguales) … */}
            </figure>

            {/* Offline-first */}
            <figure className="card">
              <figcaption className="h3" style={{marginBottom: 10}}>Sincronización <em>offline-first</em> (local ↔️ nube)</figcaption>
              {/* … (SVGs iguales) … */}
            </figure>
          </div>
        </div>
      </section>

      {/* ===== GALERÍA ===== */}
      <section id="galeria" className="section">
        <div className="container">
          <h2 className="h2">Galería de imágenes IA</h2>
          <p className="muted" style={{marginBottom: 12}}>Coloca tus imágenes en <code>public/img/</code> y ajusta las rutas si quieres.</p>
          <div className="grid">
            <figure className="card"><img src={ASSET("img/arquitectura-1.jpg")} alt="Diagrama arquitectura móvil" /></figure>
            <figure className="card"><img src={ASSET("img/arquitectura-2.jpg")} alt="Microservicios" /></figure>
            <figure className="card"><img src={ASSET("img/arquitectura-3.jpg")} alt="Offline-first" /></figure>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="section" style={{paddingTop: 16}}>
        <div className="container" style={{display:"flex",gap:12,justifyContent:"space-between",alignItems:"center",borderTop:"1px solid var(--border)",paddingTop:12}}>
          <p className="muted">© 2025 · Arquitectura de Apps Móviles</p>
          <div style={{display:"flex",gap:12}}>
            <a href="#home" className="btn btn--ghost">Inicio</a>
            <a href="#podcast" className="btn btn--ghost">Podcast</a>
            <button className="btn btn--ghost" onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>Subir ⤴️</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
