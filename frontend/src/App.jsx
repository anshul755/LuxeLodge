import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { Alert } from "./components/Alert";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { AuthForm } from "./pages/AuthForm";
import { Home } from "./pages/Home";
import { LegalPage } from "./pages/LegalPage";
import { ListingDetails } from "./pages/ListingDetails";
import { ListingForm } from "./pages/ListingForm";
import { Listings } from "./pages/Listings";
import { NotFound } from "./pages/NotFound";

function parseRoute(route) {
  const url = new URL(route, window.location.origin);
  return { pathname: url.pathname, searchParams: url.searchParams };
}

function renderRoute(pathname, searchParams, ctx) {
  if (pathname === "/") return <Home navigate={ctx.navigate} />;
  if (pathname === "/listings") {
    return <Listings q={searchParams.get("q") || ""} navigate={ctx.navigate} />;
  }
  if (pathname === "/listings/new") return <ListingForm ctx={ctx} />;
  if (pathname.endsWith("/edit")) return <ListingForm ctx={ctx} id={pathname.split("/")[2]} />;
  if (pathname.startsWith("/listings/")) {
    return <ListingDetails ctx={ctx} id={pathname.split("/")[2]} />;
  }
  if (pathname === "/login") return <AuthForm mode="login" ctx={ctx} />;
  if (pathname === "/signup") return <AuthForm mode="signup" ctx={ctx} />;
  if (pathname === "/privacy") return <LegalPage type="privacy" />;
  if (pathname === "/terms") return <LegalPage type="terms" />;
  return <NotFound navigate={ctx.navigate} />;
}

export function App() {
  const [route, setRoute] = useState(() => window.location.pathname + window.location.search);
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    api
      .getMe()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname + window.location.search);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const showNotice = (message, type = "success") => {
    if (!message) {
      setNotice(null);
      return;
    }

    setNotice(typeof message === "string" ? { message, type } : message);
  };

  const navigate = (to, message = "") => {
    window.history.pushState({}, "", to);
    setRoute(to);
    showNotice(message);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ctx = useMemo(() => ({ user, setUser, navigate, notice, setNotice: showNotice }), [user, notice]);
  const { pathname, searchParams } = parseRoute(route);
  const isHome = pathname === "/";

  return (
    <>
      <Nav ctx={ctx} />
      <main className={isHome ? "w-full" : "page-shell"}>
        {notice && <Alert notice={notice} onClose={() => setNotice(null)} />}
        {renderRoute(pathname, searchParams, ctx)}
      </main>
      {!isHome && <Footer navigate={navigate} />}
    </>
  );
}
