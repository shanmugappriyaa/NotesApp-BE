const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const AppRoutes = require("./src/routes");

const cron = require("node-cron")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {getReminder} = require('./src/controller/notesController')

dotenv.config();
const Port = process.env.PORT;
const app = express();

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
    );
  
    next();
  });
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    optionSuccessStatus: 200,
  })
);
app.use("/", AppRoutes);


cron.schedule('*/60 * * * * *',getReminder)
// })

app.listen(Port, () => console.log(`Server is listening in ${Port}`));