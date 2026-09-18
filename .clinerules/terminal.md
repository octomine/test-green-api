## Терминал (Windows + PowerShell)

### Окружение

- Проект разрабатывается на **Windows**.
- Терминал в VS Code — **PowerShell**, не CMD.
- **CMD-синтаксис не работает в PowerShell.** Флаги `/s`, `/b`, `/a`, `/o` вызовут ошибки вида «Вторая часть пути не должна быть именем диска или UNC».

### Пакетный менеджер

- Использовать **`pnpm`**, не `npm` и не `yarn`.
- Установка: `pnpm add <pkg>` / `pnpm add -D <pkg>`.
- Запуск: `pnpm dev`, `pnpm build`, `pnpm preview`.

### Список файлов и папок

| Задача             | Не использовать (CMD) | Использовать (PowerShell)                          |
| ------------------ | --------------------- | -------------------------------------------------- |
| Рекурсивный список | `dir /s`              | `Get-ChildItem -Recurse`                           |
| Только папки       | `dir /ad /s`          | `Get-ChildItem -Recurse -Directory`                |
| Только файлы       | `dir /a-d /s`         | `Get-ChildItem -Recurse -File`                     |
| Скрытые файлы      | `dir /a`              | `Get-ChildItem -Force`                             |
| Компактный вывод   | `dir /b`              | `Get-ChildItem -Name`                              |
| Полные пути        | —                     | `Get-ChildItem -Recurse \| Select-Object FullName` |

### Создание/удаление/копирование

| Задача                   | Не использовать (CMD) | Использовать (PowerShell)            |
| ------------------------ | --------------------- | ------------------------------------ |
| Создать папку            | `mkdir` (работает)    | `New-Item -ItemType Directory -Path` |
| Удалить папку рекурсивно | `rmdir /s`            | `Remove-Item -Recurse -Force`        |
| Копировать               | `xcopy /s`            | `Copy-Item -Recurse`                 |
| Переместить              | `move` (работает)     | `Move-Item`                          |

### Просмотр содержимого файла

- ❌ `type file.txt`
- ✅ `Get-Content file.txt` или `cat file.txt`

### Проверка версии

- ✅ `node --version`, `pnpm --version`
- **Не использовать** `where` — в PowerShell это алиас `Where-Object`. Для поиска исполняемого файла — `Get-Command <name>`.

### Общее правило

**Если команда начинается с `dir`, `type`, `xcopy`, `rmdir`, `find` — это почти всегда CMD.** В PowerShell используй `Get-ChildItem`, `Get-Content`, `Copy-Item`, `Remove-Item`, `Select-String`.

**Перед выполнением команды проверь:** если видишь флаг вида `/s`, `/b`, `/a`, `/o` — это CMD-синтаксис, он не сработает. Замени на PowerShell-эквивалент.
