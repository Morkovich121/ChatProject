const {
  register,
  getAllUsers,
  changeUser
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/register", register);
router.get("/allusers", getAllUsers);
router.put("/allusers/:id", changeUser);

module.exports = router;