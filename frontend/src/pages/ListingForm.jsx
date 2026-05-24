import { useEffect, useState } from "react";
import { api } from "../api";

const listingFields = ["title", "price", "country", "location"];

export function ListingForm({ ctx, id }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    country: "",
    location: "",
    image: null,
  });
  const editing = Boolean(id);

  useEffect(() => {
    if (!ctx.user) ctx.navigate("/login", { message: "Please log in first.", type: "error" });
  }, [ctx.user]);

  useEffect(() => {
    if (editing) {
      api.getListing(id).then(({ listing }) =>
        setForm({
          title: listing.title || "",
          description: listing.description || "",
          price: listing.price || "",
          country: listing.country || "",
          location: listing.location || "",
          image: null,
        }),
      );
    }
  }, [editing, id]);

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") payload.append(key, value);
    });

    if (editing) {
      await api.updateListing(id, payload);
      ctx.navigate(`/listings/${id}`, "Listing updated.");
      return;
    }

    const { listing } = await api.createListing(payload);
    ctx.navigate(`/listings/${listing._id}`, "New listing added.");
  };

  return (
    <form className="entity-form" onSubmit={submit}>
      <h1>{editing ? "Edit your listing" : "Add Details Of Lodge"}</h1>
      {listingFields.map((field) => (
        <label key={field}>
          {field}
          <input
            required
            type={field === "price" ? "number" : "text"}
            value={form[field]}
            onChange={(event) => updateField(field, event.target.value)}
          />
        </label>
      ))}
      <label>
        description
        <textarea
          required
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
      </label>
      <label>
        image
        <input
          required={!editing}
          type="file"
          accept="image/*"
          onChange={(event) => updateField("image", event.target.files[0])}
        />
      </label>
      <button className="primary">{editing ? "Done" : "Add"}</button>
    </form>
  );
}
