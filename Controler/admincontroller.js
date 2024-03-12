const CourseModel = require('../Models/course')
const nodemailer = require('nodemailer')
class AdminController {
    static dashboard = async (req, res) => {
        try {
            const { image, name, email } = req.userdata;
            const course = await CourseModel.find();
            // console.log(course)
            res.render("admin/dashboard", { i: image, n: name, e: email, c: course, msg: req.flash('success') })
        } catch (error) {
            console.log(error);
        }
    }
    static Update_status = async (req, res) => {
        try {
            const { name, email, status, comment } = req.body;
            await CourseModel.findByIdAndUpdate(req.params.id, {
                comment: comment,
                status: status
            });
            this.sendEmail(name, email, status, comment)
            // console.log(course)
            res.redirect("/admin/dashboard")
        } catch (error) {
            console.log(error);
        }
    }


    static sendEmail = async (name, email, status, comment) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "rajawatnikhil0@gmail.com",
                pass: "miiwzkejudgwbfui",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: ` Course ${status}`, // Subject line
            text: "heelo", // plain text body
            html: `<b>${name}</b> Course  <b>${status}</b> successful! <br>
             <b>Comment from Admin</b> ${comment} `, // html body
        });
    }













    static insertReg = async (req, res) => {
        try {
          // console.log(req.files.image)
          const file = req.files.image;
          //image upload
          const uploadImage = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "profile",
          });
          // console.log(uploadImage)
          // console.log('insert data')
          // console.log(req.body)
          const { n, e, p, cp } = req.body;
          const student = await UserModel.findOne({ email: e });
          if (student) {
            req.flash("error", "Email alredy exit");
            res.redirect("/register");
          } else {
            if (n && e && p && cp) {
              if (p == cp) {
                const hashpassword = await bcrypt.hash(p, 10);
                const result = new UserModel({
                  name: n,
                  email: e,
                  password: hashpassword,
                  image: {
                    public_id: uploadImage.public_id,
                    url: uploadImage.secure_url,
                  },
                });
                const Userdata = await result.save();
                if (Userdata) {
                  const token = jwt.sign(
                    { ID: Userdata.id },
                    "anuragkushwah15394584728655hgbdhjdn"
                  );
                  // console.log(token)
                  res.cookie("token", token);
                  this.sendVerifyEmail(n, e, Userdata._id);
                  //to redirect to login
                  req.flash(
                    "success",
                    "Registration Success plz verify your email!"
                  );
                  res.redirect("/register"); // route url chalta h
                } else {
                  req.flash("error", "Not Register");
                  res.redirect("/register");
                }
              } else {
                req.flash("error", "password and confirm password not same");
                res.redirect("/register");
              }
            } else {
              req.flash("error", "All field req");
              res.redirect("/register");
            }
          }
        } catch (error) {
          console.log(error);
        }
      };
      static vlogin = async (req, res) => {
        try {
          // console.log(req.body)
          const { e, p } = req.body;
          if (e && p) {
            const user = await UserModel.findOne({ email: e });
            if (user != null) {
              const isMatched = await bcrypt.compare(p, user.password);
              if (isMatched) {
                if (user.role === "admin"&& use.is_varified==1) {
                  const token = jwt.sign(
                    { ID: Userdata.id },
                    "anuragkushwah15394584728655hgbdhjdn"
                  );
                  // console.log(token)
                  res.cookie("token", token);
                  res.redirect("admin/dashboard");
                } else if(user.role === "user" && user.is_varified==1) {
                  //token genrate
    
                  const token = jwt.sign(
                    { ID: user.id },
                    "anuragkushwah15394584728655hgbdhjdn"
                  );
                  // console.log(token)
                  res.cookie("token", token);
                  res.redirect("/dashboard");
                }else{
    
                  req.flash("error", "Plz verified Email Address");
                  res.redirect("/");
                }
              } else {
                req.flash("error", "Email or Password is not valid");
                res.redirect("/");
              }
            } else {
              req.flash("error", "You are not a registred user");
              res.redirect("/");
            }
          } else {
            req.flash("error", "All Firlds Required");
            res.redirect("/");
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      static sendVerifyEmail = async (name, email, user_id) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server
    
        let transporter = await nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
    
          auth: {
            user: "anuragkofficial21@gmail.com",
            pass: "bjlgmcajfhsvpwwz",
          },
        });
        let info = await transporter.sendMail({
          from: "test@gmail.com", // sender address
          to: email, // list of receivers
          subject: ` For Varification mail`, // Subject line
          text: "heelo", // plain text body
          html:
            "<p>Hii " +
            name +
            ',Please click here to <a href="http://localhost:5000/verify?id=' +
            user_id +
            '">Verify</a>Your mail</p>.', // html body
        });
      };
    
      static verifyMail = async (req, res) => {
        try {
          const updateinfo = await UserModel.findByIdAndUpdate(req.query.id, {
            is_varified: 1,
          });
          if (updateinfo) {
            res.redirect("/dashboard");
          }
        } catch (error) {}
      };
    































}
module.exports = AdminController