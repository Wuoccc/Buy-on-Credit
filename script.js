/* ═══════════════════════════════════════════════════
   SolarCredit – script.js
   Dữ liệu giờ nắng từ Global Solar Atlas (Solargis)
   Data cập nhật 2025, period đến 2024
═══════════════════════════════════════════════════ */
'use strict';

/* ────────────────────────────────────────────────
   DỮ LIỆU VỊ TRÍ – TP. HỒ CHÍ MINH
   Nguồn: api.globalsolaratlas.info (Solargis)
   PVOUT_csi: kWh/kWp/năm (cả năm)
   pvout_monthly: kWh/kWp mỗi tháng (1-12)
   solarPrice / batPrice: đ/kWh (giả định FiT + peak)
──────────────────────────────────────────────── */
const LOCATIONS = {
  /* ---- Nội thành lõi ---- */
  q1: { label: 'Quận 1 (Trung tâm)', lat: 10.7769, lon: 106.7009, batCycleEff: 0.90, pvout_annual: 1387, pvout_monthly: [122.3, 129.5, 143.3, 128.2, 113.3, 101.9, 102.8, 109.4, 101.1, 109.9, 112.4, 113.6] },
  q3: { label: 'Quận 3 (Trung tâm)', lat: 10.7873, lon: 106.6886, batCycleEff: 0.90, pvout_annual: 1387, pvout_monthly: [122.3, 129.5, 143.3, 128.2, 113.3, 101.9, 102.8, 109.4, 101.1, 109.9, 112.4, 113.6] },
  q4: { label: 'Quận 4', lat: 10.7598, lon: 106.7038, batCycleEff: 0.90, pvout_annual: 1390, pvout_monthly: [122.6, 129.8, 143.6, 128.5, 113.6, 102.1, 103.0, 109.6, 101.3, 110.1, 112.6, 113.8] },
  q5: { label: 'Quận 5', lat: 10.7553, lon: 106.6638, batCycleEff: 0.90, pvout_annual: 1387, pvout_monthly: [122.3, 129.5, 143.3, 128.2, 113.3, 101.9, 102.8, 109.4, 101.1, 109.9, 112.4, 113.6] },
  q6: { label: 'Quận 6', lat: 10.7476, lon: 106.6344, batCycleEff: 0.90, pvout_annual: 1387, pvout_monthly: [122.3, 129.5, 143.3, 128.2, 113.3, 101.9, 102.8, 109.4, 101.1, 109.9, 112.4, 113.6] },
  q8: { label: 'Quận 8', lat: 10.7218, lon: 106.6808, batCycleEff: 0.90, pvout_annual: 1387, pvout_monthly: [122.3, 129.5, 143.3, 128.2, 113.3, 101.9, 102.8, 109.4, 101.1, 109.9, 112.4, 113.6] },
  q10: { label: 'Quận 10', lat: 10.7773, lon: 106.6686, batCycleEff: 0.90, pvout_annual: 1387, pvout_monthly: [122.3, 129.5, 143.3, 128.2, 113.3, 101.9, 102.8, 109.4, 101.1, 109.9, 112.4, 113.6] },
  q11: { label: 'Quận 11', lat: 10.7636, lon: 106.6539, batCycleEff: 0.90, pvout_annual: 1387, pvout_monthly: [122.3, 129.5, 143.3, 128.2, 113.3, 101.9, 102.8, 109.4, 101.1, 109.9, 112.4, 113.6] },
  pn: { label: 'Quận Phú Nhuận', lat: 10.7996, lon: 106.6801, batCycleEff: 0.90, pvout_annual: 1387, pvout_monthly: [122.3, 129.5, 143.3, 128.2, 113.3, 101.9, 102.8, 109.4, 101.1, 109.9, 112.4, 113.6] },
  /* ---- Nội thành mở rộng ---- */
  q7: { label: 'Quận 7', lat: 10.7365, lon: 106.7208, batCycleEff: 0.91, pvout_annual: 1416, pvout_monthly: [124.9, 132.2, 146.3, 130.8, 115.7, 104.0, 104.9, 111.6, 103.2, 112.1, 114.7, 115.9] },
  q12: { label: 'Quận 12', lat: 10.8623, lon: 106.6637, batCycleEff: 0.91, pvout_annual: 1405, pvout_monthly: [123.9, 131.1, 145.2, 129.8, 114.8, 103.2, 104.1, 110.8, 102.4, 111.2, 113.8, 115.0] },
  bt: { label: 'Quận Bình Thạnh', lat: 10.8124, lon: 106.7097, batCycleEff: 0.90, pvout_annual: 1405, pvout_monthly: [123.9, 131.1, 145.2, 129.8, 114.8, 103.2, 104.1, 110.8, 102.4, 111.2, 113.8, 115.0] },
  gv: { label: 'Quận Gò Vấp', lat: 10.8382, lon: 106.6681, batCycleEff: 0.91, pvout_annual: 1405, pvout_monthly: [123.9, 131.1, 145.2, 129.8, 114.8, 103.2, 104.1, 110.8, 102.4, 111.2, 113.8, 115.0] },
  tb: { label: 'Quận Tân Bình', lat: 10.8018, lon: 106.6531, batCycleEff: 0.91, pvout_annual: 1405, pvout_monthly: [123.9, 131.1, 145.2, 129.8, 114.8, 103.2, 104.1, 110.8, 102.4, 111.2, 113.8, 115.0] },
  tp: { label: 'Quận Tân Phú', lat: 10.7879, lon: 106.6343, batCycleEff: 0.91, pvout_annual: 1405, pvout_monthly: [123.9, 131.1, 145.2, 129.8, 114.8, 103.2, 104.1, 110.8, 102.4, 111.2, 113.8, 115.0] },
  btn: { label: 'Quận Bình Tân', lat: 10.7642, lon: 106.6025, batCycleEff: 0.91, pvout_annual: 1405, pvout_monthly: [123.9, 131.1, 145.2, 129.8, 114.8, 103.2, 104.1, 110.8, 102.4, 111.2, 113.8, 115.0] },
  /* ---- TP. Thủ Đức ---- */
  q2: { label: 'Khu vực Q.2 cũ (TP. Thủ Đức)', lat: 10.7964, lon: 106.7519, batCycleEff: 0.92, pvout_annual: 1424, pvout_monthly: [125.6, 133.0, 147.1, 131.6, 116.3, 104.6, 105.5, 112.3, 103.8, 112.8, 115.3, 116.6] },
  q9: { label: 'Khu vực Q.9 cũ (TP. Thủ Đức)', lat: 10.8417, lon: 106.7812, batCycleEff: 0.92, pvout_annual: 1435, pvout_monthly: [126.6, 134.0, 148.3, 132.5, 117.2, 105.3, 106.3, 113.2, 104.6, 113.7, 116.3, 117.4] },
  qtd: { label: 'Khu vực Q. Thủ Đức cũ (TP. Thủ Đức)', lat: 10.8556, lon: 106.7525, batCycleEff: 0.91, pvout_annual: 1424, pvout_monthly: [125.6, 133.0, 147.1, 131.6, 116.3, 104.6, 105.5, 112.3, 103.8, 112.8, 115.3, 116.6] },
  /* ---- Ngoại thành ---- */
  bc: { label: 'Huyện Bình Chánh', lat: 10.6888, lon: 106.6117, batCycleEff: 0.92, pvout_annual: 1449, pvout_monthly: [127.8, 135.3, 149.8, 133.9, 118.3, 106.4, 107.3, 114.2, 105.6, 114.7, 117.4, 118.6] },
  cc: { label: 'Huyện Củ Chi', lat: 11.0060, lon: 106.4977, batCycleEff: 0.93, pvout_annual: 1460, pvout_monthly: [128.8, 136.3, 150.8, 134.9, 119.3, 107.3, 108.2, 115.1, 106.4, 115.7, 118.3, 119.6] },
  hm: { label: 'Huyện Hóc Môn', lat: 10.8990, lon: 106.5947, batCycleEff: 0.92, pvout_annual: 1449, pvout_monthly: [127.8, 135.3, 149.8, 133.9, 118.3, 106.4, 107.3, 114.2, 105.6, 114.7, 117.4, 118.6] },
  nb: { label: 'Huyện Nhà Bè', lat: 10.6993, lon: 106.7267, batCycleEff: 0.91, pvout_annual: 1442, pvout_monthly: [127.2, 134.7, 149.0, 133.2, 117.8, 105.9, 106.8, 113.7, 105.1, 114.1, 116.8, 118.0] },
  cg: { label: 'Huyện Cần Giờ', lat: 10.5111, lon: 106.9520, batCycleEff: 0.92, pvout_annual: 1460, pvout_monthly: [128.8, 136.3, 150.8, 134.9, 119.3, 107.3, 108.2, 115.1, 106.4, 115.7, 118.3, 119.6] },
};

