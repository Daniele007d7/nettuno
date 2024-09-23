// Import
import express from "express";
const router = express.Router();

import mysql from "mysql2/promise";
import session from "express-session";
import "dotenv/config";

const host_name = process.env.HOST_NAME;
const user_name = process.env.USER_NAME;
const db_name = process.env.DB_NAME;
const db_pass = process.env.DB_PASSWORD;

const app = express();

// View engine
app.set("view engine", "ejs");

// Static files
app.use(express.static("public"));

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
  host: host_name,
  user: user_name,
  database: db_name,
  waitForConnections: true,
  connectionLimit: 10,
  password: db_pass,
});

const render_login = (req, res) => {
  if (req.session.authorized) {
    res.redirect("/addpost");
  } else {
    res.render("login", { wrongpassword: "" });
  }
};

const check_login = (req, res) => {
  if (req.body.username && req.body.password) {
    if (
      req.body.username == admin.username &&
      req.body.password == admin.password
    ) {
      console.log("Login riuscito");
      req.session.authorized = true;

      res.redirect("/addpost");
    } else {
      console.log("Login fallito: credenziali errate");
      res.render("login", { wrongpassword: "hai sbagliato password" });
    }
  } else {
    console.log("Login fallito: campi vuoti");
    res.render("login", {
      wrongpassword: "Username e password sono obbligatori",
    });
  }
};

const render_panel = async (req, res) => {
  if (req.session.authorized) {
    const [adminPanelPosts] = await pool.query(
      "SELECT id, titolo, data FROM post ORDER BY id DESC"
    );

    res.render("adminpanel", {
      adminPanelPosts,
    });
  } else {
    res.send("non sei autorizzato!");
  }
};

const render_modifica = async (req, res) => {
  try {
    const id = req.params.id;
    const [post] = await pool.query(`SELECT * FROM post WHERE id = ?`, [id]);

    res.render("modifica", {
      id,
      data: post[0].data,
      titolo: post[0].titolo,
      testo: post[0].testo,
    });
  } catch (err) {
    console.log(err);
  }
};

const update_modifica = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const [update] = await pool.execute(
      "UPDATE post SET data = ? , TESTO = ?, TITOLO  = ? WHERE id = ?",
      [req.body.data, req.body.testo, req.body.titolo, id]
    );
    res.redirect("/admin/panel");
  } catch (err) {
    console.log(err);
  }
};

const delete_modifica = async (req, res) => {
  try {
    const id = req.params.id;
    const [cancellati] = await pool.execute("DELETE FROM post WHERE id = ?", [
      id,
    ]);
    res.json({ redirect: "/admin/panel" });
  } catch (err) {
    console.log(err);
  }
};

// Username e Password
const admin = {
  username: "root",
  password: "123",
};

export default {
  render_login,
  check_login,
  render_panel,
  render_modifica,
  update_modifica,
  delete_modifica,
};
