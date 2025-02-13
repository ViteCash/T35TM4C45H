<template>
    <div class="hello">
        <img
            ref="demoTrigger"
            class="demo-trigger"
            :src="`${img}?w=200&ch=DPR&dpr=2&border=1,ddd`"
            :data-zoom="`${img}?w=500&ch=DPR&dpr=2&border=1,ddd`"
        />
        <div ref="detail" class="detail"></div>
    </div>
</template>

<script>
import Drift from 'drift-zoom'

export default {
    name: 'HelloWorld',
    props: {
        msg: String,
        img: String
    },
    data() {
        return {
            drift: null
        }
    },
    mounted() {
        if (!this.drift) {
            this.drift = new Drift(this.$refs.demoTrigger, {
                paneContainer: this.$refs.detail,
                zoomFactor: 2,
                inlinePane: true,
                containInline: false,
                hoverBoundingBox: false,
                showWhitespaceAtEdges: true,
                inlineContainer: this.$parent.$el,
                injectBaseStyles: true,
                inlineOffsetY: 50
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.demo-trigger {
    width: 100%;
    height: 400px;
}

.drift-zoom-pane {
    background: rgba(0, 0, 0, 0.5);
    /* This is required because of a bug that causes border-radius to not
	work with child elements in certain cases. */
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    border: 1px solid;
}

.drift-zoom-pane.drift-opening {
    animation: drift-noop 8ms linear;
}

.drift-zoom-pane.drift-closing {
    animation: drift-noop 8ms linear;
    display: none;
}

.drift-zoom-pane.drift-inline {
    position: absolute;
    width: 250px;
    height: 250px;
    border-radius: 60px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
    z-index: 100000;
    overflow: hidden;
    will-change: transform;
    transform-style: flat;
}

.drift-zoom-pane.drift-inline img {
    position: relative;
    z-index: 10;
    will-change: transform;
    transform-style: flat;
    object-fit: cover;
}

.drift-loading .drift-zoom-pane-loader {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    width: 66px;
    height: 20px;
    animation: drift-loader-rotate 1800ms infinite linear;
    -webkit-animation: drift-loader-rotate 1800ms infinite linear;
}

.drift-zoom-pane-loader:before,
.drift-zoom-pane-loader:after {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    margin-top: -10px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.9);
}

.drift-zoom-pane-loader:before {
    left: 0;
    animation: drift-loader-before 1800ms infinite linear;
    -webkit-animation: drift-loader-before 1800ms infinite linear;
}

.drift-zoom-pane-loader:after {
    right: 0;
    animation: drift-loader-after 1800ms infinite linear;
    -webkit-animation: drift-loader-after 1800ms infinite linear;
    animation-delay: -900ms;
    -webkit-animation-delay: -900ms;
}
</style>