/* ────────────────────────────────────────────────
   GIÁ ĐIỆN EVN KINH DOANH (theo QĐ 1062/QĐ-BCT 2023)
   • solarPrice: giá điện kinh doanh TB (~tiết kiệm khi không mua EVN)
     Hạ áp: bình thường 2.612 đ | cao điểm 3.654 đ | thấp điểm 1.387 đ
     TB gia quyền ~2.850 đ/kWh
   • batPrice: BESS xấu trong giờ cao điểm → tiết kiệm giá cao điểm
     Hạ áp cao điểm: 3.654 đ/kWh → dùng 3.500 đ (trung bình an toàn)
──────────────────────────────────────────────── */
const EVN_SOLAR_PRICE = 3638;  // đ/kWh – giá điện kinh doanh (solar)
const EVN_BAT_PRICE = 5422;  // đ/kWh – giá điện kinh doanh cao điểm (BESS)

// Hệ số giảm sản lượng (Losses/Performance Ratio):
// Sản lượng PV: 80% (0.80)
const PV_PR = 0.80;
// Sản lượng BESS: 90% (0.90)
const BESS_PR = 0.90;

// Gán lại giá cho tất cả vị trí
Object.values(LOCATIONS).forEach(d => {
  d.solarPrice = EVN_SOLAR_PRICE;
  d.batPrice = EVN_BAT_PRICE;
});


/* ────────────────────────────────────────────────
   LOAN DEFAULTS (hardcoded, per user request)
──────────────────────────────────────────────── */
const LOAN_RATE_PA = 0.095;  // 9.5%/năm (cố định)
// Chi phí lưu trữ (BESS thêm vào CAPEX): triệu/kWh
const BESS_COST_PER_KWH = 8; // 8 triệu/kWh (giả định thị trường)

