/*
  Warnings:

  - You are about to drop the `_DepartmentToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DepartmentToUser" DROP CONSTRAINT "_DepartmentToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_DepartmentToUser" DROP CONSTRAINT "_DepartmentToUser_B_fkey";

-- DropTable
DROP TABLE "_DepartmentToUser";

-- CreateTable
CREATE TABLE "UserDepartment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "departmentId" INTEGER,

    CONSTRAINT "UserDepartment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserDepartment" ADD CONSTRAINT "UserDepartment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDepartment" ADD CONSTRAINT "UserDepartment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
