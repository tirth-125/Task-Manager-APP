const mongoose = require("mongoose");
const express = require("express");
const asyncHandler = require("../middleware/asyncErrorhandler");
const ErrorHandler = require("../utils/errorHandler");
const Task = require("../model/taskmodel");


exports.getAllTasks = asyncHandler(async (req, res,next) => {

    const task = await Task.find({});
    res.status(200).json({
        success: true,
        length: task.length,
        task
    });

});

exports.getSingleTask = asyncHandler(async (req, res, next) => {

    const task = await Task.findById(req.params.id);
    // console.log(task);
    if (!task) {
        return next(new ErrorHandler("Task is not find on this id", 400));
    }
    res.status(200).json({
        success: true,
        task
    });

})

exports.createTask = asyncHandler(async (req, res,next) => {

    const { name, completed } = req.body;

    const task = await Task.create({ name, completed });

    res.status(200).json({
        success: true,
        message: task
    });

})

exports.updateTask = asyncHandler(async (req, res,next) => {
    const { name, completed } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { name, completed },
        { new: true }, { runValidators: true }
    );
    if (!updatedTask) {
        return next(new ErrorHandler("Task is not find on this id", 400));
    }
    res.status(200).json({
        success: true,
        message: "Task is updated Successfully",
        task: updatedTask
    });

});


exports.deleteTask = asyncHandler(async (req, res,next) => {

    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
        return next(new ErrorHandler("Task is not find on this id", 400));
    }

    res.status(200).json({
        success: true,
        message: "Your data is deleted"
    })

});