function getLoanTermMo() {
  const years = parseInt(document.getElementById('loan-years').value) || 4;
  return Math.min(Math.max(years, 1), 20) * 12; // giới hạn 1-20 năm
}

/* ────────────────────────────────────────────────
   STATE
──────────────────────────────────────────────── */
let storageMode = { total: 'no', capex: 'no' };
let page2Unlocked = false;
let calcData = null;

/* ────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────── */
function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return '–';
  return Math.round(n).toLocaleString('vi-VN');
}
function fmtK(n) {
  if (n === null || n === undefined || isNaN(n)) return '–';
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2).replace('.', ',') + ' tỷ';
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1).replace('.', ',') + ' tr';
  return fmt(n) + ' đ';
}
function parseRaw(val) {
  return parseInt(String(val).replace(/[^0-9]/g, ''), 10) || 0;
}
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ────────────────────────────────────────────────
   FORMAT CAPEX NUMBER INPUT
──────────────────────────────────────────────── */
function formatNumber(el) {
  const raw = parseRaw(el.value);
  if (raw > 0) el.value = raw.toLocaleString('vi-VN');
  updateDepositPreview();
}

/* ────────────────────────────────────────────────
   SWITCH INVESTMENT MODE
──────────────────────────────────────────────── */
function switchMode(mode) {
  document.getElementById('block-total').classList.toggle('hidden', mode !== 'total');
  document.getElementById('block-capex').classList.toggle('hidden', mode !== 'capex');
  updateDepositPreview();
}

/* ────────────────────────────────────────────────
   STORAGE YES/NO
──────────────────────────────────────────────── */
function setStorage(block, val) {
  storageMode[block] = val;
  document.getElementById(`${block}-stor-no`).classList.toggle('active', val === 'no');
  document.getElementById(`${block}-stor-yes`).classList.toggle('active', val === 'yes');
  const wrap = document.getElementById(`storage-kwh-wrap-${block}`);
  if (val === 'yes') {
    wrap.classList.remove('hidden');
    setTimeout(() => wrap.classList.add('visible'), 10);
  } else {
    wrap.classList.remove('visible');
    setTimeout(() => wrap.classList.add('hidden'), 310);
  }
  if (block === 'capex') calcCapexTotal();
}

/* ────────────────────────────────────────────────
   CAPEX MODE: calculate total investment
──────────────────────────────────────────────── */
function calcCapexTotal() {
  const perKwp = parseFloat(document.getElementById('capex-per-kwp').value) || 0;
  const kwp = parseFloat(document.getElementById('solar-kwp-capex').value) || 0;
  const hasBess = storageMode.capex === 'yes';
  const bessKwh = hasBess ? (parseFloat(document.getElementById('bat-kwh-capex').value) || 0) : 0;
  const total = perKwp * kwp * 1e6 + bessKwh * BESS_COST_PER_KWH * 1e6;
  const el = document.getElementById('capex-total-preview');
  el.textContent = total > 0 ? fmt(total) + ' VNĐ' : '–';
  updateDepositPreview();
}

/* ────────────────────────────────────────────────
   GET TOTAL INVESTMENT
──────────────────────────────────────────────── */
function getTotalInvest() {
  const perKwp = parseFloat(document.getElementById('capex-per-kwp').value) || 0;
  const kwp = parseFloat(document.getElementById('solar-kwp-capex').value) || 0;
  const bessKwh = storageMode.capex === 'yes'
    ? (parseFloat(document.getElementById('bat-kwh-capex').value) || 0) : 0;
  return perKwp * kwp * 1e6 + bessKwh * BESS_COST_PER_KWH * 1e6;
}

function getSystemInfo() {
  return {
    kwp: parseFloat(document.getElementById('solar-kwp-capex').value) || 0,
    hasBest: storageMode.capex === 'yes',
    bessKwh: storageMode.capex === 'yes'
      ? (parseFloat(document.getElementById('bat-kwh-capex').value) || 0) : 0,
  };
}

/* ────────────────────────────────────────────────
   DEPOSIT PREVIEW
──────────────────────────────────────────────── */
function updateDepositPreview() {
  const total = getTotalInvest();
  const pct = parseFloat(document.getElementById('deposit-pct').value) || 0;
  const own = total * pct / 100;
  const loan = total - own;
  const termMo = getLoanTermMo();
  const termYr = termMo / 12;
  document.getElementById('di-loan').textContent = total ? fmtK(loan) : '–';
  document.getElementById('di-own').textContent = total ? fmtK(own) : '–';
  // Update CTA note
  const ctaNote = document.getElementById('cta-note');
  if (ctaNote) ctaNote.textContent = `Bảng sẽ trình bày dòng tiền theo từng tháng trong ${termYr} năm (${termMo} tháng)`;
}

/* ────────────────────────────────────────────────
   GLOBAL SOLAR ATLAS API – FETCH PVOUT THỰC
   Endpoint: api.globalsolaratlas.info/data/lta?loc=LAT,LON
   Trả về monthly.data.PVOUT_csi (kWh/kWp, 12 tháng)
──────────────────────────────────────────────── */
const _pvoutCache = {}; // cache kết quả đã fetch

