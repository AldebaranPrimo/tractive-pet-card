/*
 * Tractive Pet Card — a Home Assistant dashboard card for the pets tracked with the official Tractive integration:
 * today's activity against the daily goal, where the pet is, collar battery and status, the collar controls,
 * 14 days of activity and 7 days of presence and battery.
 * Entities are found automatically (platform "tractive"); nothing to configure for a single pet.
 * https://github.com/AldebaranPrimo/tractive-pet-card — MIT licence.
 */
const VERSION = "1.2.0";

const STRINGS = {
  en: {
    pets: "Pets",
    noPets: "No Tractive pet found",
    noPetsSub: "Add the Tractive integration, or set the entities in the card configuration.",
    goalReached: (n) => `${n} reached the daily goal`,
    goalReachedSub: (m, g, p) => `${m} of ${g} minutes (${p}%)`,
    almost: (r) => `Almost there: ${r} minutes to go`,
    halfway: (r) => `Halfway: ${r} minutes to go`,
    needs: (r) => `Needs activity today: ${r} minutes to go`,
    activitySub: (m, g, p) => `${m} of ${g} minutes (${p}%)`,
    walkHint: "a good moment for a walk",
    noHealth: "No activity data",
    noHealthSub: "Tractive sends activity only with a subscription that includes health data. Location, battery and collar still work.",
    activityOff: (t) => t ? `No activity data since ${t}` : "No activity data right now",
    activitySaving: (t) => t ? `Collar in power saving mode since ${t}` : "Collar in power saving mode",
    activityCloud: (t) => t ? `Tractive not reachable since ${t}` : "Tractive not reachable",
    activityOffSub: "Today's activity arrives with the next sync of the collar.",
    activitySavingSub: "The collar syncs rarely while saving power (usually at home or charging): today's activity arrives with the next sync.",
    activityCloudSub: "Home Assistant lost the connection to the Tractive cloud. Activity comes back when Tractive sends it again.",
    lastKnown: (v, w) => `Last value: ${v} min, ${w}.`,
    lastActivity: "Last activity", today: (t) => `today ${t}`, yesterday: (t) => `yesterday ${t}`,
    lowBattery: (b) => `Charge the collar: battery at ${b}%`,
    trackerIssue: (s) => `Collar: ${s}`,
    home: "at home", away: "away", homeSince: (t) => `at home since ${t}`, awayFor: (d) => `away for ${d}`, awayNow: "just went out",
    activityToday: "Activity today", dailyGoal: "Daily goal", battery: "Collar battery", status: "Collar status",
    where: "Where", rest: "Rest", daySleep: "Day sleep", nightSleep: "Night sleep", charging: "charging",
    min: "min", controls: "Collar controls",
    on: "on", off: "off", unavailable: "unavailable",
    controlsPowerSaving: "The controls are unavailable while the collar is in power saving mode (usually when the pet is at home or charging).",
    controlsHint: "Tap to switch on or off. Buzzer and light help to call the pet back when it is out of sight: use them sparingly, or they lose effect.",
    buzzer: "Buzzer", led: "Light", live: "Live tracking",
    days14: (g, n) => `Activity, last ${n} days (full bars = goal of ${g} min reached)`,
    days14NoGoal: (n) => `Activity, last ${n} days`,
    last7: "Last 7 days", presence: "At home", batteryLine: "Collar battery", homeTotal: (d) => `at home ${d}`, tipHome: (a, b) => `At home: ${a} – ${b}`,
    noData: "No data in this period", since: (d) => `history available since ${d}`,
    trackerStates: { operational: "working", not_reporting: "not reporting", inaccurate_position: "inaccurate position",
      system_shutdown_user: "switched off", system_startup: "starting up" },
    hours: (h, m) => h ? `${h} h ${m} min` : `${m} min`, daysHours: (d, h) => `${d} d ${h} h`,
  },
  it: {
    pets: "Animali",
    noPets: "Nessun animale Tractive trovato",
    noPetsSub: "Aggiungi l'integrazione Tractive, oppure indica le entità nella configurazione della scheda.",
    goalReached: (n) => `${n} ha raggiunto l'obiettivo di oggi`,
    goalReachedSub: (m, g, p) => `${m} di ${g} minuti (${p}%)`,
    almost: (r) => `Quasi fatta: mancano ${r} minuti`,
    halfway: (r) => `A metà strada: mancano ${r} minuti`,
    needs: (r) => `Serve attività oggi: mancano ${r} minuti`,
    activitySub: (m, g, p) => `${m} di ${g} minuti (${p}%)`,
    walkHint: "buon momento per una passeggiata",
    noHealth: "Nessun dato di attività",
    noHealthSub: "Tractive manda l'attività solo con un abbonamento che comprende i dati di salute. Posizione, batteria e collare funzionano lo stesso.",
    activityOff: (t) => t ? `Nessun dato di attività da ${t}` : "Nessun dato di attività adesso",
    activitySaving: (t) => t ? `Collare in risparmio energetico da ${t}` : "Collare in risparmio energetico",
    activityCloud: (t) => t ? `Tractive non raggiungibile da ${t}` : "Tractive non raggiungibile",
    activityOffSub: "L'attività di oggi arriva alla prossima sincronizzazione del collare.",
    activitySavingSub: "In risparmio energetico il collare si sincronizza di rado (di solito a casa o in carica): l'attività di oggi arriva alla prossima sincronizzazione.",
    activityCloudSub: "Home Assistant ha perso il collegamento con il cloud Tractive. L'attività torna quando Tractive la manda di nuovo.",
    lastKnown: (v, w) => `Ultimo valore: ${v} min, ${w}.`,
    lastActivity: "Ultima attività", today: (t) => `oggi alle ${t}`, yesterday: (t) => `ieri alle ${t}`,
    lowBattery: (b) => `Ricarica il collare: batteria al ${b}%`,
    trackerIssue: (s) => `Collare: ${s}`,
    home: "a casa", away: "fuori", homeSince: (t) => `a casa dalle ${t}`, awayFor: (d) => `fuori da ${d}`, awayNow: "appena uscito",
    activityToday: "Attività oggi", dailyGoal: "Obiettivo giornaliero", battery: "Batteria del collare", status: "Stato del collare",
    where: "Dove", rest: "Riposo", daySleep: "Sonno di giorno", nightSleep: "Sonno di notte", charging: "in carica",
    min: "min", controls: "Controlli del collare",
    on: "acceso", off: "spento", unavailable: "non disponibile",
    controlsPowerSaving: "I controlli non sono disponibili mentre il collare è in risparmio energetico (di solito quando l'animale è a casa o in carica).",
    controlsHint: "Tocca per accendere o spegnere. Suoneria e luce servono a richiamare l'animale quando è fuori vista: usale con parsimonia, o perdono efficacia.",
    buzzer: "Suoneria", led: "Luce", live: "Posizione in diretta",
    days14: (g, n) => `Attività, ultimi ${n} giorni (barre piene = obiettivo di ${g} min raggiunto)`,
    days14NoGoal: (n) => `Attività, ultimi ${n} giorni`,
    last7: "Ultimi 7 giorni", presence: "A casa", batteryLine: "Batteria del collare", homeTotal: (d) => `in casa ${d}`, tipHome: (a, b) => `A casa: ${a} – ${b}`,
    noData: "Nessun dato nel periodo", since: (d) => `storico disponibile dal ${d}`,
    trackerStates: { operational: "funziona", not_reporting: "non comunica", inaccurate_position: "posizione imprecisa",
      system_shutdown_user: "spento", system_startup: "in avvio" },
    hours: (h, m) => h ? `${h} h ${m} min` : `${m} min`, daysHours: (d, h) => `${d} g ${h} h`,
  },
};

