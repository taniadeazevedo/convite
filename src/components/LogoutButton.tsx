"use client";

export default function LogoutButton() {
  return (
    <button
      className="text-sm text-soft underline"
      onClick={async () => {
        await fetch("/api/cuenta/salir", { method: "POST" });
        window.location.href = "/";
      }}
    >
      Cerrar sesión
    </button>
  );
}
