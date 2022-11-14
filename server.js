const express = require("express");
const app = express();
const mainRoutes = require("./routes/mainRoutes.js")
const PORT = 3000


//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Setup The Routes
app.use("/", mainRoutes);


//Server Running
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});