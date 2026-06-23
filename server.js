const { createServer } = require("http");
const handler = require("serve-handler");

const port = Number(process.env.PORT) || 10000;
const host = "0.0.0.0";

createServer((req, res) =>
  handler(req, res, {
    public: ".",
    cleanUrls: false,
    trailingSlash: false,
  })
).listen(port, host, () => {
  console.log(`LeafLock Store running at http://${host}:${port}`);
});