const COLORS = { red: ["#d6453d", "#ffffff"], amber: ["#f2a33a", "#2a1a00"], green: ["#3aa55c", "#ffffff"], blue: ["#3d7be0", "#ffffff"], grey: ["#6b7078", "#ffffff"] };
const UNAVAILABLE = ["unavailable", "unknown", "none", ""];
// translation keys of the Tractive integration (homeassistant/components/tractive)
const KEYS = {
  activity: "activity_time", goal: "daily_goal", rest: "rest_time", daySleep: "minutes_day_sleep", nightSleep: "minutes_night_sleep",
  status: "tracker_state", tracker: "tracker", powerSaving: "tracker_power_saving", buzzer: "tracker_buzzer", led: "tracker_led", live: "live_tracking",
};
// fallback when the registry has no translation key: end of the entity id
const SUFFIXES = {
  activity: "_minutes_active", goal: "_daily_goal", rest: "_rest_time", daySleep: "_day_sleep", nightSleep: "_night_sleep", status: "_tracker_state",
  powerSaving: "_power_saving", buzzer: "_buzzer", led: "_led", live: "_live_tracking", battery: "_battery_level", charging: "_battery_charging",
};

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const checkLanguage = (v) => {
  if (v === undefined || v === null || v === "") return;
  let ok = typeof v === "string";
  try { ok = ok && Intl.getCanonicalLocales(v).length > 0; } catch (e) { ok = false; }
  if (!ok) throw new Error("language must be a language code like en or it-IT");
};
const day0 = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
function num(s) {
  if (!s || UNAVAILABLE.includes(String(s.state).toLowerCase())) return null;
  const v = parseFloat(s.state);
  return Number.isFinite(v) ? v : null;
}
const usable = (s) => !!s && !UNAVAILABLE.includes(String(s.state).toLowerCase());
// black or white text, whichever reads better on the colour
function textFor(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return "#ffffff";
  const n = parseInt(m[1], 16), lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255) > 0.4 ? "#1d1d1d" : "#ffffff";
}

class TractivePetCard extends HTMLElement {
  static getStubConfig() { return {}; }

