import { Component,Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../Todo';

@Component({
  selector: 'app-todo-item-list',
  imports: [],
  templateUrl: './todo-item-list.component.html',
  styleUrl: './todo-item-list.component.css'
})
export class TodoItemListComponent {
  @Input() todo: Todo = new Todo();
  @Output() deleteTodo: EventEmitter<Todo> = new EventEmitter();

  onDelete(todo:Todo){
    this.deleteTodo.emit(todo);
    console.log("Delete button clicked for todo:", todo);
  }
}
