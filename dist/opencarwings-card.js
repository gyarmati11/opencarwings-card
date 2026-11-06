/*!
 * OpenCARWINGS Card – Lovelace card for the ha_opencarwings integration
 * https://github.com/czapeczek/ha_opencarwings
 * License: MIT
 */
const CARD_VERSION = "1.1.0";
const DOMAIN = "ha_opencarwings";

/* ------------------------------------------------------------------ */
/* i18n                                                                */
/* ------------------------------------------------------------------ */
const STRINGS = {
  hu: {
    status: {
      running_command: "Parancs folyamatban…",
      quick_charging: "Gyorstöltés",
      charging: "Töltés",
      running: "Üzemben",
      ac_on: "Klíma bekapcsolva",
      batt_heater: "Akkufűtés",
      idle: "Parkol",
      plugged: "Csatlakoztatva",
      unknown: "Ismeretlen",
    },
    act: {
      climate: "Klíma",
      charge: "Töltés",
      charge80: "Töltés 80%",
      lock: "Zárás",
      unlock: "Nyitás",
      horn_lights: "Duda + fény",
      horn: "Duda",
      lights: "Fények",
      stop: "Duda/fény stop",
      remote_start: "Távindítás",
      remote_stop: "Távleállítás",
      locate: "Helyzet",
      refresh: "Frissítés",
    },
    range: "Hatótáv",
    range_ac: "klímával",
    cabin: "Utastér",
    odometer: "Km-óra",
    plugged: "Kábel csatlakoztatva",
    unplugged: "Nincs csatlakoztatva",
    charging_now: "Töltés folyamatban",
    charge_done: "Töltés vége",
    soh: "Akku állapot (SOH)",
    soc_display: "Töltöttség (kijelző)",
    gids: "GIDs",
    cap_bars: "Kapacitás csíkok",
    charge_bars: "Töltöttség csíkok",
    eco: "Eco mód",
    heater: "Akkufűtés",
    energy: "Akku energia",
    last_cmd: "Utolsó parancs",
    updated: "Autó adata",
    requested: "Lekérdezve",
    t3: "Teljes töltés 3 kW",
    t1: "Teljes töltés 1 kW",
    t6: "Teljes töltés 6,6 kW",
    details: "Részletek",
    more: "További funkciók",
    confirm: "Érintsd újra!",
    sent: "Parancs elküldve – az autó 1-2 percen belül reagál.",
    refreshing: "Frissítés kérése elküldve.",
    failed: "Hiba a parancs küldésekor",
    no_car: "Nem található OpenCARWINGS autó. Ellenőrizd az integrációt, vagy add meg a device_id-t.",
    on: "Be",
    off: "Ki",
    yes: "Igen",
    no: "Nem",
    ago: "",
    editor: {
      device_id: "Autó (eszköz)",
      name: "Megjelenített név (opcionális)",
      image: "Saját autókép URL (opcionális)",
      images: "Autóképek (opcionális)",
      default: "Alap kép (pl. /local/opencarwings/leaf-main.webp)",
      charging: "Töltés közben",
      plugged: "Csatlakoztatva",
      climate: "Klíma bekapcsolva",
      show_map: "Térkép megjelenítése",
      show_details: "Részletek alapból kinyitva",
      confirm_actions: "Nyitás / duda megerősítése (dupla érintés)",
    },
  },
  en: {
    status: {
      running_command: "Command in progress…",
      quick_charging: "Quick charging",
      charging: "Charging",
      running: "Running",
      ac_on: "Climate on",
      batt_heater: "Battery heater",
      idle: "Parked",
      plugged: "Plugged in",
      unknown: "Unknown",
    },
    act: {
      climate: "Climate",
      charge: "Charge",
      charge80: "Charge 80%",
      lock: "Lock",
      unlock: "Unlock",
      horn_lights: "Horn + lights",
      horn: "Horn",
      lights: "Lights",
      stop: "Stop horn/lights",
      remote_start: "Remote start",
      remote_stop: "Remote stop",
      locate: "Location",
      refresh: "Refresh",
    },
    range: "Range",
    range_ac: "with A/C",
    cabin: "Cabin",
    odometer: "Odometer",
    plugged: "Cable plugged in",
    unplugged: "Not plugged in",
    charging_now: "Charging",
    charge_done: "Charge finished",
    soh: "Battery health (SOH)",
    soc_display: "Charge (display)",
    gids: "GIDs",
    cap_bars: "Capacity bars",
    charge_bars: "Charge bars",
    eco: "Eco mode",
    heater: "Battery heater",
    energy: "Battery energy",
    last_cmd: "Last command",
    updated: "Car data",
    requested: "Requested",
    t3: "Full charge 3 kW",
    t1: "Full charge 1 kW",
    t6: "Full charge 6.6 kW",
    details: "Details",
    more: "More actions",
    confirm: "Tap again!",
    sent: "Command sent – the car responds within 1-2 minutes.",
    refreshing: "Refresh requested.",
    failed: "Failed to send command",
    no_car: "No OpenCARWINGS car found. Check the integration or set device_id.",
    on: "On",
    off: "Off",
    yes: "Yes",
    no: "No",
    editor: {
      device_id: "Car (device)",
      name: "Display name (optional)",
      image: "Custom car image URL (optional)",
      images: "Car images (optional)",
      default: "Default image (e.g. /local/opencarwings/leaf-main.webp)",
      charging: "While charging",
      plugged: "Plugged in",
      climate: "Climate on",
      show_map: "Show map",
      show_details: "Details expanded by default",
      confirm_actions: "Confirm unlock / horn (double tap)",
    },
  },
};

