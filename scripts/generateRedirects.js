import fs from "fs";
import path from "path";

const baseUrl = process.env.VITE_BASE_URL || "http://localhost:3000";

if (!baseUrl) {
  console.error("Error: VITE_BASE_URL is not set!");
  process.exit(1);
}
const redirectsContent = `
/api/*    ${baseUrl}/api/:splat    200
/*        /index.html    200
`.trim();

const distPath = path.resolve(process.cwd(), "dist");

if (!fs.existsSync(distPath)) fs.mkdirSync(distPath, { recursive: true });

const redirectsPath = path.join(distPath, "_redirects");
fs.writeFileSync(redirectsPath, redirectsContent);
console.log(`_redirects generated successfully at ${redirectsPath}`);
