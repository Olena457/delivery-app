-- CreateTable
CREATE TABLE "telegram_messages" (
    "id" SERIAL NOT NULL,
    "chat_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telegram_messages_pkey" PRIMARY KEY ("id")
);
