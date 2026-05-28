/**
 * ITERATOR PATTERN (React/JS Implementation)
 * Gestiunea parcurgerii unei colecții de produse (paginare, next, prev)
 * fără a expune structura internă a colecției.
 */

export class ProductIterator {
  constructor(items, itemsPerPage) {
    this.items = items;
    this.itemsPerPage = itemsPerPage;
    this.currentIndex = 0;
  }

  setPage(page) {
    this.currentIndex = (page - 1) * this.itemsPerPage;
  }

  getCurrentPage() {
    return Math.floor(this.currentIndex / this.itemsPerPage) + 1;
  }

  getTotalPages() {
    return Math.ceil(this.items.length / this.itemsPerPage);
  }

  getCurrentItems() {
    return this.items.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
  }

  hasNext() {
    return this.currentIndex + this.itemsPerPage < this.items.length;
  }

  hasPrev() {
    return this.currentIndex > 0;
  }

  next() {
    if (this.hasNext()) {
      this.currentIndex += this.itemsPerPage;
    }
    return this.getCurrentItems();
  }

  prev() {
    if (this.hasPrev()) {
      this.currentIndex -= this.itemsPerPage;
    }
    return this.getCurrentItems();
  }

  getVisiblePages() {
    const total = this.getTotalPages();
    const current = this.getCurrentPage();
    const delta = 1;
    const range = [];
    
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (current - delta > 2) {
      range.unshift("...");
    }
    if (current + delta < total - 1) {
      range.push("...");
    }
    range.unshift(1);
    if (total > 1) {
      range.push(total);
    }
    return range;
  }
}
