const express = require("express");

const router = express.Router();

router.use("/search",    require("./search"));
router.use("/rooms",     require("./rooms"));
router.use("/dosen",     require("./dosen"));
router.use("/jadwal",    require("./jadwal"));
router.use("/penghuni",  require("./penghuni"));
router.use("/reservasi", require("./reservasi"));

module.exports = router;
