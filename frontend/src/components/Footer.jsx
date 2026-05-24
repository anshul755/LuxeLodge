import { Link } from "./Link";

export function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="socials">Facebook Instagram Twitter LinkedIn</div>
      <div>&copy; LuxeLodge Private Limited</div>
      <div>
        <Link navigate={navigate} to="/privacy">
          Privacy
        </Link>
        <Link navigate={navigate} to="/terms">
          Terms
        </Link>
      </div>
    </footer>
  );
}
