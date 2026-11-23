/* ==========================================================
   assignments.js  -  shared by dashboard.html and guest_dashboard.html
   Assignment #1  Conversion (C<->F, m<->ft)
   Assignment #2  Income Tax Calculator
   Assignment #3  Factorial (while), Sum (do-while), Average (for)
   Assignment #4  Simple Payroll
   Colors follow the CSS variables --accent / --accent-rgb set by each page.
   ========================================================== */
(function () {
  const css = `
  .asg-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
  .asg-tab{padding:10px 14px;background:rgba(var(--accent-rgb),.05);border:1px solid rgba(var(--accent-rgb),.25);
    color:#ccc;cursor:pointer;border-radius:5px;font-family:'Courier New',monospace;font-size:.85rem;
    text-transform:uppercase;letter-spacing:1px;transition:.2s}
  .asg-tab:hover,.asg-tab.active{background:rgba(var(--accent-rgb),.2);border-color:var(--accent);color:#fff}
  .asg-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
  .asg-card{background:rgba(var(--accent-rgb),.06);border:1px solid rgba(var(--accent-rgb),.3);
    border-left:3px solid var(--accent);border-radius:6px;padding:18px}
  .asg-card h3{margin:0 0 4px 0;font-size:1rem;letter-spacing:1px;text-transform:uppercase}
  .asg-formula{font-size:.8rem;color:#888;margin-bottom:14px}
  .asg-card label,.asg-form label{display:block;font-size:.75rem;color:var(--accent);opacity:.8;
    text-transform:uppercase;margin:12px 0 5px}
  .asg-card input,.asg-card select,.asg-form input,.asg-form select{width:100%;box-sizing:border-box;padding:10px;
    background:rgba(0,0,0,.6);border:1px solid rgba(var(--accent-rgb),.4);border-radius:4px;color:#fff;
    font-family:'Courier New',monospace;font-size:1rem;outline:none}
  .asg-card input:focus,.asg-card select:focus{border-color:var(--accent);box-shadow:0 0 8px rgba(var(--accent-rgb),.4)}
  .asg-btn{margin-top:16px;padding:12px 20px;background:transparent;border:1px solid var(--accent);color:var(--accent);
    font-family:'Courier New',monospace;font-weight:bold;text-transform:uppercase;cursor:pointer;border-radius:4px;transition:.2s}
  .asg-btn:hover{background:var(--accent);color:#000}
  .asg-result{margin-top:14px;padding:12px;background:rgba(0,0,0,.55);border:1px dashed rgba(var(--accent-rgb),.5);
    border-radius:4px;font-size:1.1rem;font-weight:bold;min-height:1.4em;word-break:break-all}
  .asg-row{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid rgba(var(--accent-rgb),.15);font-size:.95rem}
  .asg-row span:last-child{text-align:right;font-weight:bold}
  .asg-row.total{border-top:2px solid var(--accent);border-bottom:none;font-size:1.1rem;color:var(--accent)}
  .asg-err{color:#ff5555;font-size:.9rem}
  .asg-note{font-size:.78rem;color:#888;margin-top:12px;line-height:1.5}
  .asg-table{width:100%;border-collapse:collapse;font-size:.8rem;margin-top:10px}
  .asg-table th,.asg-table td{padding:6px 8px;border-bottom:1px solid rgba(var(--accent-rgb),.15);text-align:left}
  .asg-table tr.hit td{background:rgba(var(--accent-rgb),.2);color:#fff;font-weight:bold}
  .asg-code{background:rgba(0,0,0,.6);border-left:3px solid var(--accent);padding:10px;font-size:.78rem;color:#aaa;
    white-space:pre;overflow-x:auto;margin-top:8px}
  .asg-big{max-height:160px;overflow-y:auto}
  `;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const num = (id) => { const v = $(id).value.trim(); return v === '' ? NaN : Number(v); };
  const peso = (n) => '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmt = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 4 });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const row = (a, b, cls = '') => `<div class="asg-row ${cls}"><span>${a}</span><span>${b}</span></div>`;

  const A = {};

  /* ---------- Assignment #1: Conversion ---------- */
  const CONV = [
    { id: 'c2f',  title: 'Celsius → Fahrenheit', from: '°C', to: '°F', formula: '°F = (°C × 9/5) + 32', fn: (v) => v * 9 / 5 + 32 },
    { id: 'f2c',  title: 'Fahrenheit → Celsius', from: '°F', to: '°C', formula: '°C = (°F − 32) × 5/9', fn: (v) => (v - 32) * 5 / 9 },
    { id: 'm2ft', title: 'Meters → Feet',        from: 'm',  to: 'ft', formula: 'ft = m × 3.28084',     fn: (v) => v * 3.28084 },
    { id: 'ft2m', title: 'Feet → Meters',        from: 'ft', to: 'm',  formula: 'm = ft × 0.3048',      fn: (v) => v * 0.3048 },
  ];

  A.convert = (id) => {
    const c = CONV.find((x) => x.id === id);
    const v = num(id + '-in');
    $(id + '-out').textContent = isNaN(v) ? '—' : fmt(c.fn(v)) + ' ' + c.to;
  };

  function panelConversion() {
    return `<div class="asg-grid">` + CONV.map((c) => `
      <div class="asg-card">
        <h3>${c.title}</h3>
        <div class="asg-formula">${c.formula}</div>
        <label for="${c.id}-in">Enter value (${c.from})</label>
        <input id="${c.id}-in" type="number" step="any" placeholder="0" oninput="Assignments.convert('${c.id}')">
        <div class="asg-result" id="${c.id}-out">—</div>
      </div>`).join('') + `</div>`;
  }

  /* ---------- Assignment #2: Income Tax (PH, TRAIN law, 2023 onwards) ---------- */
  const BRACKETS = [
    { lo: 0,       hi: 250000,   base: 0,       rate: 0,    label: '₱250,000 and below' },
    { lo: 250000,  hi: 400000,   base: 0,       rate: 0.15, label: '₱250,001 – ₱400,000' },
    { lo: 400000,  hi: 800000,   base: 22500,   rate: 0.20, label: '₱400,001 – ₱800,000' },
    { lo: 800000,  hi: 2000000,  base: 102500,  rate: 0.25, label: '₱800,001 – ₱2,000,000' },
    { lo: 2000000, hi: 8000000,  base: 402500,  rate: 0.30, label: '₱2,000,001 – ₱8,000,000' },
    { lo: 8000000, hi: Infinity, base: 2202500, rate: 0.35, label: 'Over ₱8,000,000' },
  ];

  A.tax = () => {
    const out = $('tax-out');
    const amount = num('tax-income');
    if (isNaN(amount) || amount < 0) {
      out.innerHTML = `<span class="asg-err">Please enter a valid income (0 or more).</span>`;
      return;
    }
    const annual = $('tax-period').value === 'monthly' ? amount * 12 : amount;
    const idx = BRACKETS.findIndex((b) => annual <= b.hi);
    const b = BRACKETS[idx];
    const tax = b.base + Math.max(0, annual - b.lo) * b.rate;
    const eff = annual > 0 ? (tax / annual) * 100 : 0;

    out.innerHTML =
      row('Annual taxable income', peso(annual)) +
      row('Tax bracket', b.label) +
      row('Computation', `${peso(b.base)} + ${(b.rate * 100).toFixed(0)}% of ${peso(Math.max(0, annual - b.lo))}`) +
      row('Annual income tax', peso(tax)) +
      row('Monthly income tax', peso(tax / 12)) +
      row('Effective tax rate', eff.toFixed(2) + '%') +
      row('Annual take-home', peso(annual - tax), 'total') +
      `<table class="asg-table"><tr><th>Annual taxable income</th><th>Tax</th></tr>` +
      BRACKETS.map((x, i) => `<tr class="${i === idx ? 'hit' : ''}"><td>${x.label}</td><td>${
        x.rate === 0 ? '0%' : peso(x.base) + ' + ' + x.rate * 100 + '% of excess over ' + peso(x.lo)}</td></tr>`).join('') +
      `</table>`;
  };

  function panelTax() {
    return `<div class="asg-card" style="max-width:640px">
      <h3>Income Tax Calculator</h3>
      <div class="asg-formula">Philippine graduated rates (TRAIN Law, effective 2023 onwards)</div>
      <label for="tax-income">Taxable income (₱)</label>
      <input id="tax-income" type="number" min="0" step="any" placeholder="e.g. 30000">
      <label for="tax-period">Income is…</label>
      <select id="tax-period"><option value="monthly">Per month</option><option value="annual">Per year</option></select>
      <button class="asg-btn" onclick="Assignments.tax()">Compute Tax</button>
      <div id="tax-out" style="margin-top:16px"></div>
      <div class="asg-note">Assumes the amount entered is already taxable income (after allowable deductions such as mandatory contributions).</div>
    </div>`;
  }

  /* ---------- Assignment #3: Loops ---------- */
  A.loops = () => {
    const out = $('loop-out');
    const n = num('loop-n');
    if (!Number.isInteger(n) || n < 1 || n > 1000) {
      out.innerHTML = `<span class="asg-err">Enter a whole number from 1 to 1000.</span>`;
      return;
    }

    // Factorial - WHILE loop
    let i = n, fact = 1n;
    while (i >= 1) {
      fact *= BigInt(i);
      i--;
    }

    // Sum - DO-WHILE loop
    let j = 1, sum = 0;
    do {
      sum += j;
      j++;
    } while (j <= n);

    // Average - FOR loop
    let total = 0;
    for (let k = 1; k <= n; k++) {
      total += k;
    }
    const avg = total / n;

    const trace = n <= 10 ? Array.from({ length: n }, (_, x) => n - x).join(' × ') + ' = ' : '';
    out.innerHTML = `
      <div class="asg-grid">
        <div class="asg-card"><h3>Factorial</h3><div class="asg-formula">while loop</div>
          <div class="asg-result asg-big">${n}! = ${trace}${fact.toString()}</div></div>
        <div class="asg-card"><h3>Sum</h3><div class="asg-formula">do-while loop</div>
          <div class="asg-result">1 + 2 + … + ${n} = ${sum.toLocaleString('en-US')}</div></div>
        <div class="asg-card"><h3>Average</h3><div class="asg-formula">for loop</div>
          <div class="asg-result">${fmt(avg)}</div></div>
      </div>
      <div class="asg-code">// factorial          // sum                // average
while (i >= 1) {      do {                  for (k = 1; k <= n; k++) {
  fact *= i;            sum += j;             total += k;
  i--;                  j++;                }
}                     } while (j <= n);     average = total / n;</div>`;
  };

  function panelLoops() {
    return `<div class="asg-card" style="max-width:640px;margin-bottom:20px">
      <h3>First N Natural Numbers</h3>
      <div class="asg-formula">Factorial (while) · Sum (do-while) · Average (for)</div>
      <label for="loop-n">Enter N</label>
      <input id="loop-n" type="number" min="1" max="1000" step="1" placeholder="e.g. 5"
             onkeydown="if(event.key==='Enter')Assignments.loops()">
      <button class="asg-btn" onclick="Assignments.loops()">Compute</button>
    </div>
    <div id="loop-out"></div>`;
  }

  /* ---------- Assignment #4: Simple Payroll ---------- */
  const OT_RATE = 1.25, SSS = 0.045, PHIC = 0.025, HDMF = 0.02, HDMF_CAP = 200;

  A.payroll = () => {
    const out = $('pay-out');
    const name = $('pay-name').value.trim() || 'Employee';
    const reg = num('pay-reg'), ot = num('pay-ot') || 0, rate = num('pay-rate');
    if (isNaN(reg) || isNaN(rate) || reg < 0 || ot < 0 || rate < 0) {
      out.innerHTML = `<span class="asg-err">Enter valid regular hours and hourly rate.</span>`;
      return;
    }
    const regPay = reg * rate;
    const otPay = ot * rate * OT_RATE;
    const gross = regPay + otPay;
    const sss = gross * SSS;
    const phic = gross * PHIC;
    const hdmf = Math.min(gross * HDMF, HDMF_CAP);
    const ded = sss + phic + hdmf;
    out.innerHTML =
      `<h3 style="margin:18px 0 6px">PAYSLIP — ${esc(name)}</h3>` +
      row('Regular pay', `${fmt(reg)} hrs × ${peso(rate)} = ${peso(regPay)}`) +
      row('Overtime pay', `${fmt(ot)} hrs × ${peso(rate * OT_RATE)} = ${peso(otPay)}`) +
      row('Gross pay', peso(gross), 'total') +
      row('SSS (4.5%)', '− ' + peso(sss)) +
      row('PhilHealth (2.5%)', '− ' + peso(phic)) +
      row('Pag-IBIG (2%, max ₱200)', '− ' + peso(hdmf)) +
      row('Total deductions', '− ' + peso(ded)) +
      row('NET PAY', peso(gross - ded), 'total') +
      `<div class="asg-note">Simplified rates for a school project. Overtime is paid at 125% of the hourly rate.</div>`;
  };

  function panelPayroll() {
    return `<div class="asg-card" style="max-width:640px">
      <h3>Simple Payroll</h3>
      <div class="asg-formula">Gross = regular + overtime (×1.25) · Net = gross − deductions</div>
      <label for="pay-name">Employee name</label>
      <input id="pay-name" type="text" placeholder="e.g. Juan Dela Cruz">
      <label for="pay-reg">Regular hours worked</label>
      <input id="pay-reg" type="number" min="0" step="any" placeholder="e.g. 40">
      <label for="pay-ot">Overtime hours</label>
      <input id="pay-ot" type="number" min="0" step="any" placeholder="e.g. 5">
      <label for="pay-rate">Hourly rate (₱)</label>
      <input id="pay-rate" type="number" min="0" step="any" placeholder="e.g. 100">
      <button class="asg-btn" onclick="Assignments.payroll()">Compute Payroll</button>
      <div id="pay-out"></div>
    </div>`;
  }

  /* ---------- tabs ---------- */
  const PANELS = {
    1: ['#1 Conversion', panelConversion],
    2: ['#2 Income Tax', panelTax],
    3: ['#3 Loops', panelLoops],
    4: ['#4 Payroll', panelPayroll],
  };

  A.show = (n) => {
    document.querySelectorAll('.asg-tab').forEach((t) => t.classList.toggle('active', Number(t.dataset.n) === n));
    $('asg-panel').innerHTML = PANELS[n][1]();
  };

  window.Assignments = A;
  window.loadAssignments = function () {
    $('main-content').innerHTML = `
      <div class="content-scroll">
        <h2>Assignments</h2>
        <div class="asg-tabs">${Object.keys(PANELS).map((n) =>
          `<button class="asg-tab" data-n="${n}" onclick="Assignments.show(${n})">${PANELS[n][0]}</button>`).join('')}</div>
        <div id="asg-panel"></div>
      </div>`;
    A.show(1);
  };
})();
