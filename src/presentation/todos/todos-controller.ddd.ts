import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDTO } from "../../domain/dtos/todos/create-todo.dto";
import { UpdateTodoDTO } from "../../domain/dtos";
import { TodoRepository } from "../../domain/repositories/todo.repository";

export class TodosController {
  //* DI (Dependency Injection)
  constructor(private readonly todoRepository: TodoRepository) {}

  getTodos = async (req: Request, res: Response) => {
    const todos = await this.todoRepository.getAll();
    return res.json(todos);
  };

  getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    try {
      const todo = await this.todoRepository.findById(id);
      return res.json(todo);
    } catch (error) {
      res.status(400).json(error);
    }
  };

  createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDTO] = CreateTodoDTO.create(req.body);
    if (error) return res.status(400).json({ error });

    const todo = await this.todoRepository.create(createTodoDTO!);
    return res.json(todo);
  };

  updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDTO] = UpdateTodoDTO.create({
      ...req.body,
      id,
    });

    if (error) return res.status(400).json({ error });

    const updateTodo = await this.todoRepository.updateById(updateTodoDTO!);
    return res.json(updateTodo);
  };

  deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const deletedTodo = await this.todoRepository.deleteById(id);
    return res.json({ deletedTodo });
  };
}
