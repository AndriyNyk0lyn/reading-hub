"use client";

import Dexie, { type Table } from "dexie";

import type { AppSettings, SavedArticle } from "@/types/articles";

class ReadingHubDatabase extends Dexie {
  articles!: Table<SavedArticle, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super("offlineReadingHub");
    this.version(1).stores({
      articles: "id, savedAt, title, tags",
      settings: "name",
    });
  }
}

let clientDb: ReadingHubDatabase | null = null;

export function getDb(): ReadingHubDatabase {
  if (!clientDb) {
    clientDb = new ReadingHubDatabase();
  }
  return clientDb;
}

