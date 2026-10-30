# Document Shrink

👉 **[Utiliser l'outil en ligne](https://floriancerizay.github.io/document-shrink/)**

Page web statique : on dépose une ou plusieurs archives ZIP, tous les PDF qu'elles contiennent sont remplacés par un PDF valide d'une page indiquant « Ce document a été remplacé pour des besoins de test », et chaque archive allégée est téléchargée (`<nom>-fake.zip`).

Tout est traité dans le navigateur (JSZip), aucun fichier n'est envoyé sur un serveur.

## Structure

- `index.html` : la page
- `css/style.css` : les styles
- `js/placeholder-pdf.js` : génération du PDF de remplacement (une page A4 avec une mention)
- `js/app.js` : lecture des ZIP, remplacement des PDF, téléchargement
