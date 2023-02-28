const { addMessage, getMessages } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/sendMessage", addMessage);
router.post("/getMessages", getMessages);

module.exports = router;