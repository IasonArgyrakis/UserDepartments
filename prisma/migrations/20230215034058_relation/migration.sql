-- DropForeignKey
ALTER TABLE "UserDepartment" DROP CONSTRAINT "UserDepartment_departmentId_fkey";

-- AddForeignKey
ALTER TABLE "UserDepartment" ADD CONSTRAINT "UserDepartment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
