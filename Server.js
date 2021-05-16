const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const upload = require("express-fileupload");
const indexRouter = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  upload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);

app.use("/", indexRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
