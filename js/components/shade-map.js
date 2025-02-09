import {ref, reactive, computed, watch} from 'vue';
import { Vector3 } from '/js/classes/vector3.js';
import { Dither } from '/js/classes/dither.js';

import preview from './preview.js';

export default {
    props: ['basePalette', 'selectedColorIndex'],
    setup (props) {
        console.log(props);
        const SHADE_MAP_MAX = 256;
        let lvCount = ref(0);
        let {basePalette, selectedColorIndex} = props;
        let currentSCI = ref(selectedColorIndex);
        let previewRef = ref();
        watch(() => props.selectedColorIndex, (newSelectedColorIndex) => {
            console.log(newSelectedColorIndex); 
            currentSCI.value = newSelectedColorIndex;
            console.log(shadeMap[currentSCI.value]);
        })
        let shadeMap = reactive([]);
        let finalMap = reactive([]);

        let canvas = computed(() => {
            return document.getElementById('shade-map-output');
        })
        let ctx = computed(() => {
            return canvas.value.getContext('2d');
        })

        const generateFinalMap = () => {
            if(shadeMap.length === 0) { finalMap.length = 0; }

            let fMap = [];

            basePalette.forEach((bp, idx) => {
                let row = new Array();
                console.log(shadeMap[idx]);
                shadeMap[idx].forEach(c => {
                    let insertedDither = new Dither(basePalette[c.r], basePalette[c.g]);
                    row.push(insertedDither)
                })
                fMap.push(row)
            })

            finalMap.length = 0;
            finalMap.splice(0, 0, fMap);
            drawMap(4);
            previewRef.value.drawPreview(4);
        }

        const changeLightValues = (count) => {
            lvCount.value = count.target.value;
            shadeMap.length = 0;
            
            //Create a new array of Vector3s with the length of the max light values
            //Push that new array for each color in the basePalette
            for(let i = 0; i < basePalette.length; i++) {
                let smRow = new Array();
                for(let j = 0; j < lvCount.value; j++) {
                    smRow.push(new Vector3(0,0,0));
                }
                shadeMap.splice(0, 0, smRow);
            }
        }
        
        //CRUD functions for ShadeMap
        const addMapEntry = () => {
            shadeMap.push(new Vector3(0,0,0));
        }

        const removeMapEntry = (index) => {
            shadeMap.splice(index, 1);
        }

        const updateMapEntry = (index, value, component) => {
            value = parseInt(value);
            if(value > basePalette.length - 1) value = basePalette.length - 1;
            if(value < 0) value = 0;

            let entryToUpdate = shadeMap[currentSCI.value];

            let colorToUpdate = entryToUpdate[index];
            console.log(colorToUpdate);
            switch(component) {
                case 'r':
                    colorToUpdate.r = value;
                    break;
                case 'g':
                    colorToUpdate.g = value;
                    break;
            }
            console.log(shadeMap);
        }

        const drawMap = (scale) => {
            canvas.value.width = lvCount.value * scale;
            canvas.value.height = basePalette.length * scale;
            ctx.value.clearRect(canvas.value.clientLeft, canvas.value.clientTop, canvas.value.clientWidth, canvas.value.clientHeight);
            for(let j = 0; j < lvCount.value; j++) {
                    for(let i = 0; i < basePalette.length; i++) {
                    ctx.value.fillStyle = shadeMap[i][j].toHexString();
                    ctx.value.fillRect(
                        canvas.value.clientLeft + j * scale, 
                        (canvas.value.clientTop + i * scale), 
                        1 * scale, 
                        1 * scale
                    );
                }
            }
        }

        const downloadCanvas = () => {
            let link = document.createElement('a');
            link.download = 'shade-map.png';
            link.href = canvas.value.toDataURL('image/png');
            link.click();
        }

        return {
            SHADE_MAP_MAX,
            shadeMap,
            selectedColorIndex,
            currentSCI,
            lvCount, 
            basePalette,
            finalMap,
            preview,
            previewRef,
            changeLightValues,
            addMapEntry,
            removeMapEntry,
            updateMapEntry,
            generateFinalMap,
            downloadCanvas,
        }
    },

    template: /*html*/`
        <div>
            <div class="control-section-lg palette-area">
                <div>
                <h2>Shade Map</h2>
                    <label for="lv-count"># of Light Values: </label>
                    <input id="lv-count" type="number" min="0" max="255" :value="lvCount" @change="(e) => changeLightValues(e)"/>
                    <br/>
                    <button id="generate-btn" style="width: 100%;" @click="generateFinalMap">Generate Shade Map</button>

                    <p><b>Editing Light Values for Palette Entry# {{currentSCI}}</b></p>
                    <ul class="palette-list" v-if="shadeMap[currentSCI] !== null">
                        <li v-for="(lightValue, index) in shadeMap[currentSCI]" :key="index">
                            <div class="rgb-display">
                                <p>Red:  <input type="number" min="0" :max="basePalette.length - 1" :value="lightValue.r" @change="(e) => updateMapEntry(index, e.target.value, 'r')"></input></p>
                                <p>Green:<input type="number" min="0" :max="basePalette.length - 1" :value="lightValue.g" @change="(e) => updateMapEntry(index, e.target.value, 'g')"></input></p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div style="margin-left: 1vw; display: flex; flex-direction:column;">
                    <h2>Output</h2>
                    <div>
                        <canvas id="shade-map-output"/>
                    </div>
                    <button id="download-btn" @click="downloadCanvas">Download Output</button>
                </div>
            </div>
            <component :is="preview" :finalMap="finalMap" ref="previewRef"/>
        </div>
    `
}