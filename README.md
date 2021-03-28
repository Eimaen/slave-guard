# slave-guard
**Скрипт для VK Slaves, который выведет ваших рабов из себя!**

### Последнее обновление мерджануло сразу несколько моих проектов в один
Теперь проект содержит:
- **slaveGuard**: защита от кражи рабов
- **slaveStealer**: крадёт рабов у кого-либо
- **slaveUpgrader**: перепродаёт рабов, которые зарабатывают меньше 1000 в минуту
- **slaveFinder**: добавляет рандомных пользователей

Все это функции находятся в *очень медленной* разработке, потому что у меня не так много свободного времени. Не все функции протестированы, поэтому за баны ответственность несёте только вы. Сообщайте обо всех багах через страничку Issues проекта.

### Описание
Простой скрипт для VK Slaves с примитивной стратегией. Если у Вас выкупают раба, он покупает его обратно, тем самым повышая его уровень, а также вешает на него оковы.
Этот метод мне кажется более эффективным против честных игроков, так как задержка между покупкой и блокировкой сравнительно малая, и человек просто не успеет среагировать. Боты до сих пор могут обойти защиту и оставить Вас без рабов. Главный плюс бота в том, что он не покупает оковы для тех рабов, которых не хотят покупать, тем самым экономя игровую валюту.

Важно иметь достаточно валюты для выкупа рабов.

Также добавлены новые функции, читайте выше.

### Авторизация
Для этого приложения требуется токен авторизации. Для того, чтобы его получить:
1. Зайдите на страницу приложения "Рабство" в VK.
2. Зайдите в инструменты разработчика Вашего браузера и найдите вкладку "Сеть" (вкладка, на которой отображаются все запросы страницы).
3. Потыкайте разные кнопочки в приложении, наблюдая за списком запросов. Ищите запрос по адресу, который начинается на *https://pixel.w84.vkforms.ru/*.
4. Как только нужный запрос нашелся, нажмите на него, перейдите во вкладку "Заголовков" запроса.
5. Найдите заголовок "Authorization", и скопируйте его значение. Должно получиться что-то типа "Bearer ...".
6. Вставьте значение в поле `auth` в файле `config.json`.

Теперь в настройке нужно указать немного больше значений (`config.json`), такие как `myId`, а также настройки каждой функции по отдельности. Я уверен, вы разберётесь.

### Запуск
В командную строку из папки пропишите команды:
```bat
npm i
node index.js
```

### Пруфы, что работает
Я говорил, что бот может вывести из себя? Это правда.

![Два додика в восторге от бота](https://raw.githubusercontent.com/Eimaen/slave-guard/main/screenshot-rage.png)

#### Я не буду объяснять, как настроить бота. Всё, что нужно, уже написано.
Ну если прямо совсем непонятно, пишите мне в [ВК](https://vk.com/eimaen)
