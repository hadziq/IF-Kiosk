const express = require("express");
const cors    = require("cors");
const path    = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// The built kiosk SPA is served from the same origin as the API, so the phone
// only ever needs one host. Both /mobile and /admin are client-side routes and
// fall through to the SPA shell.
const frontendDist = path.join(__dirname, "../frontend/dist");
const spaShell     = (_req, res) => res.sendFile(path.join(frontendDist, "index.html"));

app.use(express.static(frontendDist));
app.get("/mobile", spaShell);

app.use("/api", require("./routes"));

app.get("/admin", spaShell);

module.exports = app;
