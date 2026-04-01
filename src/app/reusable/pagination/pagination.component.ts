import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgForOf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [NgIf, NgForOf, CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() lastPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();

  changePage(page: number) {
    if (page >= 1 && page <= this.lastPage) {
      this.pageChange.emit(page);
    }
  }

  pages(): number[] {
    return Array.from({ length: this.lastPage}, (_, i) => i + 1);
  }
}
