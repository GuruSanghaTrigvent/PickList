import { Component } from '@angular/core';
import { Todo } from '../../Todo';
import { TodoItemListComponent } from '../todo-item-list/todo-item-list.component';
import { CommonModule } from '@angular/common';
import { AddTodoComponent } from '../add-todo/add-todo.component';
@Component({
  selector: 'app-todolist',
  imports: [CommonModule,TodoItemListComponent, AddTodoComponent],
  templateUrl: './todolist.component.html',
  styleUrl: './todolist.component.css'
})
export class TodolistComponent {
todos: Todo[];
constructor(){
  this.todos = [
    {
      sno: 1,
      title: "This is title1",
      desc: "This is description"
    },
    {
      sno: 2,
      title: "This is title2",
      desc: "This is description"
    },
    {
      sno: 3,
      title: "This is title3",
      desc: "This is description"
    }
    ]
  }
  onDeleteTodo(todo: Todo) {
    const index = this.todos.indexOf(todo);
    if (index > -1) {
      this.todos.splice(index, 1);
    }
  }
  onAddTodo(todo: Todo) {
    this.todos.push(todo);
  }
}
// Compare this snippet from src/app/components/todolist/todolist.component.html:
