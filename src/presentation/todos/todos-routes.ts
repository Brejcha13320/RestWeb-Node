import { Router } from "express";
import { TodosController } from "./todos-controller.ddd";
import { TodoDatasourceImpl } from "../../infrastructure/datasource/todo.datasource.impl";
import { TodoRepository } from "../../domain/repositories/todo.repository";
import { TodoRepositoryImpl } from "../../infrastructure/datasource/repositories/todo.repository.imp";

export class TodosRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new TodoDatasourceImpl();
    const todoRepository = new TodoRepositoryImpl(datasource);
    const todosController = new TodosController(todoRepository);

    router.get("/", todosController.getTodos);
    router.get("/:id", todosController.getTodoById);
    router.post("/", todosController.createTodo);
    router.put("/:id", todosController.updateTodo);
    router.delete("/:id", todosController.deleteTodo);

    return router;
  }
}
