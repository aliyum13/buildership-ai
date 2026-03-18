import express from "express";
import { auth } from "../middlewares/auth.js";
import {
    createProject,
    getUserProjects,
    getProjectDetails,
    updateProject,
    deleteProject,
    createTask,
    getProjectTasks,
    updateTask,
    deleteTask
} from "../controllers/projectController.js";

const projectRouter = express.Router();

// Project routes
projectRouter.post('/create', auth, createProject)
projectRouter.get('/list', auth, getUserProjects)
projectRouter.get('/:id', auth, getProjectDetails)
projectRouter.put('/:id', auth, updateProject)
projectRouter.delete('/:id', auth, deleteProject)

// Task routes
projectRouter.post('/tasks/create', auth, createTask)
projectRouter.get('/:project_id/tasks', auth, getProjectTasks)
projectRouter.put('/tasks/:id', auth, updateTask)
projectRouter.delete('/tasks/:id', auth, deleteTask)

export default projectRouter;