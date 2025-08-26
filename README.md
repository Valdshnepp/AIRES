# AIRES - Инновационная научная команда

Сайт команды молодых учёных, специализирующейся в решении задач с применением современных информационных технологий и искусственного интеллекта.


Настройка формы контактов

Вариант 1: Formspree (Рекомендуется)

1. Перейдите на [formspree.io](https://formspree.io)
2. Создайте бесплатный аккаунт
3. Создайте новую форму
4. Скопируйте ID формы (например: `xayzqjvj`)
5. Замените в `index.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

Вариант 2: Netlify Forms

Если используете Netlify для хостинга:
```html
<form name="contact" netlify>
```

Вариант 3: EmailJS

Для отправки через JavaScript:
1. Зарегистрируйтесь на [emailjs.com](https://emailjs.com)
2. Настройте шаблон email
3. Обновите JavaScript код

Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/ivan170403-dev/AIRES.git
cd AIRES
```

2. Откройте `index.html` в браузере или используйте локальный сервер:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

Цветовая схема
Основные цвета определены в CSS переменных:
```css
--primary-color: #00d4ff;
--secondary-color: #0099cc;
--background-dark: #0a0a0a;
--background-light: #1a1a1a;
```

Шрифты
Используется шрифт Inter от Google Fonts. Для изменения замените в `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

Структура проекта

```
AIRES/
├── index.html          # Главная страница
├── styles.css          # Стили
├── script.js           # JavaScript функциональность
├── images/             # Изображения
│   ├── logo.png
│   ├── favicon.png
│   └── ...
├── videos/             # Видео файлы
│   ├── robotfone.mp4
│   └── seysmik.mp4
└── README.md           # Документация
```

Развертывание

### GitHub Pages
1. Загрузите код в репозиторий
2. В настройках репозитория включите GitHub Pages
3. Выберите ветку для развертывания

Netlify
1. Подключите GitHub репозиторий
2. Настройте домен (опционально)
3. Включите формы в настройках

Vercel
1. Подключите GitHub репозиторий
2. Автоматическое развертывание при push

Поддержка

По вопросам работы сайта или настройки форм обращайтесь:
- Email: aires.team.nsk@gmail.com
- GitHub: [ivan170403-dev](https://github.com/ivan170403-dev)

Лицензия

Проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

---

**AIRES** - Инновационная научная команда 🚀

