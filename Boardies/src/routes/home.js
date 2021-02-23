import express from "express";
import HomeController from "../controllers/home";

const router = express.Router();
const homeController = new HomeController();

router
    .get('/', homeController.Index)
    .get('/about-us', homeController.AboutUs)
    .get('/contact-us', homeController.ContactUs)
    .get('/FAQ', homeController.FAQ)

export default router;