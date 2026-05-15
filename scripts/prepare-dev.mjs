import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_DATA_PATH = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "github-repos-simple.json"
);

console.log("🚀 Preparando entorno de desarrollo...\n");

// Verificar si existen los datos necesarios
const checks = [
  {
    path: GITHUB_DATA_PATH,
    name: "GitHub repos data",
    action: "pnpm run fetch-repos",
  },
];

let needsSetup = false;

checks.forEach(({ path: checkPath, name, action }) => {
  if (!fs.existsSync(checkPath)) {
    console.log(`⚠️  ${name} no encontrado`);
    console.log(`   Ejecuta: ${action}\n`);
    needsSetup = true;
  } else {
    console.log(`✅ ${name} disponible`);
  }
});

if (needsSetup) {
  console.log(
    "\n💡 Tip: Ejecuta 'pnpm run dev:full' para preparar todo automáticamente"
  );
  console.log("   O ejecuta los comandos individuales listados arriba\n");
} else {
  console.log("\n✅ Todo listo para desarrollo\n");
}
