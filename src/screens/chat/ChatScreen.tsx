<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Чек-лист запуска MVP: Медицинское приложение</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f4f7f9;
            color: #333;
        }
        .container {
            max-width: 900px;
            margin: auto;
            background: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        h1, h2, h3 {
            color: #2c3e50;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
        }
        .phase {
            margin-bottom: 40px;
        }
        .category {
            margin-top: 20px;
            padding-left: 20px;
            border-left: 3px solid #3498db;
        }
        ul {
            list-style-type: none;
            padding-left: 0;
        }
        li {
            margin-bottom: 12px;
            display: flex;
            align-items: flex-start;
        }
        input[type="checkbox"] {
            margin-right: 15px;
            margin-top: 5px;
            min-width: 18px;
            min-height: 18px;
        }
        label {
            display: block;
        }
        .details {
            font-size: 0.9em;
            color: #7f8c8d;
            padding-left: 33px; /* checkbox width + margin */
            margin-top: -8px;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>Чек-лист полного запуска MVP: Медицинское приложение</h1>

        <div class="phase">
            <h2>Фаза 1: Подготовка к запуску (Pre-Launch)</h2>

            <div class="category">
                <h3>1.1. Планирование и Управление</h3>
                <ul>
                    <li><input type="checkbox" id="task1"><label for="task1">Финализировать и заморозить скоуп задач для MVP.</label></li>
                    <li><input type="checkbox" id="task2"><label for="task2">Настроить систему управления задачами (Jira, Asana, Kaiten и т.д.).</label></li>
                    <li><input type="checkbox" id="task3"><label for="task3">Распределить задачи по спринтам (Спринт 1: 3 нед., Спринт 2: 3 нед., Спринт 3: 2 нед.).</label></li>
                    <li><input type="checkbox" id="task4"><label for="task4">Назначить ответственных за каждый User Flow и компонент.</label></li>
                </ul>
            </div>

            <div class="category">
                <h3>1.2. Дизайн и Контент</h3>
                <ul>
                    <li><input type="checkbox" id="task5"><label for="task5">Согласовать финальный UI/UX дизайн всех экранов (Figma).</label>
                    <div class="details">Welcome Screen, онбординг, главный экран, экран анализов, чат, профиль и т.д.</div></li>
                    <li><input type="checkbox" id="task6"><label for="task6">Подготовить все текстовые материалы (копирайтинг).</label>
                    <div class="details">Тексты для кнопок, подсказок, экранов, сообщений об ошибках, email-уведомлений.</div></li>
                    <li><input type="checkbox" id="task7"><label for="task7">Подготовить контент для Базы Знаний.</label>
                    <div class="details">3-5 базовых "микросхем", статьи, описания мед. показателей, контент для протоколов лечения.</div></li>
                </ul>
            </div>

            <div class="category">
                <h3>1.3. Разработка (Backend)</h3>
                <ul>
                    <li><input type="checkbox" id="task8"><label for="task8">Настроить архитектуру сервера и базу данных.</label></li>
                    <li><input type="checkbox" id="task9"><label for="task9">Реализовать API для регистрации и аутентификации пользователей.</label></li>
                    <li><input type="checkbox" id="task10"><label for="task10">Реализовать API для онбординга (сохранение целей, ответов анамнеза).</label></li>
                    <li><input type="checkbox" id="task11"><label for="task11">Настроить интеграцию с AI-сервисом для анализа документов.</label></li>
                    <li><input type="checkbox" id="task12"><label for="task12">Настроить интеграцию с AI-ассистентом (чат).</label></li>
                    <li><input type="checkbox" id="task13"><label for="task13">Реализовать API для генерации и управления планами восстановления.</label></li>
                    <li><input type="checkbox" id="task14"><label for="task14">Настроить интеграцию с платежным шлюзом для подписок.</label></li>
                    <li><input type="checkbox" id="task15"><label for="task15">Разработать бэкенд для Админ-панели.</label></li>
                </ul>
            </div>

            <div class="category">
                <h3>1.4. Разработка (Frontend - Telegram Mini App)</h3>
                <ul>
                    <li><input type="checkbox" id="task16"><label for="task16"><strong>Спринт 1:</strong> Разработать User Flow 1 (Онбординг) и User Flow 2 (Анализ).</label>
                    <div class="details">Welcome Screen, выбор целей, чат-анамнез, загрузка файлов, экран результатов анализа.</div></li>
                    <li><input type="checkbox" id="task17"><label for="task17"><strong>Спринт 2:</strong> Разработать User Flow 3 (План) и User Flow 4 (AI-ассистент).</label>
                    <div class="details">Главный экран с планом, трекинг, геймификация, детализация задач, чат с AI.</div></li>
                    <li><input type="checkbox" id="task18"><label for="task18"><strong>Спринт 3:</strong> Разработать Монетизацию и остальные экраны.</label>
                    <div class="details">Экран подписки, интеграция оплаты, профиль, база знаний.</div></li>
                    <li><input type="checkbox" id="task19"><label for="task19">Реализовать обработку ошибок на клиенте (проблемы с сетью, ошибки API).</label></li>
                    <li><input type="checkbox" id="task20"><label for="task20">Адаптировать интерфейс под разные размеры экранов.</label></li>
                </ul>
            </div>

            <div class="category">
                <h3>1.5. Разработка (Admin Panel)</h3>
                <ul>
                    <li><input type="checkbox" id="task21"><label for="task21">Реализовать Дашборд с ключевыми метриками.</label></li>
                    <li><input type="checkbox" id="task22"><label for="task22">Реализовать модуль управления пользователями.</label></li>
                    <li><input type="checkbox" id="task23"><label for="task23">Реализовать модуль просмотра диалогов с AI и дообучения.</label></li>
                    <li><input type="checkbox" id="task24"><label for="task24">Реализовать CMS для управления контентом (статьи, цели, показатели).</label></li>
                </ul>
            </div>

             <div class="category">
                <h3>1.6. Тестирование (QA)</h3>
                <ul>
                    <li><input type="checkbox" id="task25"><label for="task25">Провести полное тестирование User Flow 1: Онбординг.</label></li>
                    <li><input type="checkbox" id="task26"><label for="task26">Провести полное тестирование User Flow 2: Анализ документов.</label>
                    <div class="details">Загрузка разных форматов (PDF, JPG, PNG), проверка корректности парсинга.</div></li>
                    <li><input type="checkbox" id="task27"><label for="task27">Провести полное тестирование User Flow 3: Персональный план.</label></li>
                    <li><input type="checkbox" id="task28"><label for="task28">Провести полное тестирование User Flow 4: AI-ассистент.</label></li>
                    <li><input type="checkbox" id="task29"><label for="task29">Провести тестирование процесса оплаты и управления подпиской.</label></li>
                    <li><input type="checkbox" id="task30"><label for="task30">Провести тестирование Админ-панели.</label></li>
                    <li><input type="checkbox" id="task31"><label for="task31">Провести нагрузочное тестирование API.</label></li>
                     <li><input type="checkbox" id="task32"><label for="task32">Провести тестирование безопасности.</label></li>
                </ul>
            </div>

            <div class="category">
                <h3>1.7. Юридические и организационные вопросы</h3>
                <ul>
                    <li><input type="checkbox" id="task33"><label for="task33">Подготовить "Пользовательское соглашение" (Terms of Service).</label></li>
                    <li><input type="checkbox" id="task34"><label for="task34">Подготовить "Политику конфиденциальности" (Privacy Policy).</label></li>
                    <li><input type="checkbox" id="task35"><label for="task35">Обеспечить соответствие требованиям хранения персональных и медицинских данных.</label></li>
                    <li><input type="checkbox" id="task36"><label for="task36">Настроить систему аналитики (Amplitude, Mixpanel и т.д.).</label></li>
                    <li><input type="checkbox" id="task37"><label for="task37">Подготовить каналы поддержки пользователей (email, чат-бот).</label></li>
                </ul>
            </div>
        </div>

        <div class="phase">
            <h2>Фаза 2: Запуск (Launch)</h2>
            <div class="category">
                <h3>2.1. Технический запуск</h3>
                <ul>
                    <li><input type="checkbox" id="launch1"><label for="launch1">Провести финальное регрессионное тестирование на staging-среде.</label></li>
                    <li><input type="checkbox" id="launch2"><label for="launch2">Сделать резервную копию базы данных и систем.</label></li>
                    <li><input type="checkbox" id="launch3"><label for="launch3">Развернуть бэкенд на production-сервере.</label></li>
                    <li><input type="checkbox" id="launch4"><label for="launch4">Опубликовать Telegram Mini App.</label></li>
                    <li><input type="checkbox" id="launch5"><label for="launch5">Провести smoke-тест на production: создать нового пользователя, пройти онбординг, оплатить подписку.</label></li>
                </ul>
            </div>

            <div class="category">
                <h3>2.2. Маркетинговый запуск</h3>
                <ul>
                    <li><input type="checkbox" id="launch6"><label for="launch6">Опубликовать анонс о запуске в социальных сетях и на сайте.</label></li>
                    <li><input type="checkbox" id="launch7"><label for="launch7">Запустить заранее подготовленные рекламные кампании.</label></li>
                    <li><input type="checkbox" id="launch8"><label for="launch8">Начать активное взаимодействие с первыми пользователями.</label></li>
                </ul>
            </div>
        </div>

        <div class="phase">
            <h2>Фаза 3: После запуска (Post-Launch)</h2>
            <div class="category">
                <h3>3.1. Мониторинг и поддержка</h3>
                <ul>
                    <li><input type="checkbox" id="post1"><label for="post1">Настроить и отслеживать мониторинг состояния серверов (uptime, нагрузка, ошибки).</label></li>
                    <li><input type="checkbox" id="post2"><label for="post2">Ежедневно проверять логи на наличие критических ошибок.</label></li>
                    <li><input type="checkbox" id="post3"><label for="post3">Отслеживать ключевые метрики продукта в системе аналитики (регистрации, конверсии, удержание).</label></li>
                    <li><input type="checkbox" id="post4"><label for="post4">Оперативно отвечать на запросы в службу поддержки.</label></li>
                </ul>
            </div>
            <div class="category">
                <h3>3.2. Сбор обратной связи и итерации</h3>
                <ul>
                    <li><input type="checkbox" id="post5"><label for="post5">Активно собирать обратную связь от первых пользователей.</label></li>
                    <li><input type="checkbox" id="post6"><label for="post6">Анализировать диалоги пользователей с AI-ассистентом для выявления проблем и инсайтов.</label></li>
                    <li><input type="checkbox" id="post7"><label for="post7">Сформировать бэклог на основе обратной связи и данных аналитики.</label></li>
                    <li><input type="checkbox" id="post8"><label for="post8">Планировать следующие спринты для исправления багов и реализации новых функций.</label></li>
                </ul>
            </div>
        </div>

    </div>

</body>
</html>