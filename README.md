# По любви

Лёгкий адаптивный сайт-визитка для фуршетов и банкетов. Чистые HTML, CSS и JavaScript, без зависимостей приложения и этапа сборки. Все изображения и шрифты находятся локально в `dist/assets`.

## Посмотреть локально

Откройте `dist/index.html` в браузере либо запустите `node serve.mjs` из этой папки и откройте http://localhost:4173.

## Заменить демонстрационные данные

- `dist/site-config.js` — название, город, телефон, Telegram, WhatsApp и почта.
- `dist/index.html` — тексты, подписи и описания фотографий.
- `dist/assets/*.webp` — фотографии. Сохраняйте имена файлов или меняйте ссылки в HTML.
- После загрузки реальных работ установите `demo: false` в конфигурации.

Форм заявок и полей ввода нет. Кнопки на первом экране ведут к контактам хозяйки. Телефон, Telegram, WhatsApp и почта настраиваются в `dist/site-config.js`; пустые контакты не показываются.

Пока включён `contactsDemo: true`: тестовые контакты показаны с пометкой «Для демонстрации» и не открывают звонки или чужие аккаунты. Замените данные и установите `contactsDemo: false`, чтобы включить прямые ссылки. Настройка `demo` отдельно управляет подписью к демонстрационным фотографиям.

## Бесплатная публикация через GitHub Pages

Для аккаунта `CommanderCiao` подготовлен вариант с репозиторием `po-lyubvi`. На GitHub Free репозиторий должен быть **Public**. Сайт и исходники будут доступны по ссылке; отдельный сервер и платный домен не нужны. [Документация GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

1. Если репозитория ещё нет, создайте [пустой публичный репозиторий `po-lyubvi`](https://github.com/new?name=po-lyubvi&visibility=public) в аккаунте `CommanderCiao`. Не включайте создание README, лицензии и `.gitignore`. Команды ниже рассчитаны на пустой репозиторий; если в нём уже есть файлы, сначала согласуйте существующую историю, не используйте принудительную отправку.
2. Из папки `po-lyubvi` выполните команды ниже. Git может предложить войти в GitHub. Если `origin` уже настроен, сначала проверьте его командой `git remote -v`, а добавление пропустите, если адрес совпадает.

   ```powershell
   git add .github/workflows/pages.yml dist/index.html dist/app.js dist/styles.css dist/site-config.js README.md
   git commit -m "Replace inquiry form with contacts and configure GitHub Pages"
   git remote add origin https://github.com/CommanderCiao/po-lyubvi.git
   git push -u origin main
   ```

3. На GitHub откройте **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Откройте **Actions → Deploy to GitHub Pages → Run workflow → main → Run workflow**. Первый запуск после загрузки может завершиться ошибкой, если Pages ещё не включён; ручной запуск после шага 3 это исправляет.
5. После успешного запуска ссылка на сайт появится в **Settings → Pages** и в результате задания `deploy`. При указанных названиях ожидаемый адрес — `https://CommanderCiao.github.io/po-lyubvi/`; он заработает только после публикации.

Дальнейшие изменения публикуются автоматически при `git push` в `main`. Workflow `.github/workflows/pages.yml` загружает только `dist/`; сборка и Node.js на хостинге не нужны. Все пути к стилям, скриптам, фотографиям и шрифтам относительные и работают по адресу `/po-lyubvi/`.

Для замены контактов отредактируйте `dist/site-config.js`, затем выполните `git add dist/site-config.js`, `git commit -m "Update owner contacts"` и `git push`.

## Анимация и доступность

Появление заголовка, раскрытие секций при прокрутке, бегущая строка, эффекты фотографий. Анимации используют transform и opacity, появления отслеживает IntersectionObserver. Системный режим уменьшенного движения отключает эффекты. Диалоги поддерживают Escape и возврат фокуса; в галерее работают клавиши влево/вправо. Основной контент читается и без JavaScript.

## Фотографии

Фотографии используются как демонстрационные материалы, а не реальные работы бизнеса. [Лицензия Pexels](https://www.pexels.com/license/).

- [Roman Odintsov — сырная тарелка](https://www.pexels.com/photo/close-up-of-cheese-board-6588379/)
- [Aleksey Mayorov — закуски](https://www.pexels.com/photo/gourmet-appetizers-on-elegant-buffet-table-32192090/)
- [Matheus Bertelli — банкет](https://www.pexels.com/photo/flower-arrangements-and-canapes-in-a-restaurant-17294729/)
- [Angel Ayala — камерный праздник](https://www.pexels.com/photo/elegant-event-table-with-appetizers-and-decor-28976228/)

Шрифты Cormorant Garamond и Manrope распространяются по SIL Open Font License; тексты лицензий лежат рядом со шрифтами. Скрипт `download-assets.mjs` сохраняет оптимизированные фото и шрифты; для повторного запуска нужен Node.js 22+, доступ к сети и установленный инструмент сжатия (`npm install --prefix qa --no-save sharp`). Для работы самого сайта Node.js не нужен.
