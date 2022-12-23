import express from 'express';
import { addBlogs, deleteById, getAllBlogs, getById, getUserBlog, updateBlogs } from '../controllers/blog-controller.js';
const blogRouter = express.Router();

blogRouter.get('/', getAllBlogs);
blogRouter.post('/add', addBlogs);
blogRouter.put('/update/:id', updateBlogs);
blogRouter.get('/:id', getById);
blogRouter.delete('/:id', deleteById);
blogRouter.get('/user/:id', getUserBlog);

export default blogRouter;

