<template>
    <div class='main-div'>
        <!-- <div > -->
        <div class='main-game' v-if='running' :style="{ backgroundImage: 'url(' + bg + ')' }"
             style='width: 100%;height: 100%;'
             @click='nextLine()'>
            <p>{{ count }}</p>
            <text-box :text='text' />
        </div>
        <div v-if='!running' style='width: 100%;height: 100%;text-align:center;line-height:400px;' @click='start()'>
            点击继续
        </div>
    </div>

</template>

<script lang='ts'>
import TextBox from './components/textbox/TextBox.vue'
import { Howl } from 'howler'

export default {
    name: 'home',
    components: {
        TextBox
    },
    data() {
        return {
            textList: '',
            text: '',
            count: 0,
            bg: '/e/b.jpg.webp',
            ignoreClick: false,
            keep: false,
            sound: {},
            running: false
        }
    },
    async mounted() {
        !(function resizeScale(id) {
            window.addEventListener(
                'resize',
                function() {
                    setScale()
                },
                false
            )
            setScale()

            function setScale() {
                const view = document.getElementById(id)
                view.style.position = 'absolute'
                // dom.view.style.width = contentW + "px";
                // dom.view.style.height = contentH + "px";
                view.style.backfaceVisibility = 'hidden'
                view.style.transformOrigin = 'left top'
                const ratio = Math.min(window.innerWidth / 800, window.innerHeight / 600)
                view.style.transform = `scale(${ratio})`
                view.style.left = `${(window.innerWidth - 800 * ratio) / 2}px`
                view.style.top = `${(window.innerHeight - 600 * ratio) / 2}px`
            }

            return false
        })('app')
        this.textList = (await (await fetch('/script/1.txt')).text()).split('\n')

        // this.nextLine()
    },
    methods: {
        clearTimer() {
            let i = setTimeout(() => this.nextLine(), 100000)
            while (i >= 0) {
                clearTimeout(i)
                --i
            }
        },
        changeText(str) {
            this.text = str
        },
        playMusic(ch) {

        },
        stopMusic() {

        },
        forceWait(t) {
            this.ignoreClick = true
            setTimeout(() => {
                this.ignoreClick = false
                this.nextLine()
            }, t)
        },
        setBackground(img: string) {
            this.bg = img
        },
        start() {
            this.running = true
            this.count = this.$store.state.nowLineNumber
            this.nextLine()
        },
        nextLine() {
            let publicPath = ''
            if (this.ignoreClick) return
            this.clearTimer()
            this.$store.commit('setLine', this.count)
            while (true) {
                ++this.count
                let nowText = this.textList[this.count] as string
                if (nowText.replace(/(^s*)|(s*$)/g, '').length == 0) {
                    continue
                }
                console.log(nowText)
                if (nowText.startsWith(';')) {

                } else if (nowText.startsWith('mov')) {

                } else if (nowText.startsWith('bg')) {
                    this.setBackground(publicPath + /[0-9a-z_\\]+\.[a-z]+/.exec(nowText).toString().replace('\\', '\\\\') + '.webp')
                    console.log(this.bg)
                    setTimeout(() => this.nextLine(), 1000)
                    return
                } else if (nowText.startsWith('wait') || nowText.startsWith('!w')) {
                    this.forceWait(parseInt(/[0-9]+/.exec(nowText).toString()))
                    return
                } else if (
                    nowText.startsWith('!') ||
                    nowText.startsWith('setwindow') ||
                    nowText.startsWith('erasetextwindow')
                ) {

                } else if (nowText.startsWith('mp3loop')) {
                    this.sound['mp3'] = new Howl({
                        loop: true,
                        src: [
                            publicPath +
                            /"(.*?)"/.exec(nowText)[1]
                        ]
                    })
                    this.sound['mp3'].play()
                } else if (nowText.startsWith('mp3fadeout')) {
                    if (this.sound['mp3']) this.sound['mp3'].stop()
                } else if (nowText.startsWith('stop')) {
                    for (let i of Object.keys(this.sound)) {
                        this.sound[i].stop()
                    }
                    console.log('stop music')
                } else if (nowText.startsWith('dwavestop')) {
                    if (this.sound && this.sound[/[0-9]+/.exec(nowText).toString()])
                        this.sound[/[0-9]+/.exec(nowText).toString()].stop()
                } else if (nowText.startsWith('dwave')) {
                    let ch = /([0-9]+),"(.*?)"/.exec(nowText)[1].toString()
                    let fi = /([0-9]+),"(.*?)"/.exec(nowText)[2]
                    this.sound[ch] = new Howl({
                        src: ['\\' + fi]
                    })
                    this.sound[ch].play()
                } else {
                    if (this.keep) {
                        nowText = '\\' + nowText
                    }
                    nowText = nowText.replace('@', '\n')
                    if (nowText.endsWith('\\')) {
                        this.changeText(nowText.substring(0, nowText.length - 1))
                        this.keep = true
                    }
                        // else if (nowText.endsWith('@')){
                        //   this.changeText(nowText.substring(0,nowText.length-1)+"\n");
                        //   this.keep=false;
                    // }
                    else {
                        this.changeText(nowText)
                        this.keep = false
                    }
                    return
                }
            }
        }
    }
}
</script>

<style scoped>
.main-div {
    background: gray;
    width: 800px;
    height: 600px;
    backface-visibility: hidden;
    transform-origin: left top;
    cursor: inherit;
    transition: all 1s ease-in-out;
}

.main-game {
    background: gray;
    width: 800px;
    height: 600px;
    backface-visibility: hidden;
    transform-origin: left top;
    cursor: inherit;
    transition: all 1s ease-in-out;
}
</style>
