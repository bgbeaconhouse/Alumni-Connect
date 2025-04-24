/*
  Warnings:

  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("userId", "postId");
DROP SEQUENCE "Like_id_seq";
