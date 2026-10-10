/*
 * RU / EN / TR language switcher.
 *
 * English is the text that already sits in index.html (it is read from the page
 * on load, so it is never duplicated here). This file only holds RU and TR.
 *
 * To change a translation: find its key (the data-i18n="..." attribute in
 * index.html) and edit the string below. A key missing here falls back to English.
 */
(function () {
  "use strict";

  var SUPPORTED = ["ru", "en", "tr"];

  var T = {
    ru: {
      "ui.problem": "Задача",
"ui.work": "Моя работа",
"ui.result": "Результат",

"proj.twin.problem": "Развить физический прототип автономного трамвая в среду моделирования, чтобы изучать взаимодействие нескольких вагонов с пассажирами, инфраструктурой и расписанием движения.",
"proj.twin.work": "Я разрабатываю симуляцию и логику управления трамваями: генерацию пассажиров, выпуск из депо, удержание на конечных и регулирование интервалов. Модель учитывает динамику вагонов, светофоры и стрелки; сценарии основаны на сетях Нижнего Новгорода и Измира. Также развиваю анализ энергопотребления с рекуперацией и маховиковыми накопителями, используя ядро на C++ и интерфейс на TypeScript.",
"proj.twin.result": "Интерактивный веб-симулятор с доступным демо, графиками движения и энергетической статистикой. Он позволяет сравнивать стратегии работы и исследовать влияние задержек, пассажирского спроса и диспетчерских решений на моделируемую сеть. Разработка и уточнение моделей продолжаются.",

"proj.asv.problem": "Планировать согласованные миссии нескольких автономных надводных аппаратов для мониторинга цветения цианобактерий. Маршруты должны учитывать избегание столкновений, перекрытие путей и распределение нагрузки между аппаратами.",
"proj.asv.work": "Во время стажировки в ISCAR при Мадридском университете Комплутенсе я расширил существующий планировщик на MATLAB для одного аппарата до сценариев с несколькими. Работал с NSGA-II и NSGA-III, проводил повторные симуляции для групп из двух и трёх аппаратов, анализировал фронты Парето с помощью гиперобъёма и непараметрических статистических сравнений.",
"proj.asv.result": "Эксперименты с планированием для нескольких аппаратов, графики траекторий, сравнительные иллюстрации и отчёт о стажировке. Работа позволила оценивать компромиссы между конкурирующими целями миссии и сравнивать методы оптимизации по результатам повторных симуляций.",

"proj.tram.problem": "Создать физическую модель трамвая, которая управляет движением, обнаруживает препятствия и взаимодействует с инфраструктурой с помощью единой встраиваемой системы.",
"proj.tram.work": "Я разработал встраиваемую систему управления моделью, объединив Arduino Nano, прошивку на C++ и собственные печатные платы. Прошивка отвечает за управление движением, обнаружение препятствий, безопасное поведение при отказах и связь с инфраструктурой; электроника объединяет драйверы моторов, беспроводные модули, датчики расстояния и исполнительные механизмы.",
"proj.tram.result": "Работающая автономная модель трамвая, победившая в национальном финале WRO 2021 в России и участвовавшая в международном финале. Позднее физический прототип стал отправной точкой для моего цифрового двойника трамвая.",
      "ui.theme": "Тёмная тема",
      "ui.menu": "Меню разделов",
      "ui.details": "Подробнее",
      "ui.watchYoutube": "Смотреть на YouTube ↗",
      "proj.tram.demo": "Видео демо →",
      "ui.close": "Закрыть",
      "ui.project": "О проекте",
      "ui.stack": "Технологии",
      "ui.focus": "Основные возможности",
      "credentials": "Сертификаты и курсы",
      "credentials.intro": "Дополнительное обучение и профессиональное развитие.",
      "credentials.empty": "Информация о курсах и сертификатах скоро появится здесь.",
      "credentials.view": "Открыть сертификат →",
      "proj.tram.alt": "Автономная модель трамвая",
      "proj.tram.composition.alt": "Состав автономной модели трамвая",
      "proj.tram.body.alt": "Корпус автономной модели трамвая",
      "proj.tram.features": "Управление движением · Обнаружение препятствий · Безопасное поведение при отказах · Связь с инфраструктурой",
      "proj.mono.features": "Сетевой режим по IP · Адаптивный ИИ · Управление состоянием игры · Разделение логики и интерфейса",
      "proj.asv.features": "Избегание столкновений · Перекрытие маршрутов · Распределение нагрузки · Статистическое сравнение фронтов Парето",
      "proj.tram.summary": "Автономная модель трамвая с собственной электроникой, управлением в реальном времени и связью с инфраструктурой.",
      "proj.mono.summary": "Настольная игра на Java: сетевой режим до восьми игроков, адаптивный ИИ и отдельный слой игровой логики.",
      "proj.asv.summary": "Многокритериальное планирование миссий группы автономных надводных аппаратов для мониторинга цветения цианобактерий.",

      "meta.title": `Александр Гордеев | Робототехника и встраиваемые системы`,
      "meta.desc": `Портфолио Александра Гордеева: студент компьютерной инженерии, работающий над робототехникой, оптимизацией и встраиваемыми системами.`,

      "about": `О себе`,
      "education": `Образование`,
      "experience": `Опыт`,
      "projects": `Проекты`,
      "achievements": `Достижения`,
      "skills": `Навыки`,
      "contact": `Контакты`,

      "name": `Александр Гордеев`,
      "hero.eyebrow": `Компьютерная инженерия · Робототехника · Оптимизация`,
      "hero.lead": `Студент компьютерной инженерии, создаю автономные системы: от встраиваемой прошивки и печатных плат собственной разработки до многокритериальной оптимизации траекторий. Живу в Измире, Турция.`,
      "hero.projects": `Мои проекты`,
      "hero.cv": `Скачать резюме`,
      "hero.alt": `Портрет Александра Гордеева`,

      "about.p1": `Студент направления «Компьютерная инженерия» в Университете Яшар, интересуюсь автономными системами, робототехникой, разработкой программного обеспечения и оптимизацией.`,
      "about.p2": `Я работал над мультиагентным планированием траекторий автономных надводных аппаратов в исследовательской группе ISCAR при Мадридском университете Комплутенсе, используя MATLAB, многокритериальную оптимизацию и статистический анализ. Также развиваю собственные инженерные проекты на стыке встраиваемых систем, программного обеспечения, электроники и интеллектуальных транспортных систем.`,
      "about.p3": `Мой технический опыт включает C/C++, Java, SQL, MATLAB, Python, встраиваемые системы, проектирование печатных плат, структуры данных и алгоритмы. Особенно интересуюсь программной инженерией, автономными системами, робототехникой, базами данных и интеллектуальными транспортными системами.`,

      "edu.date": `2023 – ожидаемый выпуск 2027`,
      "edu.degree": `Бакалавр, компьютерная инженерия`,
      "edu.degree.meta": `Университет Яшар, Измир, Турция · 100% стипендия`,
      "edu.erasmus": `Обмен по программе Erasmus+`,
      "edu.erasmus.meta": `Мадридский университет Комплутенсе, Испания · грант 6\u00A0000 €`,

      "exp.date": `июнь – июль 2026`,
      "exp.iscar.title": `Стажёр по робототехнике и автономным системам`,
      "exp.iscar.meta": `Исследовательская группа ISCAR, Мадридский университет Комплутенсе`,
      "exp.iscar.l1": `Работал над планированием траекторий для нескольких автономных надводных аппаратов (ASV).`,
      "exp.iscar.l2": `Применял многокритериальную эволюционную оптимизацию (NSGA-II / NSGA-III).`,
      "exp.inst.title": `Помощник преподавателя робототехники и судья соревнований`,
      "exp.inst.meta": `Дворец детского творчества им. В.П. Чкалова, Нижний Новгород, Россия`,
      "exp.inst.l1": `Наставлял младших учеников в робототехнических проектах и оценивал механику и алгоритмы на юношеских соревнованиях.`,
      "exp.mentor.title": `Наставник по робототехнике и координатор мероприятий`,
      "exp.mentor.meta": `Региональная благотворительная организация «Забота», Нижний Новгород, Россия`,
      "exp.mentor.l1": `Обучал основам LEGO EV3 и Arduino детей из малообеспеченных семей и помогал организовывать мероприятия по робототехнике.`,

      "proj.src": `Исходный код →`,
      "proj.tram.title": `Автономная трамвайная система`,
      "proj.tram.desc": `Автономная модель трамвая, победившая в национальном финале WRO 2021 в России и участвовавшая в международном финале. Модульная прошивка реального времени отвечает за управление движением, обнаружение препятствий, отказоустойчивое поведение и связь транспорта с инфраструктурой. Собственные печатные платы объединяют Arduino Nano, драйверы моторов, беспроводные модули, датчики расстояния и исполнительные механизмы.`,
      "tag.pcb": `Проектирование печатных плат`,
      "proj.mono.alt1": `Игровое поле Red Monopoly`,
      "proj.mono.alt2": `Экран лобби Red Monopoly`,
      "proj.mono.date": `янв – май 2025`,
      "proj.mono.desc": `Сетевая десктопная игра с мультиплеером по IP-адресам до восьми игроков. Паттерны объектно-ориентированного проектирования лежат в основе адаптивного ИИ и обработки состояния игры, а игровая логика отделена от графического интерфейса. Разработана в команде по методологии Scrum.`,
      "proj.mono.problem": "Разработать настольную игру по мотивам Monopoly в советской тематике на Java в рамках командного Scrum-проекта: объединить игровые правила, графический интерфейс, AI-соперников и сетевой режим по IP для восьми игроков.",
      "proj.mono.result": "Рабочая настольная игра на Java с тематическим полем, AI-соперниками трёх уровней сложности, сохранением и загрузкой, отменой действий и сетевым режимом. Команда разработала игру за шесть Scrum-спринтов; исходный код и документация доступны на GitHub.",
      "proj.mono.work": "Как Product Owner и Java-разработчик, я управлял бэклогом команды и реализовал основные игровые механики: покупку недвижимости и железных дорог, оплату аренды, налоги и события карточек. Интегрировал решения AI о покупке в зависимости от уровня сложности, добавил игровые диалоги и иконки игроков, а также совместно разработал отмену действий с использованием паттерна Command. Исправлял ошибки игрового процесса и сообщений в сетевом режиме, поддерживал вики и демонстрировал новые функции на обзорах спринтов.",
      "tag.networking": `Сети`,
      "proj.asv.alt": `Результат планирования траекторий для нескольких ASV`,
      "proj.asv.title": `Планирование траекторий для нескольких ASV`,
      "proj.asv.date": `июнь – июль 2026 · исследовательская группа ISCAR`,
      "proj.asv.desc": `Координированное планирование миссий для нескольких автономных надводных аппаратов, ведущих мониторинг цветения цианобактерий. Многокритериальная оптимизация с помощью NSGA-II и NSGA-III уравновешивает избегание столкновений, перекрытие маршрутов и распределение нагрузки; фронты Парето сравниваются статистически по результатам параллельных симуляций.`,
      "tag.optimization": `Оптимизация`,
      "proj.twin.title": "Цифровой двойник автономного трамвая",
"proj.twin.date": "2026 – настоящее время",
"proj.twin.summary": "Симулятор движения нескольких трамваев, пассажирского спроса, диспетчеризации и экспериментов с энергоэффективностью.",
"proj.twin.tag": "Симуляция",
"proj.twin.demo": "Запустить демо →",
"proj.twin.alt": "Симулятор цифрового двойника автономного трамвая",
"proj.twin.desc": "Самостоятельный проект, развивающий мою физическую модель автономного трамвая в среду моделирования движения нескольких вагонов. Симулятор учитывает пассажирский спрос, остановки, светофоры, стрелки и выпуск трамваев из депо. Сценарии на основе трамвайных сетей Нижнего Новгорода и Измира позволяют экспериментировать с интервалами движения, динамикой вагонов, рекуперативным торможением и маховиковыми накопителями энергии.",
"proj.twin.features": "Моделирование пассажиров · Диспетчеризация депо · Управление интервалами · Светофоры и стрелки · Анализ энергопотребления",

      "achievements.title": `Избранные достижения`,
      "ach.1": `<strong>Финалист международного этапа</strong>, Всемирная олимпиада роботов (WRO) 2021`,
      "ach.2": `<strong>1 место</strong>, Всероссийский фестиваль исследовательских и проектных работ «Вектор» (2022)`,
      "ach.3": `<strong>Победитель в номинации «Экологичная городская инфраструктура»</strong>, Российская олимпиада роботов 2021`,
      "ach.4": `<strong>2 место</strong>, Балтийский научно-инженерный конкурс (2022)`,
      "ach.5": `<strong>3 место</strong>, XIV Всероссийский молодёжный конкурс ROST-ISEF (2022)`,

      "sk.prog": `Программирование`,
      "sk.low": `Низкоуровневое`,
      "sk.low.v": `Ассемблер MIPS и RISC-V`,
      "sk.eng": `Инженерия`,
      "sk.eng.v": `Arduino, встраиваемые системы, проектирование печатных плат, цифровое проектирование, электроника`,
      "sk.cs": `Основы информатики`,
      "sk.cs.v": `ООП, структуры данных, алгоритмы, компьютерные сети, Scrum`,
      "sk.tools": `Инструменты`,
      "sk.lang": `Языки`,
      "sk.lang.v": `русский (родной), английский (C1), турецкий (B1), испанский (A2)`,

      "contact.email": `Почта:`,
      "footer.rights": "Все права защищены."
    },

    tr: {
      "ui.problem": "Amaç",
"ui.work": "Katkım",
"ui.result": "Sonuç",

"proj.twin.problem": "Fiziksel otonom tramvay prototipini, birden fazla tramvayın yolcularla, altyapıyla ve sefer planlarıyla etkileşimini inceleyen bir simülasyon ortamına dönüştürmek.",
"proj.twin.work": "Yolcu üretimi, depodan sevk, terminalde bekletme ve sefer aralığı düzenlemesi dahil tramvay simülasyonunu ve kontrol mantığını geliştiriyorum. Model; araç dinamiği, trafik sinyalleri ve hat makaslarını içeriyor. Senaryolar Nijni Novgorod ve İzmir ağlarına dayanıyor. C++ çekirdeği ve TypeScript arayüzü kullanarak rejeneratif frenleme ve volan depolama ile enerji analizini de geliştiriyorum.",
"proj.twin.result": "Çevrimiçi demosu, zaman-mesafe diyagramları ve enerji istatistikleri olan etkileşimli bir web simülatörü. İşletim stratejilerini karşılaştırmaya ve gecikmelerin, yolcu talebinin ve sevk kararlarının simüle edilen ağa etkisini incelemeye olanak sağlıyor. Model geliştirme ve iyileştirme çalışmaları devam ediyor.",

"proj.asv.problem": "Siyanobakteri çoğalmalarını izleyen birden fazla otonom yüzey aracı için koordineli görevler planlamak. Rotalar; çarpışma önleme, rota çakışması ve filodaki iş yükü dağılımını dengelemeli.",
"proj.asv.work": "Madrid Complutense Üniversitesi ISCAR grubundaki stajımda, mevcut tek araçlı MATLAB planlayıcısını çok araçlı senaryolara genişlettim. NSGA-II ve NSGA-III ile çalıştım, iki ve üç araçlı filolar için tekrarlı simülasyonlar yürüttüm; Pareto cephelerini hiperhacim ölçümü ve parametrik olmayan istatistiksel karşılaştırmalarla analiz ettim.",
"proj.asv.result": "Çok araçlı planlama deneyleri, yörünge grafikleri, karşılaştırmalı görseller ve bir staj raporu. Çalışma, görev hedefleri arasındaki ödünleşimleri değerlendirmeye ve optimizasyon yöntemlerini tekrarlı simülasyonlar üzerinden karşılaştırmaya temel sağladı.",

"proj.tram.problem": "Entegre bir gömülü sistem aracılığıyla hareketini kontrol eden, engelleri algılayan ve altyapıyla iletişim kuran fiziksel bir tramvay modeli oluşturmak.",
"proj.tram.work": "Arduino Nano donanımı, C++ yazılımı ve özel PCB’leri birleştirerek modelin gömülü kontrol sistemini geliştirdim. Yazılım; hareket kontrolünü, engel algılamayı, arıza durumunda güvenli davranışı ve araç-altyapı iletişimini yönetiyor. Elektronik sistem motor sürücülerini, kablosuz modülleri, mesafe sensörlerini ve aktüatörleri bir araya getiriyor.",
"proj.tram.result": "WRO 2021 Rusya Ulusal Finali’ni kazanan ve uluslararası finalde yarışan çalışan bir otonom tramvay modeli. Fiziksel prototip daha sonra otonom tramvay dijital ikizimin başlangıç noktası oldu.",
      "ui.theme": "Koyu tema",
      "ui.menu": "Gezinme menüsü",
      "ui.details": "Ayrıntılar",
      "ui.close": "Kapat",
      "ui.project": "Proje ayrıntıları",
      "ui.stack": "Teknolojiler",
      "ui.focus": "Temel özellikler",
      "credentials": "Sertifikalar ve Kurslar",
      "credentials.intro": "Ek öğrenim ve mesleki gelişim.",
      "credentials.empty": "Kurs ve sertifika bilgileri yakında burada yer alacak.",
      "credentials.view": "Sertifikayı görüntüle →",
      "proj.tram.alt": "Otonom model tramvay",
      "ui.watchYoutube": "YouTube'da izle ↗",
      "proj.tram.demo": "Video demo →",
      "proj.tram.composition.alt": "Otonom model tramvay dizisi",
      "proj.tram.body.alt": "Otonom model tramvay gövdesi",
      "proj.tram.features": "Hareket kontrolü · Engel algılama · Arıza durumunda güvenli davranış · Altyapı iletişimi",
      "proj.mono.features": "IP tabanlı çok oyunculu mod · Uyarlanabilir yapay zekâ · Oyun durumu yönetimi · Mantık ve arayüz ayrımı",
      "proj.mono.problem": "Bir Scrum takım projesi kapsamında Java ile Sovyet temalı, Monopoly tarzında bir masaüstü oyunu geliştirmek: oyun kurallarını, grafik arayüzü, yapay zekâ rakiplerini ve sekiz oyuncuya kadar IP tabanlı çok oyunculu modu bir araya getirmek.",
      "proj.mono.result": "Temalı oyun tahtası, üç zorluk seviyesinde yapay zekâ rakipleri, kaydetme/yükleme, geri alma ve ağ üzerinden çok oyunculu mod içeren oynanabilir bir Java masaüstü oyunu. Takım oyunu altı Scrum sprintinde geliştirdi; kaynak kodu ve geliştirme belgeleri GitHub’da mevcut.",
      "proj.asv.features": "Çarpışma önleme · Rota çakışması · İş yükü dengeleme · Pareto cephelerinin istatistiksel karşılaştırması",
      "proj.tram.summary": "Özel elektronik, gerçek zamanlı kontrol ve araç-altyapı iletişimine sahip otonom model tramvay.",
      "proj.mono.summary": "Sekiz oyuncuya kadar çok oyunculu mod, uyarlanabilir yapay zekâ ve ayrı oyun mantığı katmanı içeren Java masaüstü oyunu.",
      "proj.asv.summary": "Siyanobakteri çoğalmalarını izleyen otonom yüzey aracı filoları için çok amaçlı görev planlama.",

      "meta.title": `Aleksandr Gordeev | Robotik ve Gömülü Sistemler Mühendisliği`,
      "meta.desc": `Aleksandr Gordeev'in portfolyosu: robotik, optimizasyon ve gömülü sistemler üzerine çalışan bilgisayar mühendisliği öğrencisi.`,

      "about": `Hakkımda`,
      "education": `Eğitim`,
      "experience": `Deneyim`,
      "projects": `Projeler`,
      "achievements": `Başarılar`,
      "skills": `Beceriler`,
      "contact": `İletişim`,

      "name": `Aleksandr Gordeev`,
      "hero.eyebrow": `Bilgisayar Mühendisliği · Robotik · Optimizasyon`,
      "hero.lead": `Gömülü yazılım ve özel tasarım baskılı devre kartlarından çok amaçlı yörünge optimizasyonuna kadar otonom sistemler geliştiren bilgisayar mühendisliği öğrencisi. İzmir, Türkiye'de yaşıyorum.`,
      "hero.projects": `Projelerim`,
      "hero.cv": `CV'yi indir`,
      "hero.alt": `Aleksandr Gordeev'in portresi`,

      "about.p1": `Yaşar Üniversitesi'nde Bilgisayar Mühendisliği öğrencisiyim; otonom sistemler, robotik, yazılım geliştirme ve optimizasyon alanlarına ilgi duyuyorum.`,
      "about.p2": `Madrid Complutense Üniversitesi'nin ISCAR Araştırma Grubu'nda MATLAB, çok amaçlı optimizasyon ve istatistiksel analiz kullanarak çok etmenli otonom yüzey araçları için yörünge planlama üzerine çalıştım. Ayrıca gömülü sistemleri, yazılımı, elektroniği ve akıllı ulaşım sistemlerini bir araya getiren bağımsız mühendislik projeleri geliştiriyorum.`,
      "about.p3": `Teknik deneyimim C/C++, Java, SQL, MATLAB, Python, gömülü sistemler, PCB tasarımı, veri yapıları ve algoritmaları kapsıyor. Özellikle yazılım mühendisliği, otonom sistemler, robotik, veri tabanları ve akıllı ulaşım konularıyla ilgileniyorum.`,

      "edu.date": `2023 – beklenen mezuniyet 2027`,
      "edu.degree": `Bilgisayar Mühendisliği Lisans`,
      "edu.degree.meta": `Yaşar Üniversitesi, İzmir, Türkiye · %100 burslu`,
      "edu.erasmus": `Erasmus+ Değişim Programı`,
      "edu.erasmus.meta": `Madrid Complutense Üniversitesi, İspanya · 6.000 € hibe`,

      "exp.date": `Haziran – Temmuz 2026`,
      "exp.iscar.title": `Robotik ve Otonom Sistemler Stajyeri`,
      "exp.iscar.meta": `ISCAR Araştırma Grubu, Madrid Complutense Üniversitesi`,
      "exp.iscar.l1": `Birden fazla otonom yüzey aracı (ASV) için yörünge planlama üzerine çalıştım.`,
      "exp.iscar.l2": `Çok amaçlı evrimsel optimizasyon (NSGA-II / NSGA-III) uyguladım.`,
      "exp.inst.title": `Robotik Eğitmen Yardımcısı ve Yarışma Jürisi`,
      "exp.inst.meta": `Çocuk Yaratıcılığı Sarayı, Nijni Novgorod, Rusya`,
      "exp.inst.l1": `Robotik projelerinde genç öğrencilere rehberlik ettim; gençlik yarışmalarında mekanik ve algoritmaları değerlendirdim.`,
      "exp.mentor.title": `Robotik Mentoru ve Etkinlik Koordinatörü`,
      "exp.mentor.meta": `Bölgesel Hayır Kuruluşu "Zabota", Nijni Novgorod, Rusya`,
      "exp.mentor.l1": `Dezavantajlı gençlere LEGO EV3 ve Arduino temellerini öğrettim ve robotik etkinliklerinin düzenlenmesine yardımcı oldum.`,

      "proj.src": `Kaynak kod →`,
      "proj.tram.title": `Otonom Tramvay Sistemi`,
      "proj.tram.desc": `WRO 2021 Rusya Ulusal Finali'ni kazanan ve uluslararası finalde yarışan otonom bir model tramvay. Modüler gerçek zamanlı yazılım; hareket kontrolü, engel algılama, arıza durumunda güvenli davranış ve araç-altyapı iletişimini yönetir. Özel tasarım baskılı devre kartları Arduino Nano, motor sürücüleri, kablosuz modüller, mesafe sensörleri ve aktüatörleri bir araya getirir.`,
      "tag.pcb": `PCB Tasarımı`,
      "proj.mono.alt1": `Red Monopoly oyun tahtası`,
      "proj.mono.alt2": `Red Monopoly lobi ekranı`,
      "proj.mono.date": `Ocak – Mayıs 2025`,
      "proj.mono.desc": `IP tabanlı çok oyunculu (sekiz oyuncuya kadar) ağ üzerinden oynanan bir masaüstü oyunu. Nesne yönelimli tasarım desenleri uyarlanabilir yapay zekâyı ve oyun durumu yönetimini yönlendirir; oyun mantığı arayüzden ayrı tutulmuştur. Bir Scrum ekibinde geliştirildi.`,
      "proj.mono.work": "Product Owner ve Java geliştiricisi olarak takımın iş listesini yönettim; mülk ve demiryolu satın alma, kira ödemeleri, vergiler ve kart olayları gibi temel oyun mekaniklerini geliştirdim. Zorluk seviyesine bağlı yapay zekâ satın alma kararlarını entegre ettim, oyun diyaloglarını ve oyuncu simgelerini ekledim. Command tasarım desenini kullanarak geri alma işlevini birlikte geliştirdik. Ayrıca oyun ve çok oyunculu moddaki mesajlaşma hatalarını düzelttim, wiki belgelerini güncel tuttum ve sprint değerlendirmelerinde yeni özellikleri sundum.",
      "tag.networking": `Ağ Programlama`,
      "proj.asv.alt": `Çoklu ASV yörünge planlama sonucu`,
      "proj.asv.title": `Çoklu ASV Yörünge Planlama`,
      "proj.asv.date": `Haziran – Temmuz 2026 · ISCAR Araştırma Grubu`,
      "proj.asv.desc": `Siyanobakteri çoğalmalarını izleyen birkaç otonom yüzey aracı için koordineli görev planlama. NSGA-II ve NSGA-III ile çok amaçlı optimizasyon; çarpışma önleme, rota çakışması ve iş yükünü dengeler. Pareto cepheleri paralel simülasyon çalıştırmaları üzerinden istatistiksel olarak karşılaştırılır.`,
      "tag.optimization": `Optimizasyon`,
      "proj.twin.title": "Otonom Tramvay Dijital İkizi",
"proj.twin.date": "2026 – devam ediyor",
"proj.twin.summary": "Çoklu tramvay işletimi, yolcu talebi, sevk kontrolü ve enerji verimliliği deneyleri için bir simülatör.",
"proj.twin.tag": "Simülasyon",
"proj.twin.demo": "Demoyu aç →",
"proj.twin.alt": "Otonom tramvay dijital ikiz simülatörü",
"proj.twin.desc": "Fiziksel otonom tramvay prototipimi çoklu tramvay işletimi için bir simülasyon ortamına dönüştüren bağımsız bir proje. Yolcu talebini, durakları, trafik sinyallerini, hat makaslarını ve depodan tramvay sevkini modeller. Nijni Novgorod ve İzmir tramvay ağlarına dayalı senaryolar; sefer aralıkları, araç dinamiği, rejeneratif frenleme ve volan enerji depolama sistemleri üzerine deneyler yapılmasını sağlar.",
"proj.twin.features": "Yolcu simülasyonu · Depodan sevk · Sefer aralığı kontrolü · Trafik sinyalleri ve makaslar · Enerji analizi",

      "achievements.title": `Seçilmiş Başarılar`,
      "ach.1": `<strong>Uluslararası Finalist</strong>, Dünya Robot Olimpiyatı (WRO) 2021`,
      "ach.2": `<strong>Birincilik</strong>, Tüm Rusya Araştırma ve Tasarım Çalışmaları Festivali "Vector" (2022)`,
      "ach.3": `<strong>Kazanan, Ekolojik Kentsel Altyapı</strong>, Rusya Robot Olimpiyatı 2021`,
      "ach.4": `<strong>İkincilik</strong>, Baltık Bilim ve Mühendislik Yarışması (2022)`,
      "ach.5": `<strong>Üçüncülük</strong>, XIV. Tüm Rusya Gençlik Yarışması ROST-ISEF (2022)`,

      "sk.prog": `Programlama`,
      "sk.low": `Düşük seviye`,
      "sk.low.v": `MIPS ve RISC-V Assembly`,
      "sk.eng": `Mühendislik`,
      "sk.eng.v": `Arduino, gömülü sistemler, PCB tasarımı, sayısal tasarım, elektronik`,
      "sk.cs": `Bilgisayar bilimi kavramları`,
      "sk.cs.v": `Nesne yönelimli programlama, veri yapıları, algoritmalar, bilgisayar ağları, Scrum`,
      "sk.tools": `Araçlar`,
      "sk.lang": `Diller`,
      "sk.lang.v": `Rusça (ana dil), İngilizce (C1), Türkçe (B1), İspanyolca (A2)`,

      "contact.email": `E-posta:`,
      "footer.rights": "Tüm hakları saklıdır."
    }
  };

  // ---- remember the English text that is already in the page ----
  var textNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var altNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-alt]"));
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".lang button"));
  var descTag = document.querySelector('meta[name="description"]');

  var EN = {
    title: document.title,
    desc: descTag ? descTag.getAttribute("content") : ""
  };
  textNodes.forEach(function (el) { el._en = el.innerHTML; });
  altNodes.forEach(function (el) { el._enAlt = el.getAttribute("alt"); });

  function pick(dict, key, fallback) {
    return dict && dict[key] != null ? dict[key] : fallback;
  }

  function apply(lang) {
    var dict = lang === "en" ? null : T[lang];

    textNodes.forEach(function (el) {
      el.innerHTML = pick(dict, el.getAttribute("data-i18n"), el._en);
    });
    altNodes.forEach(function (el) {
      el.setAttribute("alt", pick(dict, el.getAttribute("data-i18n-alt"), el._enAlt));
    });

    document.title = pick(dict, "meta.title", EN.title);
    if (descTag) descTag.setAttribute("content", pick(dict, "meta.desc", EN.desc));
    document.documentElement.lang = lang;
    document.dispatchEvent(new CustomEvent("portfolio:language", { detail: lang }));

    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
  }

  function initialLanguage() {
    // 1) ?lang=ru in the address, handy for sharing a link in a given language
    var m = /[?&]lang=(ru|en|tr)\b/.exec(window.location.search);
    if (m) return m[1];
    // 2) the language the visitor picked last time
    try {
      var saved = window.localStorage.getItem("lang");
      if (SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) { /* storage can be blocked; ignore */ }
    // 3) the browser's language, otherwise English
    var guess = String(navigator.language || "").slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(guess) !== -1 ? guess : "en";
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var lang = b.getAttribute("data-lang");
      apply(lang);
      try { window.localStorage.setItem("lang", lang); } catch (e) { /* ignore */ }
    });
  });

  apply(initialLanguage());
})();
