import { Rule } from '../types/rule';

// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';

const DB_NAME = 'holo-rules';
const DB_VERSION = 1;
const STORE_NAME = 'rules';

// In-memory storage for server-side
let memoryRules: Rule[] = [];

class RuleStorage {
  private db: IDBDatabase | null = null;

  private async openDB(): Promise<IDBDatabase> {
    if (!isBrowser) {
      throw new Error('IndexedDB is only available in the browser');
    }

    if (this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject(new Error('Failed to open IndexedDB'));
      };
    });
  }

  async getAll(): Promise<Rule[]> {
    if (!isBrowser) {
      return memoryRules;
    }

    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to get rules'));
      };
    });
  }

  async saveAll(rules: Rule[]): Promise<void> {
    if (!isBrowser) {
      memoryRules = rules;
      return;
    }

    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // Clear existing rules
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        // Save new rules
        let completed = 0;
        const total = rules.length;

        if (total === 0) {
          resolve();
          return;
        }

        rules.forEach(rule => {
          const addRequest = store.add(rule);

          addRequest.onsuccess = () => {
            completed++;
            if (completed === total) {
              resolve();
            }
          };

          addRequest.onerror = () => {
            reject(new Error('Failed to save rule'));
          };
        });
      };

      clearRequest.onerror = () => {
        reject(new Error('Failed to clear existing rules'));
      };
    });
  }

  async getById(id: string): Promise<Rule | null> {
    if (!isBrowser) {
      return memoryRules.find(rule => rule.id === id) || null;
    }

    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error('Failed to get rule by id'));
      };
    });
  }

  async add(rule: Rule): Promise<Rule> {
    if (!isBrowser) {
      const newRule = { ...rule, id: Date.now().toString() };
      memoryRules.push(newRule);
      return newRule;
    }

    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(rule);

      request.onsuccess = () => {
        resolve({ ...rule, id: request.result as string });
      };

      request.onerror = () => {
        reject(new Error('Failed to add rule'));
      };
    });
  }

  async update(rule: Rule): Promise<Rule> {
    if (!isBrowser) {
      const index = memoryRules.findIndex(r => r.id === rule.id);
      if (index !== -1) {
        memoryRules[index] = rule;
      }
      return rule;
    }

    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(rule);

      request.onsuccess = () => {
        resolve(rule);
      };

      request.onerror = () => {
        reject(new Error('Failed to update rule'));
      };
    });
  }

  async delete(id: string): Promise<void> {
    if (!isBrowser) {
      memoryRules = memoryRules.filter(rule => rule.id !== id);
      return;
    }

    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to delete rule'));
      };
    });
  }

  async clear(): Promise<void> {
    if (!isBrowser) {
      memoryRules = [];
      return;
    }

    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to clear rules'));
      };
    });
  }
}

export const ruleStorage = new RuleStorage();