async function fetchSolarData(key) {
  if (_pvoutCache[key]) return _pvoutCache[key]; // dùng cache
  const d = LOCATIONS[key];
  if (!d.lat) return null;
  try {
    const res = await fetch(`https://api.globalsolaratlas.info/data/lta?loc=${d.lat},${d.lon}`);
    const json = await res.json();

    const monthly = json.monthly.data.PVOUT_csi.map(v => parseFloat(v.toFixed(1)));
    const annual = Math.round(monthly.reduce((a, b) => a + b, 0));

    const result = { monthly, annual };
    _pvoutCache[key] = result;
    // Cập nhật vào LOCATIONS để buildTable dùng
    d.pvout_monthly = monthly;
    d.pvout_annual = annual;
    return result;
  } catch (e) {
    console.warn('GSA API lỗi, dùng dữ liệu mặc định:', e.message);
    return null;
  }
}

/* ────────────────────────────────────────────────
   LOCATION INFO (async – fetch API thực)
──────────────────────────────────────────────── */
async function updateLocationInfo() {
  const key = document.getElementById('location').value;
  const box = document.getElementById('location-info-box');
  if (!key) { box.classList.add('hidden'); return; }

  const d = LOCATIONS[key];
  // Thông báo đang tải
  document.getElementById('lib-grid').innerHTML =
    `<div class="lib-loading flex-icon justify-center"><svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Đang lấy dữ liệu từ Global Solar Atlas…</div>`;
  box.classList.remove('hidden');

  const live = await fetchSolarData(key);
  const monthly = d.pvout_monthly; // đã được cập nhật nếu fetch thành công
  const annual = d.pvout_annual;
  const avgPsh = (annual / 365).toFixed(2);
  const maxPv = Math.max(...monthly).toFixed(0);
  const minPv = Math.min(...monthly).toFixed(0);
  const src = live ? '✅ Solargis API – dữ liệu thực' : '⚠️ Dữ liệu mặc định (API không khả dụng)';

  document.getElementById('lib-grid').innerHTML = `
    <div class="lib-item"><span class="lib-item-label flex-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> PVOUT/năm</span>
      <span class="lib-item-value">${annual.toLocaleString('vi-VN')} kWh/kWp</span></div>
    <div class="lib-item"><span class="lib-item-label flex-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Giờ nắng TB</span>
      <span class="lib-item-value">${avgPsh} h/ngày</span></div>
    <div class="lib-item"><span class="lib-item-label flex-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> Tháng cao nhất</span>
      <span class="lib-item-value">${maxPv} kWh/kWp</span></div>
    <div class="lib-item"><span class="lib-item-label flex-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg> Tháng thấp nhất</span>
      <span class="lib-item-value">${minPv} kWh/kWp</span></div>
  `;
  updateDepositPreview();
}

/* ────────────────────────────────────────────────
   VALIDATE & NAVIGATE TO PAGE 2
──────────────────────────────────────────────── */
function tryGotoPage2() {
  if (page2Unlocked) { goToPage(2); return; }
  showToast('⚠️ Vui lòng điền đủ thông tin và nhấn "Xem Bảng Phân Tích"');
}

function validateAndNext() {
  const total = getTotalInvest();
  const { kwp, hasBest, bessKwh } = getSystemInfo();
  const deposit = parseFloat(document.getElementById('deposit-pct').value);
  const locKey = document.getElementById('location').value;
  const loanYears = parseInt(document.getElementById('loan-years').value) || 0;

  if (!total || total < 1000000) return showToast('⚠️ Vui lòng nhập tổng chi phí hợp lệ');
  const perKwp = parseFloat(document.getElementById('capex-per-kwp').value) || 0;
  if (!perKwp) return showToast('⚠️ Vui lòng nhập tổng chi phí (triệu/kWp)');
  if (!kwp || kwp <= 0) return showToast('⚠️ Vui lòng nhập công suất hệ thống (kWp)');
  if (hasBest && (!bessKwh || bessKwh <= 0)) return showToast('⚠️ Vui lòng nhập dung lượng lưu trữ (kWh)');
  if (isNaN(deposit) || deposit < 0 || deposit > 100) return showToast('⚠️ Tỷ lệ cọc phải từ 0 – 100 %');
  if (!loanYears || loanYears < 1 || loanYears > 20) return showToast('⚠️ Số năm trả góp phải từ 1 – 20 năm');
  if (!locKey) return showToast('⚠️ Vui lòng chọn vị trí lắp đặt');

  buildTable({ total, kwp, hasBess: hasBest, bessKwh, deposit, locKey });
  page2Unlocked = true;
  document.getElementById('nav-step2').classList.remove('locked');
  document.getElementById('lock-icon').innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  goToPage(2);
}

