const express = require("express");
const FrontController = require("../Controler/FrontController");
const checkUserAuth = require('../middleware/auth');
const courseController = require("../Controler/courseController");
const AdminController = require("../Controler/admincontroller");
const route = express.Router();

route.get("/", FrontController.login);
route.get("/about", checkUserAuth, FrontController.about);
route.get("/ragistration", FrontController.ragistration);
route.get("/dashboard", checkUserAuth, FrontController.dashboard);
route.get("/contact", checkUserAuth, FrontController.contact);
//insertreg//

route.get("/logout", FrontController.logout);
route.post("/insertreg", FrontController.insertReg);
route.post("/vlogin", FrontController.vlogin);
route.get("/profile", checkUserAuth, FrontController.profile);
route.post("/profile_update", checkUserAuth, FrontController.profileUpdate);
route.post("/changepassword", checkUserAuth, FrontController.changeP);
//route.post("/forgot", FrontController.Forgotload);
//course controller
route.post("/courseinsert", checkUserAuth, courseController.courseinsert);
route.get("/course_display", checkUserAuth, courseController.courseDisplay);
route.get("/course_view/:id", checkUserAuth, courseController.courseview);
route.get("/course_edit/:id", checkUserAuth, courseController.courseEdit);
route.get("/course_delete/:id", checkUserAuth, courseController.courseDelete);
route.post("/course_update/:id", checkUserAuth, courseController.courseUpdate);



//admin controller//
route.get("/admin/dashboard", checkUserAuth, AdminController.dashboard);
route.post("/admin/Update_status/:id", checkUserAuth, AdminController.Update_status);


module.exports = route;
