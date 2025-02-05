import {ref, createApp, reactive} from 'vue';
import { Vector3 } from '/js/classes/vector3.js';

//Components
import loader from './loader.js';
import shadeMap from './shade-map.js';

export default {
    setup () {
        let palette = reactive([]);
        let selectedColorIndex = ref(0);
        //Limits for each array
        const PALETTE_MAX = 256;

        const doFill = (index, fillColor) => {
            let canvas = document.getElementById(`palette-preview-${index}`);            
            let ctx = canvas.getContext('2d');

            ctx.clearRect(canvas.clientLeft, canvas.clientTop, canvas.clientWidth, canvas.clientHeight)
            ctx.fillStyle = fillColor.toHexString();
            ctx.fillRect(canvas.clientLeft, canvas.clientTop, canvas.clientWidth, canvas.clientHeight);
        }

        const addColor = async (r,g,b) => {
            const color = new Vector3(r,g,b);
            await palette.push(color);
            doFill(palette.length - 1, color);

        }

        const addColorRaw = async (r,g,b, index) => {
            const color = new Vector3(r,g,b);
            await palette.push(color);
            doFill(index, color);

        }

        const removeColor = (index) => {
            if(palette.length - 1 === 0) {
                setColor(0, new Vector3(0,0,0));
                return;
            }
            palette.splice(index, 1);
        }

        const setColor = (index, colorToSet) => {
            palette[index] = colorToSet;
            doFill(index, colorToSet);

        }

        const updateColor = (index, value, component) => {
            value = parseInt(value)
            if(value > 255) value = 255;
            if(value < 0) value = 0;

            let colorToUpdate = palette[index];

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

           doFill(index, colorToUpdate);
        }

        const loadPalette = async (loadedPalette) => {
            palette.splice(0);
            loadedPalette.forEach((color, index) => {
                addColorRaw(color.r, color.g, color.b, index);
            });
            
        }

        const setColorIndex = (index) => {
            selectedColorIndex = index;
        }

        return {
            palette,
            PALETTE_MAX,
            selectedColorIndex,
            updateColor,
            addColor,
            removeColor,
            setColor,
            loadPalette,
            setColorIndex,
            loader,
            shadeMap
        }
    },
    
    
    template: /*html*/`
        <div class="control-layout">
            <div class="control-section palette-area">
            <h2>Base Palette</h2>
            <button :disabled="palette.length > PALETTE_MAX" @click="addColor(0,0,0)">Add color</button>
            <component :is="loader" @colorsLoaded="loadPalette"/>
            
            <ul class="palette-list">
                <li v-for="(color, index) in palette">
                    <button @click="removeColor(index)">X</button>
                    <button @click="setColorIndex(index)">Edit Light Values...</button>
                    <div class="rgb-display">
                        <p>Red:  <input type="number" min="0" max="255" :value="color.r" @change="(e) => updateColor(index, e.target.value, 'r')"></input></p>
                        <p>Green:<input type="number" min="0" max="255" :value="color.g" @change="(e) => updateColor(index, e.target.value, 'g')"></input></p>
                        <p>Blue: <input type="number" min="0" max="255" :value="color.b" @change="(e) => updateColor(index, e.target.value, 'b')"></input></p>
                    </div>
                    <canvas :id="'palette-preview-' + index" width="372" height="20" style="border:1px solid #000000;"></canvas>
                </li>
            </ul>
            </div>

            <component :is="shadeMap" :basePalette="palette" :selectedColorIndex="selectedColorIndex"/>
        </div>
        
    `
}