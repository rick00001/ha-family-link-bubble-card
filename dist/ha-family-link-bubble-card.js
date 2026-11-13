/*
 * Family Link Bubble Card — custom:familylink-bubble-card
 * A Bubble Card styled dashboard card for the HAFamilyLink integration
 * (https://github.com/noiwid/HAFamilyLink). No build, no dependency.
 * https://github.com/rick00001/ha-family-link-bubble-card
 *
 *   type: custom:familylink-bubble-card
 *   entity: switch.emmas_phone      # the device switch of the phone / tablet (required)
 *   mode: popup                     # popup (default): compact card + details pop-up
 *                                   # full: everything in one card
 *   name: Emma's phone              # optional
 *   icon: mdi:cellphone             # optional
 *   hash: '#emma'                   # optional: open the pop-up from any card with navigate '#emma'
 *   sections: [today, bonus, restrictions, apps, week, schedule, settings]   # optional, order matters
 *   top_apps: 5                     # optional, 0-10
 *   max_daily_limit: 360            # optional: slider range of the weekly limits, in minutes
 *   language: en                    # optional: en or nl, else the Home Assistant language
 *   school_today_until: '23:58'     # optional: when a school time switched off "only today" is switched back on
 *
 * Every other entity (child and device) is found automatically through the integration's
 * own "familylink/card_entities" websocket command, so area-prefixed ids work too.
 * Bubble Card theme variables (--bubble-main-background-color, --bubble-accent-color,
 * --bubble-border-radius, ...) are honoured, so it matches your Bubble Card dashboard.
 */
const FLB_VERSION = '1.1.0';
const FLB_SECTIONS = ['today', 'bonus', 'restrictions', 'apps', 'week', 'schedule', 'settings'];

const FLB_STR = {
	en: {
		available: 'Available', why: { manually_locked: 'Locked', bonus_active: 'Bonus active', bedtime_active: 'Bedtime', school_time_active: 'School time', daily_limit_reached: 'Limit reached' },
		h: 'h', until: 'until {t}', at: 'at {t}', tomorrow: 'tomorrow {t}', limit_soon: 'Daily limit soon reached',
		school_off_q: 'Switch school time off?', school_off_sub: 'Only today: back on tonight at {t}, as scheduled from tomorrow. Permanently: off until you switch it on again.',
		only_today: 'Only today', permanent: 'Permanently', today_only_badge: 'Off today only', back_on_at: '→ {t}', start: 'start', end: 'end',
		auto_fail: 'Could not create the automation that switches school time back on (administrators only). School time stays off until you switch it on.',
		save: 'Save', hour: 'Hour', minute: 'Minute',
		left: 'left', left_k: 'Left', used: 'Used', tap_lock: 'Tap to lock the device', tap_unlock: 'Tap to unlock the device', limit: 'Limit', bonus: 'Bonus', next: 'Next', lock: 'Lock', unlock: 'Unlock', details: 'Details',
		lock_q: 'Lock {d}?', unlock_q: 'Unlock {d}?', lock_sub: 'The device can no longer be used until it is unlocked.', unlock_sub: 'The device can be used again, within its limits.',
		ring: 'Ring', ring_q: 'Ring {d}?', ring_sub: 'The device rings so it can be found.',
		reset: 'Reset', reset_q: 'Cancel the active bonus?', custom: 'Custom', add: 'Add', add_q: 'Add {n} min bonus to {d}?',
		today: 'Today', all_devices: 'all devices', time_bonus: 'Time bonus', restrictions: 'Restrictions',
		bedtime: 'Bedtime', school: 'School time', daily_limit: 'Daily limit', strict: 'Strict mode', unl: 'Unlimited apps in downtime',
		now: 'Now', reached: 'Reached', not_set: 'Not set', none_today: 'None today', on: 'On', off: 'Off',
		top_apps: 'Top apps today', no_usage: 'No usage yet today', block_q: 'Block {a}?', unblock_q: 'Unblock {a}?',
		block_sub: 'The app can no longer be opened on any device of {c}.', unblock_sub: 'The app can be opened again.',
		week: 'Weekly limits', schedule: 'Schedule', settings: 'Settings',
		web_filter: 'Web filter', calls: 'Calls & texts', play_appr: 'Play approvals', play_rating: 'Apps & games rating',
		apps_sites: 'Apps & sites', installed: 'Installed', blocked: 'Blocked', limited: 'Limited', always: 'Always allowed',
		blocked_sites: 'Blocked sites', approved_sites: 'Approved sites',
		cancel: 'Cancel', confirm: 'Confirm', close: 'Close', today_tag: 'today', loading: 'Loading…',
		not_found: 'Not a Family Link entity: ', pick: 'Pick the device switch of a phone or tablet (switch.<device>), not one of the child.',
		days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], d: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
	},
	nl: {
		available: 'Beschikbaar', why: { manually_locked: 'Vergrendeld', bonus_active: 'Bonus actief', bedtime_active: 'Bedtijd', school_time_active: 'Schooltijd', daily_limit_reached: 'Limiet bereikt' },
		h: 'u', until: 'tot {t}', at: 'om {t}', tomorrow: 'morgen {t}', limit_soon: 'Daglimiet bijna bereikt',
		school_off_q: 'Schooltijd uitzetten?', school_off_sub: 'Alleen vandaag: vanavond om {t} gaat hij weer aan, vanaf morgen geldt het schema weer. Blijvend: uit tot je hem zelf weer aanzet.',
		only_today: 'Alleen vandaag', permanent: 'Blijvend', today_only_badge: 'Alleen vandaag uit', back_on_at: '→ {t}', start: 'begin', end: 'einde',
		auto_fail: 'Kon de automatisering die schooltijd weer aanzet niet aanmaken (alleen voor beheerders). Schooltijd blijft uit tot je hem weer aanzet.',
		save: 'Opslaan', hour: 'Uur', minute: 'Minuut',
		left: 'over', left_k: 'Over', used: 'Gebruikt', tap_lock: 'Tik om het apparaat te vergrendelen', tap_unlock: 'Tik om het apparaat te ontgrendelen', limit: 'Limiet', bonus: 'Bonus', next: 'Volgende', lock: 'Vergrendel', unlock: 'Ontgrendel', details: 'Details',
		lock_q: '{d} vergrendelen?', unlock_q: '{d} ontgrendelen?', lock_sub: 'Het apparaat kan niet meer gebruikt worden tot het ontgrendeld is.', unlock_sub: 'Het apparaat kan weer gebruikt worden, binnen de limieten.',
		ring: 'Laat rinkelen', ring_q: '{d} laten rinkelen?', ring_sub: 'Het apparaat gaat over zodat je het kunt vinden.',
		reset: 'Reset', reset_q: 'De actieve bonus annuleren?', custom: 'Zelf kiezen', add: 'Toevoegen', add_q: '{n} min bonus geven aan {d}?',
		today: 'Vandaag', all_devices: 'alle apparaten', time_bonus: 'Extra tijd', restrictions: 'Beperkingen',
		bedtime: 'Bedtijd', school: 'Schooltijd', daily_limit: 'Daglimiet', strict: 'Strikte modus', unl: 'Onbeperkte apps tijdens rusttijd',
		now: 'Nu', reached: 'Bereikt', not_set: 'Niet ingesteld', none_today: 'Vandaag niet', on: 'Aan', off: 'Uit',
		top_apps: 'Meest gebruikte apps', no_usage: 'Vandaag nog niet gebruikt', block_q: '{a} blokkeren?', unblock_q: '{a} deblokkeren?',
		block_sub: 'De app kan op geen enkel apparaat van {c} meer geopend worden.', unblock_sub: 'De app kan weer geopend worden.',
		week: 'Weeklimieten', schedule: 'Schema', settings: 'Instellingen',
		web_filter: 'Webfilter', calls: 'Bellen & sms', play_appr: 'Play-goedkeuringen', play_rating: 'Leeftijdsclassificatie',
		apps_sites: 'Apps & sites', installed: 'Geïnstalleerd', blocked: 'Geblokkeerd', limited: 'Beperkt', always: 'Altijd toegestaan',
		blocked_sites: 'Geblokkeerde sites', approved_sites: 'Toegestane sites',
		cancel: 'Annuleren', confirm: 'Bevestigen', close: 'Sluiten', today_tag: 'vandaag', loading: 'Laden…',
		not_found: 'Geen Family Link-entiteit: ', pick: 'Kies de apparaatschakelaar van een telefoon of tablet (switch.<apparaat>), niet die van het kind.',
		days: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'], d: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],
	},
};

const flbEsc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const flbHm = (m, hl = 'h') => { if (isNaN(m)) return '—'; m = Math.max(0, Math.round(m)); const h = Math.floor(m / 60); return h ? `${h}${hl} ${String(m % 60).padStart(2, '0')}m` : `${m}m`; };
const flbOk = (st) => !!st && st.state !== 'unavailable' && st.state !== 'unknown';
const flbNum = (st) => (st ? parseFloat(st.state) : NaN);
const flbToday = () => ((new Date().getDay() + 6) % 7) + 1; // 1 = Monday, as in the integration's unique ids
const flbHHMM = (st) => (flbOk(st) ? String(st.state).slice(0, 5) : '');

