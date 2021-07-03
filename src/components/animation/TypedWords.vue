<template>
    <div>
        <span>{{ keeptext }}</span>
        <span class="typed-words"></span>
    </div>
</template>

<script>
import Typed from 'typed.js'
export default {
    props: {
        words: {
            type: String,
            default: ''
        },
        typeSpeed: {
            type: Number,
            default: 20
        }
    },
    data() {
        return {
            typedObj: null,
            keeptext: '',
            lasttext: ''
        }
    },
    methods: {
        initTypedJs() {
            if (this.words[0] === '\\') {
                this.keeptext = ''
                let tmp = this.words.substr(1, this.words.length)
                this.typedObj = new Typed('.typed-words', {
                    strings: [tmp],
                    typeSpeed: this.typeSpeed,
                    cursorChar: '▼'
                })
                this.lasttext = tmp
            } else {
                this.keeptext += this.lasttext
                this.typedObj = new Typed('.typed-words', {
                    strings: [this.words],
                    typeSpeed: this.typeSpeed,
                    cursorChar: '▼'
                })
                this.lasttext = this.words
            }
        }
    },
    watch: {
        words() {
            if (this.typedObj) {
                this.typedObj.destroy()
            }
            this.initTypedJs()
        }
    }
}
</script>

<style>
.typed-cursor {
    position: absolute;
    right: 3rem;
    bottom: 1.5rem;
}
</style>
