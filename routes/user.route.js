const auth = require("../middlewares/auth");
const express = require("express");
const userController = require("../controllers/user.controller");
const userValidation = require("../validations/user.validation");
const validate = require("../middlewares/validate");

const router = express.Router();

router
  .route("/")
  .post(
    auth("manageUsers"),
    validate(userValidation.createUser),
    userController.createUser
  )
  .get(validate(userValidation.getUsers), userController.getUsers);

router
  .route("/:userId")
  .get(
    //auth("getUsers"),
    validate(userValidation.getUser),
    userController.getUser
  )
  .patch(
    //auth("editUsers"),
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    auth("deleteUsers"),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

module.exports = router;
