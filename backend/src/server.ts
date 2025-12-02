import express from 'express';
import cors from 'cors';
import {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getPriorities
} from './controllers/taskController';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/tasks', getAllTasks);
app.get('/api/tasks/:id', getTaskById);
app.post('/api/tasks', createTask);
app.put('/api/tasks/:id', updateTask);
app.delete('/api/tasks/:id', deleteTask);
app.get('/api/priorities', getPriorities);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
