/* Portfolio language preference, static copy and chart translations. */
(() => {
  'use strict';
  const translations = {
  "Dark theme": {"ru": "Тёмная тема", "tr": "Koyu tema"},
  "Multi-ASV · Pareto Solution Explorer": {
    "ru": "Multi-ASV · Обозреватель решений Парето",
    "tr": "Multi-ASV · Pareto Çözüm Gezgini"
  },
  "MULTI-ASV PLANNER": {
    "ru": "ПЛАНИРОВЩИК MULTI-ASV",
    "tr": "MULTI-ASV PLANLAYICI"
  },
  "MISSION DESIGN": {
    "ru": "ПРОЕКТИРОВАНИЕ МИССИЙ",
    "tr": "GÖREV TASARIMI"
  },
  "One lake. Many possible missions.": {
    "ru": "Одно озеро. Множество возможных миссий.",
    "tr": "Bir göl. Birçok olası görev."
  },
  "Each point represents one feasible nondominated mission found in the final population. Select a point to see how the trade-off between mission time, longest individual route and Cyanobacteria-density coverage changes the planned ASV trajectories.": {
    "ru": "Каждая точка — допустимая недоминируемая миссия из итоговой популяции. Выберите точку, чтобы увидеть, как компромисс между временем миссии, длиной самого длинного маршрута и охватом плотности цианобактерий меняет запланированные траектории автономных надводных аппаратов (ASV).",
    "tr": "Her nokta, son popülasyonda bulunan uygun ve baskın olmayan bir görevi temsil eder. Görev süresi, en uzun bireysel rota ve siyanobakteri yoğunluğu kapsamı arasındaki ödünleşimin otonom yüzey araçlarının (ASV) planlanan yörüngelerini nasıl değiştirdiğini görmek için bir nokta seçin."
  },
  "Open full-page explorer ↗": {
    "ru": "Открыть обозреватель на отдельной странице ↗",
    "tr": "Gezgini tam sayfada aç ↗"
  },
  "Loading recorded missions…": {
    "ru": "Загрузка записанных миссий…",
    "tr": "Kaydedilmiş görevler yükleniyor…"
  },
  "Pareto solution explorer": {
    "ru": "Обозреватель решений Парето",
    "tr": "Pareto çözüm gezgini"
  },
  "Lake / scenario": {
    "ru": "Озеро / сценарий",
    "tr": "Göl / senaryo"
  },
  "Fleet size": {
    "ru": "Количество аппаратов",
    "tr": "Filo büyüklüğü"
  },
  "2 ASVs": {
    "ru": "2 аппарата ASV",
    "tr": "2 ASV"
  },
  "3 ASVs": {
    "ru": "3 аппарата ASV",
    "tr": "3 ASV"
  },
  "Configuration": {
    "ru": "Конфигурация",
    "tr": "Yapılandırma"
  },
  "01 / EXPLORE THE TRADE-OFF": {
    "ru": "01 / ИССЛЕДУЙТЕ КОМПРОМИССЫ",
    "tr": "01 / ÖDÜNLEŞİMİ KEŞFEDİN"
  },
  "Pareto front": {
    "ru": "Фронт Парето",
    "tr": "Pareto cephesi"
  },
  "Hover or select a point. Use arrow keys when the plot is focused.": {
    "ru": "Наведите указатель или выберите точку. Для управления с клавиатуры используйте стрелки, когда график в фокусе.",
    "tr": "Bir noktanın üzerine gelin veya onu seçin. Grafik odaktayken ok tuşlarını kullanın."
  },
  "Pareto front: mission duration versus longest individual path": {
    "ru": "Фронт Парето: длительность миссии и самый длинный маршрут",
    "tr": "Pareto cephesi: görev süresi ve en uzun bireysel yol"
  },
  "Cyanobacteria-density coverage": {
    "ru": "Охват плотности цианобактерий",
    "tr": "Siyanobakteri yoğunluğu kapsamı"
  },
  "(model units)": {
    "ru": "(единицы модели)",
    "tr": "(model birimi)"
  },
  "Explore mission trade-offs": {
    "ru": "Исследование компромиссов миссии",
    "tr": "Görev ödünleşimlerini keşfedin"
  },
  "Faster mission": {
    "ru": "Более быстрая миссия",
    "tr": "Daha hızlı görev"
  },
  "Shorter individual routes": {
    "ru": "Более короткие маршруты",
    "tr": "Daha kısa bireysel rotalar"
  },
  "Greater Cyanobacteria-density coverage": {
    "ru": "Больший охват плотности цианобактерий",
    "tr": "Daha fazla siyanobakteri yoğunluğu kapsamı"
  },
  "Balanced solution": {
    "ru": "Сбалансированное решение",
    "tr": "Dengeli çözüm"
  },
  "Selected mission": {
    "ru": "Выбранная миссия",
    "tr": "Seçilen görev"
  },
  "02 / SEE THE MISSION": {
    "ru": "02 / РАССМОТРИТЕ МИССИЮ",
    "tr": "02 / GÖREVİ İNCELEYİN"
  },
  "Planned trajectories": {
    "ru": "Запланированные траектории",
    "tr": "Planlanan yörüngeler"
  },
  "Plan view · equal x/y scale · coordinates in metres": {
    "ru": "Вид сверху · одинаковый масштаб x/y · координаты в метрах",
    "tr": "Üstten görünüm · eşit x/y ölçeği · metre cinsinden koordinatlar"
  },
  "Complete lake boundary and selected ASV routes": {
    "ru": "Полный контур озера и выбранные маршруты ASV",
    "tr": "Gölün tüm sınırları ve seçilen ASV rotaları"
  },
  "○ Start": {
    "ru": "○ Старт",
    "tr": "○ Başlangıç"
  },
  "◇ Destination": {
    "ru": "◇ Финиш",
    "tr": "◇ Varış"
  },
  "→ Travel direction": {
    "ru": "→ Направление движения",
    "tr": "→ Hareket yönü"
  },
  "Projected density at mission start": {
    "ru": "Проекция плотности в начале миссии",
    "tr": "Görev başlangıcındaki öngörülen yoğunluk"
  },
  "Selected mission summary": {
    "ru": "Сводка выбранной миссии",
    "tr": "Seçilen görevin özeti"
  },
  "Mission duration": {
    "ru": "Длительность миссии",
    "tr": "Görev süresi"
  },
  "Longest individual path": {
    "ru": "Самый длинный маршрут",
    "tr": "En uzun bireysel yol"
  },
  "Trade-off descriptions are relative to this front. “Balanced” gives equal weight to all three normalized objectives; it is not universally best.": {
    "ru": "Описания компромиссов относятся к текущему фронту. «Сбалансированное» решение придаёт одинаковый вес всем трём нормализованным целям; оно не является универсально лучшим.",
    "tr": "Ödünleşim açıklamaları bu cepheye göredir. “Dengeli” çözüm, normalize edilmiş üç amaca eşit ağırlık verir; her durumda en iyi çözüm değildir."
  },
  "About the data & how to read it": {
    "ru": "О данных и их интерпретации",
    "tr": "Veriler ve nasıl okunacakları hakkında"
  },
  "Only feasible, nondominated final solutions are shown, sampled from the median final-hypervolume repeat of each experiment. Hypervolume describes an entire front, never an individual mission. Two-ASV runs finish at generation 200; three-ASV runs at 500. These are different optimisation budgets, so this view is not a controlled fleet-performance comparison.": {
    "ru": "Показаны только допустимые недоминируемые итоговые решения из повтора с медианным итоговым гиперобъёмом каждого эксперимента. Гиперобъём характеризует весь фронт, а не отдельную миссию. Запуски с двумя ASV заканчиваются на поколении 200, с тремя — на 500. Бюджеты оптимизации различаются, поэтому этот обзор не является контролируемым сравнением эффективности флотов.",
    "tr": "Yalnızca her deneyin son hiperhacmi medyan olan tekrarından örneklenen uygun, baskın olmayan nihai çözümler gösterilir. Hiperhacim, tek bir görevi değil tüm cepheyi tanımlar. İki ASV’li koşular 200., üç ASV’li koşular 500. nesilde biter. Optimizasyon bütçeleri farklı olduğu için bu görünüm kontrollü bir filo performansı karşılaştırması değildir."
  },
  "Mission duration is the last boat’s arrival. Longest path is the greatest individual 3D spline arc length, while the map shows horizontal projections. Displayed Cyanobacteria-density coverage is exactly the negative of the saved third minimization objective:": {
    "ru": "Длительность миссии определяется прибытием последнего аппарата. Самый длинный маршрут — максимальная длина индивидуального трёхмерного сплайна; на карте показаны горизонтальные проекции. Отображаемый охват плотности цианобактерий в точности равен сохранённой третьей цели минимизации с обратным знаком:",
    "tr": "Görev süresi, son aracın varış zamanıdır. En uzun yol, bireysel 3B spline yay uzunluklarının en büyüğüdür; harita yatay izdüşümleri gösterir. Gösterilen siyanobakteri yoğunluğu kapsamı, kaydedilmiş üçüncü minimizasyon amacının tam olarak negatifidir:"
  },
  ". It sums each particle’s greatest Gaussian contribution across all boat paths, avoiding double-counting overlaps. It is a model score, not measured concentration.": {
    "ru": ". Для каждой частицы суммируется её максимальный гауссов вклад по всем маршрутам, без двойного учёта перекрытий. Это модельный показатель, а не измеренная концентрация.",
    "tr": ". Tüm araç yolları boyunca her parçacığın en büyük Gauss katkısı toplanır; örtüşmeler iki kez sayılmaz. Bu, ölçülmüş konsantrasyon değil, bir model puanıdır."
  },
  "The background is a horizontal Gaussian projection of recorded particles at mission start, not cumulative Cyanobacteria-density coverage or an animated bloom. The STL outlines are the complete saved simulation geometries, including shoreline holes; no geographic imagery is added. Different groups are displayed separately, with axes rescaled to each front.": {
    "ru": "Фон — горизонтальная гауссова проекция записанных частиц в начале миссии, а не накопленный охват плотности цианобактерий или анимация цветения. Контуры STL представляют полную сохранённую геометрию симуляции, включая внутренние контуры береговой линии; географические снимки не добавлены. Группы отображаются отдельно, масштаб осей подстраивается под каждый фронт.",
    "tr": "Arka plan, görev başlangıcında kaydedilen parçacıkların yatay Gauss izdüşümüdür; birikimli siyanobakteri yoğunluğu kapsamı veya hareketli bir alg patlaması değildir. STL sınırları, kıyı çizgisinin iç boşlukları dahil kaydedilmiş simülasyon geometrisinin tamamıdır; coğrafi görüntü eklenmez. Gruplar ayrı gösterilir ve eksenler her cepheye göre ölçeklenir."
  },
  "Back to portfolio": {
    "ru": "Вернуться в портфолио",
    "tr": "Portfolyoya dön"
  },
  "Language": {
    "ru": "Язык",
    "tr": "Dil"
  },
  "Balanced trade-off": {
    "ru": "Сбалансированный компромисс",
    "tr": "Dengeli ödünleşim"
  },
  "Higher Cyanobacteria-density coverage with longer missions or routes": {
    "ru": "Больший охват плотности цианобактерий при более длительных миссиях или маршрутах",
    "tr": "Daha uzun görevler veya rotalarla daha fazla siyanobakteri yoğunluğu kapsamı"
  },
  "Faster mission with lower Cyanobacteria-density coverage": {
    "ru": "Более быстрая миссия с меньшим охватом плотности цианобактерий",
    "tr": "Daha düşük siyanobakteri yoğunluğu kapsamıyla daha hızlı görev"
  },
  "Shorter individual routes with lower Cyanobacteria-density coverage": {
    "ru": "Более короткие маршруты с меньшим охватом плотности цианобактерий",
    "tr": "Daha düşük siyanobakteri yoğunluğu kapsamıyla daha kısa bireysel rotalar"
  },
  "A trade-off favouring mission time": {
    "ru": "Компромисс в пользу времени миссии",
    "tr": "Görev süresini önceliklendiren bir ödünleşim"
  },
  "A trade-off favouring shorter routes": {
    "ru": "Компромисс в пользу более коротких маршрутов",
    "tr": "Daha kısa rotaları önceliklendiren bir ödünleşim"
  },
  "A trade-off favouring Cyanobacteria-density coverage": {
    "ru": "Компромисс в пользу охвата плотности цианобактерий",
    "tr": "Siyanobakteri yoğunluğu kapsamını önceliklendiren bir ödünleşim"
  },
  "A middle-ground trade-off across the three objectives": {
    "ru": "Промежуточный компромисс между тремя целями",
    "tr": "Üç amaç arasında orta yol bulan bir ödünleşim"
  },
  "BALANCED SOLUTION": {
    "ru": "СБАЛАНСИРОВАННОЕ РЕШЕНИЕ",
    "tr": "DENGELİ ÇÖZÜM"
  },
  "SELECTED SOLUTION": {
    "ru": "ВЫБРАННОЕ РЕШЕНИЕ",
    "tr": "SEÇİLEN ÇÖZÜM"
  },
  "Solution {index}": {
    "ru": "Решение {index}",
    "tr": "Çözüm {index}"
  },
  "min": {
    "ru": "мин",
    "tr": "dk"
  },
  "m": {
    "ru": "м",
    "tr": "m"
  },
  "model units": {
    "ru": "ед. модели",
    "tr": "model birimi"
  },
  "{fleet} ASVs · {lake} ({id}) · {config} · Repeat {repeat} · Generation {generation} · Solution {index} (MATLAB index)": {
    "ru": "{fleet} ASV · {lake} ({id}) · {config} · Повтор {repeat} · Поколение {generation} · Решение {index} (индекс MATLAB)",
    "tr": "{fleet} ASV · {lake} ({id}) · {config} · Tekrar {repeat} · Nesil {generation} · Çözüm {index} (MATLAB indeksi)"
  },
  "Solution {index}: {time} minutes, {length} metres, {density} Cyanobacteria-density coverage in model units": {
    "ru": "Решение {index}: {time} мин, {length} м, охват плотности цианобактерий {density} ед. модели",
    "tr": "Çözüm {index}: {time} dakika, {length} metre, model birimi cinsinden {density} siyanobakteri yoğunluğu kapsamı"
  },
  "Time: {value} min": {
    "ru": "Время: {value} мин",
    "tr": "Süre: {value} dk"
  },
  "Longest path: {value} m": {
    "ru": "Самый длинный маршрут: {value} м",
    "tr": "En uzun yol: {value} m"
  },
  "Cyanobacteria-density coverage: {value} model units": {
    "ru": "Охват плотности цианобактерий: {value} ед. модели",
    "tr": "Siyanobakteri yoğunluğu kapsamı: {value} model birimi"
  },
  "Mission duration (min)": {
    "ru": "Длительность миссии (мин)",
    "tr": "Görev süresi (dk)"
  },
  "Longest individual ASV path (m)": {
    "ru": "Самый длинный маршрут ASV (м)",
    "tr": "En uzun bireysel ASV yolu (m)"
  },
  "{value} · Lower coverage": {
    "ru": "{value} · Меньший охват",
    "tr": "{value} · Daha düşük kapsam"
  },
  "{value} · Greater coverage": {
    "ru": "{value} · Больший охват",
    "tr": "{value} · Daha fazla kapsam"
  },
  "{count} representative solutions from a front of {total}.": {
    "ru": "Показано решений: {count} из {total} на фронте.",
    "tr": "{total} çözümlük cepheden {count} temsilî çözüm."
  },
  "#{index} · {time} min · {length} m": {
    "ru": "№{index} · {time} мин · {length} м",
    "tr": "#{index} · {time} dk · {length} m"
  },
  "Boat {index}: {time} min, {length} m (3D)": {
    "ru": "Аппарат {index}: {time} мин, {length} м (3D)",
    "tr": "Araç {index}: {time} dk, {length} m (3B)"
  },
  "{value} m": {
    "ru": "{value} м",
    "tr": "{value} m"
  },
  "{lake}: solution {index}, {fleet} boat trajectories, complete lake boundary and mission-start density": {
    "ru": "{lake}: решение {index}, траектории {fleet} аппаратов, полный контур озера и плотность в начале миссии",
    "tr": "{lake}: çözüm {index}, {fleet} araç yörüngesi, gölün tüm sınırları ve görev başlangıcındaki yoğunluk"
  },
  "Boat {index}": {
    "ru": "Аппарат {index}",
    "tr": "Araç {index}"
  },
  "Recorded bloom snapshot · simulation hour {hour}. The bloom moves during the mission; this background stays fixed for comparison.": {
    "ru": "Записанный снимок цветения · час симуляции {hour}. Во время миссии цветение перемещается; фон остаётся неподвижным для сравнения.",
    "tr": "Kaydedilmiş alg patlaması anlık görüntüsü · simülasyon saati {hour}. Alg patlaması görev sırasında hareket eder; karşılaştırma için bu arka plan sabit kalır."
  },
  "0–{value} model units": {
    "ru": "0–{value} ед. модели",
    "tr": "0–{value} model birimi"
  },
  "Median repeat {repeat} · Generation {generation}": {
    "ru": "Медианный повтор {repeat} · Поколение {generation}",
    "tr": "Medyan tekrar {repeat} · Nesil {generation}"
  },
  "Source: {source} · final generation {generation} · {feasible}/{population} feasible · {front} nondominated · {exported} exported.": {
    "ru": "Источник: {source} · итоговое поколение {generation} · допустимых: {feasible}/{population} · недоминируемых: {front} · экспортировано: {exported}.",
    "tr": "Kaynak: {source} · son nesil {generation} · {feasible}/{population} uygun · {front} baskın olmayan · {exported} dışa aktarıldı."
  },
  "Could not load the explorer. Please reload the page or try serving this folder over HTTP.": {
    "ru": "Не удалось загрузить обозреватель. Обновите страницу или откройте папку через HTTP-сервер.",
    "tr": "Gezgin yüklenemedi. Sayfayı yenileyin veya bu klasörü bir HTTP sunucusu üzerinden açmayı deneyin."
  },
  "Lake Mendota": {
    "ru": "Озеро Мендота",
    "tr": "Mendota Gölü"
  },
  "Lake Campillo": {
    "ru": "Озеро Кампильо",
    "tr": "Campillo Gölü"
  }
};
  const supported = ['en', 'ru', 'tr'];
  const savedLanguage = () => { try { return localStorage.getItem('lang'); } catch (_) { return null; } };
  const requested = new URLSearchParams(location.search).get('lang');
  let language = [requested, savedLanguage(), navigator.language.slice(0, 2)].find(lang => supported.includes(lang)) || 'en';
  function t(text, values = {}) {
    const translated = translations[text]?.[language] || text;
    return translated.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
  }
  // Capture original text nodes once so language changes never overwrite controls or SVGs.
  const nodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode, key = node.textContent.trim();
    if (!node.parentElement.closest('script, style') && translations[key]) nodes.push({ node, key, original: node.textContent });
  }
  const attributes = [...document.querySelectorAll('[aria-label]')].map(node => ({node, key: node.getAttribute('aria-label')}));
  function apply(lang, persist = false) {
    if (!supported.includes(lang)) return;
    language = lang;
    document.documentElement.lang = lang;
    document.title = t('Multi-ASV · Pareto Solution Explorer');
    nodes.forEach(({node, key, original}) => { node.textContent = original.replace(key, t(key)); });
    attributes.forEach(({node, key}) => { node.setAttribute('aria-label', t(key)); });
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
    for (const id of ['portfolio-link', 'full-page-link']) {
      const link = document.getElementById(id), url = new URL(link.href);
      url.searchParams.set('lang', lang); link.href = url.href;
    }
    if (persist) {
      try { localStorage.setItem('lang', lang); } catch (_) {}
      try { const url = new URL(location.href); url.searchParams.set('lang', lang); history.replaceState(null, '', url); } catch (_) {}
    }
    document.dispatchEvent(new CustomEvent('portfolio:language', {detail: lang}));
  }
  window.explorerI18n = { t, get language() { return language; } };
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => apply(button.dataset.lang, true)));
  window.addEventListener('storage', event => { if (event.key === 'lang') apply(event.newValue); });
  apply(language);
})();
