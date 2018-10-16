import { TodoSingleUserModule } from './todo-single-user.module';

describe('TodoSingleUserModule', () => {
  let todoSingleUserModule: TodoSingleUserModule;

  beforeEach(() => {
    todoSingleUserModule = new TodoSingleUserModule();
  });

  it('should create an instance', () => {
    expect(todoSingleUserModule).toBeTruthy();
  });
});
