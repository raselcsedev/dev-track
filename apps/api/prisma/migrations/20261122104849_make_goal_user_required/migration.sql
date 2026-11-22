/*
  Warnings:

  - Made the column `userId` on table `goal` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `goal` DROP FOREIGN KEY `Goal_userId_fkey`;

-- DropIndex
DROP INDEX `Goal_userId_fkey` ON `goal`;

-- AlterTable
ALTER TABLE `goal` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Goal` ADD CONSTRAINT `Goal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
