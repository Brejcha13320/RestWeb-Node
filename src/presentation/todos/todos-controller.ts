import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDTO } from "../../domain/dtos/todos/create-todo.dto";
import { UpdateTodoDTO } from "../../domain/dtos";

export class TodosController {
  //* DI (Dependency Injection)
  constructor() {}

  getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();
    return res.json(todos);
  };

  getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `Id ${id} argument is not a number` });
    }

    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      return res.status(400).json({ error: `Todo with id ${id} not found` });
    }

    return res.json(todo);
  };

  createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDTO] = CreateTodoDTO.create(req.body);

    if (error) return res.status(400).json({ error });

    const todo = await prisma.todo.create({
      data: createTodoDTO!,
    });

    return res.json(todo);
  };

  updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDTO] = UpdateTodoDTO.create({
      ...req.body,
      id,
    });

    if (error) return res.status(400).json({ error });

    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      return res.status(404).json({ error: `Todo with ${id} not found` });
    }

    const updateTodo = await prisma.todo.update({
      where: { id },
      data: updateTodoDTO!.values,
    });

    return res.json(updateTodo);
  };

  deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: `Id ${id} argument is not a number` });
    }

    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      return res.status(404).json({ error: `Todo with ${id} not found` });
    }

    const deleted = await prisma.todo.delete({
      where: {
        id: todo.id,
      },
    });

    return res.json({ todo, deleted });
  };
}
