import { Router } from 'express';
import { create, getAll } from '../controllers/news.controller.js'
import { authMiddleware } from '../middlewares/auth.middlewares.js';

const route = Router();

route.post("/", authMiddleware, create);
route.get("/", authMiddleware, getAll);

export default route;