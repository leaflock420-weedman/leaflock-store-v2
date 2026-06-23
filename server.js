const { createServer } = require("http");
const handler = require("serve-handler");

const port = Number(process.env.PORT) || 10000;
const host = "0.0.0.0";

const server = createServer((req, res) => {
  if (req.url === "/" || req.url === "") {
    req.url = "/index.html";
  }
  handler(req, res, {
    public: ".",
    cleanUrls: false,
    trailingSlash: false,
    directoryListing: false,
  });
});

server.listen(port, host, () => {
  console.log(`LeafLock Store running at http://${host}:${port}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});