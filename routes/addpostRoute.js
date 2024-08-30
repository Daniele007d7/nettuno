import express from "express";
const router = express.Router();
import multer from "multer";
import session from "express-session";
// Session
router.use(
  session({
    secret: "chiaveSegreta",
    resave: false,
    saveUninitialized: false,
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
import addpostController from "../controllers/addpostController.js";

router.get("/", addpostController.render);

router.post("/", upload.array("foto", 5), addpostController.newPost);

export default router;
