const express = require("express");
const notesController = require("../controller/notesController");
const { authUser } = require("../controller/usercontroller");
const router = express.Router();

router.post("/create", authUser, notesController.createNotes);
router.get("/byUser", authUser, notesController.getNotesByUserId);
router.get("/", notesController.getAllNotes);
router.get("/:id", notesController.getNotesById);
router.put('/status/:id',notesController.setComplete)
router.put("/edit/:id", notesController.editNotes);
router.delete("/:id", notesController.deleteNote);

module.exports = router;