/* ────────────────────────────────────────────────
   BUILD & RENDER TABLE
──────────────────────────────────────────────── */
function buildTable({ total, kwp, hasBess, bessKwh, deposit, locKey }) {
  const loc = LOCATIONS[locKey];
  const ownCap = total * deposit / 100;
  const loanAmt = total - ownCap;
  const monthlyR = LOAN_RATE_PA / 12;
  const term = getLoanTermMo();

  // Monthly payment (annuity / trả đều)
  // Trả đều (Annuity) – làm tròn lên đến triệu đồng
  const MP_raw = monthlyR === 0
    ? loanAmt / term
    : loanAmt * (monthlyR * Math.pow(1 + monthlyR, term)) / (Math.pow(1 + monthlyR, term) - 1);
  const MP = Math.ceil(MP_raw / 1e6) * 1e6; // làm tròn lên đến triệu

  const rows = [];
  let balance = loanAmt;

  const prevSolar = new Array(12).fill(0);
  const prevBess = new Array(12).fill(0);

  for (let m = 1; m <= term; m++) {
    const year = Math.ceil(m / 12);
    const monthIdx = (m - 1) % 12;

    let solarKwh = 0;
    let bessKwhOut = 0;

    if (year === 1) {
      // Năm 1: Áp dụng hệ số PV 80%, BESS tháng cố định theo 90% lợi suất
      solarKwh = loc.pvout_monthly[monthIdx] * kwp * PV_PR;
      // Pin chạy trung bình 30 ngày/tháng, nhân dung lượng và hiệu suất 90%
      bessKwhOut = hasBess
        ? bessKwh * 30 * BESS_PR
        : 0;
      prevSolar[monthIdx] = solarKwh;
      prevBess[monthIdx] = bessKwhOut;
    } else {
      // Từ năm 2: tháng m năm N = tháng m năm (N-1) * hệ số suy giảm
      solarKwh = prevSolar[monthIdx] * 0.97;
      bessKwhOut = prevBess[monthIdx] * 0.90;
      prevSolar[monthIdx] = solarKwh;
      prevBess[monthIdx] = bessKwhOut;
    }

    // Prices: tăng 5%/năm
    const priceUp = Math.pow(1.05, year - 1);
    const solarPx = Math.round(loc.solarPrice * priceUp);
    const batPx = hasBess ? Math.round(loc.batPrice * priceUp) : 0;

    // Revenue
    const revSolar = solarKwh * solarPx;
    const revBat = bessKwhOut * batPx;
    const revTotal = revSolar + revBat;

    // Loan
    const interestPart = balance * monthlyR;
    const principalPart = MP - interestPart;
    balance = Math.max(0, balance - principalPart);
    const loanTotal = MP;

    // Net
    const netProfit = revTotal - loanTotal;

    rows.push({ m, year, monthIdx, solarKwh, bessKwhOut, solarPx, batPx, revSolar, revBat, revTotal, loanTotal, interestPart, principalPart, netProfit });
  }

  calcData = { rows, total, ownCap, loanAmt, deposit, locKey, loc, kwp, hasBess, bessKwh, term };

  // Summary
  const avgRev = rows.reduce((s, r) => s + r.revTotal, 0) / rows.length;
  const avgProfit = rows.reduce((s, r) => s + r.netProfit, 0) / rows.length;
  document.getElementById('s-capex').textContent = fmtK(total);
  document.getElementById('s-loan').textContent = fmtK(loanAmt);
  document.getElementById('s-loc').textContent = loc.label;
  document.getElementById('s-profit').textContent = fmtK(avgProfit);
  document.getElementById('s-profit').className = 'sum-val ' + (avgProfit >= 0 ? 'green' : 'red');

  // ── Tính toán 2 chỉ số mới ──────────────────────────────────────────────
  // 1) Sau khi hết trả góp: tích lũy "lợi nhuận sau vay" từ tháng term+1 trở đi
  //    cho đến khi bù đắp được khoản cọc ban đầu (ownCap)
  //    Doanh thu sau khi hết vay = revTotal (không còn trả gốc+lãi)
  //    Dùng sản lượng năm cuối * giá năm tiếp theo (tăng 5%/năm)
  const lastYearRows = rows.filter(r => r.year === Math.ceil(term / 12));
  const avgRevLastYear = lastYearRows.reduce((s, r) => s + r.revTotal, 0) / lastYearRows.length;
  // Năm sau khi hết vay: năm term/12 + 1
  const nextYearMult = Math.pow(1.05, Math.ceil(term / 12)); // giá điện tiếp tục tăng
  const annualRevAfterLoan = avgRevLastYear * 12 * nextYearMult;

  let recoupLabel = '–';
  if (ownCap > 0 && annualRevAfterLoan > 0) {
    const yearsToRecoup = ownCap / annualRevAfterLoan;
    if (yearsToRecoup < 1) {
      recoupLabel = `< 1 năm`;
    } else {
      recoupLabel = `~${yearsToRecoup.toFixed(1)} năm`;
    }
  }

  // 2) Tiết kiệm sau khi đã hoàn cọc: hiển thị /tháng và /năm
  document.getElementById('s-recoup').textContent = recoupLabel;
  const monthlyAfterLoan = annualRevAfterLoan / 12;
  document.getElementById('s-annual-save').innerHTML =
    `${fmtK(monthlyAfterLoan)}/tháng<br><span style="font-size:.8em;opacity:.8">${fmtK(annualRevAfterLoan)}/năm</span>`;
  document.getElementById('s-annual-save').className = 'sum-val green';

  // Info banner
  document.getElementById('info-banner').innerHTML = `
    <span class="flex-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Thời hạn vay: <b>${term} tháng (${term / 12} năm)</b></span>
    <span class="flex-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg> Công suất: <b>${kwp} kWp</b>${hasBess ? ` + BESS <b>${bessKwh} kWh</b>` : ''}</span>
    <span class="flex-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4" y1="12" x2="2" y2="12"/><line x1="22" y1="12" x2="20" y2="12"/></svg> Vốn tự có: <b>${deposit}%</b> (${fmtK(calcData.ownCap)})</span>
    <span class="flex-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> Vị trí: <b>${loc.label}</b></span>
  `;


  // Monthly pill bar
  const bar = document.getElementById('monthly-bar');
  const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  bar.innerHTML = loc.pvout_monthly.map((v, i) =>
    `<div class="mb-pill">${monthNames[i]}: <span class="mb-val">${v.toFixed(0)}</span> kWh/kWp</div>`
  ).join('');

  renderTable(rows, hasBess);
}

