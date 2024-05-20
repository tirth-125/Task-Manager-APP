const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name: {
        type : String,
        required : [true,"name is required Field"],
        trim : true,
        maxLength : [20,"Length should be not greter than 20"]
    },
    completed: {
        type : Boolean,
        default : false
    }
});


const Task = new mongoose.model("Task", taskSchema);

module.exports = Task;