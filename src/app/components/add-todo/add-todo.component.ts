import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../Todo';
@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.css'
})
export class AddTodoComponent {
  @Input() todos: Todo[] = []; // <-- This line is REQUIRED
  @Output() addTodo: EventEmitter<Todo> = new EventEmitter();
  title: string = "";
  desc: string = "";


  submitAddTodo() {
    const todo = {
      title: this.title,
      desc: this.desc,
      sno: this.todos.length + 1,
    };
    this.addTodo.emit(todo);
    console.log("Add Todo button clicked");
  }
}
