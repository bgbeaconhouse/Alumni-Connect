/*
  Warnings:

  - You are about to drop the column `imageContent` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imageContent",
ADD COLUMN     "imageContents" TEXT[];
