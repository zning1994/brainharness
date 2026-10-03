const config = JSON.parse(document.body.dataset.config);
for (const button of document.querySelectorAll('[data-demo]')) button.addEventListener('click', () => {
  const demo = config.demos[Number(button.dataset.demo)];
  document.querySelector('#demo-q').textContent = demo.q;
  document.querySelector('#demo-a').textContent = demo.a;
  document.querySelector('#demo-label').textContent = demo.label;
  for (const item of document.querySelectorAll('[data-demo]')) item.setAttribute('aria-pressed', String(item === button));
});
let platform = 'claude';
const select = document.querySelector('#skill-select');
const code = document.querySelector('#command');
const status = document.querySelector('#copy-status');
function update() {
  const slug = select.value;
  const commands = {
    claude: `/plugin marketplace add zning1994/brainharness\n/plugin install ${slug}@brainharness`,
    codex: config.compatibility.codex ? `codex plugin marketplace add zning1994/brainharness\ncodex plugin add ${slug}@brainharness` : '',
    chatgpt: '',
    clawhub: `npx clawhub@0.23.3 install ${slug}`,
  };
  document.querySelector('#platform-status').textContent = config.status[platform];
  code.textContent = commands[platform];
  document.querySelector('#command-panel').hidden = !commands[platform];
  const listing = document.querySelector('#listing');
  listing.hidden = platform !== 'clawhub';
  listing.href = `https://clawhub.ai/zning1994/${slug}`;
  status.textContent = '';
  for (const button of document.querySelectorAll('[data-platform]')) button.setAttribute('aria-pressed', String(button.dataset.platform === platform));
}
for (const button of document.querySelectorAll('[data-platform]')) button.addEventListener('click', () => {platform = button.dataset.platform; update();});
select.addEventListener('change', update);
document.querySelector('#copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(code.textContent); status.textContent = config.copied; }
  catch { status.textContent = config.copyFailed; }
});
