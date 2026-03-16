const express = require("express");
const app = express();
const PORT = 3000;
// get routes
const routes = require("./server/courtRoutes");
app.use(express.json());
app.use(routes);
app.use("/courtApp", routes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
