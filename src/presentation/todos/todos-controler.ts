import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDTO } from "../../domain/dtos/todos/create-todo.dto";
import { UpdateTodoDTO } from "../../domain/dtos";
import { TodoRepository } from "../../domain/repositories/todo.repository";
import {
  CreateTodo,
  CustomError,
  DeleteTodo,
  GetTodo,
  GetTodos,
  UpdateTodo,
} from "../../domain";

export class TodosController {
  //* DI (Dependency Injection)
  constructor(private readonly todoRepository: TodoRepository) {}

  private handleError = (res: Response, error: unknown) => {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    // grabar log
    res.status(500).json({ error: "Internal server error - check logs" });
  };

  getTodos = (req: Request, res: Response) => {
    new GetTodos(this.todoRepository)
      .execute()
      .then((todos) => res.json(todos))
      .catch((error) => this.handleError(res, error));
  };

  getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;
    new GetTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };

  createTodo = (req: Request, res: Response) => {
    const [error, createTodoDTO] = CreateTodoDTO.create(req.body);
    if (error) return res.status(400).json({ error });

    new CreateTodo(this.todoRepository)
      .execute(createTodoDTO!)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };

  updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDTO] = UpdateTodoDTO.create({
      ...req.body,
      id,
    });

    if (error) return res.status(400).json({ error });

    new UpdateTodo(this.todoRepository)
      .execute(updateTodoDTO!)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };

  deleteTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    new DeleteTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => this.handleError(res, error));
  };
}