  setConfig(config) {
    if (config.entities && (typeof config.entities !== "object" || Array.isArray(config.entities))) throw new Error("entities must be a map, e.g. { activity: sensor.x_activity_time }");
    if (config.color !== undefined && !/^#[0-9a-f]{6}$/i.test(config.color)) throw new Error("color must be like #8a6bd1");
    if (config.battery_scale !== undefined && !["fixed", "auto"].includes(config.battery_scale)) throw new Error("battery_scale must be fixed or auto");
    checkLanguage(config.language);
    const merged = { color: "#8a6bd1", days: 14, show_controls: true, show_history: true, show_home_total: true, battery_scale: "fixed", ...config };
    if (!Number.isInteger(merged.days) || merged.days < 1 || merged.days > 60) throw new Error("days must be a whole number from 1 to 60");
    this._config = merged;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._sig = null;
    this._stats = {};
    this._loadedAt = 0;
    if (this._hass) this._update(true);
  }

  set hass(hass) {
    this._hass = hass;
    this._update(false);
  }

  getCardSize() { return 8; }
  getGridOptions() { return { columns: "full" }; }

  _t() {
    const loc = this._config.language || this._hass?.locale?.language || this._hass?.language || "en";
    const lang = String(loc).slice(0, 2).toLowerCase();
    return { s: STRINGS[lang] || STRINGS.en, locale: loc };
  }

  _update(force) {
    const pets = this._pets();
    const ids = pets.flatMap((p) => Object.values(p.e)).filter(Boolean);
    const now = new Date();
    const sig = ids.map((id) => this._hass.states[id]?.last_updated).join("|") + `|${now.getHours()}:${Math.floor(now.getMinutes() / 5)}`;
    if (!force && sig === this._sig) return;
    this._sig = sig;
    this._render(pets);
    this._loadHistory(pets);
  }

  // one entry per pet: { name, e: { activity, goal, ..., tracker, person } }
  _pets() {
    const h = this._hass, c = this._config, reg = h.entities || {}, devs = h.devices || {};
    const tractive = Object.values(reg).filter((x) => x.platform === "tractive" && h.states[x.entity_id]);
    const role = (x) => {
      const id = x.entity_id;
      for (const [k, tk] of Object.entries(KEYS)) if (x.translation_key === tk) return k;
      if (id.startsWith("device_tracker.")) return "tracker";
      const dc = h.states[id]?.attributes?.device_class;
      if (id.startsWith("sensor.") && dc === "battery") return "battery";
      if (id.startsWith("binary_sensor.") && dc === "battery_charging") return "charging";
      for (const [k, suf] of Object.entries(SUFFIXES)) if (id.endsWith(suf)) return k;
      return null;
    };
    // group by pet device; a collar device belongs to the pet whose device is "via" it
    const byDevice = {};
    tractive.forEach((x) => { const r = role(x); if (r) (byDevice[x.device_id || x.entity_id] ||= {})[r] ||= x.entity_id; });
    const pets = [];
    const collars = new Set();
    for (const [devId, e] of Object.entries(byDevice)) {
      const via = devs[devId]?.via_device_id;
      if (via && byDevice[via]) { Object.assign(e, { ...byDevice[via], ...e }); collars.add(via); }
    }
    for (const [devId, e] of Object.entries(byDevice)) {
      if (collars.has(devId)) continue;
      // a collar alone: the pet device connected through it gives the name, even when it has no entities here
      const d = Object.values(devs).find((x) => x.via_device_id === devId) || devs[devId];
      const name = d?.name_by_user || d?.name || h.states[e.activity || e.tracker || Object.values(e)[0]]?.attributes?.friendly_name || "Tractive";
      pets.push({ id: devId, name, e });
    }
    // the person that uses the collar, for "at home since"
    pets.forEach((p) => {
      if (p.e.tracker && !p.e.person) {
        const person = Object.values(h.states).find((s) => s.entity_id.startsWith("person.") && (s.attributes.device_trackers || []).includes(p.e.tracker));
        if (person) p.e.person = person.entity_id;
      }
    });
    let list = pets.sort((a, b) => a.name.localeCompare(b.name));
    if (c.pet) list = list.filter((p) => p.id === c.pet || p.name.toLowerCase() === String(c.pet).toLowerCase());
    if (c.entities) {
      const base = list[0] || { id: "config", name: c.name || "", e: {} };
      list = [{ ...base, name: c.name || base.name, e: { ...base.e, ...c.entities } }];
    }
    return list;
  }

  // 14 days of activity from hourly statistics; presence and battery from history (7 days)
  async _loadHistory(pets) {
    if (!this._hass.callWS || !pets.length) return;
    const now = Date.now();
    if (this._loadedAt && now - this._loadedAt < 15 * 60000 && this._loadedFor === pets.map((p) => p.id).join()) return;
    this._loadedAt = now;
    this._loadedFor = pets.map((p) => p.id).join();
    const c = this._config, start = day0(new Date()); start.setDate(start.getDate() - c.days);
    const act = pets.map((p) => p.e.activity).filter(Boolean);
    const hist = pets.flatMap((p) => [p.e.person || p.e.tracker, p.e.battery, p.e.goal, p.e.activity]).filter(Boolean);
    try {
      const [st, hi] = await Promise.all([
        act.length ? this._hass.callWS({ type: "recorder/statistics_during_period", start_time: start.toISOString(), period: "hour", statistic_ids: act, types: ["state", "max"] }) : {},
        hist.length ? this._hass.callWS({ type: "history/history_during_period", start_time: new Date(now - 7 * 86400000).toISOString(),
          entity_ids: hist, minimal_response: true, no_attributes: true, significant_changes_only: false }) : {},
      ]);
      this._stats = st || {};
      this._hist = hi || {};
    } catch (err) {
      this._stats = {};
      this._hist = {};
    }
    this._render(pets);
  }

  // the Tractive activity counter restarts every day, at the first sync after midnight: until then the sensor keeps
  // yesterday's final value. A new day starts at the first value different from yesterday's last one (in the data,
  // never higher: no late updates of yesterday arrive after midnight). Returns { "y-m-d": minutes }.
  _daily(id) {
    const rows = (this._stats?.[id] || []).map((r) => ({ t: r.start, v: Number.isFinite(r.state) ? r.state : Number.isFinite(r.max) ? r.max : null }))
      .filter((r) => r.v !== null).sort((a, b) => a.t - b.t);
    const out = {};
    let cur = null, prevDay = null, started = false, last = null;
    for (const r of rows) {
      const k = dayKey(new Date(r.t));
      if (k !== cur) { prevDay = cur; cur = k; started = last === null; }
      if (!started && r.v !== last) started = true;
      const target = started ? cur : prevDay;
      out[target] = Math.max(out[target] ?? 0, r.v);
      last = r.v;
    }
    return out;
  }

  _render(pets) {
    if (!this.shadowRoot || !this._hass) return;
    const { s, locale } = this._t();
    const body = pets.length ? pets.map((p) => this._pet(p, s, locale, pets.length)).join("")
      : this._banner(null, "mdi:paw-off", s.noPets, s.noPetsSub);
    const title = this._config.title ?? (pets.length === 1 ? pets[0].name : s.pets);
    this.shadowRoot.innerHTML = `<style>${STYLE}</style><ha-card lang="${esc(locale)}">
      ${title ? `<div class="head"><h2><ha-icon icon="mdi:paw"></ha-icon>${esc(title)}</h2></div>` : ""}${body}</ha-card>`;
    this.shadowRoot.querySelectorAll("[data-info]").forEach((el) => this._actions(el));
  }

  _banner(color, icon, title, sub) {
    if (!color) return `<div class="banner calm"><ha-icon icon="${icon}"></ha-icon><div><b>${esc(title)}</b><span>${esc(sub)}</span></div></div>`;
    const [bg, fg] = COLORS[color] || [color, textFor(color)];
    return `<div class="banner" style="--bg:${bg};--fg:${fg}"><ha-icon icon="${icon}"></ha-icon><div><b>${esc(title)}</b><span>${esc(sub)}</span></div></div>`;
  }

  _pet(p, s, locale, count) {
    const h = this._hass, c = this._config, e = p.e, S = (id) => (id ? h.states[id] : undefined);
    const nf = (v, d = 0) => (v === null || v === undefined || !Number.isFinite(v)) ? "—" : new Intl.NumberFormat(locale, { maximumFractionDigits: d }).format(v);
    const time = (d) => d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    const span = (ms) => { const m = Math.max(0, Math.round(ms / 60000)), hh = Math.floor(m / 60); return hh >= 48 ? s.daysHours(Math.floor(hh / 24), hh % 24) : s.hours(hh, m % 60); };

    const actS = S(e.activity), goalS = S(e.goal);
    const daily = e.activity ? this._daily(e.activity) : {};
    const todayK = dayKey(new Date()), y = day0(new Date()); y.setDate(y.getDate() - 1);
    let minutes = num(actS);
    // before the counter restarts (first sync after midnight) the sensor still shows yesterday's total: today is 0
    if (minutes !== null && !(todayK in daily)) {
      const stale = day0(new Date(actS.last_changed)) < day0(new Date());
      const carried = daily[dayKey(y)] !== undefined && minutes === daily[dayKey(y)];
      if (stale || carried) minutes = 0;
    }
    if (minutes === null && todayK in daily) minutes = daily[todayK];
    // goal: the sensor, else its last value in the history, else the `goal` option
    const lastGoal = [...(this._hist?.[e.goal] || [])].reverse().map((x) => parseFloat(x.s)).find((v) => Number.isFinite(v));
    const goal = num(goalS) ?? lastGoal ?? (Number.isFinite(c.goal) ? c.goal : null);
    // last known activity value and when it arrived (history, 7 days): shown when the sensor is unavailable
    const when = (d) => {
      const dd = Math.round((day0(new Date()) - day0(d)) / 86400000);
      return dd === 0 ? s.today(time(d)) : dd === 1 ? s.yesterday(time(d)) : `${d.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "numeric" })} ${time(d)}`;
    };
    // the time is when the value was reached: the first entry of the final run of equal numeric values, skipping
    // unavailable/unknown in between (a reconnection after midnight repeats yesterday's total with today's time)
    const actRows = [...(this._hist?.[e.activity] || [])].map((x) => ({ v: parseFloat(x.s), t: new Date((x.lc ?? x.lu) * 1000) }))
      .filter((x) => Number.isFinite(x.t.getTime())).sort((a, b) => a.t - b.t);
    let lastAct = null;
    for (let i = actRows.length - 1; i >= 0; i--) {
      const r = actRows[i];
      if (!Number.isFinite(r.v)) continue;
      if (lastAct && r.v !== lastAct.v) break;
      lastAct = { v: r.v, t: r.t };
    }
    if (lastAct && day0(lastAct.t) < day0(new Date())) lastAct.old = true;
    // a value from today that only repeats yesterday's total is yesterday's (the counter has not restarted yet)
    if (lastAct && !lastAct.old && !(todayK in daily) && daily[dayKey(y)] !== undefined && lastAct.v === daily[dayKey(y)]) lastAct.old = true;
    if (minutes === null && lastAct && !lastAct.old) minutes = lastAct.v;
    const pct = minutes !== null && goal ? Math.round((minutes / goal) * 100) : null;
    const left = minutes !== null && goal ? Math.max(0, Math.round(goal - minutes)) : null;

    const where = S(e.person) || S(e.tracker);
    const home = where?.state === "home";
    // "since": the arrival / departure helpers (input_datetime) when set and valid, else when the state last changed
    const helper = (id) => {
      const x = S(id);
      if (!usable(x) || x.attributes?.has_date === false) return null;
      const raw = String(x.state).trim(), d = new Date(raw.length === 10 ? `${raw}T00:00:00` : raw.replace(" ", "T"));
      return Number.isFinite(d.getTime()) && d.getTime() <= Date.now() + 60000 ? d : null;
    };
    const since = usable(where) ? (helper(home ? e.arrival : e.departure) || new Date(where.last_changed)) : null;
    const awayMs = since ? Math.max(0, Date.now() - since) : 0;
    const whereText = !usable(where) ? "—" : home ? s.homeSince(time(since)) : awayMs < 60000 ? s.awayNow : s.awayFor(span(awayMs));
    const bat = num(S(e.battery)), charging = S(e.charging)?.state === "on";
    const st = S(e.status), stText = usable(st) ? (s.trackerStates[st.state] || st.state) : "—";

    // banner: battery first, then collar problems, then activity
    let banner;
    if (bat !== null && bat < 20 && !charging) banner = this._banner("red", "mdi:battery-alert-variant-outline", s.lowBattery(nf(bat)), whereText);
    else if (usable(st) && !["operational", "system_startup"].includes(st.state)) banner = this._banner("amber", "mdi:access-point-network-off", s.trackerIssue(stText), whereText);
    // without health data Tractive still creates the activity sensors, but they never get a value
    else if (!e.activity || (!usable(actS) && minutes === null && this._stats && !(this._stats[e.activity] || []).length && this._loadedAt))
      banner = this._banner(null, "mdi:heart-off-outline", s.noHealth, s.noHealthSub);
    else if (!usable(actS)) {
      const ps = S(e.powerSaving), lk = lastAct ? ` ${s.lastKnown(nf(lastAct.v), when(lastAct.t))}` : "";
      // the time the state changed, or null when the entity or its time is missing or not valid (the banner then omits "since")
      const from = (x) => { const d = x?.last_changed ? new Date(x.last_changed) : null; return d && Number.isFinite(d.getTime()) ? when(d) : null; };
      if (st && !usable(st)) banner = this._banner(null, "mdi:cloud-off-outline", s.activityCloud(from(st)), s.activityCloudSub + lk);
      else if (ps?.state === "on") banner = this._banner(null, "mdi:power-sleep", s.activitySaving(from(ps)), s.activitySavingSub + lk);
      else banner = this._banner(null, "mdi:timer-sand", s.activityOff(from(actS)), s.activityOffSub + lk);
    }
    else if (pct !== null && pct >= 100) banner = this._banner(null, "mdi:party-popper", s.goalReached(p.name), `${s.goalReachedSub(nf(minutes), nf(goal), pct)} · ${whereText}`);
    else if (pct !== null) banner = this._banner(c.color, "mdi:walk", pct >= 75 ? s.almost(left) : pct >= 50 ? s.halfway(left) : s.needs(left),
      `${s.activitySub(nf(minutes), nf(goal), pct)} · ${pct < 50 ? s.walkHint + " · " : ""}${whereText}`);
    else banner = this._banner(null, "mdi:paw", p.name, whereText);

    // progress towards the goal, in four bands
    const bands = [[0, "#d6453d"], [0.33, "#f2a33a"], [0.66, "#f2c94c"], [1, "#3aa55c"]];
    const scale = goal && minutes !== null ? Math.max(goal, minutes) : null;
    const progress = scale ? `<div class="scale">${bands.map(([from, col], i) => {
      const a = from * goal, b = i + 1 < bands.length ? bands[i + 1][0] * goal : scale;
      return `<i class="${minutes !== null && minutes >= a && (minutes < b || i === bands.length - 1) ? "on" : ""}" style="background:${col};flex:${Math.max(0.01, b - a)}"></i>`;
    }).join("")}</div><div class="needle"><b style="left:${Math.min(100, ((minutes ?? 0) / scale) * 100).toFixed(1)}%"></b></div>
      <div class="ticks"><span>0</span><span>${nf(goal)} ${s.min}</span></div>` : "";

    const tile = (id, label, icon, value, unit, color, full) => {
      const [bg, fg] = COLORS[color] || [color, textFor(color)];
      return `<div class="tile ${full ? "full" : "dim"}" style="--c:${bg};--t:${fg}" data-info="${esc(id || "")}">
        <div class="row"><ha-icon icon="${icon}"></ha-icon><span class="name">${esc(label)}</span></div><div class="value">${value}${unit ? `<small>${esc(unit)}</small>` : ""}</div></div>`;
    };
    const tiles = [
      e.activity && (minutes === null && lastAct
        ? tile(e.activity, s.lastActivity, "mdi:run", `${nf(lastAct.v)}<small>${esc(s.min)}</small><span class="when">${esc(when(lastAct.t))}</span>`, "", "grey", false)
        : tile(e.activity, s.activityToday, "mdi:run", nf(minutes), s.min, "green", pct !== null && pct >= 100)),
      e.goal && tile(e.goal, s.dailyGoal, "mdi:target", nf(goal), s.min, "blue", false),
      e.battery && tile(e.battery, s.battery, charging ? "mdi:battery-charging" : "mdi:battery", nf(bat), charging ? `% · ${s.charging}` : "%", bat !== null && bat < 20 ? "red" : "green", bat !== null && bat < 20 && !charging),
      e.status && tile(e.status, s.status, "mdi:satellite-variant", `<span class="word">${esc(stText)}</span>`, "", usable(st) && st.state !== "operational" ? "amber" : "blue", usable(st) && !["operational", "system_startup"].includes(st.state)),
      (e.person || e.tracker) && tile(e.person || e.tracker, s.where, home ? "mdi:home" : "mdi:tree", `<span class="word">${usable(where) ? (home ? s.home : s.away) : "—"}</span>`, "", c.color, usable(where) && !home),
      e.rest && usable(S(e.rest)) && tile(e.rest, s.rest, "mdi:sofa-outline", nf(num(S(e.rest))), s.min, "blue", false),
      e.daySleep && usable(S(e.daySleep)) && tile(e.daySleep, s.daySleep, "mdi:weather-sunny", nf(num(S(e.daySleep))), s.min, "blue", false),
      e.nightSleep && usable(S(e.nightSleep)) && tile(e.nightSleep, s.nightSleep, "mdi:weather-night", nf(num(S(e.nightSleep))), s.min, "blue", false),
    ].filter(Boolean).join("");

    // collar controls
    const sw = [["buzzer", s.buzzer, "mdi:bell-ring-outline"], ["led", s.led, "mdi:led-on"], ["live", s.live, "mdi:crosshairs-gps"]].filter(([k]) => e[k]);
    const saving = S(e.powerSaving)?.state === "on";
    const anyOff = sw.some(([k]) => !usable(S(e[k])));
    const controls = c.show_controls && sw.length ? `<div class="block"><div class="group">${esc(s.controls)}</div><div class="chips">${sw.map(([k, label, icon]) => {
      const x = S(e[k]), on = x?.state === "on", ok = usable(x);
      return `<span class="chip ${on ? "full" : "dim"}" style="--c:${c.color};--t:${textFor(c.color)}" data-info="${esc(e[k])}" ${ok ? `data-toggle="${esc(e[k])}"` : ""}><ha-icon icon="${icon}"></ha-icon>${esc(label)}: <b>${ok ? (on ? s.on : s.off) : s.unavailable}</b></span>`;
    }).join("")}</div><div class="foot">${esc(anyOff && saving ? s.controlsPowerSaving : s.controlsHint)}</div></div>` : "";

    // 14 days of activity
    let days = "";
    if (e.activity) {
      const list = [...Array(c.days)].map((_, i) => { const d = day0(new Date()); d.setDate(d.getDate() - (c.days - 1) + i); return { d, v: daily[dayKey(d)] ?? null }; });
      if (minutes !== null) list[list.length - 1].v = minutes;
      const top = Math.max(goal || 0, ...list.map((x) => x.v ?? 0), 1);
      days = `<div class="block"><div class="group">${esc(goal ? s.days14(nf(goal), c.days) : s.days14NoGoal(c.days))}</div><div class="days" style="--c:${c.color};--n:${c.days}">${list.map((x) => {
        const label = `${x.d.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "numeric" })}: ${x.v === null ? "—" : nf(x.v) + " " + s.min}`;
        return `<div title="${esc(label)}"><i class="${x.v === null ? "none" : x.v === 0 ? "zero" : goal && x.v >= goal ? "" : "part"}" style="height:${x.v ? Math.max(3, (x.v / top) * 44).toFixed(1) : 2}px"></i><span>${x.d.getDate()}</span></div>`;
      }).join("")}</div></div>`;
    }

