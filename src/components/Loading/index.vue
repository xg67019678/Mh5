<template>
    <div id="preloader">
        <div id="ctn-preloader" class="ctn-preloader" :class="!show && 'loaded'">
            <div class="animation-preloader">
                <div class="spinner"></div>
                <div class="txt-loading">
                    <span data-text-preloader="L" class="letters-loading">
                        L
                    </span>

                    <span data-text-preloader="O" class="letters-loading">
                        O
                    </span>

                    <span data-text-preloader="A" class="letters-loading">
                        A
                    </span>

                    <span data-text-preloader="D" class="letters-loading">
                        D
                    </span>

                    <span data-text-preloader="I" class="letters-loading">
                        I
                    </span>

                    <span data-text-preloader="N" class="letters-loading">
                        N
                    </span>

                    <span data-text-preloader="G" class="letters-loading">
                        G
                    </span>
                </div>
            </div>
            <div class="loader-section section-left"></div>
            <div class="loader-section section-right"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Loading',
    props: {
        show: {
            type: Boolean,
            default: true
        }
    },
}
</script>

<style lang="scss" scoped>
.ctn-preloader {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 100%;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 9999;
    pointer-events: none;
}

.ctn-preloader .animation-preloader {
    position: absolute;
    z-index: 100;
}

.ctn-preloader .animation-preloader .spinner {
    -webkit-animation: spinner 1s infinite linear;
    animation: spinner 1s infinite linear;
    border-radius: 50%;
    border: 4px solid var(--light-color2);
    border-top-color: var(--black-color);
    height: 120px !important;
    width: 120px !important;
    margin: 0 auto 20px auto !important;
}

.ctn-preloader .animation-preloader .txt-loading {
    font-weight: 600;
    text-align: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color: var(--light-color2);
    font-size: 26px !important;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading:before {
    animation: letters-loading 5s infinite;
    color: var(--black-color);
    content: attr(data-text-preloader);
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    -webkit-transform: rotateY(-90deg);
    transform: rotateY(-90deg);
    -webkit-animation: letters-loading 5s infinite;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading {
    color: rgba(0, 0, 0, 0.2);
    position: relative;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(2):before {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(3):before {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(4):before {
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(5):before {
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(6):before {
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
}

.ctn-preloader .animation-preloader .txt-loading .letters-loading:nth-child(7):before {
    -webkit-animation-delay: 0.7s;
    animation-delay: 0.7s;
}

.ctn-preloader .loader-section {
    background: var(--white-color);
    height: 100%;
    position: fixed;
    top: 0;
    width: calc(50% + 1px);
}

.ctn-preloader .loader-section.section-left {
    left: 0;
}

.ctn-preloader .loader-section.section-right {
    right: 0;
}

.loaded .animation-preloader {
    opacity: 0;
    transition: 0.5s ease-out;
    -webkit-transition: 0.5s ease-out;
    -moz-transition: 0.5s ease-out;
    -ms-transition: 0.5s ease-out;
    -o-transition: 0.5s ease-out;
}

.loaded .loader-section.section-left {
    // -webkit-transition: 0.7s 0.3s all cubic-bezier(0.1, 0.1, 0.1, 1);
    // transition: 0.7s 0.3s all cubic-bezier(0.1, 0.1, 0.1, 1);
    -webkit-transform: translateX(-101%);
    transform: translateX(-101%);
}

.loaded .loader-section.section-right {
    // -webkit-transition: 0.7s 0.3s all cubic-bezier(0.1, 0.1, 0.1, 1);
    // transition: 0.7s 0.3s all cubic-bezier(0.1, 0.1, 0.1, 1);
    -webkit-transform: translateX(101%);
    transform: translateX(101%);
}

/* Animación del preloader */
@-webkit-keyframes spinner {
    to {
        -webkit-transform: rotateZ(360deg);
        transform: rotateZ(360deg);
    }
}

@keyframes spinner {
    to {
        -webkit-transform: rotateZ(360deg);
        transform: rotateZ(360deg);
    }
}

/* Animación de las letras cargando del preloader */
@-webkit-keyframes letters-loading {

    0%,
    75%,
    100% {
        opacity: 0;
        -webkit-transform: rotateY(-90deg);
        transform: rotateY(-90deg);
    }

    25%,
    50% {
        opacity: 1;
        -webkit-transform: rotateY(0deg);
        transform: rotateY(0deg);
    }
}

@keyframes letters-loading {

    0%,
    75%,
    100% {
        opacity: 0;
        -webkit-transform: rotateY(-90deg);
        transform: rotateY(-90deg);
    }

    25%,
    50% {
        opacity: 1;
        -webkit-transform: rotateY(0deg);
        transform: rotateY(0deg);
    }
}

/* Tamaño de portatil hacia atras (portatil, tablet, celular) */
@media screen and (max-width: 767px) {

    /* Preloader */
    /* Spinner cargando */
    .ctn-preloader .animation-preloader .spinner {
        height: 8em;
        width: 8em;
    }

    /* Texto cargando */
    .ctn-preloader .animation-preloader .txt-loading {
        font-size: 2.5rem;
    }
}

@media screen and (max-width: 500px) {
    .ctn-preloader .animation-preloader .spinner {
        height: 7em;
        width: 7em;
    }
}
</style>


