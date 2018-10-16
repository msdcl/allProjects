import { SlotsModule } from './slots.module';

describe('SlotsModule', () => {
  let slotsModule: SlotsModule;

  beforeEach(() => {
    slotsModule = new SlotsModule();
  });

  it('should create an instance', () => {
    expect(slotsModule).toBeTruthy();
  });
});
