function PrivacyCopy() {
  return (
    <>
      <h2>Information We Collect</h2>
      <p>
        We may collect personal information such as your name, email address, phone number, and
        booking information.
      </p>
      <h2>How We Use Information</h2>
      <p>
        We use information to provide the service, improve user experiences, process bookings, and
        comply with legal obligations.
      </p>
      <h2>Contact Us</h2>
      <p>Contact us at info@luxelodge.com.</p>
    </>
  );
}

function TermsCopy() {
  return (
    <>
      <h2>Eligibility</h2>
      <p>You must be at least 18 years old to use the service.</p>
      <h2>Listings and Bookings</h2>
      <p>Users are responsible for accurate listings and lawful use of LuxeLodge.</p>
      <h2>Contact Us</h2>
      <p>Contact us at info@luxelodge.com.</p>
    </>
  );
}

export function LegalPage({ type }) {
  const privacy = type === "privacy";

  return (
    <article className="legal">
      <h1>LuxeLodge {privacy ? "Privacy Policy" : "Terms of Service"}</h1>
      <p>Last Updated: {new Date().toLocaleDateString()}</p>
      <p>
        Welcome to LuxeLodge.{" "}
        {privacy
          ? "This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our service."
          : "These Terms govern your use of our website and any related services."}
      </p>
      {privacy ? <PrivacyCopy /> : <TermsCopy />}
    </article>
  );
}
