// Import
import express from "express";
import mysql from "mysql2/promise";
import session from "express-session";
import adminRoutes from "./routes/adminRoute.js";
import addpostRoutes from "./routes/addpostRoute.js";

import path from "path";

import "dotenv/config";

const host_name = process.env.HOST_NAME;
const user_name = process.env.USER_NAME;
const db_name = process.env.DB_NAME;
const db_pass = process.env.DB_PASSWORD;

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

// Route Homepage
app.get("/homepage", async (req, res) => {
  try {
    const [blogs] = await pool.query(
      "SELECT * FROM post ORDER BY id DESC LIMIT 6;"
    );
    //console.log(blogs);
    const [imagesPath] = await pool.query("SELECT * FROM image");

    const completo = blogs.map((blog) => {
      let id = blog.id;

      let imageFiltered = imagesPath.filter((image) => {
        if (image.id == id) {
          return image;
        }
      });
      let path = imageFiltered.map((idPath) => {
        let correctedPath = idPath.path.replaceAll("\\", "/");
        correctedPath = correctedPath.replace("public", "");

        return correctedPath;
      });

      return {
        ...blog,
        path,
      };
    });
    const oldPost = completo.slice(1, 5);
    console.log(oldPost);
    //console.log("questo è completo", completo);

    res.render("index", { completo, oldPost, req });
  } catch (err) {
    console.log(err);
  }
});

// Route view blog
app.get("/blog/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [post] = await pool.execute("SELECT * FROM post WHERE id=?", [id]);
    //console.log(blogs);
    const [imagesPath] = await pool.execute("SELECT * FROM image WHERE id=?", [
      id,
    ]);
    //console.log(imagesPath);

    let path = imagesPath.map((idPath) => {
      let correctedPath = idPath.path.replaceAll("\\", "/");
      correctedPath = correctedPath.replace("public", "");

      return correctedPath;
    });
    //console.log("questo è path", path);

    res.render("blog", {
      path,
      post,
      titolo: post[0].titolo,
      testo: post[0].testo,
      data: post[0].data,
    });
  } catch (err) {
    console.log(err);
  }
});

// Chi siamo
app.use("/chi-siamo", (req, res) => {
  res.render("chi-siamo");
});

// Dove siamo
app.use("/dove-siamo", (req, res) => {
  res.render("dove");
});

// orari di apertura
app.use("/orari-apertura", (req, res) => {
  res.render("orari");
});
// Route addpost
app.use("/addpost", addpostRoutes);

// Route admin-panel
app.use("/admin", adminRoutes);

// 404 page
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

// Listening
app.listen(3000, () => {
  console.log("listening on port 3000");
});
