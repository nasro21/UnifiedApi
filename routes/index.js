const express = require("express");
const app = express();
const router = express.Router();
const upload = require("express-fileupload");
var queryAccess = require("../Controller/unifiedApiExcel");

app.use(
  upload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

router.get("/", (req, res) => {
  res.render("index");
});

// Unified Api allow maximum of 1 call per second.
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// To Upload Excel File
router.post("/upload", async (req, res) => {
  var file = req.files.excelFile;
  var filename = file.name;
  console.log(filename);

  file.mv("./" + filename, (err) => {
    if (err) res.send(err);
  });
  await delay(1500);
  try {
    // Processing the file
    let result = await queryAccess(filename);
    console.log(result);
    if (result == "finished") {
      res.send({ status: "finished", filename: filename });
    }
  } catch (error) {
    res.send({ status: "error" });
  }
});

// To download Excel File
router.get("/download", function (req, res, next) {
  let id = req.query.id;
  console.log(id);
  res.download(id);
});

module.exports = router;