/* ------------------------------------------------------------------ */
/* Entity discovery                                                    */
/* ------------------------------------------------------------------ */

// unique_id: ha_opencarwings_<key>_<VIN>  →  "<domain>:<key>"
const UID_PREFIX = "ha_opencarwings_";

// Fallback: match on entity object_id (used if the registry can't be read)
const FALLBACK = {
  sensor: [
    [/state_of_charge_display$/, "soc_display"],
    [/state_of_charge$/, "soc"],
    [/state_of_health$/, "soh"],
    [/range_a_c_on$/, "range_acon"],
    [/range_a_c_off$/, "range_acoff"],
    [/charge_cable$/, "plugged_in"],
    [/quick_charging$/, "quick_charging"],
    [/charge_finish$/, "charge_finish"],
    [/charge_bars$/, "charge_bars"],
    [/capacity_bars$/, "capacity_bars"],
    [/maximum_gids_when_battery_is_new$/, "max_gids"],
    [/gids$/, "gids"],
    [/charging$/, "charging"],
    [/ac_status$/, "ac_status"],
    [/eco_mode$/, "eco_mode"],
    [/last_requested_command$/, "last_requested_command"],
    [/last_requested$/, "last_requested"],
    [/last_updated$/, "last_updated"],
    [/running$/, "car_running"],
    [/odometer$/, "odometer"],
    [/3_kw_240_v_charge_time$/, "full_chg_time"],
    [/1_kw_120_v_charge_time$/, "limit_chg_time"],
    [/6_6_kw_charge_time$/, "obc_6kw"],
    [/6_6_kw_obc_exists$/, "obc_6kw_avail"],
    [/battery_heater_exists$/, "batt_heater_avail"],
    [/battery_heater_active$/, "batt_heater_status"],
    [/battery_wh_content$/, "wh_content"],
    [/cabin_temperature$/, "cabin_temp"],
    [/vehicle_health_report$/, "veh_health_report"],
    [/_vin$/, "vin"],
    [/status$/, "status"],
  ],
  button: [
    [/^stop_horn_lights_for_/, "car_stop_horn_lights"],
    [/^horn_lights_for_/, "car_horn_lights"],
    [/^horn_for_/, "car_horn"],
    [/^lights_for_/, "car_lights"],
    [/^charge_start_80_for_/, "car_chargestart80"],
    [/^charge_start_for_/, "car_chargestart"],
    [/^unlock_doors_for_/, "car_doorunlock"],
    [/^lock_doors_for_/, "car_doorlock"],
    [/^request_data_refresh_for_/, "car_refresh"],
    [/^remote_start_for_/, "car_remote_start"],
    [/^remote_stop_for_/, "car_remote_stop"],
    [/opencarwings_refresh/, "refresh"],
  ],
  switch: [[/./, "ac"]],
  device_tracker: [[/./, "tracker"]],
};

function keyFromUniqueId(domain, uid) {
  if (!uid || !uid.startsWith(UID_PREFIX)) return null;
  const rest = uid.slice(UID_PREFIX.length);
  if (domain === "sensor" && rest.endsWith("_cars")) return "cars";
  const idx = rest.lastIndexOf("_");
  if (idx <= 0) return null;
  const key = rest.slice(0, idx);
  if (domain === "device_tracker") return "tracker";
  return key;
}

