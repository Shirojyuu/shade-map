import {ref, reactive, computed, watch, onMounted} from 'vue';

export default {
    props: ['finalMap'],
    setup (props) {

        let {finalMap} = props;
        let canvas = computed(() => {
            return document.getElementById('preview-canvas');
        })
        let ctx = computed(() => {
            return canvas.value.getContext('2d');
        })

        const drawPreview = (scale) => {
            ctx.value.clearRect(canvas.value.clientLeft, canvas.value.clientTop, canvas.value.clientWidth * scale, canvas.value.clientHeight * scale)

            let pMap = finalMap.flat();
            console.log(pMap);
            for(let i = 0; i < pMap.length; i++) {
                console.log(i);

                for(let j = 0; j < pMap[i].length; j++) {
                    drawDither(pMap[i][j], j, i, scale);
                }
            }
        }

        const drawDither = (dither, x, y, scale) => {
            // canvas.value.width = lvCount.value * scale;
            // canvas.value.height = basePalette.length * scale;
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
                        (canvas.value.clientLeft + i * scale) + (x * scale * 4), 
                        (canvas.value.clientTop + h* scale) + y * scale * 4, 
                        1 * scale, 
                        1 * scale
                    );
                }
            }
        }

        return {
            drawDither,
            drawPreview,
        }

    },

    template: /*html*/`
        <div>
            <div class="control-section fixed">
                <h2>Preview</h2>
                <canvas id="preview-canvas"/>
            </div>
        </div>
    ` 

}