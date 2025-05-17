import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  public currentUser$: Observable<AppUser | null> = this.currentUserSubject.asObservable();

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        };
        this.currentUserSubject.next(appUser);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  getCurrentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  async register(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    return signOut(this.auth);
  }
}
