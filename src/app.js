const express = require("express");

const app = express();

app.use("/user", (req, res) => {
  res.send("HHAHAHAHAHAH");
});

app.get("/user", (req, res) => {
  res.send({ firstName: "Yash", lastName: "Mankar" });
});

app.post("/user ", (req, res) => {
  // saving to DB
  res.send("Data successfully saved to database!");
});

app.delete("/user", (req, res) => {
  res.send("Deleted successfully");
});

app.use("/test", (req, res) => {
  res.send("Hello from server");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
