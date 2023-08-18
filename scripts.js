let editor;
const codeByTabIndex = [
  'Código de la Pestaña 1',
  'Código de la Pestaña 2',
];

function changeTab(tabIndex) {
  // Ocultar todas las pestañas
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach((tab, index) => {
    tab.classList.remove('active');
  });

  // Mostrar solo la pestaña seleccionada
  tabs[tabIndex].classList.add('active');

  // Actualizar el contenido del editor con el código correspondiente
  if(editor){
      editor.setValue(codeByTabIndex[tabIndex]);
  }
}

async function initEditor() {
  const editorContainer = document.getElementById('editor-container');
  require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs' }});
    require(['vs/editor/editor.main'], () => {
        editor = monaco.editor.create(editorContainer, {
            value:codeByTabIndex[0],
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true
        })}
    );

  // Mostrar la primera pestaña por defecto
  changeTab(0);
}

initEditor();
