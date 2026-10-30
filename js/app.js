const drop = document.getElementById('drop');
const input = document.getElementById('file');
const results = document.getElementById('results');
const pdf = placeholderPdf();

const fmt = n => n < 1024 * 1024 ? (n / 1024).toFixed(1) + ' Ko' : (n / 1024 / 1024).toFixed(2) + ' Mo';

document.getElementById('preview').href = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));

function addResult(name) {
  const li = document.createElement('li');
  li.className = 'result';
  li.innerHTML = '<span class="name"></span><span class="status">Traitement…</span>';
  li.querySelector('.name').textContent = name;
  results.prepend(li);
  return li;
}

async function processAll(files) {
  for (const file of files) await process(file);
  input.value = '';
}

async function process(file) {
  const li = addResult(file.name);
  const status = li.querySelector('.status');
  try {
    const zip = await JSZip.loadAsync(file);
    const entries = zip.file(/\.pdf$/i);
    entries.forEach(entry => zip.file(entry.name, pdf));
    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });

    const gain = Math.round((1 - blob.size / file.size) * 100);
    status.textContent = `${entries.length} PDF remplacé(s) · ${fmt(file.size)} → ${fmt(blob.size)}`;
    li.insertAdjacentHTML('beforeend', `<span class="gain">−${Math.max(gain, 0)} %</span>`);

    const a = document.createElement('a');
    a.className = 'download';
    a.href = URL.createObjectURL(blob);
    a.download = file.name.replace(/\.zip$/i, '') + '-fake.zip';
    a.textContent = `Télécharger ${a.download}`;
    li.append(a);
    li.classList.add('done');
    a.click();
  } catch (e) {
    li.classList.add('error');
    status.textContent = `Erreur : ${e.message}`;
  }
}

input.addEventListener('change', () => processAll([...input.files]));
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', e => {
  e.preventDefault();
  drop.classList.remove('over');
  processAll([...e.dataTransfer.files].filter(f => /\.zip$/i.test(f.name)));
});
