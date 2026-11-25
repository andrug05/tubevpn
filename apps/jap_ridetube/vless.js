'use strict';
// The in-car VLESS screen. Profile credentials remain in the root daemon; the app receives names and opaque keys only.
module.exports = function vlessPage(o) {
    const { model, ui, send, say, fit, t, message, C, H, W } = o;
    const LIT = { literal: true }, BOLD = { literal: true, font: 'bold' };
    const st = { profiles: [], loading: false, error: null, notice: null, selectedAt: 0 };
    const buttons = Array.from({ length: 10 }, (_, i) => 'BTN_VLESS_' + (i + 1));
    function menu() {
        buttons.forEach((id, i) => {
            const p = st.profiles[i];
            ui.visible(id, !!p);
            if (p) ui.text(id, (p.active ? '✓ ' : '') + String(p.name || 'VLESS profile ' + (i + 1)).slice(0, 42), 0, 'Text', { literal: true });
        });
        ui.visible('BTN_VLESS_OFF', st.profiles.some((p) => p.active));
    }
    function refresh() {
        if (!model.connected) return false;
        st.loading = true; st.error = null; st.notice = null; o.changed();
        if (!send({ cmd: 'vless_list' })) {
            st.loading = false; st.error = t('VLESS profile list unavailable'); o.changed(); return false;
        }
        return true;
    }
    function select(key) {
        if (!model.connected || st.loading) return false;
        st.loading = true; st.error = null; st.notice = t('Selected. Connecting...'); o.changed();
        if (!send({ cmd: 'vless_select', key: key })) {
            st.loading = false; st.error = t('Could not send VLESS command'); o.changed(); return false;
        }
        return true;
    }
    function selectIndex(i) {
        const p = st.profiles[i];
        if (p && /^[0-9a-f]{16}$/.test(p.key)) select(p.key);
    }
    function onMsg(m) {
        if (m.ev === 'vless_list') {
            st.profiles = Array.isArray(m.profiles) ? m.profiles.filter((p) => p && typeof p.key === 'string' && /^[0-9a-f]{16}$/.test(p.key)).slice(0, 10) : [];
            st.loading = false; st.error = null; menu(); o.changed();
        } else if (m.ev === 'vless_select') {
            st.loading = false; st.notice = m.result && m.result.active ? t('Selected. Connecting...') : t('VLESS is off');
            st.selectedAt = Date.now(); refresh();
            setTimeout(refresh, 2500);
        } else if (m.ev === 'error' && m.cmd === 'vless_select') {
            st.loading = false; st.error = String(m.msg || t('VLESS profile selection failed')).slice(0, 140); o.changed();
        }
    }
    function draw(cv) {
        const X0 = o.X0, TOP = o.TOP, bottom = H + (cv.own ? cv.extra : 0);
        if (!model.connected) return say(cv, o.OFF, o.OFF2);
        const active = st.profiles.find((p) => p.active);
        const status = st.loading ? t('Loading VLESS profiles...') : active ? (active.ready ? t('VLESS proxy is ready') : t('VLESS is connecting')) : t('VLESS is off');
        cv.text(t('VLESS proxy'), X0, TOP + 44, 30, '#ffffff', BOLD);
        cv.text(fit(cv, status, 22, W - X0 - 360, LIT), X0 + 250, TOP + 44, 22, active && active.ready ? '#35d07f' : C.dim, LIT);
        let y = TOP + 100;
        const rowH = 43, room = Math.max(1, Math.floor((bottom - y - 150) / rowH));
        const rows = st.profiles.slice(0, Math.min(10, room));
        rows.forEach((p, i) => {
            const label = (p.active ? '✓  ' : '○  ') + String(p.name || 'VLESS profile').slice(0, 48) + (p.active ? (p.ready ? '  ·  ' + t('Ready') : '  ·  ' + t('Connecting')) : '');
            const w = W - X0 - 48, f = o.focus() === 'vless:' + p.key;
            cv.roundRect(X0, y - 25, w, 36, 10, f ? '#34495e' : (p.active ? '#183c30' : '#20252d'));
            cv.text(fit(cv, label, 22, w - 24, LIT), X0 + 14, y, 22, p.active ? '#ffffff' : C.text, LIT);
            if (cv.own) cv.target(X0, y - 25, w, 36, () => select(p.key), 'vless:' + p.key, 10);
            y += rowH;
        });
        if (!st.profiles.length && !st.loading) {
            cv.text(t('No VLESS profiles saved'), X0, y + 8, 24, C.dim, LIT); y += 48;
        }
        if (st.profiles.length > rows.length) cv.text(message('+{count} more profiles', { count: st.profiles.length - rows.length }), X0, y, 20, C.dim, LIT);
        if (st.error) cv.text(fit(cv, st.error, 22, W - X0 - 40, LIT), X0, bottom - 112, 22, '#ffaaaa', LIT);
        else if (st.notice) cv.text(fit(st.notice, 22, W - X0 - 40, LIT), X0, bottom - 112, 22, C.dim, LIT);
        cv.text(fit(t('To add a profile, open Phone remote and paste the vless:// link from your phone.'), 20, W - X0 - 40, LIT), X0, bottom - 72, 20, C.dim, LIT);
        if (cv.own && !st.loading) {
            const label = active ? t('Disable VLESS') : t('Refresh');
            const bw = Math.max(250, cv.textWidth(label, 26, BOLD) + 60), by = bottom - 40;
            cv.roundRect(X0, by - 28, bw, 48, 24, C.red);
            cv.text(label, X0 + bw / 2, by + 4, 26, '#ffffff', { literal: true, font: 'bold', align: 'center' });
            cv.target(X0, by - 28, bw, 48, () => active ? select('off') : refresh(), 'vless:off', 24);
        } else if (!cv.own) {
            cv.text(t('Choose profiles in the RideTube menu'), X0, bottom - 28, 20, C.dim, LIT);
        }
    }
    menu();
    return { onMsg, refresh, select, selectIndex, draw };
};
