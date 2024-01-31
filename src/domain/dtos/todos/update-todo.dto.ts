export class UpdateTodoDTO {
  private constructor(
    public readonly id?: number,
    public readonly text?: string,
    public readonly completedAt?: string
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};
    if (this.text) returnObj.text = this.text;
    if (this.completedAt) returnObj.completedAt = this.completedAt;
    return returnObj;
  }

  static create(props: { [key: string]: any }): [string?, UpdateTodoDTO?] {
    const { id, text, completedAt } = props;
    let newCompletedAt = completedAt;

    if (!id || isNaN(Number(id))) {
      return ["Id nust be a valid number"];
    }

    if (completedAt) {
      newCompletedAt = new Date(completedAt);
      if (newCompletedAt.toString() === "Invalid Date") {
        return ["completedAt must be a valid date"];
      }
    }

    return [undefined, new UpdateTodoDTO(id, text, completedAt)];
  }
}
