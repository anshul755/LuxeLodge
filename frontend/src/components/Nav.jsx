import { useState } from "react";
import { api } from "../api";
import { Link } from "./Link";

function NavItem({ to, navigate, children, mobile = false }) {
  return (
    <Link
      navigate={navigate}
      to={to}
      className={`text-sm font-black no-underline transition ${
        mobile
          ? "rounded-lg px-4 py-3 text-neutral-800 hover:bg-[#fff7e8]"
          : "text-neutral-700 hover:text-neutral-950"
      }`}
    >
      {children}
    </Link>
  );
}

function LogoutButton({ ctx, mobile = false }) {
  const logout = async () => {
    await api.logout();
    ctx.setUser(null);
    ctx.navigate("/listings", "You logged out successfully.");
  };

  return (
    <button
      className={`text-sm font-black transition ${
        mobile
          ? "rounded-lg px-4 py-3 text-left text-neutral-800 hover:bg-[#fff7e8]"
          : "text-neutral-700 hover:text-neutral-950"
      }`}
      onClick={logout}
    >
      Logout
    </button>
  );
}

function NavLinks({ ctx, mobile = false }) {
  return (
    <>
      <NavItem mobile={mobile} navigate={ctx.navigate} to="/">
        Home
      </NavItem>
      <NavItem mobile={mobile} navigate={ctx.navigate} to="/listings">
        All Lodges
      </NavItem>
      <NavItem mobile={mobile} navigate={ctx.navigate} to="/listings/new">
        Add New Lodge
      </NavItem>
      {!ctx.user && (
        <NavItem mobile={mobile} navigate={ctx.navigate} to="/signup">
          Sign Up
        </NavItem>
      )}
      {!ctx.user && (
        <NavItem mobile={mobile} navigate={ctx.navigate} to="/login">
          Login
        </NavItem>
      )}
      {ctx.user && <LogoutButton mobile={mobile} ctx={ctx} />}
    </>
  );
}

export function Nav({ ctx }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1280px] items-center justify-between gap-4 rounded-2xl border border-black/6 bg-white/92 px-4 shadow-[0_14px_40px_rgba(15,15,15,0.08)] backdrop-blur-xl sm:px-6">
        <Link navigate={ctx.navigate} to="/" className="flex items-center gap-3 no-underline">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-neutral-950 text-lg font-black text-amber-400 shadow-lg shadow-black/15">
            L
          </div>
          <div className="grid">
            <strong className="text-[1.75rem] font-black leading-none text-neutral-950 sm:text-[1.95rem]">
              LuxeLodge
            </strong>
            <span className="text-[11px] font-black uppercase tracking-[0.08em] text-neutral-500">
              Stay beautifully
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <div className="flex items-center gap-7">
            <NavLinks ctx={ctx} />
          </div>
          <button
            className="rounded-xl bg-neutral-950 px-5 py-3 text-sm font-black text-amber-400 shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:text-white"
            onClick={() => ctx.navigate("/listings")}
          >
            Explore
          </button>
        </div>

        <button
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-black text-neutral-900 shadow-lg shadow-black/5 transition hover:border-amber-500 lg:hidden"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setOpen(false)}>
          <div
            className="ml-auto flex h-full w-[min(320px,86vw)] flex-col gap-5 bg-[#f5f2ec] p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <strong className="text-lg font-black text-neutral-950">Menu</strong>
              <button
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-black text-neutral-900"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="grid gap-2" onClick={() => setOpen(false)}>
              <NavLinks ctx={ctx} mobile />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
