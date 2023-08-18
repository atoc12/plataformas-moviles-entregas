class Seleccion{
    constructor(){
        this.element = document.querySelector('#actividad-seleccionada');
        this.content = null;
        this.tab=[];
    }
    async setContent(datos){
        const {descripcion,titulo,id} = datos;
        // cargarArchivoAutomaticamente(titulo);
        let div = document.createElement('div');
        let button = document.createElement('button');
        let button2=document.createElement('button');
        let button3=document.createElement('button');
        button2.className='tab-btn';
        button3.className='tab-btn'
        button2.innerText='HTML';
        button3.innerText='JAVASCRIPT';
        button2.onclick=()=>{
            this.editor.setValue(this.tab[0].content);
            monaco.editor.setModelLanguage(this.editor.getModel(), this.tab[0].type);
        }
        button3.onclick=()=>{
            monaco.editor.setModelLanguage(this.editor.getModel(), this.tab[1].type);
            this.editor.setValue(this.tab[1].content);
        }
        button.onclick=()=>{
            ejecutarCodigo(this); 
        }
        button.className='btn-ejecutar'
        button.textContent='Ejecutar';
        
        div.innerHTML=`
            <section id="introduccion">
                <h1><span class="tittle-span">#</span>${titulo} <a href="./tp-${id}">Ir</a></h1>
                <article>
                    <section id="info-section">
                    </section>
                </article>
            </section>
            <section id="codigo-javascript">
                <div>
                    <h2>Código</h2>
                </div>
                <div id="contenido-codigo">
                    <div>
                        <div class="tabs">
                            
                        </div>
                        <div class="editorContainer" id="editorContainer"></div>
                    </div>
                    <div id="consola">
                    </div>
                </div>
            </section>
            
        `;
        this.content =div;
        this.time=setTimeout(()=>{
            this.initMonacoEditor(`tp-${id}`);
            document.querySelector("#contenido-codigo").appendChild(button);
            let tabs= document.querySelector(".tabs");
            tabs.appendChild(button2)
            tabs.appendChild(button3)
            this.ObtenerConsigna(id);
        },2000);
    }
    create(){
        this.element.appendChild(this.content);
        
    }
    async ObtenerConsigna (id){
        const consigna = (await fetch(`./tp-${id}/readme`)).text();
        document.querySelector("#info-section").innerHTML=await consigna;
        console.log(await consigna);
    }
    async initMonacoEditor(id) {
        return new Promise((resolve, reject) => {
            // ...
            // Verificar que el elemento editorContainer exista antes de crear el editor
            const editorContainer = document.getElementById('editorContainer');
            if (!editorContainer) {
                console.error('El elemento editorContainer no existe en el DOM.');
                return reject(new Error('El elemento editorContainer no existe en el DOM.'));
            }
            require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs' }});
            require(['vs/editor/editor.main'], () => {
                const editor = monaco.editor.create(editorContainer, {
                    language: 'javascript',
                    theme: 'vs-dark',
                    automaticLayout: true
                }

            );
            
            

            this.editor = editor;
            resolve(editor);
            cargarArchivoAutomaticamente(id,this);
            });
        })
    }
    destroy(){
        this.element.innerHTML='';
        this.tab=[];
        if(this.time){
            clearTimeout(this.time);
        }
        if (this.editor) {
            this.editor.dispose(); // Elimina el editor Monaco
            this.editor = null;
        }
    }
}
class Actividades {
    constructor(id){
        this.elementID=id;
        this.element=document.querySelector(`#${this.elementID}`);
        this.listas=this.element.children;
        this.seleccion = new Seleccion();
    }
    addList(datos){
        const {titulo,descripcion,id} = datos;
        let lista = document.createElement('li');
        lista.id=`tp-${id}`;
        lista.onclick = async (e) => {
            document.querySelector('aside').classList.toggle('close');
            document.querySelector('aside').classList.toggle('open');
            this.seleccion.destroy();
            this.seleccion.setContent(datos);
            this.seleccion.create();
        }
        lista.innerHTML=`
            <div class="lista-actividad">
                <span>
                    tp-${id}
                </span>
                <ul>
                    <li><a href="#introduccion">Introducción</a></li>
                    <li><a href="#contenido-codigo">Codigo</a></li>
                </ul>
            </div>
        `;
        this.element.appendChild(lista);
        this.listas=this.element.children;
    }
    removeList({titulo}){

    }
}

async function cargarArchivoAutomaticamente(titulo,seleccion) {
    console.log("a");
    const rutaArchivo = titulo+'/codigo.js';
    const rutaIndexHTML = titulo + '/index.html';
    const htmltext = await (await fetch(rutaIndexHTML)).text();
    const js = await (await fetch(rutaArchivo)).text();
    seleccion.tab.push({content:htmltext,type:"html"});
    seleccion.tab.push({content:js,type:"javascript"});
    seleccion.editor.setValue(seleccion.tab[1].content);
}
const actividades = new Actividades("lista-de-actividades");

// function changeTab(n){
//     console.log(n);
// }

(async()=>{
    try{
        const Datos =async ()=> await (await fetch('./datos.json')).json();
        const resultado = await Datos();        
        await resultado.actividades.map((datos)=>actividades.addList(datos));
        





    }catch(err){
        console.log(err);
    }
})()
const BUTTON_MENU = document.getElementById('btn-menu');
const ASIDE = document.querySelector('aside');
BUTTON_MENU.addEventListener("click",()=>{
    ASIDE.classList.toggle('close');
    ASIDE.classList.toggle('open');
})




