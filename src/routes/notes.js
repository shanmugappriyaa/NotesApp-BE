const express = require("express");
const notesController = require("../controller/notesController");
const { authUser } = require("../controller/usercontroller");
const router = express.Router();
const Auth = require("../common/auth")
router.post("/create",Auth.validate , notesController.createNotes);
router.get("/byUser", Auth.validate, notesController.getNotesByUserId);
router.get("/", notesController.getAllNotes);
router.get("/:id", notesController.getNotesById);
router.put('/status/:id',notesController.setComplete)
router.put("/edit/:id", notesController.editNotes);
router.delete("/:id", notesController.deleteNote);

module.exports = router;
