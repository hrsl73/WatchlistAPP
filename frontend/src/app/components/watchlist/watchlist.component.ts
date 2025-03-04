import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WatchlistService } from '../../services/watchlist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface WatchlistItem {
  _id?: string;
  id?: string;
  type: 'movie' | 'book';
  title: string;
  genre: string;
  status: 'pending' | 'watched';
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-watchlist',
  standalone: true,
  template: `
    <div class="watchlist-container">
      <!-- Form for Adding Items -->
      <form (submit)="addToWatchlist()">
        <label>Title:</label>
        <input type="text" [(ngModel)]="newItem.title" name="title" required />

        <label>Genre:</label>
        <select [(ngModel)]="newItem.genre" name="genre" required>
          <option *ngFor="let genre of genres" [value]="genre">{{ genre }}</option>
        </select>

        <label>Status:</label>
        <select [(ngModel)]="newItem.status" name="status" required>
          <option *ngFor="let option of statusOptions" [value]="option.value">{{ option.label }}</option>
        </select>

        <button type="submit">Add</button>
      </form>

      <!-- Watchlist Grid Container -->
      <div class="watchlist">
        <div *ngFor="let item of watchlist" class="watchlist-item">
          <div class="item-content">
            <h3 class="item-title">{{ item.title }}</h3>
            <div class="item-details">
              <p><strong>Type:</strong> {{ item.type }}</p>
              <p><strong>Genre:</strong> {{ item.genre }}</p>
              <p><strong>Status:</strong> <span class="status-badge" [ngClass]="item.status">
                {{ getStatusLabel(item.status) }}
              </span></p>
              <p><strong>Created:</strong> {{ item.createdAt | date:'medium' }}</p>
              <p><strong>Updated:</strong> {{ item.updatedAt | date:'medium' }}</p>
              <p><strong>ID:</strong> {{ item._id || item.id }}</p>
            </div>
          </div>
          <div class="watchlist-item-actions">
            <button class="update-btn" (click)="updateItemStatus(item)" [disabled]="item.status === 'watched'">
              {{ item.status === 'pending' ? (isMoviesPage ? 'Mark as Watched' : 'Mark as Read') : (isMoviesPage ? 'Already Watched' : 'Already Read') }}
            </button>
            <button class="edit-btn" (click)="enableEdit(item)">Edit</button>
            <button class="delete-btn" (click)="deleteItem(item._id || item.id)">Delete</button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div class="modal" *ngIf="editMode">
        <div class="modal-content">
          <h3>Edit Item</h3>
          <form (submit)="updateItem()">
            <label>Title:</label>
            <input type="text" [(ngModel)]="editItem.title" name="title" required />

            <label>Genre:</label>
            <select [(ngModel)]="editItem.genre" name="genre" required>
              <option *ngFor="let genre of genres" [value]="genre">{{ genre }}</option>
            </select>

            <label>Status:</label>
            <select [(ngModel)]="editItem.status" name="status" required>
              <option *ngFor="let option of statusOptions" [value]="option.value">{{ option.label }}</option>
            </select>

            <div class="modal-actions">
              <button type="submit" class="save-btn">Save</button>
              <button type="button" class="cancel-btn" (click)="cancelEdit()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .watchlist-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    label {
      font-weight: bold;
    }

    input, select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }

    button[type="submit"] {
      background: #4CAF50;
      color: white;
    }

    .watchlist {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .watchlist-item {
      background: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .item-title {
      margin: 0 0 10px 0;
      color: #333;
    }

    .item-details {
      margin-bottom: 15px;
    }

    .item-details p {
      margin: 5px 0;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9em;
    }

    .status-badge.pending {
      background: #ffd700;
      color: #000;
    }

    .status-badge.watched {
      background: #4CAF50;
      color: white;
    }

    .watchlist-item-actions {
      display: flex;
      gap: 10px;
    }

    .update-btn {
      background: #2196F3;
      color: white;
    }

    .edit-btn {
      background: #FF9800;
      color: white;
    }

    .delete-btn {
      background: #f44336;
      color: white;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .save-btn {
      background: #4CAF50;
      color: white;
    }

    .cancel-btn {
      background: #9e9e9e;
      color: white;
    }
  `],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class WatchlistComponent {
  type: 'movie' | 'book' = 'movie';
  isMoviesPage: boolean = false;
  watchlist: WatchlistItem[] = [];
  genres: string[] = [];
  statusOptions: { value: string; label: string }[] = [];
  newItem: Omit<WatchlistItem, '_id' | 'id' | 'createdAt' | 'updatedAt'> = { 
    type: 'movie',
    title: '', 
    genre: '', 
    status: 'pending' 
  };
  editMode: boolean = false;
  editItem: WatchlistItem = { 
    type: 'movie',
    title: '', 
    genre: '', 
    status: 'pending' 
  };

  constructor(private route: ActivatedRoute, private watchlistService: WatchlistService) {}

  ngOnInit() {
    this.route.url.subscribe(urlSegments => {
      const path = urlSegments.map(segment => segment.path).join('/');
      this.isMoviesPage = path.includes('movies');
      this.type = this.isMoviesPage ? 'movie' : 'book';
      
      // Set genres based on section
      this.genres = this.isMoviesPage
        ? ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror']
        : ['Fiction', 'Non-Fiction', 'Mystery', 'Fantasy', 'Biography'];

      // Set status options based on section
      this.statusOptions = this.isMoviesPage
        ? [
            { value: 'pending', label: 'Pending' },
            { value: 'watched', label: 'Watched' }
          ]
        : [
            { value: 'pending', label: 'Yet to Read' },
            { value: 'watched', label: 'Already Read' }
          ];

      this.newItem.genre = this.genres[0];
      this.newItem.status = 'pending';
      this.loadWatchlist();
    });
  }

  loadWatchlist() {
    if (!this.type) return;

    this.watchlistService.getWatchlist(this.type).subscribe({
      next: (data) => {
        console.log('✅ Watchlist loaded - Full data structure:', JSON.stringify(data, null, 2));
        this.watchlist = data;
      },
      error: (err) => console.error('❌ Error loading watchlist:', err)
    });
  }

  addToWatchlist() {
    if (this.newItem.title.trim()) {
      const itemToAdd = {
        type: this.type,
        title: this.newItem.title.trim(),
        genre: this.newItem.genre,
        status: this.newItem.status
      };
      
      console.log('Adding new item:', itemToAdd);
      this.watchlistService.addToWatchlist(itemToAdd).subscribe({
        next: (res) => {
          console.log('✅ Item added:', res);
          this.newItem = { 
            type: this.type,
            title: '', 
            genre: this.genres[0], 
            status: 'pending'
          };
          this.loadWatchlist();
        },
        error: (err) => console.error('❌ Error adding item:', err)
      });
    }
  }

  deleteItem(id?: string) {
    console.log('Attempting to delete item with id:', id);
    // Get either _id or id property
    if (!id) {
      console.error("❌ Cannot delete: ID is undefined");
      return;
    }
    
    this.watchlistService.removeFromWatchlist(id).subscribe({
      next: () => {
        console.log(`✅ Deleted item: ${id}`);
        this.loadWatchlist();
      },
      error: (err) => console.error('❌ Error deleting item:', err)
    });
  }

  enableEdit(item: WatchlistItem) {
    this.editMode = true;
    this.editItem = {
      ...item,
      id: item._id || item.id
    };
  }

  cancelEdit() {
    this.editMode = false;
    this.editItem = { 
      type: this.type,
      title: '', 
      genre: '', 
      status: 'pending' 
    };
  }

  updateItem() {
    if (this.editItem.title.trim()) {
      const itemToUpdate = {
        ...this.editItem,
        title: this.editItem.title.trim(),
        genre: this.editItem.genre,
        status: this.editItem.status
      };
      
      console.log('Updating item:', itemToUpdate);
      this.watchlistService.updateWatchlist(itemToUpdate).subscribe({
        next: () => {
          console.log('✅ Item updated:', itemToUpdate);
          this.editMode = false;
          this.loadWatchlist();
        },
        error: (err) => console.error('❌ Error updating item:', err)
      });
    }
  }

  updateItemStatus(item: WatchlistItem) {
    if (item.status === 'pending') {
      const updatedItem: WatchlistItem = {
        ...item,
        status: 'watched' as const,
        title: item.title.trim(),
        genre: item.genre
      };
      
      console.log('Updating item status:', updatedItem);
      this.watchlistService.updateWatchlist(updatedItem).subscribe({
        next: () => {
          console.log('✅ Item status updated to watched:', updatedItem);
          this.loadWatchlist();
        },
        error: (err) => console.error('❌ Error updating item status:', err)
      });
    }
  }

  getStatusLabel(status: string): string {
    return this.statusOptions.find(opt => opt.value === status)?.label || status;
  }
}
