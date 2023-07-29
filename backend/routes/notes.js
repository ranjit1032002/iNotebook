const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// Route 1: Get All the Notes using : GET "/api/notes/fetchallnotes" .Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: e.message });
  }
});

// Route 2: Add a new Note using : POST "/api/notes/addnote" .Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description ust be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = await Notes.create({
        title: req.body.title,
        description: req.body.description,
        user: req.user.id,
      });
      res.json(note);
    } catch (e) {
      res
        .status(500)
        .json({ error: "Internal Server Error", message: e.message });
    }
  }
);

// Route 3: Update an existing Note using : PUT "/api/notes/updatenote" .Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // Create a newNote object
    const newNote = {
      title: title ? title : "",
      description: description ? description : "",
      tag: tag ? tag : "",
    };

    // Find the note to be updated to update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(401).send("Not Found");
    }

    // To check wheather the note is connected with his account or not
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    // Update the Note
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.send(note);
  } catch (e) {
    res
    .status(500)
    .json({ error: "Internal Server Error", message: e.message });
  }
});

// Route 4: Delete an existing Note using : DELETE "/api/notes/deletenote" .Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(401).send("Not Found");
    }

    // Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);

    res.json({"Success": "Note has been deleted", note: note});
  } catch (e) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: e.message });
  }
});
module.exports = router;
