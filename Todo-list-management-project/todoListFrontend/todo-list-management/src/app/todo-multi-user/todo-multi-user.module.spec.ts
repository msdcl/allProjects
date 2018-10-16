import { TodoMultiUserModule } from './todo-multi-user.module';

describe('TodoMultiUserModule', () => {
  let todoMultiUserModule: TodoMultiUserModule;

  beforeEach(() => {
    todoMultiUserModule = new TodoMultiUserModule();
  });

  it('should create an instance', () => {
    expect(todoMultiUserModule).toBeTruthy();
  });
});
