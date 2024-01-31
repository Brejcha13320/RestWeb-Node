-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR NOT NULL,
    "completedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