    // 7 days of presence and battery
    let week = "";
    if (c.show_history && (e.person || e.tracker || e.battery) && this._hist) {
      const t1 = Date.now(), t0 = t1 - 7 * 86400000;
      const pts = (id) => (this._hist[id] || []).map((x) => ({ s: x.s, t: (x.lc ?? x.lu) * 1000 })).filter((x) => Number.isFinite(x.t)).sort((a, b) => a.t - b.t);
      const pc = (t) => ((Math.min(Math.max(t, t0), t1) - t0) / (t1 - t0)) * 100;
      const pres = pts(e.person || e.tracker);
      const first = pres.length ? pres[0].t : null;
      const when = (t) => new Date(t).toLocaleString(locale, { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
      let homeMs = 0;
      const segs = pres.map((x, i) => {
        const a = Math.max(x.t, t0), b = i + 1 < pres.length ? pres[i + 1].t : t1;
        if (b <= t0 || x.s !== "home") return "";
        homeMs += Math.max(0, b - a);
        return `<i style="left:${pc(a).toFixed(2)}%;width:${Math.max(0.3, pc(b) - pc(a)).toFixed(2)}%" title="${esc(s.tipHome(when(a), i + 1 < pres.length ? when(b) : time(new Date(t1))))}"></i>`;
      }).join("");
      const homeMin = Math.round(homeMs / 60000);
      const batPts = pts(e.battery).map((x) => ({ t: x.t, v: parseFloat(x.s) })).filter((x) => Number.isFinite(x.v) && x.t >= t0);
      const midnight = []; const g = day0(new Date(t0)); g.setDate(g.getDate() + 1);
      for (let d = +g; d < t1; d += 86400000) midnight.push(d);
      const axis = `<div class="axis">${midnight.map((d) => `<span style="left:${pc(d).toFixed(2)}%">${esc(`${new Date(d).toLocaleDateString(locale, { weekday: "short" })} ${new Date(d).getDate()}`)}</span>`).join("")}</div>`;
      // battery scale: fixed 0-100, or fitted to the data (multiples of 5, at least 10 points tall)
      let lo = 0, hi = 100;
      if (c.battery_scale === "auto" && batPts.length) {
        lo = Math.floor(Math.min(...batPts.map((x) => x.v)) / 5) * 5; hi = Math.ceil(Math.max(...batPts.map((x) => x.v)) / 5) * 5;
        if (hi - lo < 10) { hi = Math.min(100, lo + 10); lo = Math.max(0, hi - 10); }
        lo = Math.max(0, lo); hi = Math.min(100, hi);
      }
      const line = batPts.length > 1 ? `<svg viewBox="0 0 100 40" preserveAspectRatio="none"><path d="${batPts.map((x, i) => `${i ? "L" : "M"}${pc(x.t).toFixed(2)},${(38 - ((x.v - lo) / (hi - lo)) * 36).toFixed(2)}`).join("")}"/></svg>
        <span class="max">${nf(hi)}%</span><span class="min">${nf(lo)}%</span>` : `<div class="foot">${esc(s.noData)}</div>`;
      week = `<div class="block"><div class="group">${esc(s.last7)}</div>
        ${e.person || e.tracker ? `<div class="lane" data-info="${esc(e.person || e.tracker)}"><span class="lab">${esc(s.presence)}</span><div class="bar" style="--c:${c.color}">${segs}</div></div>
        ${c.show_home_total && pres.length ? `<div class="lane"><span class="lab"></span><div class="foot total">${esc(s.homeTotal(s.hours(Math.floor(homeMin / 60), homeMin % 60)))}</div></div>` : ""}` : ""}
        ${e.battery ? `<div class="lane" data-info="${esc(e.battery)}"><span class="lab">${esc(s.batteryLine)}</span><div class="line">${line}</div></div>` : ""}
        <div class="lane"><span class="lab"></span>${axis}</div>
        ${first && first > t0 + 12 * 3600000 ? `<div class="foot">${esc(s.since(new Date(first).toLocaleDateString(locale, { day: "numeric", month: "numeric" })))}</div>` : ""}</div>`;
    }

    return `<section class="pet">${count > 1 ? `<div class="group petname">${esc(p.name)}</div>` : ""}
      ${banner}${progress}<div class="tiles">${tiles}</div>
      <div class="cols"><div>${controls}${days}</div><div>${week}</div></div></section>`;
  }

  // tap: toggle for collar switches, otherwise details; long press: details
  _actions(el) {
    let timer = null, long = false;
    const info = el.dataset.info, tog = el.dataset.toggle;
    if (!info) return;
    el.addEventListener("pointerdown", () => { long = false; timer = setTimeout(() => { long = true; this._more(info); }, 550); });
    const stop = () => clearTimeout(timer);
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => el.addEventListener(ev, stop));
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (long) return;
      if (tog) this._hass.callService("switch", "toggle", { entity_id: tog });
      else this._more(info);
    });
  }
  _more(entityId) { this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId } })); }
}

