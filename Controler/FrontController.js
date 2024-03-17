
const UserModel = require('../Models/user')
// const TeacherModel = require('../Models/teacher')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const cloudinary = require('cloudinary').v2
const CourseModel = require('../Models/course')
const randomstring = require('randomstring')
const nodemailer = require('nodemailer')

cloudinary.config({
  cloud_name: 'dtsiv1iir',
  api_key: '287327449485171',
  api_secret: 'WmFpz_g0Ycmtf7dqqbY42VXZvro'
})

class FrontController {
  static login = async (req, res) => {
    try {
      res.render("login", { message: req.flash('success'), error: req.flash('error') });
    } catch (error) {
      console.log(error);
    }
  };
  static about = async (req, res) => {
    try {
      const { name, image } = req.userdata
      res.render("about", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static ragistration = async (req, res) => {
    try {
      res.render("ragistration", { message: req.flash('success'), error: req.flash('error') });
    } catch (error) {
      console.log(error);
    }
  };
  static dashboard = async (req, res) => {
    try {
      const { name, image, email, id } = req.userdata;
      const btech = await CourseModel.findOne({ user_id: id, course: "btech" })
      const bca = await CourseModel.findOne({ user_id: id, course: "bca" })
      const mca = await CourseModel.findOne({ user_id: id, course: "mca" })
      // console.log(btech)
      res.render("dashboard", { n: name, btech: btech, bca: bca, mca: mca, i: image, e: email });
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      res.render("contact", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static logout = async (req, res) => {
    try {
      res.clearCookie("token")
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  static forgotPassword = async (req, res) => {
    try {

      res.render('forget', { msg: req.flash('success'), err: req.flash('error') });

    } catch (error) {
      console.log(error);
    }
  };

  static forgetPasswordVerify = async (req, res) => {
    try {
      const { email } = req.body;
      const userData = await UserModel.findOne({ email: email });
      //console.log(userData)
      if (userData) {
        const randomString = randomstring.generate();
        await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendEmail(userData.name, userData.email, randomString);
        req.flash("success", "Plz Check Your mail to reset Your Password!");
        res.redirect("/");
      } else {
        req.flash("error", "You are not a registered Email");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };


  static sendEmail = async (name, email, token) => {
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
      subject: "Reset Password", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:4000/reset_password?token=' +
        token +
        '">Reset</a>Your Password.',
    });
  };


  static reset_Password = async (req, res) => {
    // console.log('hello')
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      if (tokenData) {
        res.render("reset_password", { user_id: tokenData._id });
      } else {
        res.render("404");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static reset_Password1 = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const newHashPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(user_id, {
        password: newHashPassword,
        token: "",
      });
      req.flash("success", "Reset Password Updated successfully ");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };


  static sendverifyEmail = async (n, e, id) => {
    console.log(n, e, id)
    // connenct with the smtp server

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "rajawatnikhil0@gmail.com",
        pass: "ushxnskkerrwluhp",
      },
    });
    const mailOptions = {
      from: "test@gmail.com", // sender address
      to: e, // list of receivers
      subject: "Verify Email", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        n +
        ',Please click here to <a href="http://localhost:4000/verifyEmail?id=' + id + '"> Verify <a/> Your Email.</p> '
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);

      }
      else {
        console.log("Email has been send-", info.response)
      }
    })

  };





  static verifyEmail = async (req, res) => {
    try {
      const upadatInfo = await UserModel.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } })
      // console.log(upadatInfo)
      res.redirect('/dashboard')
    } catch (error) {
      console.log(error)

    }
  };

  static profile = async (req, res) => {
    try {
      const { name, image, email } = req.userdata;

      res.render("profile", { n: name, i: image, e: email, msg: req.flash('success') });
    } catch (error) {
      console.log(error);
    }
  };

  static profileUpdate = async (req, res) => {
    try {
      const { id } = req.userdata;
      const { name, email, image } = req.body;
      console.log(req.body)
      // console.log(req.files.image)
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        console.log(imageID)

        //delete by cloudinary
        await cloudinary.uploader.destroy(imageID)
        //new image update
        const imagefile = req.files.image
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath, {
          folder: 'profileImage'
        }
        )
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url
          }
        }

      } else {
        var data = {
          name: name,
          email: email,
        }
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash('success', 'update profile successfully')
      res.redirect("/profile");
    } catch (error) {
      console.log(error)
    }
  };

  // cahng password start
  static changeP = async (req, res) => {
    try {
      const { op, np, cp } = req.body;
      const { id } = req.userdata;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        // console.log(isMatched);
        if (!isMatched) {
          req.flash("error", "current password is incorrect");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "password updated successfully");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "all fields are required");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };


  // insert data insertreg// 
  static insertReg = async (req, res) => {
    try {
      // console.log(req.files.image);
      const file = req.files.image;

      //image upload
      const uploadImage = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'profile'
      })

      // console.log(uploadImage)
      const { n, e, p, cp } = req.body
      const user = await UserModel.findOne({ email: e })
      //console.log(user)
      if (user) {
        req.flash('error', "Email is alredy exist")
        res.redirect('/ragistration')
      } else {

        if (n && e && p && cp) {
          if (p == cp) {
            const hashpassword = await bcrypt.hash(p, 10)
            const result = new UserModel({
              name: n,
              email: e,
              password: hashpassword,
              image: {
                public_id: uploadImage.public_id,
                url: uploadImage.secure_url,
              }
            })
            const userdata = await result.save()
            if (userdata) {
              let token = jwt.sign({ ID: userdata.id }, 'nikhilqwertyuisdfghjkzxcvbn')
              //token genrate
              // console.log(token)
              res.cookie('token', token)
              this.sendverifyEmail(n, e, userdata._id)

              req.flash('success', "You are registered Successfully,Plaese verify your mail")
              res.redirect('/ragistration')
            }
            else {
              req.flash('error', 'Not register')
              res.redirect('/ragistration')
            }

          } else {
            req.flash('error', "Password and confirm pasword does not match")
            res.redirect('/ragistration')
          }

        } else {
          req.flash('error', "all fields required")
          res.redirect('/ragistration')
        }
      }

    } catch (error) {
      console.log(error)
    }
  }


  // secure data login

  static vlogin = async (req, res) => {
    try {
      // console.log(req.body)
      const { e, p } = req.body;
      if (e && p) {
        const user = await UserModel.findOne({ email: e })
        if (user != null) {
          const isMatched = await bcrypt.compare(p, user.password)
          if (isMatched) {
            if (user.role === "admin" && user.is_varified == 1) {
              const token = jwt.sign({ ID: user.id }, 'nikhilqwertyuisdfghjkzxcvbn')
              //token genrate
              // console.log(token)
              res.cookie("token", token)
              res.redirect('/admin/dashboard')
            } else if (user.role === "user" && user.is_varified == 1) {
              let token = jwt.sign({ ID: user.id }, 'nikhilqwertyuisdfghjkzxcvbn')
              //token genrate
              // console.log(token)
              res.cookie('token', token)
              res.redirect('/dashboard')
            } else {
              req.flash('erorr', 'plz varify your Email ')
              res.redirect('/')
            }




          } else {
            req.flash('erorr', 'Email or Password is not valid')
            res.redirect('/')
          }
        } else {
          req.flash('error', 'You are not a registred user')
          res.redirect('/')
        }
      } else {
        req.flash('error', 'All Firlds Required')
        res.redirect('/')
      }

    } catch (error) {
      console.log(error)
    }
  }

}
module.exports = FrontController;