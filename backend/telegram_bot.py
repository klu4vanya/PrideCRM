import os
import requests
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# Загружаем переменные окружения
load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
MINI_APP_URL = os.getenv("MINI_APP_URL", "https://localhost:3000/mini-app")
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000/api")

if not BOT_TOKEN:
    raise ValueError("❌ TELEGRAM_BOT_TOKEN not set in .env")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /start для запуска Mini App"""
    user = update.effective_user
    
    # Регистрируем пользователя в системе через API
    telegram_data = {
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }
    
    try:
        # Авторизуем пользователя через API
        response = requests.post(
            f"{API_BASE_URL}/auth/telegram/",
            json={"telegram_data": telegram_data}
        )
        
        if response.status_code == 200:
            # Показываем кнопку для открытия Mini App
            keyboard = [[
                InlineKeyboardButton(
                    "🎮 Открыть Poker CRM", 
                    web_app={"url": MINI_APP_URL}
                )
            ]]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await update.message.reply_text(
                f"👋 Добро пожаловать, {user.first_name or 'игрок'}!\n\n"
                "🎯 Poker CRM поможет вам:\n"
                "• Смотреть расписание игр\n"
                "• Регистрироваться на турниры\n"
                "• Следить за своим рейтингом\n"
                "• Узнавать результаты\n\n"
                "Нажмите кнопку ниже, чтобы открыть приложение!",
                reply_markup=reply_markup
            )
        else:
            await update.message.reply_text(
                "❌ Ошибка при авторизации. Попробуйте позже."
            )
            
    except Exception as e:
        print(f"Error: {e}")
        await update.message.reply_text(
            f"⚠️ Сервис временно недоступен. Попробуйте позже.\n{e}"
        )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /help"""
    help_text = (
        "🤖 Команды бота Poker CRM:\n\n"
        "/start - Начать работу с ботом\n"
        "/help - Показать эту справку\n\n"
        "📱 После запуска бота вы получите доступ к:\n"
        "• Расписанию турниров\n"
        "• Рейтингу игроков\n"
        "• Личному профилю\n"
        "• Результатам игр\n\n"
        "По вопросам обращайтесь к администратору."
    )
    await update.message.reply_text(help_text)

def main():
    """Запуск Telegram-бота"""
    print("🤖 Запуск Telegram-бота Poker CRM...")
    
    try:
        app = ApplicationBuilder().token(BOT_TOKEN).build()
        
        # Добавляем обработчики команд
        app.add_handler(CommandHandler("start", start))
        app.add_handler(CommandHandler("help", help_command))
        
        print("✅ Бот успешно запущен. Ожидание сообщений...")
        app.run_polling()
        
    except Exception as e:
        print(f"❌ Ошибка запуска бота: {e}")

if __name__ == "__main__":
    main()