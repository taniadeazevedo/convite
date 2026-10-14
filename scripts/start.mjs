// Arranca la web en producción.
// Railway apaga la versión anterior con la señal SIGTERM cada vez que publica una nueva. Next.js
// termina entonces con un código de error, y Railway lo toma como una caída y envía el correo
// «Deploy Crashed». Este arranque reenvía la señal a Next.js y, si el cierre lo hemos pedido nosotros,
// termina con código 0 (cierre normal).
import { spawn } from "node:child_process";

const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0", "-p", process.env.PORT || "3000"], {
  stdio: "inherit",
});

let stopping = false;
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    stopping = true;
    next.kill(signal);
  });
}

// Si Next.js se cae por su cuenta, se devuelve su error para que Railway lo reinicie y avise
next.on("exit", (code) => process.exit(stopping ? 0 : (code ?? 1)));