function renderTable(rows, hasBess) {
  const thead = document.getElementById('table-head');
  const tbody = document.getElementById('table-body');
  const tfoot = document.getElementById('table-foot');

  /* ── HEADER ĐỘNG ── */
  const slCols = hasBess ? 2 : 1;
  const pxCols = hasBess ? 2 : 1;
  const revCols = hasBess ? 2 : 1;

  thead.innerHTML = `
    <tr>
      <th rowspan="2" class="th-month">Tháng</th>
      <th colspan="${slCols}"  class="th-group solar-group">Sản lượng (kWh/tháng)</th>
      <th colspan="${pxCols}"  class="th-group price-group">Giá điện EVN kinh doanh (đ/kWh)</th>
      <th colspan="${revCols}" class="th-group rev-group">Doanh thu (VNĐ)</th>
      ${hasBess ? '<th rowspan="2" class="th-total-rev">Tổng<br>Doanh thu</th>' : ''}
      <th rowspan="2" class="th-loan">Gốc + Lãi<br>(VNĐ)</th>
      <th rowspan="2" class="th-profit">Lợi nhuận<br>Ròng (VNĐ)</th>
    </tr>
    <tr>
      <th class="solar-group">Solar</th>
      ${hasBess ? '<th class="solar-group">BESS</th>' : ''}
      <th class="price-group">Solar</th>
      ${hasBess ? '<th class="price-group">BESS</th>' : ''}
      <th class="rev-group">Doanh thu Solar</th>
      ${hasBess ? '<th class="rev-group">Doanh thu BESS</th>' : ''}
    </tr>`;

  /* ── BODY ── */
  tbody.innerHTML = '';
  const MONTH_NAMES = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

  let totSolar = 0, totBess = 0, totRevSolar = 0, totRevBat = 0, totRevAll = 0, totLoan = 0, totProfit = 0;

  rows.forEach(r => {
    totSolar += r.solarKwh;
    totBess += r.bessKwhOut;
    totRevSolar += r.revSolar;
    totRevBat += r.revBat;
    totRevAll += r.revTotal;
    totLoan += r.loanTotal;
    totProfit += r.netProfit;

    const isNewYear = r.monthIdx === 0 && r.m > 1;
    const pcls = r.netProfit >= 0 ? 'c-pos' : 'c-neg';

    const tr = document.createElement('tr');
    if (isNewYear) tr.classList.add('yr-start');
    tr.innerHTML = `
      <td>${MONTH_NAMES[r.monthIdx]}<br><small style="color:#94a3b8;font-weight:400">Năm ${r.year}</small></td>
      <td class="c-solar">${fmt(r.solarKwh)}</td>
      ${hasBess ? `<td>${fmt(r.bessKwhOut)}</td>` : ''}
      <td>${fmt(r.solarPx)}</td>
      ${hasBess ? `<td>${fmt(r.batPx)}</td>` : ''}
      <td class="c-rev">${fmt(r.revSolar)}</td>
      ${hasBess ? `<td class="c-rev">${fmt(r.revBat)}</td>` : ''}
      ${hasBess ? `<td class="c-tot-rev">${fmt(r.revTotal)}</td>` : ''}
      <td class="c-loan">${fmt(r.loanTotal)}</td>
      <td class="${pcls}">${fmt(r.netProfit)}</td>
    `;
    tbody.appendChild(tr);
  });

  const pcls = totProfit >= 0 ? 'c-pos' : 'c-neg';
  tfoot.innerHTML = `
    <tr>
      <td>TỔNG CỘNG</td>
      <td>${fmt(totSolar)}</td>
      ${hasBess ? `<td>${fmt(totBess)}</td>` : ''}
      <td>–</td>
      ${hasBess ? `<td>–</td>` : ''}
      <td>${fmt(totRevSolar)}</td>
      ${hasBess ? `<td>${fmt(totRevBat)}</td>` : ''}
      ${hasBess ? `<td>${fmt(totRevAll)}</td>` : ''}
      <td>${fmt(totLoan)}</td>
      <td class="${pcls}">${fmt(totProfit)}</td>
    </tr>
  `;
}

