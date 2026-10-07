"use client";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn print:hidden">
      Imprimir o guardar en PDF
    </button>
  );
}
