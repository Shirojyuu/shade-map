import {ref, reactive, computed, watch, onMounted} from 'vue';

export default {
    props: ['finalMap'],
    setup (props) {

        let {finalMap} = props
        let canvas = computed(() => {
            return document.getElementById('preview-canvas');
        })
        let ctx = computed(() => {
            return canvas.value.getContext('2d');
        })

        watch(() => props.finalMap, (newFinalMap) => {
            newFinalMap.forEach((d, index) => {
                drawDither(d, index, 4);
            });
        });

        const drawDither = (dither, index, scale) => {
            // ctx.value.clearRect(canvas.value.clientLeft, canvas.value.clientTop, canvas.value.clientWidth, canvas.value.clientHeight)
            for(let h = 0; h < 4; h++) {
                for(let i = 0; i < 4; i++) {
                    if(i % 2 === 0) {
                        if(h % 2 === 0) ctx.value.fillStyle = dither.c1.toHexString();
                        else ctx.value.fillStyle = dither.c2.toHexString();
                    }
                    else {
                        if(h % 2 === 0) ctx.value.fillStyle = dither.c2.toHexString();
                        else ctx.value.fillStyle = dither.c1.toHexString();
                    }
                    ctx.value.fillRect(
                        canvas.value.clientLeft + i * scale + (index * scale * 4), 
                        (canvas.value.clientTop + h * scale), 
                        1 * scale, 
                        1 * scale
                    );
                }
            }
        }

        return {
            finalMap
        }

    },

    template: /*html*/`
        <div>
            <div class="control-section fixed">
                <h2>Preview</h2>
                <canvas id="preview-canvas" width="160" height="160"/>
            </div>
        </div>
    ` 

}