function keyFromEntityId(entityId) {
  const [domain, obj] = entityId.split(".");
  const list = FALLBACK[domain];
  if (!list) return null;
  for (const [re, key] of list) if (re.test(obj)) return key;
  return null;
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */
// id, entity key, icon, confirm?
const MAIN_ACTIONS = [
  { id: "climate", key: "switch:ac", icon: "mdi:air-conditioner" },
  { id: "charge", key: "button:car_chargestart", icon: "mdi:ev-station" },
  { id: "charge80", key: "button:car_chargestart80", icon: "mdi:battery-charging-80" },
  { id: "lock", key: "button:car_doorlock", icon: "mdi:lock" },
  { id: "unlock", key: "button:car_doorunlock", icon: "mdi:lock-open-variant", confirm: true },
  { id: "horn_lights", key: "button:car_horn_lights", icon: "mdi:alarm-light", confirm: true },
  { id: "locate", key: "device_tracker:tracker", icon: "mdi:map-marker" },
  { id: "refresh", key: "button:car_refresh", icon: "mdi:refresh" },
];
const MORE_ACTIONS = [
  { id: "horn", key: "button:car_horn", icon: "mdi:bullhorn", confirm: true },
  { id: "lights", key: "button:car_lights", icon: "mdi:car-light-high" },
  { id: "stop", key: "button:car_stop_horn_lights", icon: "mdi:stop-circle" },
  { id: "remote_start", key: "button:car_remote_start", icon: "mdi:engine" },
  { id: "remote_stop", key: "button:car_remote_stop", icon: "mdi:engine-off" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const BAD = ["unknown", "unavailable", "none", "", undefined, null];
const isTrue = (v) => ["true", "on", "1", "yes", "plugged"].includes(String(v).toLowerCase());
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function fmtNum(v, lang, digits = 0) {
  const n = Number(v);
  if (!isFinite(n)) return null;
  return n.toLocaleString(lang, { maximumFractionDigits: digits });
}

function fmtDuration(sec, lang) {
  const s = Number(sec);
  if (!isFinite(s) || s <= 0) return null;
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  return lang === "hu" ? `${h} ó ${m} p` : `${h} h ${m} min`;
}

function fmtRelative(iso, lang) {
  if (BAD.includes(iso)) return null;
  const t = Date.parse(iso);
  if (isNaN(t)) return null;
  const diff = (t - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  const abs = Math.abs(diff);
  if (abs < 60) return rtf.format(Math.round(diff), "second");
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  return rtf.format(Math.round(diff / 86400), "day");
}

function socColor(soc) {
  if (soc == null) return "var(--disabled-text-color, #9e9e9e)";
  if (soc < 15) return "var(--error-color, #db4437)";
  if (soc < 30) return "var(--warning-color, #ffa600)";
  return "var(--success-color, #43a047)";
}

/* Original, generic hatchback illustration */
const CAR_SVG = `
<svg class="car-svg" viewBox="0 0 250 112" aria-hidden="true">
  <ellipse cx="125" cy="101" rx="108" ry="6" class="shadow"/>
  <path class="body" d="M16 80c0-8 4-13 12-15l34-8c13-15 31-25 56-26h30c22 0 38 9 52 23l14 10c11 2 18 8 18 17v6c0 4-3 6-7 6h-18a23 23 0 0 0-45 0H90a23 23 0 0 0-45 0H22c-4 0-6-2-6-6z"/>
  <path class="glass" d="M70 58c10-13 25-20 44-21h4v21z"/>
  <path class="glass" d="M126 37h22c17 0 31 7 43 20l-65 1z"/>
  <path class="line" d="M122 36v40M60 76h150"/>
  <path class="lamp-f" d="M220 70h10c2 0 3 2 2 4l-2 3h-10z"/>
  <path class="lamp-r" d="M17 72h6v8h-7z"/>
  <g class="wheel"><circle cx="67" cy="92" r="17"/><circle cx="67" cy="92" r="8" class="hub"/></g>
  <g class="wheel"><circle cx="190" cy="92" r="17"/><circle cx="190" cy="92" r="8" class="hub"/></g>
</svg>`;

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */
class OpenCarwingsCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ents = null; // key -> entity_id
    this._uidMap = null; // entity_id -> unique_id
    this._regTried = false;
    this._sig = "";
    this._pending = {};
    this._confirm = null;
    this._detailsOpen = null;
    this._shadowBuilt = false;
  }

  static getStubConfig() {
    return { type: "custom:opencarwings-card" };
  }

  static getConfigForm() {
    const lang = (document.querySelector("home-assistant")?.hass?.locale?.language || navigator.language || "en").startsWith("hu") ? "hu" : "en";
    const L = STRINGS[lang].editor;
    return {
      schema: [
        { name: "device_id", selector: { device: { integration: DOMAIN } } },
        { name: "name", selector: { text: {} } },
        {
          type: "expandable",
          name: "images",
          title: L.images,
          icon: "mdi:image-multiple",
          schema: [
            { name: "default", selector: { text: {} } },
            { name: "charging", selector: { text: {} } },
            { name: "plugged", selector: { text: {} } },
            { name: "climate", selector: { text: {} } },
          ],
        },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "show_map", selector: { boolean: {} } },
            { name: "show_details", selector: { boolean: {} } },
            { name: "confirm_actions", selector: { boolean: {} } },
          ],
        },
      ],
      computeLabel: (s) => L[s.name] || s.name,
    };
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = { show_map: false, show_details: false, confirm_actions: true, ...config };
    this._ents = null;
    this._sig = "";
    this._detailsOpen = !!this._config.show_details;
    if (this._hass) this._update();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._regTried) {
      this._regTried = true;
      this._loadRegistry();
    }
    this._update();
    if (this._mapCard) this._mapCard.hass = hass;
  }

  getCardSize() {
    return 7;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  get _lang() {
    const l = this._config?.language || this._hass?.locale?.language || this._hass?.language || "en";
    return l.startsWith("hu") ? "hu" : "en";
  }
  get _t() {
    return STRINGS[this._lang];
  }

  async _loadRegistry() {
    // unique_id gives exact mapping; needs an admin user. Falls back to entity_id patterns otherwise.
    try {
      const list = await this._hass.callWS({ type: "config/entity_registry/list" });
      this._uidMap = {};
      for (const e of list) if (e.platform === DOMAIN) this._uidMap[e.entity_id] = e.unique_id;
    } catch (e) {
      this._uidMap = {};
    }
    this._ents = null;
    this._sig = "";
    this._update();
  }

  /* Build key -> entity_id map for the selected car */
  _discover() {
    const hass = this._hass;
    const reg = hass.entities || {};
    const all = Object.values(reg).filter((e) => e.platform === DOMAIN);
    const byDevice = {};
    let globalRefresh = null;

    for (const e of all) {
      const domain = e.entity_id.split(".")[0];
      const uid = this._uidMap?.[e.entity_id];
      const key = (uid && keyFromUniqueId(domain, uid)) || keyFromEntityId(e.entity_id);
      if (!key) continue;
      if (domain === "button" && key === "refresh") {
        globalRefresh = e.entity_id;
        continue;
      }
      if (key === "cars") continue;
      const dev = e.device_id || "_none";
      (byDevice[dev] ||= {})[`${domain}:${key}`] = e.entity_id;
    }

    // choose device
    let devId = this._config.device_id;
    if (!devId && this._config.vin) {
      devId = Object.keys(byDevice).find((d) => {
        const vinEnt = byDevice[d]["sensor:vin"];
        return vinEnt && hass.states[vinEnt]?.state === this._config.vin;
      });
    }
    if (!devId || !byDevice[devId]) {
      devId = Object.keys(byDevice)
        .filter((d) => d !== "_none")
        .sort((a, b) => Object.keys(byDevice[b]).length - Object.keys(byDevice[a]).length)[0];
    }
    const ents = { ...(byDevice[devId] || {}) };

    // tracker might live on another device in older versions
    if (!ents["device_tracker:tracker"]) {
      const devName = (hass.devices?.[devId]?.name_by_user || hass.devices?.[devId]?.name || "").toLowerCase();
      const tr = all.find(
        (e) => e.entity_id.startsWith("device_tracker.") &&
          (!devName || (hass.states[e.entity_id]?.attributes?.friendly_name || "").toLowerCase().includes(devName))
      );
      if (tr) ents["device_tracker:tracker"] = tr.entity_id;
    }
    if (globalRefresh) ents["button:refresh"] = globalRefresh;

    // manual overrides: entities: { "sensor:soc": "sensor.x" } or { soc: "sensor.x" }
    for (const [k, v] of Object.entries(this._config.entities || {})) {
      const full = k.includes(":") ? k : `${v.split(".")[0]}:${k}`;
      ents[full] = v;
    }
    this._deviceId = devId;
    return ents;
  }

  _st(key) {
    const id = this._ents?.[key];
    return id ? this._hass.states[id] : undefined;
  }
  _val(key) {
    const s = this._st(key);
    return s && !BAD.includes(s.state) ? s.state : null;
  }

  _signature() {
    const parts = [this._lang, JSON.stringify(this._pending), this._confirm, this._detailsOpen];
    for (const id of Object.values(this._ents || {})) {
      const s = this._hass.states[id];
      parts.push(id, s?.state, s?.last_updated);
    }
    // relative time refreshes every minute
    parts.push(Math.floor(Date.now() / 60000));
    return parts.join("|");
  }

  _update() {
    if (!this._hass || !this._config) return;
    if (!this._ents || Object.keys(this._ents).length === 0) this._ents = this._discover();
    const sig = this._signature();
    if (sig === this._sig) return;
    this._sig = sig;
    this._render();
  }

  /* -------------------------------------------------------------- */
  _buildShadow() {
    this.shadowRoot.innerHTML = `<style>${STYLE}</style><ha-card><div id="content"></div><div id="map"></div></ha-card>`;
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    this._shadowBuilt = true;
    if (!this._tick) this._tick = setInterval(() => this._update(), 60000);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    this._tick = null;
  }
  connectedCallback() {
    if (this._shadowBuilt && !this._tick) this._tick = setInterval(() => this._update(), 60000);
  }

  _render() {
    if (!this._shadowBuilt) this._buildShadow();
    const root = this.shadowRoot.getElementById("content");
    const t = this._t;
    const lang = this._lang;

    if (!this._ents || Object.keys(this._ents).length === 0) {
      root.innerHTML = `<div class="empty"><ha-icon icon="mdi:car-off"></ha-icon><span>${esc(t.no_car)}</span></div>`;
      return;
    }

    const dev = this._hass.devices?.[this._deviceId];
    const name = this._config.name || dev?.name_by_user || dev?.name || "Nissan";
    const model = dev?.model || "";

    // values
    const soc = this._val("sensor:soc") != null ? Number(this._val("sensor:soc")) : null;
    const rangeOff = this._val("sensor:range_acoff");
    const rangeOn = this._val("sensor:range_acon");
    const cabin = this._val("sensor:cabin_temp");
    const odo = this._val("sensor:odometer");
    const plugged = isTrue(this._val("sensor:plugged_in"));
    const charging = isTrue(this._val("sensor:charging")) || isTrue(this._val("sensor:quick_charging"));
    const acOn = isTrue(this._val("sensor:ac_status"));
    let status = this._val("sensor:status") || "unknown";
    if (status === "idle" && plugged) status = "plugged";
    const busy = status === "running_command";
    const updated = fmtRelative(this._val("sensor:last_updated"), lang);

    const statusClass = {
      charging: "green", quick_charging: "green", plugged: "green", ac_on: "cyan",
      running: "blue", running_command: "blue pulse", batt_heater: "orange",
    }[status] || "grey";
    const statusIcon = {
      charging: "mdi:flash", quick_charging: "mdi:flash", plugged: "mdi:power-plug", ac_on: "mdi:air-conditioner",
      running: "mdi:car-connected", running_command: "mdi:timer-sand", batt_heater: "mdi:heat-wave",
    }[status] || "mdi:car-electric";

    // SoC ring
    const R = 52, C = 2 * Math.PI * R;
    const pct = soc == null ? 0 : Math.max(0, Math.min(100, soc));
    const ring = `
      <div class="ring" style="--c:${socColor(soc)}">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="${R}" class="track"/>
          <circle cx="60" cy="60" r="${R}" class="bar" stroke-dasharray="${(C * pct) / 100} ${C}"/>
        </svg>
        <div class="ring-text">
          <div class="soc">${soc == null ? "—" : fmtNum(soc, lang)}<span>%</span></div>
          <div class="ring-sub">${rangeOff != null ? `${fmtNum(rangeOff, lang)} km` : ""}</div>
        </div>
      </div>`;

    const carMode = charging ? "charging" : acOn || status === "ac_on" ? "climate" : plugged ? "plugged"
      : status === "running" ? "running" : busy ? "command" : "default";
    this._carState = { mode: carMode, charging, plugged };

    const stat = (icon, label, value, sub) =>
      value == null
        ? ""
        : `<div class="stat"><ha-icon icon="${icon}"></ha-icon><div><div class="sv">${value}</div><div class="sl">${esc(label)}</div>${sub ? `<div class="sl2">${sub}</div>` : ""}</div></div>`;

    const stats = [
      stat("mdi:map-marker-distance", t.range, rangeOff != null ? `${fmtNum(rangeOff, lang)} km` : null,
        rangeOn != null ? `${fmtNum(rangeOn, lang)} km ${t.range_ac}` : ""),
      stat("mdi:thermometer", t.cabin, cabin != null ? `${fmtNum(cabin, lang, 1)} °C` : null),
      stat("mdi:counter", t.odometer, odo != null ? `${fmtNum(odo, lang)} km` : null),
    ].join("");

    // charge line
    const tFull = fmtDuration(this._val("sensor:full_chg_time"), lang);
    const t6 = fmtDuration(this._val("sensor:obc_6kw"), lang);
    const chargeLine = `
      <div class="chargeline ${charging ? "on" : plugged ? "plug" : ""}">
        <ha-icon icon="${charging ? "mdi:battery-charging" : plugged ? "mdi:power-plug" : "mdi:power-plug-off"}"></ha-icon>
        <span>${esc(charging ? t.charging_now : plugged ? t.plugged : t.unplugged)}</span>
        ${(plugged || charging) && (t6 || tFull) ? `<span class="muted">· ${esc(t6 ? t.t6 : t.t3)}: ${esc(t6 || tFull)}</span>` : ""}
      </div>`;

    // actions
    const actionBtn = (a) => {
      const ent = this._ents[a.key];
      if (!ent) return "";
      let active = false;
      if (a.id === "climate") active = acOn;
      if (a.id === "charge" || a.id === "charge80") active = charging;
      const pending = this._pending[a.id];
      const confirming = this._confirm === a.id;
      const label = confirming ? t.confirm : t.act[a.id];
      return `
        <button class="act ${active ? "active" : ""} ${pending ? "pending" : ""} ${confirming ? "confirming" : ""} ${a.id}"
                data-action="${a.id}" ${busy && a.id !== "locate" ? 'data-busy="1"' : ""} title="${esc(t.act[a.id])}">
          <span class="ic"><ha-icon icon="${a.icon}"></ha-icon></span>
          <span class="al">${esc(label)}</span>
        </button>`;
    };
    const mainActs = MAIN_ACTIONS.map(actionBtn).join("");
    const moreActs = MORE_ACTIONS.map(actionBtn).join("");

    // details
    const row = (label, value) => (value == null ? "" : `<div class="drow"><span>${esc(label)}</span><span>${value}</span></div>`);
    const boolTxt = (k) => (this._val(k) == null ? null : isTrue(this._val(k)) ? t.yes : t.no);
    const pctTxt = (k) => (this._val(k) == null ? null : `${fmtNum(this._val(k), lang, 1)} %`);
    const capBars = this._val("sensor:capacity_bars");
    const chgBars = this._val("sensor:charge_bars");
    const bars = (n, max = 12) => {
      const v = Number(n);
      if (!isFinite(v)) return null;
      return `<span class="bars">${Array.from({ length: max }, (_, i) => `<i class="${i < v ? "f" : ""}"></i>`).join("")}</span>`;
    };
    const wh = this._val("sensor:wh_content");
    const details = [
      row(t.soh, pctTxt("sensor:soh")),
      row(t.soc_display, pctTxt("sensor:soc_display")),
      row(t.charge_bars, bars(chgBars)),
      row(t.cap_bars, bars(capBars)),
      row(t.gids, this._val("sensor:gids") != null
        ? `${esc(this._val("sensor:gids"))}${this._val("sensor:max_gids") ? ` / ${esc(this._val("sensor:max_gids"))}` : ""}` : null),
      row(t.energy, wh != null ? `${fmtNum(Number(wh) / 1000, lang, 1)} kWh` : null),
      row(t.t3, fmtDuration(this._val("sensor:full_chg_time"), lang)),
      row(t.t6, fmtDuration(this._val("sensor:obc_6kw"), lang)),
      row(t.t1, fmtDuration(this._val("sensor:limit_chg_time"), lang)),
      row(t.eco, boolTxt("sensor:eco_mode")),
      row(t.heater, boolTxt("sensor:batt_heater_status")),
      row(t.last_cmd, this._val("sensor:last_requested_command") != null ? esc(this._val("sensor:last_requested_command")) : null),
      row(t.updated, updated ? esc(updated) : null),
      row(t.requested, fmtRelative(this._val("sensor:last_requested"), lang)),
    ].join("");

    root.innerHTML = `
      <div class="head">
        <div class="title">
          <div class="name">${esc(name)}</div>
          <div class="sub">${esc(model)}${updated ? `${model ? " · " : ""}<ha-icon icon="mdi:update"></ha-icon>${esc(updated)}` : ""}</div>
        </div>
        <div class="chip ${statusClass}"><ha-icon icon="${statusIcon}"></ha-icon>${esc(t.status[status] || status)}</div>
      </div>

      <div class="hero">
        ${ring}
        <div class="car-slot"></div>
      </div>

      ${chargeLine}
      <div class="stats">${stats}</div>

      <div class="actions">${mainActs}</div>

      ${moreActs || details ? `
      <button class="toggle" data-action="details">
        <span>${esc(t.details)}${moreActs ? ` & ${esc(t.more.toLowerCase())}` : ""}</span>
        <ha-icon icon="mdi:chevron-down" class="${this._detailsOpen ? "up" : ""}"></ha-icon>
      </button>
      <div class="more ${this._detailsOpen ? "open" : ""}">
        ${moreActs ? `<div class="actions small">${moreActs}</div>` : ""}
        <div class="details">${details}</div>
      </div>` : ""}
    `;

    const slot = root.querySelector(".car-slot");
    if (slot) slot.replaceWith(this._carElement());
    this._renderMap();
  }

  /* Image per state: images: { default, charging, plugged, climate, running, command } */
  _imageFor(mode) {
    const imgs = this._config.images || {};
    const order = {
      charging: ["charging", "plugged"],
      plugged: ["plugged"],
      climate: ["climate", "ac_on"],
      running: ["running"],
      command: ["command"],
      default: [],
    }[mode] || [];
    for (const k of order) if (imgs[k]) return imgs[k];
    return imgs.default || this._config.image || null;
  }

  /* Persistent element so image crossfades & glow animations aren't restarted on every update */
  _carElement() {
    const { mode, charging, plugged } = this._carState;
    let el = this._carEl;
    const urls = [...new Set(
      ["default", "charging", "plugged", "climate", "running", "command"].map((m) => this._imageFor(m)).filter(Boolean)
    )];
    const urlKey = urls.join("|");
    if (!el || el._urlKey !== urlKey) {
      el = document.createElement("div");
      el.className = "car";
      el.dataset.action = "info";
      el.dataset.key = "sensor:status";
      el.innerHTML = `<div class="glow"></div>` +
        (urls.length
          ? urls.map((u) => `<img class="ph" src="${esc(u)}" alt="" draggable="false">`).join("")
          : CAR_SVG) +
        `<div class="badge"></div>`;
      el._urlKey = urlKey;
      this._carEl = el;
    }
    const cur = this._imageFor(mode);
    el.querySelectorAll("img.ph").forEach((img) => img.classList.toggle("on", img.getAttribute("src") === cur));
    el.classList.toggle("photo", urls.length > 0);
    for (const m of ["charging", "plugged", "climate", "running", "command", "default"]) el.classList.toggle(`m-${m}`, m === mode);
    const badge = el.querySelector(".badge");
    const b = charging ? "charge" : plugged ? "plug" : "";
    if (badge._b !== b) {
      badge._b = b;
      badge.className = `badge ${b}`;
      badge.innerHTML = b ? `<ha-icon icon="${b === "charge" ? "mdi:flash" : "mdi:power-plug"}"></ha-icon>` : "";
    }
    return el;
  }

  async _renderMap() {
    const box = this.shadowRoot.getElementById("map");
    const tracker = this._ents?.["device_tracker:tracker"];
    if (!this._config.show_map || !tracker) {
      box.innerHTML = "";
      this._mapCard = null;
      this._mapFor = null;
      return;
    }
    if (this._mapFor === tracker) return;
    this._mapFor = tracker;
    try {
      const helpers = await window.loadCardHelpers?.();
      if (!helpers) return;
      const card = helpers.createCardElement({
        type: "map",
        entities: [tracker],
        default_zoom: 15,
        aspect_ratio: "16:7",
        hours_to_show: 0,
      });
      card.hass = this._hass;
      card.classList.add("mapcard");
      box.innerHTML = "";
      box.appendChild(card);
      this._mapCard = card;
    } catch (e) {
      console.warn("opencarwings-card: map failed", e);
    }
  }

  /* -------------------------------------------------------------- */
  _onClick(ev) {
    const el = ev.target.closest("[data-action]");
    if (!el) return;
    const id = el.dataset.action;

    if (id === "details") {
      this._detailsOpen = !this._detailsOpen;
      this._sig = "";
      this._update();
      return;
    }
    if (id === "info") {
      this._moreInfo(this._ents[el.dataset.key]);
      return;
    }
    if (id === "locate") {
      this._moreInfo(this._ents["device_tracker:tracker"]);
      return;
    }

    const a = [...MAIN_ACTIONS, ...MORE_ACTIONS].find((x) => x.id === id);
    if (!a || this._pending[id]) return;

    if (a.confirm && this._config.confirm_actions && this._confirm !== id) {
      this._confirm = id;
      clearTimeout(this._confirmTimer);
      this._confirmTimer = setTimeout(() => {
        this._confirm = null;
        this._sig = "";
        this._update();
      }, 3000);
      this._sig = "";
      this._update();
      return;
    }
    this._confirm = null;
    this._run(a);
  }

  async _run(a) {
    const ent = this._ents[a.key];
    const t = this._t;
    let domain, service;
    if (a.id === "climate") {
      domain = "switch";
      service = isTrue(this._val("sensor:ac_status")) ? "turn_off" : "turn_on";
    } else {
      domain = "button";
      service = "press";
    }
    this._pending[a.id] = true;
    this._sig = "";
    this._update();
    try {
      await this._hass.callService(domain, service, { entity_id: ent });
      this._toast(a.id === "refresh" ? t.refreshing : t.sent);
    } catch (e) {
      this._toast(`${t.failed}: ${e?.message || e}`);
    } finally {
      // keep the spinner shortly so the tap feels acknowledged
      setTimeout(() => {
        delete this._pending[a.id];
        this._sig = "";
        this._update();
      }, 1200);
    }
  }

  _moreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
  }

  _toast(message) {
    this.dispatchEvent(new CustomEvent("hass-notification", { detail: { message }, bubbles: true, composed: true }));
  }
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */
const STYLE = `
:host {
  --ocw-accent: var(--primary-color, #03a9f4);
  --ocw-text: var(--primary-text-color, #212121);
  --ocw-muted: var(--secondary-text-color, #727272);
  --ocw-tile: rgba(127,127,127,.10);
  --ocw-tile-hover: rgba(127,127,127,.18);
  --ocw-green: var(--success-color, #43a047);
  --ocw-orange: var(--warning-color, #ffa600);
  --ocw-cyan: #00acc1;
  --ocw-blue: var(--info-color, #039be5);
}
ha-card { padding: 16px; overflow: hidden; }
ha-icon { --mdc-icon-size: 20px; display: inline-flex; }
.empty { display: flex; gap: 12px; align-items: center; color: var(--ocw-muted); padding: 8px; }

.head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.name { font-size: 1.35rem; font-weight: 600; color: var(--ocw-text); line-height: 1.2; }
.sub { font-size: .82rem; color: var(--ocw-muted); margin-top: 2px; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.sub ha-icon { --mdc-icon-size: 14px; }

.chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 999px;
  font-size: .8rem; font-weight: 600; white-space: nowrap; background: var(--ocw-tile); color: var(--ocw-muted); }
.chip ha-icon { --mdc-icon-size: 16px; }
.chip.green { background: color-mix(in srgb, var(--ocw-green) 16%, transparent); color: var(--ocw-green); }
.chip.orange { background: color-mix(in srgb, var(--ocw-orange) 16%, transparent); color: var(--ocw-orange); }
.chip.cyan { background: color-mix(in srgb, var(--ocw-cyan) 16%, transparent); color: var(--ocw-cyan); }
.chip.blue { background: color-mix(in srgb, var(--ocw-blue) 16%, transparent); color: var(--ocw-blue); }
.pulse { animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 50% { opacity: .45; } }

.hero { display: grid; grid-template-columns: 128px 1fr; gap: 12px; align-items: center; margin: 14px 0 6px; }
.ring { position: relative; width: 128px; height: 128px; }
.ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring circle { fill: none; stroke-width: 10; }
.ring .track { stroke: var(--ocw-tile); }
.ring .bar { stroke: var(--c); stroke-linecap: round; transition: stroke-dasharray .8s ease; }
.ring-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.soc { font-size: 2.1rem; font-weight: 700; color: var(--ocw-text); line-height: 1; letter-spacing: -.02em; }
.soc span { font-size: 1rem; font-weight: 600; margin-left: 1px; color: var(--ocw-muted); }
.ring-sub { font-size: .85rem; color: var(--ocw-muted); margin-top: 4px; }

.car { position: relative; cursor: pointer; display: flex; justify-content: center; align-items: center; min-height: 120px; }
.car-svg { width: 100%; max-width: 260px; height: auto; position: relative; z-index: 1; }
.car.photo { display: grid; height: 140px; margin-right: -8px; }
.car .ph { grid-area: 1 / 1; width: 100%; height: 140px; object-fit: contain; position: relative; z-index: 1;
  opacity: 0; transform: scale(.97); transition: opacity .6s ease, transform .6s ease; user-select: none;
  filter: drop-shadow(0 6px 10px rgba(0,0,0,.18)); }
.car .ph.on { opacity: 1; transform: none; }
.car.m-charging .ph.on { -webkit-mask-image: linear-gradient(to bottom, #000 86%, transparent);
  mask-image: linear-gradient(to bottom, #000 86%, transparent); filter: none; }
.car .glow { position: absolute; inset: 10% 6%; border-radius: 50%; opacity: 0; transition: opacity .6s; z-index: 0; pointer-events: none; }
.car.m-charging .glow { opacity: 1; background: radial-gradient(ellipse at 50% 70%, color-mix(in srgb, var(--ocw-green) 45%, transparent), transparent 65%);
  animation: breathe 2.4s ease-in-out infinite; }
.car.m-climate .glow { opacity: 1; background: radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--ocw-cyan) 45%, transparent), transparent 62%);
  animation: breathe 3s ease-in-out infinite; }
.car.m-command .glow { opacity: 1; background: radial-gradient(ellipse, color-mix(in srgb, var(--ocw-blue) 35%, transparent), transparent 62%);
  animation: breathe 1.4s ease-in-out infinite; }
@keyframes breathe { 0%,100% { transform: scale(.92); filter: brightness(.9); } 50% { transform: scale(1.06); filter: brightness(1.15); } }
.car-svg .body { fill: color-mix(in srgb, var(--ocw-accent) 78%, var(--ocw-text) 0%); }
.car-svg .glass { fill: color-mix(in srgb, var(--ha-card-background, var(--card-background-color, #fff)) 70%, var(--ocw-accent)); opacity: .9; }
.car-svg .line { stroke: rgba(0,0,0,.18); stroke-width: 1.5; fill: none; }
.car-svg .lamp-f { fill: #fff6c8; }
.car-svg .lamp-r { fill: #e53935; }
.car-svg .wheel circle { fill: #2b2b2b; }
.car-svg .wheel .hub { fill: #9ea4aa; }
.car-svg .shadow { fill: rgba(0,0,0,.14); }

.badge:empty { display: none; }
.badge { position: absolute; z-index: 2; top: 0; right: 8%; width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 2px 6px rgba(0,0,0,.25); }
.badge.charge { background: var(--ocw-green); animation: glow 1.8s ease-in-out infinite; }
.badge.plug { background: var(--ocw-muted); }
@keyframes glow { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--ocw-green) 60%, transparent); } 50% { box-shadow: 0 0 0 9px transparent; } }

.chargeline { display: flex; align-items: center; gap: 6px; font-size: .88rem; color: var(--ocw-muted); flex-wrap: wrap; }
.chargeline.on { color: var(--ocw-green); font-weight: 600; }
.chargeline.plug { color: var(--ocw-text); }
.chargeline .muted { color: var(--ocw-muted); font-weight: 400; }

.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(104px, 1fr)); gap: 8px; margin: 12px 0 14px; }
.stat { display: flex; gap: 9px; align-items: center; padding: 9px 10px; border-radius: 12px; background: var(--ocw-tile); }
.stat ha-icon { color: var(--ocw-accent); }
.sv { white-space: nowrap; font-weight: 600; color: var(--ocw-text); font-size: .98rem; }
.sl { font-size: .74rem; color: var(--ocw-muted); }
.sl2 { font-size: .7rem; color: var(--ocw-muted); opacity: .85; white-space: nowrap; }

.actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.act { all: unset; box-sizing: border-box; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 10px 4px; border-radius: 14px; background: var(--ocw-tile); color: var(--ocw-text);
  transition: background .15s, transform .1s; -webkit-tap-highlight-color: transparent; text-align: center; }
.act:hover { background: var(--ocw-tile-hover); }
.act:active { transform: scale(.95); }
.act:focus-visible { outline: 2px solid var(--ocw-accent); outline-offset: 2px; }
.act .ic { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--ocw-accent) 14%, transparent); color: var(--ocw-accent); }
.act .ic ha-icon { --mdc-icon-size: 22px; }
.act .al { font-size: .74rem; line-height: 1.15; font-weight: 500; }
.act.active .ic { background: var(--ocw-accent); color: var(--text-primary-color, #fff); }
.act.climate.active .ic { background: var(--ocw-cyan); }
.act.charge.active .ic, .act.charge80.active .ic { background: var(--ocw-green); }
.act.unlock .ic { color: var(--ocw-orange); background: color-mix(in srgb, var(--ocw-orange) 14%, transparent); }
.act.confirming { background: color-mix(in srgb, var(--ocw-orange) 22%, transparent); }
.act.confirming .al { color: var(--ocw-orange); font-weight: 700; }
.act.pending .ic { animation: spin 1s linear infinite; }
.act[data-busy] { opacity: .55; }
@keyframes spin { to { transform: rotate(360deg); } }
.actions.small { grid-template-columns: repeat(5, 1fr); margin-bottom: 10px; }
.actions.small .ic { width: 34px; height: 34px; }
.actions.small .ic ha-icon { --mdc-icon-size: 19px; }

.toggle { all: unset; box-sizing: border-box; cursor: pointer; width: 100%; margin-top: 12px; padding: 8px 2px 2px;
  display: flex; justify-content: space-between; align-items: center; color: var(--ocw-muted); font-size: .85rem;
  border-top: 1px solid var(--divider-color, rgba(127,127,127,.2)); }
.toggle ha-icon { transition: transform .2s; }
.toggle ha-icon.up { transform: rotate(180deg); }
.more { display: none; padding-top: 10px; }
.more.open { display: block; }
.details { display: grid; grid-template-columns: 1fr; }
.drow { display: flex; justify-content: space-between; gap: 12px; padding: 6px 2px; font-size: .86rem;
  border-bottom: 1px dashed var(--divider-color, rgba(127,127,127,.2)); color: var(--ocw-muted); }
.drow:last-child { border-bottom: 0; }
.drow span:last-child { color: var(--ocw-text); font-weight: 500; text-align: right; }
.bars { display: inline-flex; gap: 2px; vertical-align: middle; }
.bars i { width: 6px; height: 12px; border-radius: 2px; background: var(--ocw-tile-hover); }
.bars i.f { background: var(--ocw-green); }

#map:not(:empty) { margin: 14px -16px -16px; }
.mapcard { --ha-card-border-radius: 0; --ha-card-box-shadow: none; --ha-card-border-width: 0; }

@media (max-width: 380px) {
  .hero { grid-template-columns: 110px 1fr; }
  .ring { width: 110px; height: 110px; }
  .soc { font-size: 1.8rem; }
  .actions.small { grid-template-columns: repeat(3, 1fr); }
}
`;

customElements.define("opencarwings-card", OpenCarwingsCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "opencarwings-card",
  name: "OpenCARWINGS Card",
  description: "Nissan LEAF / e-NV200 card for the OpenCARWINGS integration: battery, range, charging, climate, locks, horn & lights, location.",
  preview: true,
  documentationURL: "https://github.com/czapeczek/ha_opencarwings",
});

console.info(`%c OPENCARWINGS-CARD %c v${CARD_VERSION} `, "color:#fff;background:#03a9f4;font-weight:700", "color:#03a9f4");
