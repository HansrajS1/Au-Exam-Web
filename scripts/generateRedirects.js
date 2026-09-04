import fs from "fs";
import path from "path";

const distPath = path.resolve(process.cwd(), "dist");

if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

const redirectsPath = path.join(distPath, "_redirects");

fs.writeFileSync(redirectsPath, "");

console.log(`_redirects generated successfully at ${redirectsPath}`);