const FLB_CSS = `
:host { display: block; }
* { box-sizing: border-box; }
.fl {
	--fl-r: var(--bubble-border-radius, 32px);
	--fl-main: var(--bubble-main-background-color, var(--background-color-2, var(--secondary-background-color, #eee)));
	--fl-sub: var(--bubble-sub-button-background-color, var(--card-background-color, var(--ha-card-background, #fff)));
	--fl-iconbg: var(--bubble-icon-background-color, var(--card-background-color, var(--ha-card-background, #fff)));
	--fl-accent: var(--bubble-accent-color, var(--accent-color, #03a9f4));
	--fl-ok: var(--success-color, #43a047);
	--fl-bad: var(--error-color, #db4437);
	--fl-warn: var(--warning-color, #ffa600);
	color: var(--primary-text-color);
	font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, Roboto, sans-serif));
	-webkit-tap-highlight-color: transparent;
}
ha-card { background: none; border: none; box-shadow: none; overflow: visible; }
ha-card.full { background: var(--ha-card-background, var(--card-background-color)); border-radius: calc(var(--fl-r) + 8px); padding: 8px; }
.stack { display: flex; flex-direction: column; gap: 10px; }
.full .stack { gap: 10px; }

/* --- Bubble button ------------------------------------------------------ */
.b { position: relative; border-radius: var(--fl-r); background: var(--fl-main); overflow: hidden; min-height: 56px; display: flex; flex-direction: column; justify-content: center; user-select: none; cursor: pointer; isolation: isolate; }
.b.static { cursor: default; }
.b .bg { position: absolute; inset: 0; z-index: -1; background: var(--fl-accent); opacity: 0; transition: opacity .3s, background-color .3s; }
.b.on .bg { opacity: .5; }
.b .fill { position: absolute; inset: 0 auto 0 0; z-index: -1; background: var(--fl-accent); opacity: .5; transition: width .3s; border-radius: 0 var(--fl-r) var(--fl-r) 0; }
.b.locked .fill { background: var(--fl-bad); opacity: .28; }
.row { display: flex; align-items: center; gap: 10px; min-height: 56px; padding: 0 10px 0 10px; }
.icon { flex: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--fl-iconbg); --mdc-icon-size: 22px; transition: background .3s, color .3s; }
.b.on .icon { color: var(--fl-accent); }
.icon.ok { color: var(--fl-ok); background: color-mix(in srgb, var(--fl-ok) 18%, var(--fl-iconbg)); }
.icon.bad { color: var(--fl-bad); background: color-mix(in srgb, var(--fl-bad) 18%, var(--fl-iconbg)); }
.names { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.state { font-size: 12px; opacity: .7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.value { font-size: 13px; font-weight: 600; white-space: nowrap; padding-right: 6px; }
.subs { display: flex; gap: 6px; align-items: center; flex: none; }
.bottom { display: flex; gap: 8px; padding: 0 8px 8px; }
.bottom .s { flex: 1 1 0; min-width: 0; }
.bottom .s.wide { flex: 0 0 auto; padding: 0 14px; }
.s > span { overflow: hidden; text-overflow: ellipsis; }
.large .row { padding: 0 8px 0 10px; }

/* --- Sub-buttons -------------------------------------------------------- */
.s { position: relative; height: 36px; border-radius: 18px; border: none; background: var(--fl-sub); color: inherit; font: inherit; font-size: 12px; font-weight: 500; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0 12px; white-space: nowrap; cursor: pointer; --mdc-icon-size: 18px; transition: background .25s, transform .1s; overflow: hidden; min-width: 36px; }
.s:active, .b:active:not(.static):not(.slider) { transform: scale(.98); }
.s.ghost { background: none; padding: 0 4px; cursor: default; }
.s.ghost.click { cursor: pointer; }
.s.icon-only { padding: 0; width: 36px; }
.s.accent { background: color-mix(in srgb, var(--fl-accent) 55%, var(--fl-sub)); }
.s.bad { background: color-mix(in srgb, var(--fl-bad) 35%, var(--fl-sub)); }
.s.okc { background: color-mix(in srgb, var(--fl-ok) 35%, var(--fl-sub)); }
.s[disabled] { opacity: .4; pointer-events: none; }
.s .lbl { opacity: .7; }
.badge { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 12px; background: var(--fl-warn); color: #000; white-space: nowrap; }
.badge.bad { background: var(--fl-bad); color: #fff; }

/* --- Separator ---------------------------------------------------------- */
.sep { display: flex; align-items: center; gap: 8px; min-height: 40px; padding: 0 6px 0 8px; margin-top: 4px; font-size: 15px; font-weight: 600; --mdc-icon-size: 20px; }
.sep .line { flex: 1; height: 6px; border-radius: 6px; background: var(--fl-main); opacity: .6; min-width: 16px; }
.sep .sub { font-size: 12px; font-weight: 500; opacity: .7; }

/* --- Layouts ------------------------------------------------------------ */
.chips { display: grid; grid-template-columns: repeat(auto-fit, minmax(76px, 1fr)); gap: 8px; }
.chip { border-radius: 22px; background: var(--fl-main); padding: 10px 12px; display: flex; flex-direction: column; gap: 2px; min-width: 0; cursor: pointer; }
.chip .k { font-size: 11px; opacity: .7; display: flex; align-items: center; gap: 4px; --mdc-icon-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.chip .k ha-icon { flex: none; }
.chip .v { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chip.wide { grid-column: 1 / -1; flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; }
.chip.wide .v { font-size: 13px; }
.grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.grid2 .span { grid-column: 1 / -1; }
.panel { background: var(--fl-main); border-radius: var(--fl-r); padding: 8px; display: flex; flex-direction: column; gap: 8px; }
.btnrow { display: flex; gap: 8px; flex-wrap: wrap; }
.btnrow .s { flex: 1; }
.stepper { display: flex; gap: 8px; align-items: center; }
.stepper .v { flex: 1; text-align: center; font-weight: 600; font-size: 14px; }
.msg { padding: 16px; font-size: 13px; opacity: .8; }
.msg.err { color: var(--fl-bad); opacity: 1; }
.muted { opacity: .6; font-size: 12px; padding: 4px 12px; }

/* --- Slider ------------------------------------------------------------- */
.b.slider { touch-action: pan-y; cursor: ew-resize; }
.b.slider.drag .fill { transition: none; opacity: .75; }
.b.slider.today { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--fl-accent) 70%, transparent); }

/* --- Apps --------------------------------------------------------------- */
.app { position: relative; display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 6px 0 8px; border-radius: 24px; background: var(--fl-main); overflow: hidden; isolation: isolate; }
.app .bar { position: absolute; inset: 0 auto 0 0; z-index: -1; background: var(--fl-accent); opacity: .22; border-radius: 0 24px 24px 0; }
.app .rank { width: 32px; height: 32px; border-radius: 50%; background: var(--fl-iconbg); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex: none; }
.app .an { flex: 1; min-width: 0; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.app .at { font-size: 12px; opacity: .8; white-space: nowrap; }
.app.blocked .an { text-decoration: line-through; opacity: .6; }

/* --- Schedule ----------------------------------------------------------- */
.sched { border-radius: 24px; background: var(--fl-main); padding: 6px 10px; }
.srow { display: grid; grid-template-columns: minmax(64px, auto) 1fr; gap: 8px; align-items: center; min-height: 44px; }
.seg { display: flex; gap: 6px; padding: 4px; border-radius: 22px; background: var(--fl-main); }
.seg .s { flex: 1; background: none; }
.seg .s.sel { background: var(--fl-sub); font-weight: 600; }
.srow.head { min-height: 28px; font-size: 11px; opacity: .7; font-weight: 600; }
.srow.today .dn { color: var(--fl-accent); font-weight: 700; }
.srow + .srow { border-top: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
.dn { font-size: 12px; font-weight: 600; }
.pair { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 6px; font-size: 12px; }
.pair .off { opacity: .5; font-size: 12px; padding-left: 6px; grid-column: 1 / -1; }
.tbtn { width: 100%; height: 34px; border-radius: 14px; font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; }
.dlg .pick { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 8px; padding: 8px 0 0; font-size: 22px; font-weight: 700; }
.dlg .pick .selwrap { max-width: none; }
.dlg .pick select { width: 100%; height: 48px; border-radius: 24px; font-size: 20px; font-weight: 700; text-align: center; padding: 0 30px 0 18px; background: var(--fl-main); font-variant-numeric: tabular-nums; }
.dlg .pick .lab { font-size: 11px; opacity: .6; text-align: center; font-weight: 500; }
.dlg .acts.col { flex-direction: column-reverse; }
.dlg .acts.col .s { flex: none; }
.dlg .acts .s:not(.accent):not(.bad) { background: var(--fl-main); }
.s:focus { outline: none; }
.s:focus-visible { outline: 2px solid color-mix(in srgb, var(--fl-accent) 70%, transparent); outline-offset: 2px; }
input[type=time] { font: inherit; font-size: 13px; color: inherit; background: var(--fl-sub); border: none; border-radius: 14px; height: 34px; padding: 0 8px; min-width: 0; width: 100%; color-scheme: light dark; }

/* --- Select ------------------------------------------------------------- */
.selwrap { position: relative; flex: none; max-width: 55%; }
.selwrap select { appearance: none; -webkit-appearance: none; font: inherit; font-size: 12px; font-weight: 500; color: inherit; background: var(--fl-sub); border: none; border-radius: 18px; height: 36px; padding: 0 30px 0 12px; max-width: 100%; text-overflow: ellipsis; cursor: pointer; }
.selwrap ha-icon { position: absolute; right: 8px; top: 9px; --mdc-icon-size: 18px; pointer-events: none; }

/* --- Pop-up ------------------------------------------------------------- */
.ov { position: fixed; inset: 0; z-index: 7; pointer-events: none; }
.ov.open { pointer-events: auto; }
.bd { position: absolute; inset: 0; background: var(--bubble-backdrop-background-color, rgba(0, 0, 0, .35)); opacity: 0; transition: opacity .3s; }
.ov.open .bd { opacity: 1; }
.sheet { position: absolute; left: 50%; bottom: 0; width: min(100%, var(--flb-popup-width, 560px)); max-height: calc(100% - 48px); display: flex; flex-direction: column;
	transform: translate(-50%, 105%); transition: transform .38s cubic-bezier(.2, .9, .25, 1);
	border-radius: var(--bubble-pop-up-border-radius, 42px) var(--bubble-pop-up-border-radius, 42px) 0 0;
	background: var(--bubble-pop-up-background-color, color-mix(in srgb, var(--card-background-color, #fff) 90%, transparent));
	-webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px); box-shadow: 0 0 40px rgba(0, 0, 0, .25); }
.ov.open .sheet { transform: translate(-50%, 0); }
.sheet.dragging { transition: none; }
.hdr { display: flex; gap: 8px; align-items: center; padding: 16px 16px 6px; touch-action: none; }
.hdr .b { flex: 1; }
.handle { position: absolute; top: 6px; left: 50%; width: 40px; height: 4px; margin-left: -20px; border-radius: 2px; background: var(--primary-text-color); opacity: .2; }
.close { flex: none; width: 56px; height: 56px; border-radius: 50%; border: none; background: var(--fl-main); color: inherit; display: flex; align-items: center; justify-content: center; cursor: pointer; --mdc-icon-size: 24px; }
.content { overflow-y: auto; overscroll-behavior: contain; padding: 6px 16px calc(24px + env(safe-area-inset-bottom, 0px)); display: flex; flex-direction: column; gap: 10px; }

/* --- Confirm dialog ----------------------------------------------------- */
.dlg { position: fixed; inset: 0; z-index: 8; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgba(0, 0, 0, .3); opacity: 0; transition: opacity .2s; }
.dlg.show { opacity: 1; }
.dlg .box { width: min(100%, 360px); border-radius: 32px; padding: 22px 18px 16px; background: var(--card-background-color, #fff); box-shadow: 0 10px 40px rgba(0, 0, 0, .3); display: flex; flex-direction: column; gap: 10px; transform: scale(.94); transition: transform .2s; }
.dlg.show .box { transform: scale(1); }
.dlg .ttl { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 600; }
.dlg .sub { font-size: 13px; opacity: .75; padding-left: 46px; }
.dlg .acts { display: flex; gap: 8px; margin-top: 8px; }
.dlg .acts .s { flex: 1; height: 42px; border-radius: 21px; font-size: 13px; }
`;

