import {ref, onMounted} from 'vue';
import { Vector3 } from '/js/classes/vector3.js';

export default {
    setup (props, {emit}) {
        emits: ['colorsLoaded'];

        const openFileDialog = () => {
            document.getElementById("json-palette").click();
        }

        const processFile = (file) => {
            console.log(file);
            const fr = new FileReader();
            fr.onload = () => {
                try {
                    let jsonPalette = JSON.parse(fr.result);
                    console.log(jsonPalette);
                    processPalette(jsonPalette);
                } catch (e) {
                    console.error(e);
                }
            }
            fr.readAsText(file);
        }

        const processPalette = (loaded) => {
            let palette = [];
            loaded['palette'].forEach((col) =>{
                palette.push(new Vector3(col.r, col.g, col.b));
            })

            console.log(palette);
            emit('colorsLoaded', palette);
            document.getElementById('file-form').reset();
        }

        onMounted (() => {
            document.getElementById('json-palette').addEventListener('change', (e) => {
                const file = document.getElementById('json-palette').files[0];
          
                if (file) {
                  processFile(file);
                }
              });
        })

        return {
            openFileDialog,
            processFile
        }
    },

   

    

    template: /*html*/`
        <div>
            <button @click="openFileDialog">Import palette from .json...</button>
            <form id="file-form">
                <input type="file" id="json-palette" style="display:none;">
            </form>
        </div>
    `
}