# slave-guard
**Скрипт для VK Slaves, который выведет ваших рабов из себя!**

### Описание
Простой скрипт для VK Slaves с примитивной стратегией. Если у Вас выкупают раба, он покупает его обратно, тем самым повышая его уровень, а также вешает на него оковы.
Этот метод мне кажется более эффективным против честных игроков, так как задержка между покупкой и блокировкой сравнительно малая, и человек просто не успеет среагировать. Боты до сих пор могут обойти защиту и оставить Вас без рабов. Главный плюс бота в том, что он не покупает оковы для тех рабов, которых не хотят покупать, тем самым экономя игровую валюту.

### Авторизация
Для этого приложения требуется токен авторизации. Для того, чтобы его получить:
1. Зайдите на страницу приложения "Рабство" в VK.
2. Зайдите в инструменты разработчика Вашего браузера и найдите вкладку "Сеть" (вкладка, на которой отображаются все запросы страницы).
3. Потыкайте разные кнопочки в приложении, наблюдая за списком запросов. Ищите запрос по адресу, который начинается на *https://pixel.w84.vkforms.ru/*.
4. Как только нужный запрос нашелся, ражмите на него, перейдите во вкладку "Заголовков" запроса.
5. Найдите заголовок "Authorization", и скопируйте его значение. Должно получиться что-то типа "Bearer ...".
6. Вставьте значение в `config.json`.

Настройка завершена.

### Запуск
Не будет инструкции по тому, как запустить приложение на Node.js.

### Пруфы, что работает
Я говорил, что бот может вывести из себя? Это правда.

![Два додика в восторге от бота](https://raw.githubusercontent.com/Eimaen/slave-guard/main/screenshot-rage.png)
