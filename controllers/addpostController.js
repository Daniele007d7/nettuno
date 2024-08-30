import express from "express";
const router = express.Router();

import mysql from "mysql2/promise";
import session from "express-session";
import multer from "multer";
import path from "path"; // Make sure to import 'path'
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// View engine
app.set("view engine", "ejs");

// Static files
app.use(express.static("../public"));

// urlencoded
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: "chiaveSegreta",
    resave: false,
    saveUninitialized: false,
  })
);

// Connecting DB
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "login",
  waitForConnections: true,
  connectionLimit: 10,
  password: "*",
});

const render = (req, res) => {
  if (req.session.authorized) {
    res.render("addPost", { datomancante: "" });
  } else {
    res.send("non puoi entrare in questa pagina!");
  }
};

const newPost = async (req, res) => {
  try {
    if (req.body.titolo && req.body.data && req.body.testo) {
      const [insert] = await pool.execute(
        `INSERT INTO post (titolo, testo, data) VALUES (?, ?, ?)`,
        [req.body.titolo, req.body.testo, req.body.data]
      );

      req.files.forEach((file, number) => {
        pool.execute("INSERT INTO image (id, path) VALUES(?,?)", [
          insert.insertId,
          file.path,
        ]);
      });
      res.redirect("/homepage");
    } else {
      res.render("addPost", {
        datomancante: "devi inserire tutti i campi",
      });
    }
  } catch (err) {
    console.log("questo è l'errore", err);
  }
};

export default {
  render,
  newPost,
};
