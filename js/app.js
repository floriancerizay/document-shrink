const log = document.getElementById('log');
const drop = document.getElementById('drop');
const input = document.getElementById('file');
const fmt = n => (n / 1024 / 1024).toFixed(2) + ' Mo';

async function processAll(files) {
  log.textContent = '';
  for (const file of files) await process(file);
  input.value = '';
}

async function process(file) {
  log.textContent += `Lecture de ${file.name}…\n`;
  try {
    const zip = await JSZip.loadAsync(file);
    const pdf = placeholderPdf();
    const entries = zip.file(/\.pdf$/i);
    entries.forEach(entry => zip.file(entry.name, pdf));
    log.textContent += `${entries.length} PDF remplacé(s)\n`;
    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
    log.textContent += `Taille : ${fmt(file.size)} → ${fmt(blob.size)}\n\n`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = file.name.replace(/\.zip$/i, '') + '-fake.zip';
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (e) {
    log.textContent += `Erreur : ${e.message}\n\n`;
  }
}

input.addEventListener('change', () => processAll([...input.files]));
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', e => {
  e.preventDefault();
  drop.classList.remove('over');
  processAll([...e.dataTransfer.files]);
});
