export default function TabSection({ id, active, children }) {
  return (
    <section
      id={id}
      style={{
        display: active ? 'block' : 'none',
        animation: active ? 'fadeIn 0.4s ease' : undefined,
      }}
    >
      {active ? children : null}
    </section>
  );
}