/* ────────────────────────────────────────────────
   PAGE NAVIGATION
──────────────────────────────────────────────── */
function goToPage(n) {
  document.getElementById('page1').classList.toggle('hidden', n !== 1);
  document.getElementById('page2').classList.toggle('hidden', n !== 2);
  document.getElementById('nav-step1').classList.toggle('active', n === 1);
  document.getElementById('nav-step2').classList.toggle('active', n === 2);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ────────────────────────────────────────────────
   EXCEL EXPORT (HTML Table format)
──────────────────────────────────────────────── */
function exportExcel() {
  if (!calcData) return;
  const { rows, total, ownCap, loanAmt, deposit, locKey, loc, kwp, hasBess, bessKwh, term } = calcData;

  const avgRev = rows.reduce((s, r) => s + r.revTotal, 0) / rows.length;
  const avgProfit = rows.reduce((s, r) => s + r.netProfit, 0) / rows.length;
  
  const lastYearRows = rows.filter(r => r.year === Math.ceil(term / 12));
  const avgRevLastYear = lastYearRows.reduce((s, r) => s + r.revTotal, 0) / lastYearRows.length;
  const nextYearMult = Math.pow(1.05, Math.ceil(term / 12));
  const annualRevAfterLoan = avgRevLastYear * 12 * nextYearMult;
  
  let recoupLabel = '–';
  if (ownCap > 0 && annualRevAfterLoan > 0) {
    const yearsToRecoup = ownCap / annualRevAfterLoan;
    if (yearsToRecoup < 1) {
      recoupLabel = '< 1 năm';
    } else {
      recoupLabel = '~' + yearsToRecoup.toFixed(1) + ' năm';
    }
  }
  const monthlyAfterLoan = annualRevAfterLoan / 12;

  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <style>
        table { border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 11pt; }
        .head { font-weight: bold; text-align: center; vertical-align: middle; padding: 5px; border: 1px solid #000000; }
        .num { mso-number-format:"\\#\\,\\#\\#0"; text-align:right; border: 1px solid #000000; }
        .num-center { mso-number-format:"\\#\\,\\#\\#0"; text-align:center; border: 1px solid #000000; }
        .bold { font-weight: bold; }
        .border { border: 1px solid #000000; padding: 3px; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="13" style="text-align:center; font-size:16pt; font-weight:bold; height: 40px; vertical-align: middle;">BÁO CÁO HIỆU QUẢ KINH TẾ (TRẢ CHẬM ${term / 12} NĂM)</td>
        </tr>
        <tr><td colspan="13"></td></tr>
        
        <tr><td colspan="13" class="bold">1. THÔNG TIN DỰ ÁN & HỆ THỐNG</td></tr>
        <tr>
          <td class="bold">Vị trí lắp đặt:</td><td></td><td></td>
          <td>${loc.label}</td><td></td><td></td><td></td>
          <td class="bold">Công suất Solar:</td><td></td><td></td>
          <td>${kwp.toLocaleString('vi-VN')} kWp</td><td></td><td></td>
        </tr>
        <tr>
          <td class="bold">PVOUT hàng năm:</td><td></td><td></td>
          <td>${loc.pvout_annual.toLocaleString('vi-VN')} kWh/kWp</td><td></td><td></td><td></td>
          <td class="bold">Lưu trữ BESS:</td><td></td><td></td>
          <td>${hasBess ? bessKwh + ' kWh' : 'Không có'}</td><td></td><td></td>
        </tr>
        <tr><td colspan="13"></td></tr>

        <tr><td colspan="13" class="bold">2. THÔNG TIN TÀI CHÍNH & GIẢ ĐỊNH</td></tr>
        <tr>
          <td class="bold">Tổng mức đầu tư:</td><td></td><td></td>
          <td class="num bold" style="text-align:left; border:none;">${Math.round(total)} VNĐ</td><td></td><td></td><td></td>
          <td class="bold">Thời hạn vay:</td><td></td><td></td>
          <td>${term} tháng (${term / 12} năm)</td><td></td><td></td>
        </tr>
        <tr>
          <td class="bold">Tỷ lệ Vốn tự có:</td><td></td><td></td>
          <td style="text-align:left;">${deposit}%</td><td></td><td></td><td></td>
          <td class="bold">Lãi suất vay (cố định):</td><td></td><td></td>
          <td>${(LOAN_RATE_PA * 100).toFixed(1)}%/năm</td><td></td><td></td>
        </tr>
        <tr>
          <td class="bold">Số tiền Vốn tự có:</td><td></td><td></td>
          <td class="num bold" style="text-align:left; border:none;">${Math.round(ownCap)} VNĐ</td><td></td><td></td><td></td>
          <td class="bold">Giá điện mua bình quân:</td><td></td><td></td>
          <td class="num" style="text-align:left; border:none;">${loc.solarPrice} VNĐ/kWh</td><td></td><td></td>
        </tr>
        <tr>
          <td class="bold">Số tiền Vay:</td><td></td><td></td>
          <td class="num bold" style="text-align:left; border:none;">${Math.round(loanAmt)} VNĐ</td><td></td><td></td><td></td>
          <td class="bold">Mức tăng giá điện:</td><td></td><td></td>
          <td>5%/năm</td><td></td><td></td>
        </tr>
        <tr>
          <td class="bold">Hệ số suy giảm:</td><td></td><td></td>
          <td>Solar: 3%/năm</td><td>BESS: 10%/năm</td><td></td><td></td>
          <td class="bold">Thời gian bảo trì miễn phí:</td><td></td><td></td>
          <td>36 tháng</td><td></td><td></td>
        </tr>
        <tr><td colspan="13"></td></tr>

        <tr><td colspan="13" class="bold">3. TỔNG HỢP HIỆU QUẢ ĐẦU TƯ</td></tr>
        <tr>
          <td class="bold">Lợi nhuận trung bình:</td><td></td><td></td>
          <td class="num bold" style="text-align:left; border:none;">${Math.round(avgProfit)} VNĐ/tháng</td><td></td><td></td><td></td>
          <td class="bold">Thời gian hoàn cọc:</td><td></td><td></td>
          <td class="bold">${recoupLabel}</td><td></td><td></td>
        </tr>
        <tr>
          <td class="bold">Tiết kiệm (Sau hoàn cọc):</td><td></td><td></td>
          <td class="num bold" style="text-align:left; border:none;">${Math.round(monthlyAfterLoan)} VNĐ/tháng</td><td></td><td></td><td></td><td></td><td></td><td></td>
          <td class="num bold" style="text-align:left; border:none;">${Math.round(annualRevAfterLoan)} VNĐ/năm</td><td></td><td></td>
        </tr>
        <tr><td colspan="13"></td></tr>
        <tr><td colspan="13" class="bold"> 4. BẢNG DÒNG TIỀN CHI TIẾT HÀNG THÁNG </td></tr>
        <tr>
          <td class="head"> Tháng </td>
          <td class="head"> Sản lượng nắng </td>
          <td class="head"> Sản lượng điện </td>
          <td class="head"> Sản lượng điện </td>
          <td class="head"> Giá điện TB </td>
          <td class="head"> Giá điện TB </td>
          <td class="head"> Doanh thu Solar </td>
          <td class="head"> Doanh thu BESS </td>
          <td class="head"> Tổng Doanh thu </td>
          <td class="head"> Gốc + Lãi Vay </td>
          <td class="head"> Chi phí Bảo Trì </td>
          <td class="head"> Lợi nhuận Ròng </td>
          <td class="head"> Lũy kế Hoàn vốn </td>
        </tr>
        <tr>
          <td class="head"></td>
          <td class="head"></td>
          <td class="head"> Solar (kWh) </td>
          <td class="head"> BESS (kWh) </td>
          <td class="head"> Solar (VNĐ) </td>
          <td class="head"> BESS (VNĐ) </td>
          <td class="head"> (VNĐ) </td>
          <td class="head"> (VNĐ) </td>
          <td class="head"> Tiết kiệm (VNĐ) </td>
          <td class="head"> (VNĐ) </td>
          <td class="head"> (36 tháng miễn phí) </td>
          <td class="head"> (VNĐ) </td>
          <td class="head"> Vốn tự có (VNĐ) </td>
        </tr>
  `;

  let rowIndex = 21; // Data starts at row 21 (after headers)

  rows.forEach((r, idx) => {
    // bVal is pvout_monthly (fixed depending on month, 1-12 repeating)
    let bVal = loc.pvout_monthly[r.monthIdx]; 
    
    // Năm 1 dùng giá trị fix (như tính bằng formula: Solar = kwp * nắng * PV_PR), Năm 2+ dùng công thức suy giảm
    // Với Solar: formula `=(Công suất * Sản lượng nắng) * PV_PR` cho năm 1
    let cValExp = `=${kwp}*B${rowIndex}*${PV_PR}`;
    let cVal = r.year === 1 ? cValExp : `=ROUND(C${rowIndex - 12}*0.97,0)`;
    
    // BESS cố định năm 1: `bessKwh * 30 * BESS_PR`
    let dValExp = hasBess ? `=${bessKwh}*30*${BESS_PR}` : 0;
    let dVal = hasBess ? (r.year === 1 ? dValExp : `=ROUND(D${rowIndex - 12}*0.90,0)`) : 0;

    let eVal = r.year === 1 ? r.solarPx : `=ROUND(E${rowIndex - 12}*1.05,0)`;
    let fVal = hasBess ? (r.year === 1 ? r.batPx : `=ROUND(F${rowIndex - 12}*1.05,0)`) : 0;
    
    let gVal = `=ROUND(C${rowIndex}*E${rowIndex},0)`;
    let hVal = `=ROUND(D${rowIndex}*F${rowIndex},0)`;
    let iVal = `=G${rowIndex}+H${rowIndex}`;
    let jVal = Math.round(r.loanTotal);
    let kVal = 0; 
    let lVal = `=I${rowIndex}-J${rowIndex}-K${rowIndex}`;
    let mVal = rowIndex === 21 ? `=-ROUND(${ownCap},0)+L${rowIndex}` : `=M${rowIndex-1}+L${rowIndex}`;

    html += `
      <tr>
        <td class="num-center">${r.m}</td>
        <td class="num-center">${bVal}</td>
        <td class="num">${cVal}</td>
        <td class="num">${dVal}</td>
        <td class="num">${eVal}</td>
        <td class="num">${fVal}</td>
        <td class="num">${gVal}</td>
        <td class="num">${hVal}</td>
        <td class="num bold">${iVal}</td>
        <td class="num bold">${jVal}</td>
        <td class="num-center">${kVal}</td>
        <td class="num bold">${lVal}</td>
        <td class="num">${mVal}</td>
      </tr>
    `;
    rowIndex++;
  });

  html += `
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `HinhThuc_HieuQuaKinhTe_${new Date().toISOString().slice(0, 10)}.xls`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('✅ Xuất file Excel thành công!');
}
