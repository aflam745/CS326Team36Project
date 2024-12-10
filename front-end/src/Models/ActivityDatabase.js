export class ActivityDatabase {
    constructor(dbName) {
      this.dbName = dbName;
    }

    // Method to open the database
    async openDatabase() {
      return new Promise((resolve, reject) => {
        if (this.dbName === "") {
          reject("Database name cannot be empty.");
          return;
        }

        let request = indexedDB.open(this.dbName, 1);
        request.onupgradeneeded = function (event) {
          let db = event.target.result;
          if (!db.objectStoreNames.contains("activities")) {
            db.createObjectStore("activities", { keyPath: "id" });
          }
        };
        request.onsuccess = function (event) {
          resolve(event.target.result);
        };
        request.onerror = function (event) {
          reject(event.target.error);
        };
      });
    }

    // Method to add an activity
    async addActivity(activity) {
      const db = await this.openDatabase();
      const tx = db.transaction("activities", "readwrite");
      const store = tx.objectStore("activities");
      store.add(activity);

      return new Promise((resolve, reject) => {
        tx.oncomplete = function () {
          resolve("Activity added successfully!");
        };
        tx.onerror = function () {
          reject("Failed to add activity.");
        };
      });
    }

    // Method to get all activities
    async getAllActivity() {
      const db = await this.openDatabase();
      const tx = db.transaction("activities", "readwrite");
      const store = tx.objectStore("activities");

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = function (event) {
          resolve(event.target.result)
        };
        request.onerror = function (event) {
          reject(event.target.error);
        };
      });
    }

    //Method to get an activity by ID
    async getActivity(activityID) {
        const db = await this.openDatabase();
        const tx = db.transaction("activities", "readwrite");
        const store = tx.objectStore("activities");

        return new Promise((resolve, reject) => {
          const request = store.get(activityID);
          request.onsuccess = function (event) {
            resolve(event.target.result)
          };
          request.onerror = function (event) {
            reject(event.target.error);
          };
        });
    }

    // Method to check if an activity exists by its ID
    async activityExists(activityID) {
        const db = await this.openDatabase();
        const tx = db.transaction("activities", "readonly");
        const store = tx.objectStore("activities");

        return new Promise((resolve, reject) => {
            const request = store.get(activityID);
            request.onsuccess = function (event) {
                const result = event.target.result;
                if (result !== undefined) {
                resolve(true); // Activity exists
                } else {
                resolve(false); // Activity does not exist
                }
            };
            request.onerror = function (event) {
                reject(event.target.error);
            };
        });
    }

    // Method to delete a activity by its ID
    async deleteActivity(activityID) {
      const db = await this.openDatabase();
      const tx = db.transaction("activities", "readwrite");
      const store = tx.objectStore("activities");

      store.delete(activityID);

      return new Promise((resolve, reject) => {
        tx.oncomplete = function () {
          resolve("Activity deleted successfully!");
        };
        tx.onerror = function () {
          reject("Activity deletion failed!");
        };
      });
    }

    async deleteAllEntries() {
      const db = await this.openDatabase();
      const tx = db.transaction("activities", "readwrite");
      const store = tx.objectStore("activities");

      store.clear();
      return new Promise((resolve, reject) => {
        tx.oncomplete = function () {
          resolve("All entries deleted successfully!");
        };
        tx.onerror = function () {
          reject("Entries deletion failed!");
        };
      });
    }
  }
