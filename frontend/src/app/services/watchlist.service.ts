import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private apiUrl = 'http://localhost:5001/api/watchlist'; 

  constructor(private http: HttpClient) {}

  getWatchlist(type: string): Observable<WatchlistItem[]> {
    return this.http.get<WatchlistItem[]>(`${this.apiUrl}/${type}`);
  }

  addToWatchlist(item: Omit<WatchlistItem, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Observable<WatchlistItem> {
    console.log('Sending item to add:', item);
    return this.http.post<WatchlistItem>(this.apiUrl, item);
  }

  removeFromWatchlist(id: string): Observable<{ message: string; deletedItem: WatchlistItem }> {
    return this.http.delete<{ message: string; deletedItem: WatchlistItem }>(`${this.apiUrl}/${id}`);
  }

  updateWatchlist(item: WatchlistItem): Observable<WatchlistItem> {
    console.log('Sending item to update:', item);
    return this.http.put<WatchlistItem>(`${this.apiUrl}/${item._id || item.id}`, item);
  }
}
