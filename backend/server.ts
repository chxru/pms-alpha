import express from "express";

const app = express();

app.all("/", (_req, res) => {
  console.log("hello from server");
  res.sendStatus(200);
});

const PORT = 3448;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
