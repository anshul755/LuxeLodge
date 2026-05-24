import { useState } from "react";
import { api } from "../api";
import { Link } from "../components/Link";

export function AuthForm({ mode, ctx }) {
  const signup = mode === "signup";
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const response = signup ? await api.signup(form) : await api.login(form);
    ctx.setUser(response.user);
    ctx.navigate("/listings", response.message);
  };

  return (
    <form className="auth-card" onSubmit={submit}>
      <h1>
        {signup ? "Sign Up for" : "Log In to"} <span>LuxeLodge</span>
      </h1>
      <label>
        Username
        <input
          required
          value={form.username}
          onChange={(event) => updateField("username", event.target.value)}
        />
      </label>
      {signup && (
        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
      )}
      <label>
        Password
        <input
          required
          type="password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
        />
      </label>
      <button className="primary">{signup ? "Sign Up" : "Log In"}</button>
      <p>
        {signup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link navigate={ctx.navigate} to={signup ? "/login" : "/signup"}>
          {signup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </form>
  );
}
