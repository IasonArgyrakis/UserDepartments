-- AlterTable
ALTER TABLE "UserDepartment" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserDepartment_pkey" PRIMARY KEY ("id");
