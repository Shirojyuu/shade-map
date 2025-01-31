import {ref} from 'vue';
import { Vector3 } from '/js/classes/vector3.js';


export default {
    setup () {
        const palette = ref([
            new Vector3(0,0,0)
        ]);

        const addColor = () => {
            palette._value.push(new Vector3(0,0,0));
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
            updateColor,
            addColor
        }
    },
    
    
    template: /*html*/`
        <div>
            <h2>Base Palette</h2>
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
            <br/>
            <button @click="addColor">Add color</button>
        </div>
        
    `
}