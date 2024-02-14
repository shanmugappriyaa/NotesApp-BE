const notesModel = require("../model/notes");
const userModel = require("../model/User");
const { transporter, mailOptions } = require("../common/nodeMail");

const createNotes = async (req, res) => {

  try {
    const { title, notes, reminder, email } = req.body;
    

    if (title && notes && reminder) {
      await notesModel.create({
        title,
        notes,
        reminder,
        email,
        createdBy: req?.headers?.userId,
      });

      res.status(201).send({
        messasge: "Notes created successfully",
      });
    } else {
      res.status(400).send({
        messasge: "title,notes,reminder required",
      });
    }
  } catch (error) {
    res.status(500).send({
      messasge: "Internal server Error",
      error: error.messasge,
    });
  }
};

const getAllNotes = async (req, res) => {
  try {
    let allNotes = await notesModel
      .find(
        {},
        { _id: 1, title: 1, notes: 1, reminder: 1, createdAt: 1, status: 1 }
      )
      .sort({ createdAt: 1 });
    res.status(200).send({
      messasge: "Notes fetched successfully",
      allNotes,
    });
  } catch (error) {
    res.status(500).send({
      messasge: "Internal server Error",
      error: error.messasge,
    });
  }
};
const getNotesById = async (req, res) => {
  try {
    let notesId = req.params.id;

    if (notesId) {
      let notes = await notesModel.findOne({ _id: req.params.id });
      res.status(200).send({
        notes,
      });
    } else {
      res.status(400).send({
        messasge: "notes id not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      messasge: "Internal server Error",
      error: error.messasge,
    });
  }
};
const getNotesByUserId = async (req, res) => {
  // console.log("user.userId==>",req.user.id)
  try {
    let userNotes = await notesModel
      .find(
        { createdBy: req.headers.userId },
        { _id: 1, title: 1, notes: 1,status:1 }
      )
      .sort({ createdAt: 1 });
    res.status(200).send({
      message: "notes Fetched Successfully",
      userNotes,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const editNotes = async (req, res) => {
  let notesId = req.params.id;
  if (notesId) {
    const { title, notes } = req.body;
    console.log("title,notes", title, notes);
    let resNotes = await notesModel.findOne({ _id: req.params.id });

    (resNotes.title = title),
      (resNotes.notes = notes),
      // (resNotes.reminder = reminder),
      // (resNotes.status = status),
      // (modifiedAt = new Date.now());

      await resNotes.save();
    console.log("resNotes-->", resNotes);
    res.status(200).send({
      messasge: "notes updated successfully",
    });
  } else {
    res.status(400).send({ messasge: "notesId not found" });
  }
  try {
   
  } catch (error) {
    res.status(500).send({
      messasge: "Internal server Error",
      error: error.messasge,
    });
  }
};
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("dlete id--?", id);
    const result = await notesModel.findByIdAndDelete(id);

    if (!result) {
      return res.status(400).json({ message: "Note not found" });
    } else {
      return res.status(200).json({ message: "Success" });
    }
  } catch (error) {
    res.status(500).send({
      messasge: "Internal server Error",
      error: error.messasge,
    });
  }
};
const getReminder = async (req, res) => {
  try {
    const result = await notesModel.find({
      $and: [
        { reminder: { $gte: new Date(new Date().getTime() - 1000 * 60 * 1) } },
        { reminder: { $lte: new Date(new Date().getTime() + 1000 * 60 * 1) } },
      ],
    });

    result.forEach((res) => {
      mailOptions.to = res.email;
      mailOptions.html = `Hi, This is the reminder mail to complete your task -->  ${res.title}`;
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: " + error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const setComplete = async(req,res) => {
  try {
    let notesId = req.params.id;
    console.log("notesId--->", notesId);
    if (notesId) {
    const { status } = req.body;
      console.log("status", status);
      let resNotes = await notesModel.findOne({ _id: req.params.id });
      (resNotes.status = true),
      (resNotes.reminder=null)
      await resNotes.save();
      console.log("resNotes-->", resNotes);
      res.status(200).send({
        messasge: "notes updated successfully",
      });
    } else {
      res.status(400).send({ messasge: "notesId not found" });
}
} catch (error) {
  res.status(500).send({
    messasge: "Internal server Error",
    error: error.messasge,
  });
}
}
module.exports = {
  createNotes,
  getAllNotes,
  getNotesById,
  editNotes,
  deleteNote,
  getReminder,
  getNotesByUserId,
  setComplete
};
