import os
import requests
from dotenv import load_dotenv
from telegram import Update, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    filters
)

# Загружаем переменные окружения
load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
API_BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:8000/api/")

if not BOT_TOKEN:
    raise ValueError("❌ TELEGRAM_BOT_TOKEN not set in .env")


# ============================================================
# Handlers
# ============================================================

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /start"""
    user = update.effective_user
    keyboard = [[KeyboardButton("Авторизоваться 🔐")]]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

    await update.message.reply_text(
        f"👋 Привет, {user.first_name or 'игрок'}!\n"
        "Я помогу тебе авторизоваться на сайте Poker CRM.\n\n"
        "Нажми кнопку ниже, чтобы пройти авторизацию.",
        reply_markup=reply_markup
    )


async def auth(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Авторизация пользователя через Telegram"""
    user = update.effective_user
    data = {
        "telegram_data": {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
    }

    try:
        headers = {"Authorization": f"Bearer {os.getenv('TELEGRAM_BOT_TOKEN')}"}
        response = requests.post(f"{API_BASE_URL}auth/telegram/callback/", json=data, headers=headers)

        if response.status_code == 200:
            info = response.json()
            token = info.get("token")
            if token:
                await update.message.reply_text(
                    "✅ Авторизация успешна!\n"
                    f"Перейдите по ссылке, чтобы войти на сайт:\n\n"
                    f"http://localhost:3000/auth?token={token}"
                )
        else:
            await update.message.reply_text(
                f"❌ Ошибка авторизации:\n{response.text[:2000]}"  # ограничим длину для безопасности
            )
    except Exception as e:
        await update.message.reply_text(f"⚠️ Ошибка соединения с сервером: {str(e)[:2000]}")



async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Доступные команды:\n"
        "/start — начало\n"
        "/help — помощь\n"
        "Кнопка 'Авторизоваться' — для авторизации через сайт"
    )


# ============================================================
# MAIN
# ============================================================

def main():
    """Запуск Telegram-бота"""
    print("🤖 Запуск Telegram-бота...")
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(MessageHandler(filters.Regex("Авторизоваться"), auth))

    print("✅ Бот успешно запущен. Ожидание сообщений...")
    app.run_polling()


if __name__ == "__main__":
    main()
