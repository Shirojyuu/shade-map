import {ref, reactive, computed, onMounted} from 'vue';
import { Vector3 } from '/js/classes/vector3.js';
import { Dither } from '/js/classes/dither.js';

import preview from './preview.js';

export default {
    props: ['basePalette', 'selectedColorIndex'],
    setup (props) {
        console.log(props);
        const SHADE_MAP_MAX = 256;
        let {basePalette, selectedColorIndex} = props;
        let shadeMap = reactive([]);
        let currentEntry = computed (() => { 
            if(shadeMap.length === 0) { return []; }
            return shadeMap[selectedColorIndex];
        });

        let maxLightValues = ref(0);
        let finalMap = computed(() => {
            if(shadeMap.length === 0) { return []; }

            let fMap = [];
            shadeMap.forEach((entry) => {
                fMap.push(new Dither(basePalette[entry.r], basePalette[entry.g]));
            })

            console.log(fMap);
            return fMap;
        })

        const disableAdd = computed(() => {
            return shadeMap.length > SHADE_MAP_MAX || basePalette.length === 0
        });

        const changeLightValues = (count) => {
            let shadeMap = new Array();
            let smRow = new Array();
            smRow.length = count.target.value;
            smRow.fill(new Vector3(0,0,0));
            for(let i = 0; i < basePalette.length; i++) {
                shadeMap.push(smRow);
            }
            console.log(shadeMap)
            console.log(currentEntry.value)
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

            let entryToUpdate = shadeMap[index];

            switch(component) {
                case 'r':
                    entryToUpdate.r = value;
                    break;
                case 'g':
                    entryToUpdate.g = value;
                    break;
            }
            console.log(shadeMap);
        }

        const drawMapEntry = (entry) => {

        }

        return {
            SHADE_MAP_MAX,
            shadeMap,
            maxLightValues,
            currentEntry,
            basePalette,
            disableAdd,
            finalMap,
            preview,
            changeLightValues,
            addMapEntry,
            removeMapEntry,
            updateMapEntry,
        }
    },

    template: /*html*/`
        <div>
            <div class="control-section-lg palette-area">
                <div>
                <h2>Shade Map</h2>
                    <label for="lv-count"># of Light Values: </label>
                    <input id="lv-count" type="number" min="0" max="255" :value="maxLightValues" @change="(e) => changeLightValues(e)"/>
                    

                    <ul class="palette-list">
                        <li v-for="(lightValue, index) in currentEntry">
                            <div class="rgb-display">
                                <p>Red:  <input type="number" min="0" :max="basePalette.length - 1" :value="lightValue.r" @change="(e) => updateMapEntry(index, e.target.value, 'r')"></input></p>
                                <p>Green:<input type="number" min="0" :max="basePalette.length - 1" :value="lightValue.g" @change="(e) => updateMapEntry(index, e.target.value, 'g')"></input></p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2>Output</h2>
                    <canvas id="shade-map-output" width/>
                </div>
            </div>
            <component :is="preview" :finalMap="finalMap"/>
        </div>
    `
}