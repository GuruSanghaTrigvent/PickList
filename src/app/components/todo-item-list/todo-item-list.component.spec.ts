import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemListComponent } from './todo-item-list.component';

describe('TodoItemListComponent', () => {
  let component: TodoItemListComponent;
  let fixture: ComponentFixture<TodoItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
