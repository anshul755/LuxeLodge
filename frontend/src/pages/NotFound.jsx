export function NotFound({ navigate }) {
  return (
    <section>
      <h1>Page Not Found</h1>
      <button className="primary" onClick={() => navigate("/listings")}>
        Back to lodges
      </button>
    </section>
  );
}
