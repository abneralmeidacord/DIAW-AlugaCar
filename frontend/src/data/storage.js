import { createInitialDB } from './demo.js';
const DATABASE_KEY = 'alugacar.visual.v1';
const SESSION_KEY = 'alugacar.session';
export function readDatabase() {
  try {
    const database = JSON.parse(localStorage.getItem(DATABASE_KEY));
    if (database?.users?.length && Array.isArray(database.orders)) return database;
  } catch {}
  return createInitialDB();
}
export function saveDatabase(database) {
  localStorage.setItem(DATABASE_KEY, JSON.stringify(database));
}
export function readSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}
export function saveSession(session) {
  try {
    if (session) sessionStorage.setItem(SESSION_KEY, session);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}
