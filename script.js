(() => {
  const S = window.SITE;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const ALL = [...S.types, ...S.services];
  const rub = (n) => Math.round(n).toLocaleString("ru-RU").replace(/\s/g, " ") + " ₽";
  const plain = (html) => html.replace(/&nbsp;/g, " ");
  const tel = "tel:" + S.phone.replace(/[^\d+]/g, "");
  const arrow = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const icons = {
    repair: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    water: '<path d="M12 2.7s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11z"/>',
    track: '<path d="M3 5h18M7 5v4M12 5v4M17 5v4"/><path d="M5 13a2 2 0 0 0 4 0M10 13a2 2 0 0 0 4 0M15 13a2 2 0 0 0 4 0"/>',
    walls: '<path d="M3 4h18v16H3zM8 4v16M13 4v16M18 4v16"/>',
    heat: '<path d="M8 3c-1.5 2 1.5 3 0 5s1.5 3 0 5M12 3c-1.5 2 1.5 3 0 5s1.5 3 0 5M16 3c-1.5 2 1.5 3 0 5s1.5 3 0 5M4 19h16"/>',
  };
  const priceText = (t) => (t.unit === "m2" ? `от ${rub(t.price)} за м²` : `от ${rub(t.price)}`);

  // Логотип: комната в разрезе — стены, полотно потолка и световая линия под ним
  const mark = '<svg viewBox="0 0 32 32" aria-hidden="true"><path class="m-wall" d="M4 27V7.5M28 27V7.5"/><path class="m-ceil" d="M2.5 6.5h27"/><path class="m-light" d="M9 11h14"/></svg>';
  // Если у фирмы есть свой логотип — ставим его вместо значка
  const logo = S.logo ? `<img src="${S.logo}" alt="">` : mark;
  $$(".logo__mark").forEach((el) => { el.innerHTML = logo; el.classList.toggle("logo__mark--img", !!S.logo); });

  // Данные фирмы
  // Город необязателен: пустой city нигде не выводится
  const city = S.city ? `${S.city}, ` : "";
  const isWorks = !!$("#works-list");
  document.title = isWorks
    ? `Работы и отзывы — ${S.name}`
    : `${S.name} — ${S.tagline}${S.city ? ` в городе ${S.city}` : ""}`;
  $("#logo-name").textContent = S.name;
  if ($("#hero-city")) $("#hero-city").textContent = S.city ? `${S.city} / замер в день обращения` : "Замер в день обращения";
  $("#top-phone-label").textContent = S.phone;
  $("#top-phone").href = tel;
  $("#dock-call").href = tel;

  // Блоки главной страницы; на works.html их нет
  if ($("#types")) $("#types").innerHTML = S.types.map((t) => `
    <article class="glass type rise" data-id="${t.id}">
      <div class="type__photo"><img src="assets/types/${t.id}.jpg" alt="${plain(t.name)}" loading="lazy"></div>
      <div class="type__body">
        <h3>${t.name}</h3>
        <span class="type__price">${priceText(t)}</span>
        <div class="type__more"><p>${t.text}</p></div>
        <div class="type__acts">
          <button class="btn btn--ghost" data-more><span class="btn__fill"></span><span class="btn__label">Что это</span></button>
          <button class="btn btn--solid" data-order="${t.id}"><span class="btn__fill"></span><span class="btn__label">Заказать</span></button>
        </div>
      </div>
    </article>`).join("");

  if ($("#services-list")) $("#services-list").innerHTML = S.services.map((t) => `
    <li class="glass service rise">
      <span class="service__ico"><svg viewBox="0 0 24 24">${icons[t.id] || ""}</svg></span>
      <h3>${t.name}</h3>
      <span class="service__price">${priceText(t)}</span>
      <p>${t.text}</p>
      <button class="service__go" data-order="${t.id}">Оставить заявку ${arrow}</button>
    </li>`).join("");

  if ($("#promos-list")) $("#promos-list").innerHTML = S.promos.map((p) => `
    <article class="glass promo rise">
      <span class="promo__n">${p.n}</span>
      <h3>${p.title}</h3>
      <p>${p.text}</p>
    </article>`).join("");

  if ($("#faq-list")) $("#faq-list").innerHTML = S.faq.map((f) => `
    <div class="glass q rise">
      <button class="q__btn" aria-expanded="false"><span>${f.q}</span><span class="q__plus"></span></button>
      <div class="q__a"><p>${f.a}</p></div>
    </div>`).join("");

  // Вторая страница: работы и отзывы. Пока данных нет — карточки-заготовки
  const camera = '<svg viewBox="0 0 24 24"><path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  const quote = '<svg viewBox="0 0 24 24"><path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6"/></svg>';
  if (isWorks) {
    const works = S.works || [], reviews = S.reviews || [];
    $("#works-list").innerHTML = works.length
      ? works.map((w) => `
        <figure class="glass work rise">
          <div class="work__photo"><img src="${w.photo}" alt="${plain(w.title || "")}" loading="lazy"></div>
          <figcaption><h3>${w.title || ""}</h3>${w.meta ? `<span>${w.meta}</span>` : ""}</figcaption>
        </figure>`).join("")
      : Array.from({ length: 6 }, () => `
        <div class="work work--empty rise"><span class="empty__ico">${camera}</span><span>Здесь будет фото работы</span></div>`).join("");
    $("#reviews-list").innerHTML = reviews.length
      ? reviews.map((r) => `
        <article class="glass review rise">
          <span class="review__stars" aria-label="Оценка ${r.stars || 5} из 5">${"★".repeat(r.stars || 5)}</span>
          <p>${r.text}</p>
          <footer><b>${r.name}</b>${r.date ? `<span>${r.date}</span>` : ""}</footer>
        </article>`).join("")
      : Array.from({ length: 3 }, () => `
        <div class="review review--empty rise"><span class="empty__ico">${quote}</span><span>Здесь будет отзыв клиента</span></div>`).join("");
  }

  $("#contacts-info").innerHTML = `
    <span class="label">Контакты</span>
    <a href="${tel}">${S.phone}</a>
    <span>${city}${S.address}</span>
    <span>${S.hours}</span>
    <a href="https://wa.me/${S.whatsapp}">Написать в&nbsp;WhatsApp</a>
    ${S.vk ? `<a href="${S.vk}">Группа ВКонтакте</a>` : ""}`;
  $("#foot-name").textContent = S.name;
  $("#foot-year").textContent = `${S.name} / ${S.tagline} / ${S.city ? `${S.city} / ` : ""}${new Date().getFullYear()}`;

  // «Что это» раскрывает описание, вопросы — аккордеон
  document.addEventListener("click", (e) => {
    const more = e.target.closest("[data-more]");
    if (more) {
      const card = more.closest(".type");
      card.classList.toggle("is-open");
      more.querySelector(".btn__label").textContent = card.classList.contains("is-open") ? "Свернуть" : "Что это";
    }
    const q = e.target.closest(".q__btn");
    if (q) {
      const open = q.parentElement.classList.toggle("is-open");
      q.setAttribute("aria-expanded", open);
    }
  });

  // Свет на карточках идёт за курсором
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest && e.target.closest(".glass");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, { passive: true });

  // Шапка и меню
  const top = $(".top");
  $(".burger").addEventListener("click", () => top.classList.toggle("is-menu"));
  $$(".nav a").forEach((a) => a.addEventListener("click", () => top.classList.remove("is-menu")));

  // При прокрутке первого экрана фото отъезжает, а тёплый свет снизу разгорается
  const hero = $(".hero");  // только на главной
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const p = Math.min(1, Math.max(0, scrollY / innerHeight));
    if (hero) hero.style.setProperty("--p", p.toFixed(3));
    top.classList.toggle("is-scrolled", scrollY > 40);
    document.body.classList.toggle("is-past", scrollY > innerHeight * 0.8);
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // Заголовки режем на слова, чтобы они проявлялись по одному, как в образце
  $$(".split").forEach((h) => {
    [...h.childNodes].forEach((node) => {
      if (node.nodeType !== 3) return;
      const frag = document.createDocumentFragment();
      node.textContent.split(/( )/).forEach((part) => {
        if (part === " ") return frag.append(" ");
        if (!part) return;
        const w = document.createElement("span");
        w.className = "w";
        w.textContent = part;
        frag.append(w);
      });
      node.replaceWith(frag);
    });
    const base = +(h.dataset.d || 0);
    $$(".w", h).forEach((w, i) => w.style.setProperty("--d", `${base + i * 70}ms`));
    delete h.dataset.d;
  });

  // Появление лесенкой: 100 мс между смысловыми группами, 50 мс между однотипными
  $$("[data-d]").forEach((el) => el.style.setProperty("--d", el.dataset.d + "ms"));
  $$(".reveal").forEach((sec) => {
    let t = 0;
    $$(".rise, .split", sec).forEach((el) => {
      if (el.matches(".split")) {
        $$(".w", el).forEach((w, i) => w.style.setProperty("--d", `${t + i * 70}ms`));
        t += 200;
        return;
      }
      if (el.dataset.d) return;
      el.style.setProperty("--d", `${t}ms`);
      t += el.matches(".type, .service, .promo, .q, .step, .work, .review") ? 50 : 100;
    });
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-in");
      io.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((s) => io.observe(s));
  const start = () => hero && hero.classList.add("is-in");
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(start));
  setTimeout(start, 1500);

  // Калькулятор
  const modal = $("#modal");
  const form = $("#order");
  const area = $("#area");
  const range = $("#area-range");
  const phone = $("#phone");
  $("#type-tiles").innerHTML = S.types.map((t) => `
    <label class="tile-pick"><input type="radio" name="type" value="${t.id}">
      <span class="tile-pick__in"><img src="assets/types/${t.id}.jpg" alt="" loading="lazy"><span class="tile-pick__name">${t.name}</span></span>
    </label>`).join("");
  $("#chips").innerHTML = S.services.map((t) => `
    <label class="chip"><input type="radio" name="type" value="${t.id}"><span>${t.name}</span></label>`).join("");

  const openModal = (id) => {
    form.classList.remove("is-done");
    $("#fail").classList.remove("is-on");
    if (id) {
      const r = form.querySelector(`input[name="type"][value="${id}"]`);
      if (r) r.checked = true;
    }
    update();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
  };
  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  };
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-order]");
    if (btn) { e.preventDefault(); openModal(btn.dataset.order); }
    if (e.target.closest("[data-close]")) closeModal();
    const step = e.target.closest("[data-step]");
    if (step) setArea((parseFloat(area.value) || 0) + +step.dataset.step);
    if (e.target.closest("[data-to-form]")) { $(".calc__bill").scrollIntoView({ behavior: "smooth" }); setTimeout(() => phone.focus({ preventScroll: true }), 500); }
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });

  const picked = () => ALL.find((t) => t.id === (form.querySelector('input[name="type"]:checked') || {}).value);
  const m2 = () => Math.max(0, parseFloat(String(area.value).replace(",", ".")) || 0);
  const calc = () => {
    const t = picked();
    if (!t) return { total: 0, rows: [] };
    const base = t.unit === "m2" ? t.price * m2() : t.price;
    const rows = [
      [t.unit === "m2" ? `${plain(t.name)}, ${m2()} м² × ${rub(t.price)}` : `${plain(t.name)}, работа мастера`, rub(base)],
      ["Полотно, профиль и монтаж", "входят в цену"],
      ["Замер и выезд", "бесплатно"],
    ];
    return { total: Math.round(base / 100) * 100, rows };
  };
  const setArea = (v) => {
    area.value = Math.max(1, Math.min(1000, Math.round(v)));
    range.value = area.value;
    update();
  };

  // Сумма «докручивается» до нового значения
  let shown = 0, anim;
  const countTo = (to) => {
    cancelAnimationFrame(anim);
    const from = shown, t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / 700);
      shown = from + (to - from) * (1 - Math.pow(1 - k, 4));
      $("#sum").textContent = $("#mini-sum").textContent = (picked() ? "от " : "") + rub(shown);
      if (k < 1) anim = requestAnimationFrame(tick);
    };
    anim = requestAnimationFrame(tick);
  };
  function update() {
    const t = picked();
    const { total, rows } = calc();
    range.style.setProperty("--fill", `${(Math.min(range.max, m2()) - range.min) / (range.max - range.min) * 100}%`);
    $("#bill").innerHTML = t
      ? rows.map(([a, b]) => `<li><span>${a}</span><span>${b}</span></li>`).join("")
      : `<li><span>Выберите, что нужно сделать</span><span></span></li>`;
    countTo(t ? total : 0);
    if (t) $("#err-type").parentElement.classList.remove("is-bad");
  }
  range.addEventListener("input", () => { area.value = range.value; update(); });
  area.addEventListener("input", () => { range.value = area.value; update(); });
  form.addEventListener("change", (e) => { if (e.target.name === "type") update(); });

  // Маска телефона +7 (___) ___-__-__
  const digits = (v) => {
    let d = v.replace(/\D/g, "");
    if (d.startsWith("8")) d = "7" + d.slice(1);
    if (d && !d.startsWith("7")) d = "7" + d;
    return d.slice(0, 11);
  };
  phone.addEventListener("input", () => {
    const d = digits(phone.value);
    const p = d.slice(1);
    let out = d ? "+7" : "";
    if (p.length) out += " (" + p.slice(0, 3);
    if (p.length >= 3) out += ") " + p.slice(3, 6);
    if (p.length >= 6) out += "-" + p.slice(6, 8);
    if (p.length >= 8) out += "-" + p.slice(8, 10);
    phone.value = out;
    if (d.length === 11) phone.parentElement.classList.remove("is-bad");
  });
  phone.addEventListener("focus", () => { if (!phone.value) phone.value = "+7 ("; });

  // Отправка заявки в Telegram фирмы
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const t = picked();
    const okPhone = digits(phone.value).length === 11;
    $("#err-type").parentElement.classList.toggle("is-bad", !t);
    phone.parentElement.classList.toggle("is-bad", !okPhone);
    if (!t) { $("#chips").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    if (!okPhone) return;
    if (!$("#agree").checked) {
      $("#fail").textContent = "Нужно согласие на обработку данных";
      $("#fail").classList.add("is-on");
      return;
    }

    const data = new FormData(form);
    const text = [
      "<b>Новая заявка с сайта</b>",
      "",
      `<b>Телефон:</b> ${esc(phone.value)}`,
      `<b>Имя:</b> ${esc(data.get("name") || "не указано")}`,
      `<b>Что нужно:</b> ${esc(plain(t.name))}`,
      `<b>Площадь:</b> ${esc(m2())} м²`,
      `<b>Расчёт на сайте:</b> от ${rub(calc().total)}`,
      `<b>Комментарий:</b> ${esc(data.get("comment") || "нет")}`,
    ].join("\n");

    const send = $("#send");
    send.classList.add("is-busy");
    $("#fail").classList.remove("is-on");
    try {
      if (!S.telegram.botToken || !S.telegram.chatId) {
        console.warn("Демо-режим: бот не подключён (data.js > telegram). Текст заявки:\n" + text);
      } else {
        // Простой POST без JSON — браузер не делает предварительный запрос, работает и с диска
        const res = await fetch(`https://api.telegram.org/bot${S.telegram.botToken}/sendMessage`, {
          method: "POST",
          body: new URLSearchParams({ chat_id: S.telegram.chatId, text, parse_mode: "HTML" }),
        });
        const json = await res.json();
        if (!json.ok) throw new Error(json.description);
      }
      form.classList.add("is-done");
      form.reset();
      area.value = range.value = 18;
    } catch (err) {
      console.error(err);
      $("#fail").innerHTML = `Не получилось отправить. Позвоните нам: <a href="${tel}">${S.phone}</a>`;
      $("#fail").classList.add("is-on");
    } finally {
      send.classList.remove("is-busy");
    }
  });
})();
