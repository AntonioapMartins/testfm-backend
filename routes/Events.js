const express = require('express');
const router = express.Router();
const { Event } = require('../models');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + file.originalname;
      cb(null, uniqueName);
    }
  });
  
  const upload = multer({ storage });

router.get('/', async (req, res) => {
    const listOfEvents = await Event.findAll();
    res.json(listOfEvents);
});

router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'rules', maxCount: 1 },
    { name: 'registration', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { title, event_date, description } = req.body;

      const image = req.files['image']?.[0];
      const rules = req.files['rules']?.[0];
      const registration = req.files['registration']?.[0];

      const event = await Event.create({
        title,
        event_date,
        description,
        media_url: image ? image.filename : null,
        media_type: image ? 'image' : null,
        rules_url: rules ? rules.filename : null,
        registration_url: registration ? registration.filename : null
      });

      res.json(event);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;