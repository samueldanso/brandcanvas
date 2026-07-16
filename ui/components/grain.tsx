export function Grain() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
        backgroundImage: "url('/noise.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
        opacity: 0.18,
        mixBlendMode: "multiply",
      }}
    />
  );
}
