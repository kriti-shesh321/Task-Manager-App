import Tasks from '../models/tasks.js'

//@desc Get all tasks
//@route GET api/v1/tasks
export const getTasks = async (req, res, next) => {
    try {
        const tasks = await Tasks.find({ user: req.user });
        if (tasks.length === 0) return res.status(404).json({ message: "Tasks Not Found!" });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks..", error });
    }
};

//@desc Get task by id
//@route GET api/v1/tasks/:id
export const getTaskById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const task = await Tasks.findOne({ _id: id, user: req.user });

        if (!task) return res.status(404).json({ message: "Task Not Found!" });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error fetching the task..", error });
    }
};

//@desc Create new task
//@route POST api/v1/tasks
export const createTask = async (req, res, next) => {
    try {
        const { name, due, completed } = req.body;
        const newTask = new Tasks({ name, due, completed, user: req.user });

        const savedTask = await newTask.save();
        res.status(200).json({ message: "Task created Sucessfully.", savedTask });

    } catch (error) {
        res.status(500).json({ message: "Error creating the task..", error })
    }
};

//@desc Update existing task
//@route PATCH api/v1/tasks/:ID
export const updateTask = async (req, res, next) => {
    try {
        const updatedTask = await Tasks.findOneAndUpdate(
            { _id: req.params.id, user: req.user },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updateTask) return res.status(404).json({ message: "Task Not Found!" });

        res.status(200).json({ message: "Task updated Sucessfully.", updatedTask });

    } catch (error) {
        res.status(500).json({ message: "Error updating the task..", error });
    }
};

//@desc Delete task
//@route DELETE api/v1/tasks/:id
export const deleteTask = async (req, res, next) => {
    try {
        const deletedTask = await Tasks.findOneAndDelete({ _id: req.params.id, user: req.user });
        if (!deletedTask) return res.status(404).json({ message: "Task Not Found!" });

        res.status(200).json({ message: "Task deleted Sucessfully.", deletedTask });

    } catch (error) {
        res.status(500).json({ message: "Error deleting the task..", error });
    }
};