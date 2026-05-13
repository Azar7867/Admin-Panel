const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createEmployee,
  getEmployees,
  grantAccess,
  removeAccess,
  grantPageAccess,
  removePageAccess,
} = require("../controllers/employeeController");

router.use(auth);

router.post("/", createEmployee);
router.get("/", getEmployees);
router.put("/grant/:id", grantAccess);
router.put("/remove/:id", removeAccess);
router.put("/grant-page/:id", grantPageAccess);

router.put("/remove-page/:id", removePageAccess);
module.exports = router;
