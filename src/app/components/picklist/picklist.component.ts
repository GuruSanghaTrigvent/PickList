import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionList, MatListOption } from '@angular/material/list';

@Component({
  selector: 'app-picklist',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './picklist.component.html',
  styleUrls: ['./picklist.component.css']
})
export class PicklistComponent {
  @ViewChild('availableList') availableList!: MatSelectionList;
  @ViewChild('selectedList') selectedList!: MatSelectionList;

  availableItems: string[] = [
    'Bamboo Watch', 'Black Watch', 'Blue Band', 'Blue T-Shirt',
    'Bracelet', 'Brown Purse'
  ];
  selectedItems: string[] = [];

  selectedAvailable: string[] = [];
  selectedSelected: string[] = [];

  lastSelectedIndex: number | null = null;
  selectionStartIndex: number | null = null;
  isShiftPressed: boolean = false;
  activeList: 'available' | 'selected' = 'available';
  lastDirection: number = 0;

  // Add a new property to store the list references
  private listElements: { [key: string]: MatSelectionList } = {};

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      this.isShiftPressed = true;
    }

    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && this.isShiftPressed) {
      event.preventDefault();
      this.handleArrowSelection(event);
    }
  }

  onKeyup(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      this.isShiftPressed = false;
      // Keep the last selection range as the new starting point
      this.selectionStartIndex = this.lastSelectedIndex;
      this.lastDirection = 0;
    }
  }

  handleArrowSelection(event: KeyboardEvent) {
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    const currentList = this.activeList === 'available' ? this.availableItems : this.selectedItems;
    
    // Don't proceed if the list is empty
    if (currentList.length === 0) {
      return;
    }

    const targetList = this.activeList === 'available' ? this.availableList : this.selectedList;
    if (!targetList) return;

    const options = targetList.options.toArray();
    
    let currentIndex = this.getCurrentIndex(options);
    
    if (currentIndex === -1) {
      currentIndex = direction === 1 ? 0 : currentList.length - 1;
      this.selectionStartIndex = currentIndex;
    }

    // Initialize selectionStartIndex if it's null
    if (this.selectionStartIndex === null) {
      this.selectionStartIndex = currentIndex;
    }

    const nextIndex = Math.max(0, Math.min(currentList.length - 1, currentIndex + direction));

    if (nextIndex >= 0 && nextIndex < currentList.length) {
      if (this.isShiftPressed) {
        // If direction changed or this is the first selection
        if (this.lastDirection !== direction) {
          if (this.lastDirection !== 0) { // If not the first selection
            // Unselect in the previous direction
            this.unselectInDirection(options, currentIndex, -this.lastDirection);
          }
          this.lastDirection = direction;
        }

        // Update selection based on the selection start point
        this.updateSelectionRange(options, this.selectionStartIndex, nextIndex);
        this.lastSelectedIndex = nextIndex;
      } else {
        // Single selection without shift
        options.forEach(option => option.selected = false);
        options[nextIndex].selected = true;
        this.lastSelectedIndex = nextIndex;
        this.selectionStartIndex = nextIndex;
      }

      this.updateSelectionModel(options);
    }
  }

  getCurrentIndex(options: MatListOption[]): number {
    const selectedOptions = options.filter(opt => opt.selected);
    if (selectedOptions.length === 0) return -1;
    
    return this.lastSelectedIndex !== null ? 
      this.lastSelectedIndex : 
      options.indexOf(selectedOptions[selectedOptions.length - 1]);
  }

  updateSelectionRange(options: MatListOption[], start: number, end: number) {
    // Clear all selections first
    options.forEach(option => option.selected = false);
    
    // Then select the range
    const [minIndex, maxIndex] = start < end ? [start, end] : [end, start];
    for (let i = minIndex; i <= maxIndex; i++) {
      options[i].selected = true;
    }
  }

  unselectInDirection(options: MatListOption[], fromIndex: number, direction: number) {
    const targetIndex = direction > 0 ? 
      Math.min(options.length - 1, fromIndex + direction) : 
      Math.max(0, fromIndex + direction);

    if (direction > 0) {
      for (let i = fromIndex; i <= targetIndex; i++) {
        options[i].selected = false;
      }
    } else {
      for (let i = fromIndex; i >= targetIndex; i--) {
        options[i].selected = false;
      }
    }
  }

  updateSelectionModel(options: MatListOption[]) {
    const selectedValues = options
      .filter(option => option.selected)
      .map(option => option.value);

    if (this.activeList === 'available') {
      this.selectedAvailable = selectedValues;
    } else {
      this.selectedSelected = selectedValues;
    }
  }

  onListFocus(listType: 'available' | 'selected') {
    // Only update if actually changing lists
    if (this.activeList !== listType) {
      this.activeList = listType;
      this.resetSelectionState();
    }
  }

  // Handle selection change in available items list
  onAvailableSelectionChange(event: any) {
    // You can handle any additional logic when the selection changes
    console.log('Available Items Selection Changed:', event);
  }

  // Handle selection change in selected items list
  onSelectedSelectionChange(event: any) {
    // You can handle any additional logic when the selection changes
    console.log('Selected Items Selection Changed:', event);
  }

  // Move selected items from available to selected
  moveSelectedToRight() {
    if (this.selectedAvailable.length === 0) return;
    
    this.selectedItems.push(...this.selectedAvailable);
    this.availableItems = this.availableItems.filter(i => !this.selectedAvailable.includes(i));
    this.selectedAvailable = [];
    this.resetSelectionState();
    
    // Switch focus to the selected list
    setTimeout(() => {
      this.activeList = 'selected';
      this.selectedList?.focus();
    });
  }

  // Move selected items from selected to available
  moveSelectedToLeft() {
    if (this.selectedSelected.length === 0) return;
    
    this.availableItems.push(...this.selectedSelected);
    this.selectedItems = this.selectedItems.filter(i => !this.selectedSelected.includes(i));
    this.selectedSelected = [];
    this.resetSelectionState();
    
    // Switch focus to the available list
    setTimeout(() => {
      this.activeList = 'available';
      this.availableList?.focus();
    });
  }

  // Move all items from available to selected
  moveAllToRight() {
    if (this.availableItems.length === 0) return;
    
    this.selectedItems.push(...this.availableItems);
    this.availableItems = [];
    this.selectedAvailable = [];
    this.resetSelectionState();
    
    // Switch focus to the selected list
    setTimeout(() => {
      this.activeList = 'selected';
      this.selectedList?.focus();
    });
  }

  // Move all items from selected to available
  moveAllToLeft() {
    if (this.selectedItems.length === 0) return;
    
    this.availableItems.push(...this.selectedItems);
    this.selectedItems = [];
    this.selectedSelected = [];
    this.resetSelectionState();
    
    // Switch focus to the available list
    setTimeout(() => {
      this.activeList = 'available';
      this.availableList?.focus();
    });
  }

  // Move an item up in the selected list
  moveUp(list: string[], selection: string[]) {
    selection.forEach(item => {
      const i = list.indexOf(item);
      if (i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
    });
  }

  // Move an item down in the selected list
  moveDown(list: string[], selection: string[]) {
    [...selection].reverse().forEach(item => {
      const i = list.indexOf(item);
      if (i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
    });
  }

  // Add this new method to reset selection state
  private resetSelectionState() {
    this.lastSelectedIndex = null;
    this.selectionStartIndex = null;
    this.lastDirection = 0;
    this.isShiftPressed = false;
  }

  // Add method to check if a list is focused
  isListFocused(listType: 'available' | 'selected'): boolean {
    return this.activeList === listType;
  }

  moveToTop(list: string[], selection: string[]) {
    // Remove selected items from their current positions
    const itemsToMove = selection.filter(item => list.includes(item));
    const remaining = list.filter(item => !selection.includes(item));
    // Place selected items at the start
    list.length = 0;
    list.push(...itemsToMove, ...remaining);
  }

  moveToBottom(list: string[], selection: string[]) {
    // Remove selected items from their current positions
    const itemsToMove = selection.filter(item => list.includes(item));
    const remaining = list.filter(item => !selection.includes(item));
    // Place selected items at the end
    list.length = 0;
    list.push(...remaining, ...itemsToMove);
  }
}
