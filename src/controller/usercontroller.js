const userModel = require("../model/User");
const jwt = require("jsonwebtoken");
const auth = require("../common/auth");
const jwtSecret = process.env.JWT_SECRET;
var Cookies = require("cookies");

const loginUser = async (req, res) => {

  try {
    let user = await userModel.findOne({ userName: req.body.userName });
    console.log(user);
    if (user) {
      let passCheck = await auth.hashCompare(req.body.password, user.password);
      // console.log("passCheck=======> ", passCheck, "JWT-->", jwtSecret);
      if (passCheck) {
        let token = await auth.createToken({
          id: user._id,
          userName: user.userName,
        });
        res.status(200).send({
          message: "Login Successfull",
          token,
          user,
        });
      }
      else {
        res.status(500).send({
          message: "Invalid Password",
        });
      }
    } else {
      res.status(400).send({
        message: `Account with ${req.body.userName} does not exist`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const registerUser = async (req, res) => {
  const { userName, password, email } = req.body;
  try {
    let user = await userModel.findOne({ userName: req.body.userName });
    if (!user) {
      const hashedPassword = await auth.hashPassword(req.body.password);
      const User = await userModel.create({
        userName,
        password: hashedPassword,
        email,
      });
      res.status(201).send({
        message: "User created Successfully",
        User,
      });
    } else {
      res.status(400).send({
        message: "user already exists",
      });
    }
    // jwt.sign(
    //   { userId: createdUser._id, userName },
    //   jwtSecret,
    //   {expiresIn: process.env.JWT_EXPIRE},
    //   (err, token) => {
    //     if (err) throw err;

    //     res
    //       .cookie("token", token, { sameSite: "none", secure: true })
    //       .status(201)
    //       .json({
    //         id: createdUser._id,
    //       });
    //   }
    // );
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const authUser = async (req, res, next) => {
  const cookies = req.headers.cookie;
  let token = null;
  console.log("cookies========> ", cookies);
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      token = tokenCookieString.split("=")[1];
    }
  }
  try {
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        req.user = userData;
        next();
      });
    } else {
      res.status(401).send({
        message: "No token",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const profile = async (req, res, next) => {
  const cookies = req.headers.cookie;
  let token = null;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      token = tokenCookieString.split("=")[1];
    }
  }
  try {
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        res.json(userData);
      });
    } else {
      res.status(401).send({
        message: "No token",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json("ok");
};

module.exports = { loginUser, registerUser, authUser, profile, logout };
