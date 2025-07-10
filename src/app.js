const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("listening on dashboard");
});

app.use("/test", (req, res) => {
  res.send("Hello from the server");
});

app.use("/exam", (req, res) => {
  res.send("Hello from the server11");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
