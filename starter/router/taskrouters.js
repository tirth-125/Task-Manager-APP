const mongoose = require("mongoose");
const express = require("express");
const Task = require("../model/taskmodel");
const taskController = require("../controller/taskController");
const authController = require("../controller/authController");

const router = express.Router();


router.route('/').get(taskController.getAllTasks).post(authController.protect,taskController.createTask)
router.route('/:id').get(taskController.getSingleTask).put(taskController.updateTask).delete(taskController.deleteTask)



module.exports = router;