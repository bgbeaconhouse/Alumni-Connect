/*
  Warnings:

  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
CREATE SEQUENCE like_id_seq;
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
ALTER COLUMN "id" SET DEFAULT nextval('like_id_seq'),
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE like_id_seq OWNED BY "Like"."id";