class FamilyLinkBubbleCard extends HTMLElement {
	static getStubConfig(hass) {
		const sw = Object.keys(hass.states).find((id) => id.startsWith('switch.') && hass.entities?.[id]?.platform === 'familylink' && 'restriction_reason' in hass.states[id].attributes);
		return { entity: sw || '', mode: 'popup' };
	}
	static getConfigElement() { return document.createElement('familylink-bubble-card-editor'); }

	setConfig(config) {
		if (!config || !config.entity) throw new Error('familylink-bubble-card: set "entity" to the device switch (switch.<device>)');
		const old = this._config;
		this._config = { mode: 'popup', top_apps: 5, max_daily_limit: 360, ...config };
		if (old && old.entity !== config.entity) this._map = null;
		this._sig = '';
		this._bonusCustom = this._bonusCustom || 45;
		if (!this.shadowRoot) {
			this.attachShadow({ mode: 'open' });
			this._bind(this.shadowRoot);
		}
		if (this._hass) this.hass = this._hass;
	}

	getCardSize() { return this._config?.mode === 'full' ? 14 : 2; }
	getGridOptions() { return { columns: 12, min_columns: 6, rows: 'auto' }; }

	connectedCallback() {
		this._onLoc = () => this._checkHash();
		window.addEventListener('location-changed', this._onLoc);
		window.addEventListener('popstate', this._onLoc);
		window.addEventListener('hashchange', this._onLoc);
		setTimeout(() => this._checkHash(), 0);
	}
	disconnectedCallback() {
		window.removeEventListener('location-changed', this._onLoc);
		window.removeEventListener('popstate', this._onLoc);
		window.removeEventListener('hashchange', this._onLoc);
		// the pop-up lives on <body>; take it away with the card (after a moment: HA re-attaches cards on edit)
		clearTimeout(this._gc);
		this._gc = setTimeout(() => { if (!this.isConnected) this._destroyLayer(); }, 1000);
	}

	set hass(hass) {
		this._hass = hass;
		if (!this._config) return;
		if (!this._map) return this._resolve();
		const ids = this._watched();
		if (this._autoEntity) ids.push(this._autoEntity);
		const sig = ids.map((id) => (hass.states[id] ? hass.states[id].last_updated : '-')).join('|') + hass.language + (hass.themes?.darkMode ? 'd' : 'l');
		if (sig === this._sig) return;
		this._sig = sig;
		this._render();
	}
	get hass() { return this._hass; }