const STYLE = `
  :host { display: block; container: tpc / inline-size; }
  ha-card { display: block; padding: 16px; }
  .head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .head h2 { margin: 0; font-size: 1rem; font-weight: 600; display: flex; align-items: center; gap: 6px; }
  .head ha-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); }
  .pet + .pet { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--divider-color, rgba(127,127,127,.2)); }
  .banner { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 14px; margin-bottom: 12px; background: var(--bg); color: var(--fg); }
  .banner.calm { background: color-mix(in srgb, var(--secondary-text-color) 8%, transparent); color: inherit;
    border: 1px solid color-mix(in srgb, var(--secondary-text-color) 20%, transparent); }
  .banner ha-icon { --mdc-icon-size: 28px; flex: none; }
  .banner.calm ha-icon { color: var(--secondary-text-color); }
  .banner b { display: block; font-size: 1.06rem; line-height: 1.25; }
  .banner span { display: block; font-size: .84rem; opacity: .88; margin-top: 2px; }
  .banner.calm span { color: var(--secondary-text-color); opacity: 1; }
  .scale { display: flex; height: 12px; border-radius: 6px; overflow: hidden; }
  .scale i { opacity: .3; } .scale i.on { opacity: 1; }
  .needle { position: relative; height: 10px; }
  .needle b { position: absolute; top: 0; width: 0; height: 0; transform: translateX(-6px); border-left: 6px solid transparent;
    border-right: 6px solid transparent; border-bottom: 9px solid var(--primary-text-color); }
  .ticks { display: flex; justify-content: space-between; font-size: .66rem; color: var(--secondary-text-color); margin-bottom: 10px; }
  .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
  .tile { --c: #6b7078; --t: #fff; display: flex; flex-direction: column; gap: 3px; padding: 10px 10px 9px; border-radius: 14px; min-width: 0; cursor: pointer;
    background: color-mix(in srgb, var(--c) 18%, var(--ha-card-background, var(--card-background-color, #fff)));
    border: 1px solid color-mix(in srgb, var(--c) 45%, transparent); }
  .tile.full { background: var(--c); color: var(--t); border: 2px solid var(--c); box-shadow: 0 0 14px color-mix(in srgb, var(--c) 45%, transparent); }
  .tile .row { display: flex; align-items: center; gap: 6px; min-width: 0; }
  .tile ha-icon { --mdc-icon-size: 20px; color: var(--c); flex: none; }
  .tile.full ha-icon { color: var(--t); }
  .tile .name { font-size: .76rem; font-weight: 600; line-height: 1.2; overflow-wrap: break-word; hyphens: auto; min-width: 0; }
  .tile .value { font-size: 1.3rem; font-weight: 700; line-height: 1.15; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
  .tile .value small { font-size: .72rem; font-weight: 600; opacity: .8; margin-left: 3px; }
  .tile .value .word { font-size: .95rem; }
  .tile .value .when { display: block; font-size: .72rem; font-weight: 600; opacity: .8; }
  .cols { display: grid; gap: 0 24px; }
  .block { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--divider-color, rgba(127,127,127,.2)); }
  .group { font-size: .7rem; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--secondary-text-color); margin-bottom: 8px; }
  .petname { font-size: .8rem; color: var(--primary-text-color); }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { --c: #6b7078; display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px 4px 8px; border-radius: 999px; font-size: .78rem; cursor: pointer;
    background: color-mix(in srgb, var(--c) 18%, transparent); border: 1px solid color-mix(in srgb, var(--c) 45%, transparent); }
  .chip ha-icon { --mdc-icon-size: 16px; color: var(--c); }
  .chip.dim { opacity: .7; }
  .chip.full { background: var(--c); color: var(--t, #fff); border-color: var(--c); font-weight: 600; } .chip.full ha-icon { color: var(--t, #fff); }
  .foot { font-size: .72rem; color: var(--secondary-text-color); margin-top: 8px; line-height: 1.4; }
  .days { display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 3px; align-items: end; height: 64px; }
  .days div { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 3px; height: 100%; min-width: 0; }
  .days i { display: block; width: 100%; max-width: 22px; border-radius: 3px 3px 0 0; background: var(--c); }
  .days i.part { opacity: .5; } .days i.zero, .days i.none { opacity: .25; background: var(--secondary-text-color); }
  .days span { font-size: .62rem; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
  .lane { display: grid; grid-template-columns: 84px 1fr; align-items: center; gap: 8px; margin-top: 6px; cursor: pointer; }
  .lane .lab { font-size: .72rem; color: var(--secondary-text-color); }
  .bar { position: relative; height: 14px; border-radius: 4px; background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent); overflow: hidden; }
  .bar i { position: absolute; top: 0; bottom: 0; background: var(--c); border-radius: 2px; }
  .line { position: relative; border-top: 1px dotted var(--divider-color, rgba(127,127,127,.3)); border-bottom: 1px dotted var(--divider-color, rgba(127,127,127,.3)); }
  .line svg { width: 100%; height: 40px; display: block; }
  .line .max, .line .min { position: absolute; left: 2px; font-size: .6rem; line-height: 1; color: var(--secondary-text-color); font-variant-numeric: tabular-nums;
    background: color-mix(in srgb, var(--ha-card-background, var(--card-background-color, #fff)) 75%, transparent); padding: 1px 2px; border-radius: 3px; }
  .line .max { top: 1px; } .line .min { bottom: 1px; }
  .foot.total { margin-top: 0; }
  .line path { fill: none; stroke: #3aa55c; stroke-width: 1.8; vector-effect: non-scaling-stroke; }
  .axis { position: relative; height: 14px; font-size: .62rem; color: var(--secondary-text-color); }
  .axis span { position: absolute; transform: translateX(-50%); white-space: nowrap; }
  @container tpc (min-width: 720px) { .cols { grid-template-columns: 1fr 1fr; } }
  @container tpc (max-width: 420px) {
    ha-card { padding: 12px; }
    .tiles { grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 6px; }
    .tile .value { font-size: 1.12rem; }
    .lane { grid-template-columns: 64px 1fr; }
    .days span { font-size: .55rem; }
  }
`;

if (!customElements.get("tractive-pet-card")) customElements.define("tractive-pet-card", TractivePetCard);
window.customCards = window.customCards || [];
if (!window.customCards.some((x) => x.type === "tractive-pet-card")) {
  window.customCards.push({ type: "tractive-pet-card", name: "Tractive Pet Card", preview: true,
    description: "Your pet's activity, goal, collar battery and controls from the Tractive integration." });
}
console.info(`%c TRACTIVE-PET-CARD %c ${VERSION} `, "color:#fff;background:#8a6bd1;font-weight:700", "color:#8a6bd1;background:#fff");
