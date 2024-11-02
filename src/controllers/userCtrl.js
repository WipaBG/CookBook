const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const { createToken } = require("../services/jwtService");
const { login, register } = require("../services/userService");
const { isGuest } = require("../middlewares/guards");
const { parseError } = require("../utils");

const userRouter = Router();

userRouter.get("/login", isGuest(), (req, res) => {
  res.render("login");
});

userRouter.post(
  "/login",
  isGuest(),
  body("email").trim().isLength({ min: 10 }),
  body("password").trim().isLength({ min: 4 }),
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await login(email, password);
      const token = createToken(result);
      res.cookie("token", token);

      res.redirect("/catalog");
    } catch (err) {
      res.render("login", { data: { email }, errors: parseError(err).errors });
    }
  }
);

userRouter.get("/register", isGuest(), (req, res) => {
  res.render("register");
});

userRouter.post(
  "/register",
  isGuest(),
  body("name").trim().isLength({ min: 2 },{max: 10}),
  body("email").trim().isLength({ min: 10 }).isEmail(),
  body("password").trim().isLength({ min: 4 }),
  body("repass")
    .trim()
    .custom((value, { req }) => value == req.body.password)
    .withMessage("Passwords don't match"),

  async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const validation = validationResult(req);
      if (validation.errors.length) {
        throw validation.errors;
      }

      const result = await register(name,email, password);
      const token = createToken(result);
      res.cookie("token", token);

      res.redirect("/catalog");
    } catch (err) {
      res.render("register", {
        data: { email, name },
        errors: parseError(err).errors,
      });
    }
  }
);

userRouter.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = {
  userRouter,
};
