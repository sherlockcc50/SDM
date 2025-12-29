import fs from "fs";
import path from "path";

// project-relative base
const BASE = "static/images";

const container = {};

for (const file of fs.readdirSync(".")) {
  if (file.endsWith(".js") || file.endsWith(".py")) continue;
  container[file] = `${BASE}/${file}`;
}

console.log(container);

