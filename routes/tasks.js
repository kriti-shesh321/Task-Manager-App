import express from 'express';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/taskContollers.js'

const router = express.Router();

// get all the tasks
router.get('/', getTasks);
// get task by id
router.get('/:id', getTaskById);
// create a new task
router.post('/', createTask);
// update a existing task
router.patch('/:id', updateTask);
// delete task
router.delete('/:id',deleteTask);

export default router;