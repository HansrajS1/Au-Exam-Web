import fs from "fs";
import path from "path";

const baseUrl = process.env.VITE_BASE_URL;

if (!baseUrl) {
  console.error("Error: VITE_BASE_URL is not set!");
  process.exit(1);
}

const redirectsContent = `
/api/*    ${baseUrl}/api/:splat    200
/*        /index.html    200
`;

const distPath = path.resolve("dist");
if (!fs.existsSync(distPath)) fs.mkdirSync(distPath);

fs.writeFileSync(path.join(distPath, "_redirects"), redirectsContent.trim());
console.log("_redirects generated successfully!");
