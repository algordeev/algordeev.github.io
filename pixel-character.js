/* Pixel portrait refined from Aleksandr’s photos: swept-back sandy hair and an oval face.
 * Interaction inspired by https://nisakocagenis.github.io/ (no copied assets).
 */
(() => {
  'use strict';
  const game = document.getElementById('pixel-game');
  const controls = document.getElementById('pixel-controls');
  const player = document.getElementById('pixel-player');
  const canvas = document.getElementById('pixel-sprite');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = 14 * 4;
  canvas.height = 24 * 4;
  const shadow = document.getElementById('pixel-shadow');
  const bubble = document.getElementById('pixel-bubble');
  const toggle = document.getElementById('pixel-toggle');
  const hint = document.getElementById('pixel-hint');
  const keyHint = document.getElementById('pixel-key-hint');
  const helpButton = document.getElementById('pixel-help-toggle');
  let helpOpen = false;
  const jumpButton = document.getElementById('pixel-jump');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const touch = matchMedia('(hover: none)');
  const copy = {
    en: {
      hint: 'Click empty space to walk · click me to jump',
      keys: '← → / A D walk · ↑ / W / Space jump',
      touch: 'Tap empty space to walk · tap me to jump',
      hide: 'Hide me', show: 'Show pixel me', top: 'Back to top ↑',
      player: 'Mini Aleksandr. Use left and right arrows or A/D to walk; Up, W or Space to jump. Click to say hi.',
      controls: 'Character controls', left: 'Walk left', right: 'Walk right', jump: 'Jump',
      hello: 'Hi! I build autonomous systems 🤖',
      clicks: ['Hi there! 👋', 'Tiny pixels, big dreams ✨', 'Thanks for stopping by! ✨', 'You found me! 👀', 'Have a lovely day! ☀️']
    },
    ru: {
      hint: 'Клик по пустому месту — идти · клик по мне — прыгнуть',
      keys: '← → / A D — идти · ↑ / W / Пробел — прыгнуть',
      touch: 'Касание пустого места — идти · касание меня — прыгнуть',
      hide: 'Скрыть меня', show: 'Показать пиксельного меня', top: 'Снова наверх ↑',
      player: 'Мини-Александр. Стрелки влево и вправо или A/D — идти; ↑, W или пробел — прыгнуть. Нажмите, чтобы поздороваться.',
      controls: 'Управление персонажем', left: 'Идти влево', right: 'Идти вправо', jump: 'Прыгнуть',
      hello: 'Привет! Я создаю автономные системы 🤖',
      clicks: ['Привет-привет! 👋', 'Маленькие пиксели, большие мечты ✨', 'Спасибо, что заглянули! ✨', 'Вы меня нашли! 👀', 'Хорошего вам дня! ☀️']
    },
    tr: {
      hint: 'Boş alana tıkla, yürüyeyim · bana tıkla, zıplayayım',
      keys: '← → / A D yürü · ↑ / W / Boşluk zıpla',
      touch: 'Yürümek için boş alana · zıplamak için bana dokun',
      hide: 'Beni gizle', show: 'Piksel beni göster', top: 'Başa dön ↑',
      player: 'Mini Aleksandr. Yürümek için sol/sağ okları veya A/D; zıplamak için ↑, W veya Boşluk. Selam vermek için tıkla.',
      controls: 'Karakter kontrolleri', left: 'Sola yürü', right: 'Sağa yürü', jump: 'Zıpla',
      hello: 'Merhaba! Otonom sistemler geliştiriyorum 🤖',
      clicks: ['Selam! 👋', 'Küçük pikseller, büyük hayaller ✨', 'Uğradığın için teşekkürler! ✨', 'Beni buldun! 👀', 'Harika bir gün geçir! ☀️']
    }
  };
  const sectionCopy = {
    en: {
      home: copy.en.hello,
      about: 'From embedded electronics to autonomous systems 🔌',
      education: 'Engineering studies in Türkiye and Spain 🎓',
      experience: 'Research, robotics and hands-on engineering 🛠️',
      projects: 'Try the tram digital twin! 🚋',
      skills: 'C++, MATLAB, Java — my toolbox 🧰',
      achievements: 'Years of building and competing! 🏆',
      credentials: 'Always learning something new 📚',
      contact: 'Let’s build something together 🤝'
    },
    ru: {
      home: copy.ru.hello,
      about: 'От встраиваемой электроники до автономных систем 🔌',
      education: 'Инженерное образование в Турции и Испании 🎓',
      experience: 'Исследования, робототехника и инженерная практика 🛠️',
      projects: 'Попробуйте цифровой двойник трамвая! 🚋',
      skills: 'C++, MATLAB, Java — мои инструменты 🧰',
      achievements: 'Годы проектов и соревнований! 🏆',
      credentials: 'Всегда учусь чему-то новому 📚',
      contact: 'Давайте создадим что-нибудь вместе 🤝'
    },
    tr: {
      home: copy.tr.hello,
      about: 'Gömülü elektronikten otonom sistemlere 🔌',
      education: 'Türkiye ve İspanya’da mühendislik eğitimi 🎓',
      experience: 'Araştırma, robotik ve uygulamalı mühendislik 🛠️',
      projects: 'Tramvay dijital ikizini deneyin! 🚋',
      skills: 'C++, MATLAB, Java — alet çantam 🧰',
      achievements: 'Yıllardır geliştiriyor ve yarışıyorum! 🏆',
      credentials: 'Her zaman yeni bir şey öğreniyorum 📚',
      contact: 'Birlikte bir şeyler geliştirelim 🤝'
    }
  };
  let words;
  let hidden = motion.matches; // No unsolicited animation with reduced motion.
  try {
    const saved = localStorage.getItem('portfolio:character-hidden');
    if (saved !== null) hidden = saved === '1';
  } catch (_) {}

  // Clothes use a 14 × 24 grid; the face uses twice the detail at the same size.
  const spriteWidth = 14, pixelScale = 4;
  const palette = {
    o: '#353943', h: '#92764f', l: '#b99c70', a: '#947c5e',
    s: '#e9bd9b', t: '#d5a17e', n: '#bb8968', m: '#b68a73',
    e: '#748077', q: '#303b39',
    b: '#8fb2dc', c: '#7299c1', j: '#394560', k: '#29354f',
    w: '#f2f2ed', g: '#9da3af'
  };
  const portrait = [
    '..........ooooooooo.........',
    '........ohhlllllllhho.......',
    '.......ohhllllllllllho......',
    '......ohllllllllllllhho.....',
    '......ollllhssssssthhhho....',
    '.....ohlllsssssssssthhlo....',
    '.....olllsssssssssssthlo....',
    '.....ollssssssssssssthlo....',
    '.....ollsaaassssaaasthlo....',
    '.....ollsseessssseesthlo....',
    '.....oltssqesssssqesttlo....',
    '.....olssssssstssssstslho...',
    '.....oltsssssstsssssttlho...',
    '.....ollsssssnnsssssthlho...',
    '.....ollhssssssssssthhlho...',
    '.....ollhssssssssssthhlho...',
    '.....ollhhsssmmsssthhhlho...',
    '.....ollhhhssssssthhhhlho...',
    '......ollhhhssssthhhhhlho...',
    '......olllhhsssssthhhhlho...',
  ];
  const body = [
    '.oohbbccbbhoo.',
    '.obbbbbbbbboo.',
    'osobbbbbbbboso',
    'osobbbbbbbboso',
    'osobbbbbbbboso',
    'osobbbbbbbboso',
    'ooobbbbbbbbooo'
  ];
  const legs = {
    idle: ['..ojjjjjjjjo..', '..ojjjoojjjo..', '..ojkjoojkjo..', '..ojjjoojjjo..', '..ojjjoojjjo..', '..owwgoogwwo..', '..oooooooooo..'],
    run: ['..ojjjjjjjjo..', '..ojjjojjjo...', '.ojjjo.ojjjo..', '.ojjo...ojjjo.', 'ojjjo....ojjjo', 'owwgo....ogwwo', 'oooo......oooo'],
    lift: ['..ojjjjjjjjo..', '..ojjjoojjjo..', '..ojjjoojkjo..', '..ojjjooowwo..', '..ojjjoogwwo..', '..owwgooooo...', '..oooo........'],
    jump: ['..ojjjjjjjjo..', '.ojjjoojjjjo..', '.ojjoo..ojjjo.', '.owwgo..ogwwo.', '.ooooo..ooooo.', '..............', '..............']
  };
  legs.other = legs.lift.map(row => [...row].reverse().join(''));
  let x = Math.min(64, Math.max(0, innerWidth - 56)), y = 0, vy = 0, facing = 1;
  let target = null, pressed = new Set(), pointerDirection = 0, pointerId = null;
  let clock = 0, last = 0, frameId = 0, nextWander = performance.now() + 7000;
  let bubbleUntil = 0;
  let blinkUntil = 0, nextBlink = performance.now() + 2500 + Math.random() * 3000;
  let activeSection = 'home', speechSection = null;
  let lastClickMessage = -1, speechClick = null;
  const sectionWords = () => sectionCopy[document.documentElement.lang] || sectionCopy.en;
  const width = () => player.offsetWidth || 56;
  const limit = () => Math.max(0, document.documentElement.clientWidth - width());
  const blocked = () => document.hidden || hidden || !!document.querySelector('dialog[open]') || !document.getElementById('section-menu').hidden;
  function draw(frame, blinking) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    body.concat(frame).forEach((row, rowIndex) => [...row].forEach((pixel, px) => {
      if (!palette[pixel]) return;
      const dx = (facing === 1 ? px : spriteWidth - 1 - px) * pixelScale;
      ctx.fillStyle = palette[pixel];
      ctx.fillRect(dx, (rowIndex + 10) * pixelScale, pixelScale, pixelScale);
    }));
    portrait.forEach((row, py) => [...row].forEach((pixel, px) => {
      if (!palette[pixel]) return;
      // Keep the portrait facing forward; only the body mirrors with travel.
      const dx = px * 2;
      const eye = pixel === 'e' || pixel === 'q';
      // Keep facial details on the same square-pixel grid as the portrait.
      ctx.fillStyle = palette[blinking && eye ? 's' : pixel];
      ctx.fillRect(dx, py * 2, 2, 2);
      if (blinking && eye && py === 10) {
        ctx.fillStyle = palette.q;
        ctx.fillRect(dx, py * 2, 2, 2);
      }
    }));
  }
  function render(now, running) {
    if (!motion.matches && now >= nextBlink) {
      blinkUntil = now + 140;
      nextBlink = now + 3000 + Math.random() * 3000;
    }
    const bob = running && y === 0 && !motion.matches ? Math.sin(clock * 20) * 2 : 0;
    player.style.transform = `translate3d(${x}px, ${-y - bob}px, 0)`;
    shadow.style.transform = `translateX(${x + width() / 2}px) scale(${1 - Math.min(y, 100) / 170})`;
    draw(y > 0 ? legs.jump : running ? [legs.run, legs.lift, legs.run, legs.other][Math.floor(clock * 10) % 4] : legs.idle, !motion.matches && now < blinkUntil);
    bubble.hidden = now > bubbleUntil;
    bubble.style.setProperty('--bubble-shift', `${Math.max(90 - x - width() / 2, Math.min(0, document.documentElement.clientWidth - 90 - x - width() / 2))}px`);
  }
  function say(text, section = null) {
    bubble.textContent = text;
    speechSection = section;
    speechClick = null;
    bubbleUntil = performance.now() + 4200;
    start();
  }
  function saySection() {
    if (!blocked()) say(sectionWords()[activeSection], activeSection);
  }
  function activeInput() { nextWander = performance.now() + 8000; }
  function clearInput() { pressed.clear(); pointerDirection = 0; pointerId = null; target = null; }
  function jump() { if (!blocked() && y === 0) { vy = 470; activeInput(); start(); } }
  function loop(now) {
    frameId = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.032) : 0;
    last = now;
    if (blocked()) { clearInput(); last = 0; return; }
    let dir = pointerDirection || (pressed.has('left') ? -1 : 0) + (pressed.has('right') ? 1 : 0);
    if (!dir && target !== null) {
      const distance = target - x;
      if (Math.abs(distance) <= 210 * dt + 1) { x = target; target = null; }
      else dir = Math.sign(distance);
    }
    if (dir) { facing = dir; x += dir * 210 * dt; clock += dt; } else clock = 0;
    x = Math.max(0, Math.min(limit(), x));
    if (y > 0 || vy > 0) { vy -= 1450 * dt; y = Math.max(0, y + vy * dt); if (y === 0 && vy <= 0) vy = 0; }
    if (!motion.matches && now > nextWander && target === null && !pressed.size && !pointerDirection) {
      target = Math.random() * limit();
      nextWander = now + 5000 + Math.random() * 5000;
      if (Math.random() < 0.4) vy = 470;
    }
    render(now, !!dir);
    if (!motion.matches || dir || target !== null || y > 0 || vy > 0 || now < bubbleUntil) frameId = requestAnimationFrame(loop);
    else last = 0;
  }
  function start() { if (!frameId && !blocked()) frameId = requestAnimationFrame(loop); }
  function refresh() {
    words = copy[document.documentElement.lang] || copy.en;
    hint.textContent = touch.matches ? words.touch : words.hint;
    keyHint.textContent = words.keys;
    helpButton.setAttribute('aria-label', words.controls);
    helpButton.hidden = hidden;
    toggle.textContent = hidden ? words.show : words.hide;
    toggle.setAttribute('aria-expanded', String(!hidden));
    player.setAttribute('aria-label', words.player);
    controls.setAttribute('aria-label', words.controls);
    jumpButton.setAttribute('aria-label', words.jump);
    document.querySelectorAll('[data-pixel-move]').forEach(button => button.setAttribute('aria-label', button.dataset.pixelMove === '-1' ? words.left : words.right));
    game.hidden = hidden;
    controls.hidden = false;
    controls.classList.toggle('pixel-is-hidden', hidden);
    if (speechSection) bubble.textContent = sectionWords()[speechSection];
    else if (speechClick !== null) bubble.textContent = words.clicks[speechClick];
    render(performance.now(), false);
    start();
  }
  toggle.addEventListener('click', () => {
    hidden = !hidden;
    clearInput(); y = vy = 0; bubbleUntil = 0;
    try { localStorage.setItem('portfolio:character-hidden', hidden ? '1' : '0'); } catch (_) {}
    setHelp(false);
    controls.classList.remove('pixel-intro');
    refresh();
    if (!hidden) saySection();
  });
  function setHelp(open) {
    helpOpen = open;
    controls.classList.toggle('pixel-help-open', open);
    helpButton.setAttribute('aria-expanded', String(open));
  }
  helpButton.addEventListener('click', () => setHelp(!helpOpen));
  document.addEventListener('click', event => {
    if (!event.target.closest('.pixel-controls')) setHelp(false);
  });
  controls.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      setHelp(false);
      controls.classList.remove('pixel-intro');
      helpButton.blur();
    }
  });
  const actions = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'jump', KeyW: 'jump', Space: 'jump' };
  function interactive(element) { return !!element.closest('a, button, input, textarea, select, video, audio, summary, dialog, [contenteditable], [role="button"], [role="textbox"], [tabindex]'); }
  addEventListener('keydown', event => {
    const action = actions[event.code];
    if (!action || blocked() || event.ctrlKey || event.metaKey || event.altKey || (interactive(event.target) && !player.contains(event.target))) return;
    event.preventDefault();
    activeInput();
    if (action === 'jump') { if (!event.repeat) jump(); }
    else { pressed.add(action); target = null; start(); }
  });
  addEventListener('keyup', event => { pressed.delete(actions[event.code]); });
  addEventListener('blur', clearInput);
  document.addEventListener('visibilitychange', () => { clearInput(); last = 0; start(); });
  document.addEventListener('click', event => {
    if (blocked() || interactive(event.target) || event.target.closest('.pixel-controls') || getSelection()?.toString()) return;
    target = Math.max(0, Math.min(limit(), event.clientX - width() / 2)); activeInput(); start();
  });
  function greetAndJump() {
    if (blocked()) return;
    target = null;
    jump();
    // Choose from all messages except the previous one, without retrying.
    let index = Math.floor(Math.random() * (words.clicks.length - (lastClickMessage < 0 ? 0 : 1)));
    if (lastClickMessage >= 0 && index >= lastClickMessage) index++;
    lastClickMessage = index;
    say(words.clicks[index]);
    speechClick = index;
  }
  // Act on press: a moving sprite may no longer be under the pointer on release.
  // Prevent pointer focus/selection while keeping normal keyboard focus available.
  player.addEventListener('pointerdown', event => {
    if (event.isPrimary === false || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    greetAndJump();
  });
  player.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    // Keyboard and assistive-technology activation have no pointer press.
    if (event.detail === 0) greetAndJump();
  });
  player.addEventListener('dragstart', event => event.preventDefault());
  jumpButton.addEventListener('click', jump);
  document.querySelectorAll('[data-pixel-move]').forEach(button => {
    button.addEventListener('pointerdown', event => {
      if (blocked()) return;
      button.setPointerCapture(event.pointerId);
      pointerId = event.pointerId;
      pointerDirection = Number(button.dataset.pixelMove); target = null; activeInput(); start();
    });
    const release = event => { if (event.pointerId === pointerId) { pointerDirection = 0; pointerId = null; } };
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
    // Keyboard and assistive technology can also activate these buttons.
    button.addEventListener('click', event => { if (event.detail === 0 && !blocked()) { target = Math.max(0, Math.min(limit(), x + Number(button.dataset.pixelMove) * 70)); activeInput(); start(); } });
  });
  addEventListener('resize', () => { x = Math.min(x, limit()); if (target !== null) target = Math.min(target, limit()); render(performance.now(), false); });
  document.addEventListener('portfolio:language', refresh);
  touch.addEventListener('change', refresh);
  motion.addEventListener('change', () => { clearInput(); activeInput(); start(); });
  // Pause while menus/dialogs are open, and resume when they close.
  const overlayObserver = new MutationObserver(() => {
    if (blocked()) clearInput();
    else { last = 0; start(); }
  });
  document.querySelectorAll('dialog, #section-menu').forEach(overlay => {
    overlayObserver.observe(overlay, { attributes: true, attributeFilter: ['open', 'hidden'] });
  });
  // A narrow viewport band picks the section being read, even for long sections.
  // Unlike a percentage threshold, this also works for sections taller than the screen.
  if ('IntersectionObserver' in window) {
    const sections = [...document.querySelectorAll('main > section')];
    const visibleSections = new Set();
    const contact = document.getElementById('contact');
    function contactAtPageEnd() {
      if (!contact) return false;
      const page = document.scrollingElement || document.documentElement;
      if (page.scrollHeight <= innerHeight || page.scrollTop + innerHeight < page.scrollHeight - 4) return false;
      const rect = contact.getBoundingClientRect();
      return rect.top < innerHeight && rect.bottom > 0;
    }
    function updateCurrentSection() {
      const readingLine = innerHeight * 0.35;
      const current = [...visibleSections].sort((a, b) => {
        const distance = section => {
          const rect = section.getBoundingClientRect();
          return Math.max(rect.top - readingLine, readingLine - rect.bottom, 0);
        };
        return distance(a) - distance(b) || sections.indexOf(b) - sections.indexOf(a);
      })[0];
      // The final, short section may never reach the reading band at maximum scroll.
      const name = contactAtPageEnd() ? 'contact' : current && (current.id || 'home');
      if (name && name !== activeSection) {
        activeSection = name;
        saySection();
      }
    }
    const updateSection = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visibleSections.add(entry.target);
        else visibleSections.delete(entry.target);
      });
      updateCurrentSection();
    };
    let scrollFrame = 0;
    addEventListener('scroll', () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        updateCurrentSection();
      });
    }, { passive: true });
    let sectionObserver;
    function observeSections() {
      if (sectionObserver) sectionObserver.disconnect();
      visibleSections.clear();
      sectionObserver = new IntersectionObserver(updateSection, {
        rootMargin: `-${Math.round(innerHeight * 0.25)}px 0px -${Math.round(innerHeight * 0.55)}px 0px`,
        threshold: 0
      });
      sections.forEach(section => sectionObserver.observe(section));
    }
    observeSections();
    addEventListener('resize', observeSections);
  }
  refresh();
  if (!hidden) {
    saySection();
    controls.classList.add('pixel-intro');
    setTimeout(() => controls.classList.remove('pixel-intro'), 2400);
  }
})();
