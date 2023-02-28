const {
    register,
    getAllUsers,
    setAvatar,
  } = require("../controllers/userController");
  
  const router = require("express").Router();
  
  router.post("/register", register);
  router.get("/allusers", getAllUsers);
  
  module.exports = router;