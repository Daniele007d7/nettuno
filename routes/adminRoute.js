import express from "express";
const router = express.Router();
router.use(express.urlencoded({ extended: true }));

import adminController from "../controllers/adminController.js";
router.get("/panel", adminController.render_panel);

router.get("/login", adminController.render_login);

router.post("/login", adminController.check_login);

router.get("/modifica/:id", adminController.render_modifica);

router.post("/modifica/:id", adminController.update_modifica);

router.delete("/modifica/:id", adminController.delete_modifica);

export default router;
