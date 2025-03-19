/*
  Warnings:

  - Added the required column `host` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduler` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomId" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "host" TEXT NOT NULL,
    "scheduler" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("createdAt", "endTime", "id", "roomId", "startTime") SELECT "createdAt", "endTime", "id", "roomId", "startTime" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE TABLE "new_Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "features" TEXT,
    "notes" TEXT,
    "image" TEXT,
    "status" TEXT NOT NULL
);
INSERT INTO "new_Room" ("capacity", "features", "id", "image", "name", "notes", "number") SELECT "capacity", "features", "id", "image", "name", "notes", "number" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_number_key" ON "Room"("number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