	// --- entity discovery --------------------------------------------------
	_resolve() {
		if (this._resolving) return;
		const entity = this._config.entity;
		if (!this._hass.states[entity]) return this._shell(`<div class="msg err">${this._t('not_found')}${flbEsc(entity)}</div>`);
		this._shell(`<div class="msg">${this._t('loading')}</div>`);
		this._resolving = this._hass.callWS({ type: 'familylink/card_entities', entity_id: entity })
			.then((r) => this._setMap(r))
			.catch(() => this._setMap(this._guess(entity)))
			.finally(() => { this._resolving = null; });
	}
	_setMap(found) {
		if (!found || !found.device_id || !found.device || !found.device.lock) {
			this._map = null;
			return this._shell(`<div class="msg err">${this._t('pick')}</div>`);
		}
		const over = this._config.entities || {};
		this._map = { child: { ...(found.child || {}), ...(over.child || {}) }, device: { ...(found.device || {}), ...(over.device || {}) } };
		this._sig = '';
		this.hass = this._hass;
		if (this._openWhenReady) { this._openWhenReady = false; this._open(true); }
	}
	/** Fallback for integration versions without the websocket command: guess from the entity ids. */
	_guess(entity) {
		const st = this._hass.states[entity];
		if (!st || !('restriction_reason' in st.attributes)) return null;
		const dev = entity.split('.')[1];
		const slug = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
		const child = this._config.child || slug(st.attributes.child_name);
		const has = (id) => (this._hass.states[id] ? id : undefined);
		const device = { lock: entity };
		const D = { screen_time_remaining: 'sensor', next_restriction: 'sensor', daily_limit: 'sensor', active_bonus: 'sensor', daily_screen_time: 'sensor', battery_level: 'sensor',
			bedtime_active: 'binary_sensor', schooltime_active: 'binary_sensor:school_time_active', daily_limit_reached: 'binary_sensor',
			bonus_15min: 'button:15min', bonus_30min: 'button:30min', bonus_60min: 'button:60min', reset_bonus: 'button', ring: 'button' };
		for (const [role, spec] of Object.entries(D)) { const [dom, suf] = spec.split(':'); device[role] = has(`${dom}.${dev}_${suf || role}`); }
		const c = {};
		const C = { bedtime: 'switch', school_time: 'switch', daily_limit: 'switch', strict_mode: 'switch', downtime_unlimited_apps: 'switch:unlimited_apps_during_downtime',
			screen_time_total: 'sensor:daily_screen_time', app_count: 'sensor:installed_apps', blocked_apps: 'sensor', apps_with_limits: 'sensor:apps_with_time_limits',
			always_allowed_apps: 'sensor', blocked_sites: 'sensor', approved_sites: 'sensor', web_filter: 'select', allowed_calls_texts: 'select',
			play_approval_setting: 'select:play_purchase_approvals', play_apps_rating_setting: 'select:play_apps_games_rating' };
		for (const [role, spec] of Object.entries(C)) { const [dom, suf] = spec.split(':'); c[role] = has(`${dom}.${child}_${suf || role}`); }
		for (let i = 1; i <= 10; i++) c[`top_app_${i}`] = has(`sensor.${child}_top_app_${i}`);
		const names = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
		names.forEach((n, i) => {
			c[`daily_limit_${i + 1}`] = has(`number.${child}_${n}_limit`);
			for (const b of ['start', 'end']) {
				c[`bedtime_${i + 1}_${b}`] = has(`time.${child}_${n}_bedtime_${b}`);
				c[`schooltime_${i + 1}_${b}`] = has(`time.${child}_${n}_school_time_${b}`);
			}
		});
		const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v));
		return { device_id: dev, device: clean(device), child: clean(c) };
	}
	_watched() { return [...Object.values(this._map.child), ...Object.values(this._map.device)]; }

	// --- helpers -----------------------------------------------------------
	_t(key) { const l = (this._config?.language || this._hass?.language || 'en').slice(0, 2); return (FLB_STR[l] || FLB_STR.en)[key] ?? FLB_STR.en[key]; }
	_c(role) { return this._hass.states[this._map.child[role]]; }
	_d(role) { return this._hass.states[this._map.device[role]]; }
	_id(ref) { const [scope, role] = ref.split(':'); return this._map[scope === 'c' ? 'child' : 'device'][role]; }
	_call(domain, service, data) { return this._hass.callService(domain, service, data).catch((e) => this._toast(e.message || String(e))); }
	_toast(message) { this.dispatchEvent(new CustomEvent('hass-notification', { detail: { message }, bubbles: true, composed: true })); }
	_moreInfo(entityId) { if (entityId) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true })); }
	_haptic() { this.dispatchEvent(new CustomEvent('haptic', { detail: 'light', bubbles: true, composed: true })); }
	_fmtState(st) { try { return this._hass.formatEntityState ? this._hass.formatEntityState(st) : st.state; } catch (e) { return st.state; } }
	_fmtOption(st, v) { try { return this._hass.formatEntityState ? this._hass.formatEntityState(st, v) : v; } catch (e) { return v; } }
	_devName() { const l = this._d('lock'); return this._config.name || (l && l.attributes.friendly_name) || ''; }
	_childName() { const l = this._d('lock'); return (l && l.attributes.child_name) || ''; }
	_hash() { return this._config.hash || `#fl-${String(this._config.entity).split('.')[1]}`; }
	_sections() { const s = this._config.sections; return Array.isArray(s) && s.length ? s.filter((x) => FLB_SECTIONS.includes(x)) : FLB_SECTIONS; }
	_shell(body) {
		this.shadowRoot.innerHTML = `<style>${FLB_CSS}</style><ha-card class="fl">${body}</ha-card>`;
	}

	// --- status ------------------------------------------------------------
	_status() {
		const lock = this._d('lock');
		const usable = lock && lock.state === 'on';
		const reason = lock ? lock.attributes.restriction_reason : '';
		const used = flbNum(this._d('daily_screen_time')), limit = flbNum(this._d('daily_limit')), bonus = flbNum(this._d('active_bonus')) || 0;
		const left = flbNum(this._d('screen_time_remaining'));
		const total = limit > 0 ? limit + bonus : NaN;
		const pct = total > 0 && !isNaN(used) ? Math.min(100, (used / total) * 100) : 0;
		const next = this._d('next_restriction');
		const nextTxt = this._nextText(next, reason);
		const why = this._t('why');
		const label = !lock ? '' : reason && reason !== 'none' ? why[reason] || reason : usable ? this._t('available') : why.manually_locked;
		let icon = this._config.icon || (lock && lock.attributes.icon) || 'mdi:cellphone';
		if (!this._config.icon && !usable && icon === 'mdi:cellphone') icon = 'mdi:cellphone-lock';
		const battery = flbNum(this._d('battery_level'));
		return { lock, usable, reason, used, limit, bonus, left, total, pct, nextTxt, label, icon, battery };
	}

	// --- rendering ---------------------------------------------------------
	_render() {
		if (this._busy) { this._pending = true; return; }
		const full = this._config.mode === 'full';
		const s = this._status();
		const name = this._devName();
		const stateLine = [s.label, s.nextTxt].filter(Boolean).join(' · ');
		const subs = [];
		if (!isNaN(s.left)) subs.push(`<span class="s ghost"><ha-icon icon="mdi:timer-sand"></ha-icon>${this._hm(s.left)} <span class="lbl">${flbEsc(this._t('left'))}</span></span>`);
		if (!isNaN(s.battery)) subs.push(`<span class="s ghost"><ha-icon icon="${this._battIcon(s.battery)}"></ha-icon>${Math.round(s.battery)}%</span>`);
		if (full && this._d('ring')) subs.push(`<button class="s icon-only" data-act="ring" title="${flbEsc(this._t('ring'))}"><ha-icon icon="mdi:bell-ring-outline"></ha-icon></button>`);
		const btn = (act, icon, label, extra = '') => `<button class="s ${extra}" data-act="${act}"><ha-icon icon="${icon}"></ha-icon>${label ? `<span>${flbEsc(label)}</span>` : ''}</button>`;
		const bottom = [
			btn('lock', s.usable ? 'mdi:lock' : 'mdi:lock-open-variant', s.usable ? this._t('lock') : this._t('unlock'), s.usable ? 'wide' : 'wide bad'),
			this._d('bonus_15min') ? btn('press:bonus_15min', 'mdi:timer-plus-outline', '+15') : '',
			this._d('bonus_30min') ? btn('press:bonus_30min', 'mdi:timer-plus-outline', '+30') : '',
			this._d('bonus_60min') ? btn('press:bonus_60min', 'mdi:timer-plus-outline', '+60') : '',
			full ? '' : btn('open', 'mdi:chevron-up', ''),
		].join('');
		const main = `
			<div class="b large ${s.usable ? '' : 'locked'}" data-act="${full ? 'more:d:lock' : 'open'}">
				<div class="fill" style="width:${s.pct}%"></div>
				<div class="row">
					<div class="icon ${s.usable ? 'ok' : 'bad'}"><ha-icon icon="${s.icon}"></ha-icon></div>
					<div class="names"><div class="name">${flbEsc(name)}</div><div class="state">${flbEsc(stateLine)}</div></div>
					<div class="subs">${subs.join('')}</div>
				</div>
				<div class="bottom">${bottom}</div>
			</div>`;
		const body = full ? `<div class="stack">${main}${this._sectionsHtml()}</div>` : main;
		this.shadowRoot.innerHTML = `<style>${FLB_CSS}</style><ha-card class="fl ${full ? 'full' : ''}">${body}</ha-card>`;
		if (this._layer && this._layer.open) this._renderPopup();
	}

	/** The integration words the next restriction in English ("School time (ends at 17:00)"): reword it, in 24 h. */
	_nextText(st, reason) {
		if (!flbOk(st)) return '';
		const raw = String(st.state).trim();
		if (/^no restriction/i.test(raw)) return '';
		if (/^daily limit soon/i.test(raw)) return this._t('limit_soon');
		const m = raw.match(/^(Bedtime|School time)\s+(?:\(ends\s+(.+)\)|(.+))$/i);
		if (!m) return raw;
		const kind = /^bed/i.test(m[1]) ? 'bedtime' : 'school_time';
		const label = kind === 'bedtime' ? this._t('bedtime') : this._t('school');
		const when = (w) => {
			const hm = (w.match(/(\d{1,2}):(\d{2})/) || []).slice(1);
			const clock = hm.length ? `${hm[0].padStart(2, '0')}:${hm[1]}` : w;
			if (/^at\b/i.test(w)) return this._t('at').replace('{t}', clock);
			if (/^tomorrow\b/i.test(w)) return this._t('tomorrow').replace('{t}', clock);
			const d = w.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/i);
			if (d) return `${this._t('d')[['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].indexOf(d[1].toLowerCase())]} ${clock}`;
			return clock;
		};
		if (m[2]) {
			const clock = (m[2].match(/(\d{1,2}):(\d{2})/) || []).slice(1);
			const until = this._t('until').replace('{t}', /^at\b/i.test(m[2]) && clock.length ? `${clock[0].padStart(2, '0')}:${clock[1]}` : when(m[2]));
			return reason === `${kind}_active` ? until : `${label} ${until}`;
		}
		return `${label} ${when(m[3])}`;
	}
	_hm(m) { return flbHm(m, this._t('h')); }
	_battIcon(b) { const r = Math.max(10, Math.min(100, Math.round(b / 10) * 10)); return r === 100 ? 'mdi:battery' : `mdi:battery-${r}`; }

	_sep(name, icon, right = '') {
		return `<div class="sep"><ha-icon icon="${icon}"></ha-icon><span>${flbEsc(name)}</span><div class="line"></div>${right}</div>`;
	}

	_sectionsHtml() {
		const out = [];
		for (const sec of this._sections()) {
			const fn = this[`_sec_${sec}`];
			if (fn) out.push(fn.call(this));
		}
		return out.join('');
	}

	_sec_today() {
		const s = this._status(), t = (k) => this._t(k);
		const chip = (icon, k, v, ref) => `<div class="chip" data-act="more:${ref}"><div class="k"><ha-icon icon="${icon}"></ha-icon>${flbEsc(k)}</div><div class="v">${flbEsc(v)}</div></div>`;
		const total = flbNum(this._c('screen_time_total'));
		return this._sep(t('today'), 'mdi:calendar-today', isNaN(total) ? '' : `<span class="sub">${this._hm(total)} ${flbEsc(t('all_devices'))}</span>`) + `
			<div class="chips">
				${chip('mdi:clock-outline', t('used'), this._hm(s.used), 'd:daily_screen_time')}
				${chip('mdi:timer-sand', t('left_k'), this._hm(s.left), 'd:screen_time_remaining')}
				${chip('mdi:timer-outline', t('limit'), this._hm(s.limit), 'd:daily_limit')}
				${chip('mdi:gift-outline', t('bonus'), s.bonus > 0 ? '+' + this._hm(s.bonus) : '—', 'd:active_bonus')}
				${s.nextTxt ? `<div class="chip wide" data-act="more:d:next_restriction"><div class="k"><ha-icon icon="mdi:clock-alert-outline"></ha-icon>${flbEsc(t('next'))}</div><div class="v">${flbEsc(s.nextTxt)}</div></div>` : ''}
			</div>
			${this._config.mode === 'full' ? '' : `<div class="b static ${s.usable ? '' : 'locked'}" data-act="lock" style="cursor:pointer">
				<div class="row">
					<div class="icon ${s.usable ? 'ok' : 'bad'}"><ha-icon icon="${s.usable ? 'mdi:lock-open-variant' : 'mdi:lock'}"></ha-icon></div>
					<div class="names"><div class="name">${flbEsc(s.label)}</div><div class="state">${flbEsc(s.usable ? t('tap_lock') : t('tap_unlock'))}</div></div>
					<span class="s ${s.usable ? '' : 'bad'}">${flbEsc(s.usable ? t('lock') : t('unlock'))}</span>
				</div>
			</div>`}`;
	}

	_sec_bonus() {
		const t = (k) => this._t(k), s = this._status();
		const b = (role, label) => (this._d(role) ? `<button class="s" data-act="press:${role}"><ha-icon icon="mdi:timer-plus-outline"></ha-icon>${label}</button>` : '');
		return this._sep(t('time_bonus'), 'mdi:gift-outline', s.bonus > 0 ? `<span class="badge">+${this._hm(s.bonus)}</span>` : '') + `
			<div class="panel"><div class="btnrow">
				${b('bonus_15min', '+15')}${b('bonus_30min', '+30')}${b('bonus_60min', '+60')}
				<button class="s" data-act="reset" ${s.bonus > 0 ? '' : 'disabled'}><ha-icon icon="mdi:timer-off-outline"></ha-icon>${flbEsc(t('reset'))}</button>
			</div>
			<div class="stepper">
				<button class="s icon-only" data-act="bstep:-15"><ha-icon icon="mdi:minus"></ha-icon></button>
				<div class="v">${flbEsc(t('custom'))}: ${this._hm(this._bonusCustom)}</div>
				<button class="s icon-only" data-act="bstep:15"><ha-icon icon="mdi:plus"></ha-icon></button>
				<button class="s accent" data-act="badd"><ha-icon icon="mdi:check"></ha-icon>${flbEsc(t('add'))}</button>
			</div></div>`;
	}

	_sec_restrictions() {
		const t = (k) => this._t(k), day = flbToday();
		const tile = (role, name, icon, sub, badge, span) => {
			const st = this._c(role);
			if (!st) return '';
			const on = st.state === 'on';
			return `<div class="b ${on ? 'on' : ''} ${span ? 'span' : ''}" data-act="toggle:c:${role}">
				<div class="bg"></div>
				<div class="row">
					<div class="icon"><ha-icon icon="${icon}"></ha-icon></div>
					<div class="names"><div class="name">${flbEsc(name)}</div><div class="state">${flbEsc(sub || (flbOk(st) ? (on ? t('on') : t('off')) : this._fmtState(st)))}</div></div>
					${badge || ''}
				</div></div>`;
		};
		const range = (a, b) => { const x = flbHHMM(this._c(a)), y = flbHHMM(this._c(b)); return x && y ? `${x} – ${y}` : ''; };
		const bed = range(`bedtime_${day}_start`, `bedtime_${day}_end`) || t('not_set');
		const school = range(`schooltime_${day}_start`, `schooltime_${day}_end`) || t('none_today');
		const active = (role, label, cls = '') => (this._d(role) && this._d(role).state === 'on' ? `<span class="badge ${cls}">${flbEsc(label)}</span>` : '');
		const lim = flbNum(this._d('daily_limit'));
		const tiles = [
			tile('bedtime', t('bedtime'), 'mdi:sleep', bed, active('bedtime_active', t('now'))),
			(() => {
				const only = this._c('school_time')?.state === 'off' && this._schoolTodayOnly();
				return only
					? tile('school_time', t('school'), 'mdi:school-outline', t('today_only_badge'), `<span class="badge">${flbEsc(t('back_on_at').replace('{t}', this._schoolUntil()))}</span>`)
					: tile('school_time', t('school'), 'mdi:school-outline', school, active('schooltime_active', t('now')));
			})(),
			tile('daily_limit', t('daily_limit'), 'mdi:timer-lock-outline', isNaN(lim) ? '' : `${this._hm(lim)} ${t('today_tag')}`, active('daily_limit_reached', t('reached'), 'bad')),
			tile('strict_mode', t('strict'), 'mdi:shield-lock-outline', ''),
			tile('downtime_unlimited_apps', t('unl'), 'mdi:apps', '', '', true),
		].join('');
		return this._sep(t('restrictions'), 'mdi:shield-half-full') + `<div class="grid2">${tiles}</div>`;
	}

	_sec_apps() {
		const t = (k) => this._t(k), n = Math.max(0, Math.min(10, Number(this._config.top_apps) || 0));
		if (!n) return '';
		const blocked = new Set(((this._c('blocked_apps') || {}).attributes?.apps || []).map((a) => a.package));
		const rows = [];
		let max = 0;
		for (let i = 1; i <= n; i++) {
			const st = this._c(`top_app_${i}`);
			if (!flbOk(st) || !st.attributes.app_name) continue;
			const secs = Number(st.attributes.total_seconds) || 0;
			max = Math.max(max, secs);
			rows.push({ i, st, secs, pkg: st.attributes.package_name, name: st.attributes.app_name });
		}
		const total = flbNum(this._c('screen_time_total'));
		const html = rows.map((r) => {
			const isB = blocked.has(r.pkg);
			return `<div class="app ${isB ? 'blocked' : ''}">
				<div class="bar" style="width:${max ? (r.secs / max) * 100 : 0}%"></div>
				<div class="rank">${r.i}</div>
				<div class="an" data-act="more:c:top_app_${r.i}" style="cursor:pointer">${flbEsc(r.name)}</div>
				<div class="at">${this._hm(r.secs / 60)}</div>
				<button class="s icon-only ${isB ? 'bad' : ''}" data-act="app:${r.i}" title="${flbEsc(isB ? t('unblock_q').replace('{a}', r.name) : t('block_q').replace('{a}', r.name))}"><ha-icon icon="${isB ? 'mdi:cancel' : 'mdi:block-helper'}"></ha-icon></button>
			</div>`;
		}).join('');
		return this._sep(t('top_apps'), 'mdi:chart-bar', isNaN(total) ? '' : `<span class="sub">${this._hm(total)}</span>`) + (html ? `<div class="stack" style="gap:6px">${html}</div>` : `<div class="muted">${flbEsc(t('no_usage'))}</div>`);
	}

	_sec_week() {
		const t = (k) => this._t(k), days = t('days'), today = flbToday();
		const cfgMax = Number(this._config.max_daily_limit) || 360;
		const rows = [];
		for (let i = 1; i <= 7; i++) {
			const role = `daily_limit_${i}`, st = this._c(role);
			if (!st) continue;
			const v = flbNum(st);
			const step = Number(st.attributes.step) || 5, min = Number(st.attributes.min) || 0;
			const max = Math.max(cfgMax, isNaN(v) ? 0 : Math.ceil(v / 60) * 60);
			const pct = isNaN(v) ? 0 : Math.min(100, ((v - min) / (max - min)) * 100);
			rows.push(`<div class="b slider ${i === today ? 'today' : ''}" data-slider="c:${role}" data-min="${min}" data-max="${max}" data-step="${Math.max(step, 15)}" data-val="${isNaN(v) ? 0 : v}">
				<div class="fill" style="width:${pct}%"></div>
				<div class="row">
					<div class="icon"><ha-icon icon="mdi:calendar${i === today ? '-today' : ''}"></ha-icon></div>
					<div class="names"><div class="name">${flbEsc(days[i - 1])}${i === today ? ` · ${flbEsc(t('today_tag'))}` : ''}</div></div>
					<div class="value">${flbOk(st) ? (v === 0 ? flbEsc(t('off')) : this._hm(v)) : '—'}</div>
				</div></div>`);
		}
		return rows.length ? this._sep(t('week'), 'mdi:calendar-week') + `<div class="stack" style="gap:8px">${rows.join('')}</div>` : '';
	}

	_sec_schedule() {
		const t = (k) => this._t(k), days = t('days'), today = flbToday();
		const hasSchool = [1, 2, 3, 4, 5, 6, 7].some((i) => this._c(`schooltime_${i}_start`));
		const tab = hasSchool && this._schedTab === 'schooltime' ? 'schooltime' : 'bedtime';
		const cell = (i) => {
			const a = this._c(`${tab}_${i}_start`), b = this._c(`${tab}_${i}_end`);
			if (!a && !b) return '';
			if (!flbOk(a) && !flbOk(b)) return `<div class="srow ${i === today ? 'today' : ''}"><span class="dn">${flbEsc(days[i - 1])}</span><div class="pair"><span class="off">${flbEsc(t('off'))}</span></div></div>`;
			const inp = (st, bound) => `<button class="s tbtn" data-act="tpick:c:${tab}_${i}_${bound}" ${flbOk(st) ? '' : 'disabled'}>${flbHHMM(st) || '--:--'}</button>`;
			return `<div class="srow ${i === today ? 'today' : ''}"><span class="dn">${flbEsc(days[i - 1])}</span><div class="pair">${inp(a, 'start')}<span>–</span>${inp(b, 'end')}</div></div>`;
		};
		let rows = '';
		for (let i = 1; i <= 7; i++) rows += cell(i);
		const seg = hasSchool ? `<div class="seg">
			<button class="s ${tab === 'bedtime' ? 'sel' : ''}" data-act="stab:bedtime"><ha-icon icon="mdi:sleep"></ha-icon>${flbEsc(t('bedtime'))}</button>
			<button class="s ${tab === 'schooltime' ? 'sel' : ''}" data-act="stab:schooltime"><ha-icon icon="mdi:school-outline"></ha-icon>${flbEsc(t('school'))}</button>
		</div>` : '';
		return this._sep(t('schedule'), 'mdi:calendar-clock') + seg + (rows ? `<div class="sched">${rows}</div>` : '');
	}

	_sec_settings() {
		const t = (k) => this._t(k);
		const sel = (role, name, icon) => {
			const st = this._c(role);
			if (!st) return '';
			const opts = st.attributes.options || [];
			return `<div class="b static"><div class="row">
				<div class="icon"><ha-icon icon="${icon}"></ha-icon></div>
				<div class="names"><div class="name">${flbEsc(name)}</div></div>
				<div class="selwrap"><select data-select="c:${role}" ${flbOk(st) ? '' : 'disabled'}>
					${opts.map((o) => `<option value="${flbEsc(o)}" ${o === st.state ? 'selected' : ''}>${flbEsc(this._fmtOption(st, o))}</option>`).join('')}
					${opts.includes(st.state) ? '' : `<option selected disabled>${flbEsc(this._fmtState(st))}</option>`}
				</select><ha-icon icon="mdi:chevron-down"></ha-icon></div>
			</div></div>`;
		};
		const chip = (role, icon, k) => { const st = this._c(role); return st ? `<div class="chip" data-act="more:c:${role}"><div class="k"><ha-icon icon="${icon}"></ha-icon>${flbEsc(k)}</div><div class="v">${flbOk(st) ? flbEsc(st.state) : '—'}</div></div>` : ''; };
		return this._sep(t('settings'), 'mdi:cog-outline') + `
			<div class="stack" style="gap:8px">
				${sel('web_filter', t('web_filter'), 'mdi:web-check')}
				${sel('allowed_calls_texts', t('calls'), 'mdi:message-processing-outline')}
				${sel('play_approval_setting', t('play_appr'), 'mdi:google-play')}
				${sel('play_apps_rating_setting', t('play_rating'), 'mdi:star-circle-outline')}
			</div>` + this._sep(t('apps_sites'), 'mdi:apps') + `
			<div class="chips">
				${chip('app_count', 'mdi:apps', t('installed'))}
				${chip('blocked_apps', 'mdi:cancel', t('blocked'))}
				${chip('apps_with_limits', 'mdi:timer-cog-outline', t('limited'))}
				${chip('always_allowed_apps', 'mdi:check-decagram-outline', t('always'))}
				${chip('blocked_sites', 'mdi:web-cancel', t('blocked_sites'))}
				${chip('approved_sites', 'mdi:web-check', t('approved_sites'))}
			</div>`;
	}

	// --- pop-up --------------------------------------------------------------
	_ensureLayer() {
		if (this._layer) return this._layer;
		const host = document.createElement('div');
		host.setAttribute('data-familylink-bubble-popup', this._hash());
		const root = host.attachShadow({ mode: 'open' });
		root.innerHTML = `<style>${FLB_CSS}</style>
			<div class="fl ov"><div class="bd"></div>
				<div class="sheet"><div class="handle"></div><div class="hdr"></div><div class="content"></div></div>
			</div>`;
		document.body.appendChild(host);
		this._bind(root);
		const ov = root.querySelector('.ov'), sheet = root.querySelector('.sheet'), hdr = root.querySelector('.hdr');
		root.querySelector('.bd').addEventListener('click', () => this._close());
		// swipe the header down to close
		let y0 = null, dy = 0;
		hdr.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; y0 = e.clientY; dy = 0; sheet.classList.add('dragging'); hdr.setPointerCapture(e.pointerId); });
		hdr.addEventListener('pointermove', (e) => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); sheet.style.transform = `translate(-50%, ${dy}px)`; });
		const end = () => { if (y0 === null) return; y0 = null; sheet.classList.remove('dragging'); sheet.style.transform = ''; if (dy > 90) this._close(); };
		hdr.addEventListener('pointerup', end);
		hdr.addEventListener('pointercancel', end);
		this._onKey = (e) => { if (e.key === 'Escape' && this._layer?.open && !this._dlg) this._close(); };
		window.addEventListener('keydown', this._onKey);
		this._layer = { host, root, ov, sheet, hdr, content: root.querySelector('.content'), open: false };
		return this._layer;
	}
	_destroyLayer() {
		if (!this._layer) return;
		if (this._layer.open) this._unlockScroll();
		this._layer.host.remove();
		window.removeEventListener('keydown', this._onKey);
		this._layer = null;
	}
	_open(fromHash = false) {
		if (!this._map || this._config.mode === 'full') return;
		const L = this._ensureLayer();
		if (L.open) return;
		L.open = true;
		this._renderPopup();
		requestAnimationFrame(() => requestAnimationFrame(() => L.ov.classList.add('open')));
		this._lockScroll();
		if (!fromHash && location.hash !== this._hash()) {
			history.pushState({ flb: true }, '', location.pathname + location.search + this._hash());
			this._pushed = true;
		}
	}
	_close(fromHash = false) {
		const L = this._layer;
		if (!L || !L.open) return;
		L.open = false;
		L.ov.classList.remove('open');
		this._unlockScroll();
		if (!fromHash && location.hash === this._hash()) {
			if (this._pushed) history.back();
			else history.replaceState(history.state, '', location.pathname + location.search);
		}
		this._pushed = false;
	}
	_checkHash() {
		if (!this._config || this._config.mode === 'full') return;
		const want = location.hash === this._hash();
		if (want && !(this._layer && this._layer.open)) { if (this._map) this._open(true); else this._openWhenReady = true; }
		else if (!want && this._layer && this._layer.open) this._close(true);
	}
	_lockScroll() { this._oldOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
	_unlockScroll() { document.body.style.overflow = this._oldOverflow || ''; }
	_renderPopup() {
		const L = this._layer;
		if (!L) return;
		const s = this._status();
		const ring = this._d('ring') ? `<button class="s icon-only" data-act="ring" title="${flbEsc(this._t('ring'))}"><ha-icon icon="mdi:bell-ring-outline"></ha-icon></button>` : '';
		const batt = isNaN(s.battery) ? '' : `<span class="s ghost"><ha-icon icon="${this._battIcon(s.battery)}"></ha-icon>${Math.round(s.battery)}%</span>`;
		L.hdr.innerHTML = `
			<div class="b static ${s.usable ? '' : 'locked'}">
				<div class="fill" style="width:${s.pct}%"></div>
				<div class="row">
					<div class="icon ${s.usable ? 'ok' : 'bad'}" data-act="more:d:lock" style="cursor:pointer"><ha-icon icon="${s.icon}"></ha-icon></div>
					<div class="names"><div class="name">${flbEsc(this._devName())}</div><div class="state">${flbEsc([s.label, this._childName()].filter(Boolean).join(' · '))}</div></div>
					<div class="subs">${batt}${ring}</div>
				</div>
			</div>
			<button class="close" data-act="close" aria-label="${flbEsc(this._t('close'))}"><ha-icon icon="mdi:close"></ha-icon></button>`;
		const scroll = L.content.scrollTop;
		L.content.innerHTML = this._sectionsHtml();
		L.content.scrollTop = scroll;
	}

	// --- dialogs -----------------------------------------------------------
	/** Bubble-style dialog. buttons: [{label, value, cls}] (last = default). Resolves with the value, or null. */
	_dialog({ title, sub = '', icon = 'mdi:help-circle-outline', bad = false, body = '', buttons, column = false }) {
		const L = this._ensureLayer();
		return new Promise((resolve) => {
			const el = document.createElement('div');
			el.className = 'fl dlg';
			el.innerHTML = `<div class="box">
				<div class="ttl"><div class="icon ${bad ? 'bad' : ''}"><ha-icon icon="${icon}"></ha-icon></div><span>${flbEsc(title)}</span></div>
				${sub ? `<div class="sub">${flbEsc(sub)}</div>` : ''}${body}
				<div class="acts ${column ? 'col' : ''}">${buttons.map((b, i) => `<button class="s ${b.cls || ''}" data-r="${i}">${flbEsc(b.label)}</button>`).join('')}</div>
			</div>`;
			L.root.appendChild(el);
			this._dlg = el;
			requestAnimationFrame(() => el.classList.add('show'));
			const def = buttons.length - 1;
			const done = (i) => {
				const out = i === null ? null : { value: buttons[i].value, el };
				el.classList.remove('show'); this._dlg = null; setTimeout(() => el.remove(), 200);
				window.removeEventListener('keydown', key, true);
				resolve(out);
			};
			const key = (e) => { if (e.key === 'Escape') { e.stopPropagation(); done(null); } if (e.key === 'Enter' && !e.target.matches?.('select')) done(def); };
			window.addEventListener('keydown', key, true);
			el.addEventListener('click', (e) => { const b = e.target.closest('[data-r]'); if (b) done(Number(b.dataset.r)); else if (e.target === el) done(null); });
			setTimeout(() => el.querySelector(`[data-r="${def}"]`)?.focus(), 50);
		});
	}
	async _confirm({ title, sub = '', icon, ok, bad = false }) {
		const r = await this._dialog({ title, sub, icon, bad, buttons: [{ label: this._t('cancel'), value: false }, { label: ok || this._t('confirm'), value: true, cls: bad ? 'bad' : 'accent' }] });
		return !!(r && r.value);
	}
	/** 24 h time picker (the browser's own time field follows its locale, often AM/PM). */
	async _pickTime(ref) {
		const id = this._id(ref), st = this._hass.states[id];
		if (!st) return;
		const [h, m] = (flbHHMM(st) || '00:00').split(':').map(Number);
		const opts = (n, step, cur) => { const v = []; for (let i = 0; i < n; i += step) v.push(i); if (!v.includes(cur)) v.push(cur); return v.sort((a, b) => a - b).map((i) => `<option value="${i}" ${i === cur ? 'selected' : ''}>${String(i).padStart(2, '0')}</option>`).join(''); };
		const role = ref.split(':')[1];
		const [, kind, day, bound] = role.match(/^(bedtime|schooltime)_(\d)_(start|end)$/) || [];
		const title = kind ? `${kind === 'bedtime' ? this._t('bedtime') : this._t('school')} · ${this._t('days')[day - 1]} · ${this._t(bound)}` : (st.attributes.friendly_name || id);
		const body = `<div class="pick">
			<div><div class="selwrap"><select data-p="h">${opts(24, 1, h)}</select><ha-icon icon="mdi:chevron-down"></ha-icon></div><div class="lab">${flbEsc(this._t('hour'))}</div></div>
			<span>:</span>
			<div><div class="selwrap"><select data-p="m">${opts(60, 5, m)}</select><ha-icon icon="mdi:chevron-down"></ha-icon></div><div class="lab">${flbEsc(this._t('minute'))}</div></div>
		</div>`;
		const r = await this._dialog({ title, icon: kind === 'bedtime' ? 'mdi:sleep' : 'mdi:school-outline', body,
			buttons: [{ label: this._t('cancel'), value: false }, { label: this._t('save'), value: true, cls: 'accent' }] });
		if (!r || !r.value) return;
		const hh = String(r.el.querySelector('[data-p="h"]').value).padStart(2, '0'), mm = String(r.el.querySelector('[data-p="m"]').value).padStart(2, '0');
		if (`${hh}:${mm}` !== flbHHMM(st)) this._call('time', 'set_value', { entity_id: id, time: `${hh}:${mm}:00` });
	}

	// --- school time "only today" -----------------------------------------------
	_todayIso() {
		try { return new Intl.DateTimeFormat('en-CA', { timeZone: this._hass.config?.time_zone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
		catch (e) { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
	}
	_schoolUntil() { const v = String(this._config.school_today_until || '23:58'); return /^\d{1,2}:\d{2}$/.test(v) ? v.padStart(5, '0') : '23:58'; }
	_schoolAutoId() { return `familylink_bubble_school_${(String(this._map.child.school_time || '').split('.')[1] || 'child').replace(/_school_time$/, '')}`; }
	/** The restore automation, if it is set for today: { entity_id, date }. */
	_schoolTodayOnly() {
		const id = this._schoolAutoId();
		if (!this._autoEntity || !this._hass.states[this._autoEntity]) {
			const now = Date.now();
			if (this._autoSearched && now - this._autoSearched < 30000) return null;
			this._autoSearched = now;
			this._autoEntity = Object.keys(this._hass.states).find((k) => k.startsWith('automation.') && this._hass.states[k].attributes.id === id) || null;
			if (!this._autoEntity) return null;
		}
		const st = this._hass.states[this._autoEntity];
		const date = ((st.attributes.friendly_name || '').match(/\((\d{4}-\d{2}-\d{2})\)\s*$/) || [])[1];
		return date === this._todayIso() && st.state === 'on' ? { entity_id: this._autoEntity, date } : null;
	}
	async _schoolOffToday() {
		const sw = this._map.child.school_time, at = this._schoolUntil(), today = this._todayIso();
		const child = this._childName() || sw;
		const cfg = {
			alias: `Family Link: schooltijd weer aan – ${child} (${today})`,
			description: `Made by familylink-bubble-card: school time was switched off for ${today} only. Switches it back on at ${at} that day, so the weekly schedule applies again from tomorrow. Safe to delete.`,
			mode: 'single',
			triggers: [{ trigger: 'time', at: `${at}:00` }],
			conditions: [
				{ condition: 'template', value_template: `{{ now().date() | string == '${today}' }}` },
				{ condition: 'state', entity_id: sw, state: 'off' },
			],
			actions: [{ action: 'switch.turn_on', target: { entity_id: sw } }],
		};
		try {
			await this._hass.callApi('POST', `config/automation/config/${this._schoolAutoId()}`, cfg);
			this._autoEntity = null; this._autoSearched = 0;
		} catch (e) {
			this._toast(this._t('auto_fail'));
		}
		await this._call('switch', 'turn_off', { entity_id: sw });
	}

	// --- events --------------------------------------------------------------
	_bind(root) {
		root.addEventListener('click', (e) => this._onClick(e));
		root.addEventListener('change', (e) => this._onChange(e));
		root.addEventListener('pointerdown', (e) => this._onSliderDown(e));
		root.addEventListener('focusin', (e) => { if (e.target.matches('input,select')) this._busy = true; });
		root.addEventListener('focusout', (e) => { if (e.target.matches('input,select')) { this._busy = false; this._flush(); } });
	}
	_flush() { if (this._pending && !this._busy) { this._pending = false; this._render(); } }

	async _onClick(e) {
		if (this._dragMoved) { this._dragMoved = false; return; }
		const el = e.target.closest('[data-act]');
		if (!el || !this._map) return;
		e.stopPropagation();
		const [act, ...rest] = el.dataset.act.split(':');
		const arg = rest.join(':');
		const t = (k) => this._t(k), dev = this._devName();
		this._haptic();
		switch (act) {
			case 'open': return this._open();
			case 'close': return this._close();
			case 'more': return this._moreInfo(this._id(arg));
			case 'press': return this._call('button', 'press', { entity_id: this._map.device[arg] });
			case 'toggle': {
				if (arg === 'c:school_time' && this._c('school_time')?.state === 'on') {
					const at = this._schoolUntil();
					const r = await this._dialog({ title: t('school_off_q'), sub: t('school_off_sub').replace('{t}', at), icon: 'mdi:school-outline', column: true,
						buttons: [{ label: t('cancel'), value: null }, { label: t('permanent'), value: 'perm' }, { label: `${t('only_today')} (→ ${at})`, value: 'today', cls: 'accent' }] });
					if (!r || !r.value) return;
					if (r.value === 'today') return this._schoolOffToday();
				}
				return this._call('homeassistant', 'toggle', { entity_id: this._id(arg) });
			}
			case 'tpick': return this._pickTime(arg);
			case 'lock': {
				const usable = this._d('lock')?.state === 'on';
				const yes = await this._confirm({ title: (usable ? t('lock_q') : t('unlock_q')).replace('{d}', dev), sub: usable ? t('lock_sub') : t('unlock_sub'), icon: usable ? 'mdi:lock' : 'mdi:lock-open-variant', ok: usable ? t('lock') : t('unlock'), bad: usable });
				if (yes) this._call('switch', usable ? 'turn_off' : 'turn_on', { entity_id: this._map.device.lock });
				return;
			}
			case 'ring':
				if (await this._confirm({ title: t('ring_q').replace('{d}', dev), sub: t('ring_sub'), icon: 'mdi:bell-ring-outline', ok: t('ring') })) this._call('button', 'press', { entity_id: this._map.device.ring });
				return;
			case 'reset':
				if (await this._confirm({ title: t('reset_q'), icon: 'mdi:timer-off-outline', ok: t('reset'), bad: true })) this._call('button', 'press', { entity_id: this._map.device.reset_bonus });
				return;
			case 'stab':
				this._schedTab = arg;
				return this._rerenderNow();
			case 'bstep':
				this._bonusCustom = Math.max(15, Math.min(1440, this._bonusCustom + Number(arg)));
				return this._rerenderNow();
			case 'badd':
				if (await this._confirm({ title: t('add_q').replace('{n}', this._bonusCustom).replace('{d}', dev), icon: 'mdi:gift-outline', ok: t('add') })) {
					this._call('familylink', 'add_time_bonus', { entity_id: this._map.device.lock, bonus_minutes: this._bonusCustom });
				}
				return;
			case 'app': {
				const st = this._c(`top_app_${arg}`);
				if (!st) return;
				const pkg = st.attributes.package_name, name = st.attributes.app_name || pkg;
				const isB = ((this._c('blocked_apps') || {}).attributes?.apps || []).some((a) => a.package === pkg);
				const yes = await this._confirm({ title: (isB ? t('unblock_q') : t('block_q')).replace('{a}', name), sub: isB ? t('unblock_sub') : t('block_sub').replace('{c}', this._childName()), icon: isB ? 'mdi:check-circle-outline' : 'mdi:cancel', ok: t('confirm'), bad: !isB });
				if (yes) this._call('familylink', isB ? 'unblock_app' : 'block_app', { entity_id: this._map.child[`top_app_${arg}`], package_name: pkg });
				return;
			}
			default:
		}
	}
	_rerenderNow() { this._sig = ''; this._render(); }

	_onChange(e) {
		const el = e.target;
		if (el.dataset.select) {
			this._call('select', 'select_option', { entity_id: this._id(el.dataset.select), option: el.value });
		} else if (el.dataset.time && el.value) {
			this._call('time', 'set_value', { entity_id: this._id(el.dataset.time), time: el.value.length === 5 ? `${el.value}:00` : el.value });
		}
	}

	/** Bubble-like slider: drag horizontally, vertical moves keep scrolling the pop-up. */
	_onSliderDown(e) {
		const el = e.target.closest('[data-slider]');
		if (!el || e.button > 0) return;
		const min = Number(el.dataset.min), max = Number(el.dataset.max), step = Number(el.dataset.step);
		const x0 = e.clientX, y0 = e.clientY;
		const startVal = Number(el.dataset.val);
		let active = false, val = startVal;
		const fill = el.querySelector('.fill'), label = el.querySelector('.value');
		const rect = el.getBoundingClientRect();
		const move = (ev) => {
			const dx = ev.clientX - x0, dy = ev.clientY - y0;
			if (!active) {
				if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) return cleanup();
				if (Math.abs(dx) < 8) return;
				active = true;
				this._busy = true;
				el.classList.add('drag');
				try { el.setPointerCapture(e.pointerId); } catch (err) { /* not capturable */ }
			}
			ev.preventDefault();
			// relative to the start value, like Bubble Card's relative slide
			const raw = startVal + (dx / rect.width) * (max - min);
			val = Math.max(min, Math.min(max, Math.round(raw / step) * step));
			fill.style.width = `${((val - min) / (max - min)) * 100}%`;
			label.textContent = val === 0 ? this._t('off') : this._hm(val);
		};
		const up = () => {
			const was = active;
			cleanup();
			if (!was) return;
			this._dragMoved = true;
			setTimeout(() => { this._dragMoved = false; }, 50);
			el.dataset.val = val;
			if (val !== startVal) this._call('number', 'set_value', { entity_id: this._id(el.dataset.slider), value: val });
			this._busy = false;
			this._flush();
		};
		const cleanup = () => {
			el.classList.remove('drag');
			el.removeEventListener('pointermove', move);
			el.removeEventListener('pointerup', up);
			el.removeEventListener('pointercancel', up);
			if (active) { this._busy = false; }
		};
		el.addEventListener('pointermove', move);
		el.addEventListener('pointerup', up);
		el.addEventListener('pointercancel', up);
	}
}

// ---------------------------------------------------------------------------
// Visual editor
// ---------------------------------------------------------------------------
class FamilyLinkBubbleCardEditor extends HTMLElement {
	setConfig(config) { this._config = config; this._render(); }
	set hass(hass) { this._hass = hass; if (this._form) this._form.hass = hass; else this._render(); }
	_render() {
		if (!this._hass || !this._config) return;
		if (!this._form) {
			this._form = document.createElement('ha-form');
			this._form.computeLabel = (s) => ({
				entity: 'Device switch (phone / tablet)', mode: 'Layout', name: 'Name', icon: 'Icon', hash: 'Pop-up hash (e.g. #emma)',
				sections: 'Sections (pop-up / full card)', top_apps: 'Number of top apps', max_daily_limit: 'Weekly limit slider max (minutes)', language: 'Language', school_today_until: 'School time "only today": back on at (HH:MM)',
			}[s.name] || s.name);
			this._form.addEventListener('value-changed', (e) => {
				const cfg = { ...e.detail.value };
				for (const k of Object.keys(cfg)) if (cfg[k] === '' || cfg[k] === undefined || (Array.isArray(cfg[k]) && !cfg[k].length)) delete cfg[k];
				this._config = cfg;
				this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: cfg }, bubbles: true, composed: true }));
			});
			this.appendChild(this._form);
		}
		this._form.hass = this._hass;
		this._form.schema = [
			{ name: 'entity', required: true, selector: { entity: { filter: { integration: 'familylink', domain: 'switch' } } } },
			{ name: 'mode', selector: { select: { mode: 'dropdown', options: [{ value: 'popup', label: 'Compact card + pop-up' }, { value: 'full', label: 'Everything in one card' }] } } },
			{ type: 'grid', name: '', schema: [{ name: 'name', selector: { text: {} } }, { name: 'icon', selector: { icon: {} } }] },
			{ name: 'sections', selector: { select: { multiple: true, mode: 'list', options: [
				{ value: 'today', label: 'Today (usage + lock)' }, { value: 'bonus', label: 'Time bonus' }, { value: 'restrictions', label: 'Restrictions' },
				{ value: 'apps', label: 'Top apps' }, { value: 'week', label: 'Weekly limits' }, { value: 'schedule', label: 'Bedtime & school schedule' }, { value: 'settings', label: 'Settings, apps & sites' },
			] } } },
			{ type: 'grid', name: '', schema: [
				{ name: 'top_apps', selector: { number: { min: 0, max: 10, mode: 'box' } } },
				{ name: 'max_daily_limit', selector: { number: { min: 60, max: 1440, step: 15, mode: 'box' } } },
			] },
			{ type: 'grid', name: '', schema: [
				{ name: 'hash', selector: { text: {} } },
				{ name: 'school_today_until', selector: { text: {} } },
				{ name: 'language', selector: { select: { mode: 'dropdown', options: [{ value: 'en', label: 'English' }, { value: 'nl', label: 'Nederlands' }] } } },
			] },
		];
		this._form.data = { mode: 'popup', ...this._config };
	}
}

if (!customElements.get('familylink-bubble-card')) customElements.define('familylink-bubble-card', FamilyLinkBubbleCard);
if (!customElements.get('familylink-bubble-card-editor')) customElements.define('familylink-bubble-card-editor', FamilyLinkBubbleCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === 'familylink-bubble-card')) {
	window.customCards.push({
		type: 'familylink-bubble-card', name: 'Family Link Bubble Card', preview: false,
		description: 'Bubble Card style control for Google Family Link: compact card with a details pop-up, or everything in one card.',
		documentationURL: 'https://github.com/rick00001/ha-family-link-bubble-card',
	});
}
console.info(`%c FAMILYLINK-BUBBLE-CARD %c ${FLB_VERSION} `, 'color:#fff;background:#4285f4;font-weight:700;border-radius:4px 0 0 4px;padding:2px 4px', 'color:#4285f4;background:#e8f0fe;border-radius:0 4px 4px 0;padding:2px 4px');
