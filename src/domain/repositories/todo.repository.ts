import { CreateTodoDTO } from "../dtos";
import { TodoEntity } from "../entities/todo.entity";
import { UpdateTodoDTO } from "../dtos/todos/update-todo.dto";

export abstract class TodoRepository {
  abstract create(createTodoDto: CreateTodoDTO): Promise<TodoEntity>;
  abstract getAll(): Promise<TodoEntity[]>;
  abstract findById(id: number): Promise<TodoEntity>;
  abstract updateById(updateTodoDTO: UpdateTodoDTO): Promise<TodoEntity>;
  abstract deleteById(id: number): Promise<TodoEntity>;
}
