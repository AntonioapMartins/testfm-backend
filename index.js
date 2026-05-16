require("dotenv").config();

const helmet = require("helmet");
const express = require('express');
const app = express();
const cors = require('cors');

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

const db = require('./models');

const postRouter = require('./routes/Events');
app.use("/events", postRouter)

const galleryRouter = require('./routes/Galleries');
app.use("/galleries", galleryRouter);

db.sequelize.sync({ alter: true }).then(() => {
    app.listen(3001, () => {
        console.log('Server is running on port 3001');
      });
});