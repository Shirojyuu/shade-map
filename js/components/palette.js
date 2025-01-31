import {ref} from 'vue';
import { Vector3 } from '/js/classes/vector3.js';


export default {
    setup () {
        const palette = ref([
            new Vector3(0,0,0)
        ]);
        const PALETTE_MAX = 256;
        const shadeMap = ref([]);

        const addColor = () => {
            palette._value.push(new Vector3(0,0,0));
            console.log(paletteLimitReached);
        }
        const updateColor = (index, value, component) => {
            let colorToUpdate = palette._value[index];

            switch(component) {
                case 'r':
                    colorToUpdate.r = value;
                    break;
                case 'g':
                    colorToUpdate.g = value;
                    break;
                    case 'b':
                    colorToUpdate.b = value;
                    break;
            }

            let hexString = 
                '#'+
                Number(colorToUpdate.r).toString(16).padStart(2, '0') + 
                Number(colorToUpdate.g).toString(16).padStart(2, '0') + 
                Number(colorToUpdate.b).toString(16).padStart(2, '0'); 
            console.log(hexString);

            let canvas = document.getElementById(`palette-preview-${index}`);            
            let ctx = canvas.getContext('2d');

            ctx.clearRect(canvas.clientLeft, canvas.clientTop, canvas.clientWidth, canvas.clientHeight)
            ctx.fillStyle = hexString;
            ctx.fillRect(canvas.clientLeft, canvas.clientTop, canvas.clientWidth, canvas.clientHeight);
        }

        return {
            palette,
            PALETTE_MAX,
            updateColor,
            addColor
        }
    },
    
    
    template: /*html*/`
        <div>
            <div class="control-section palette-area">
            <h2>Base Palette</h2>
            <button :disabled="palette.length > PALETTE_MAX" @click="addColor">Add color</button>
            
            <ul class="palette-list">
                <li v-for="(color, index) in palette">
                    <div class="rgb-display">
                        <p>Red:  <input type="number" :min="0" :max="255" :value="color.r" @change="(e) => updateColor(index, e.target.value, 'r')"></input></p>
                        <p>Green:<input type="number" :min="0" :max="255" :value="color.g" @change="(e) => updateColor(index, e.target.value, 'g')"></input></p>
                        <p>Blue: <input type="number" :min="0" :max="255" :value="color.b" @change="(e) => updateColor(index, e.target.value, 'b')"></input></p>
                    </div>
                    <canvas :id="'palette-preview-' + index" width="372" height="20" style="border:1px solid #000000;"></canvas>
                </li>
            </ul>
            </div>

            <!--<div class="control-section load-area">
                <h2>Load a Palette from text file</h2>
                <textarea width=100 id="load-palette">
                </textarea>
            </div> -->
        </div>
        
    `
}