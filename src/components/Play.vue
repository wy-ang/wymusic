<template>
    <transition name="fade" mode="out-in" translate>
        <div id="play" class="play">
            <mt-header :title="songname" fixed>
                <router-link to="/" slot="left">
                    <mt-button icon="back" @click="back(true)"></mt-button>
                </router-link>
                <mt-button icon="more" slot="right">
                    <i class="fa fa-pinterest"></i>
                </mt-button>
            </mt-header>
            <div id="record" class="record">
                <img  :class="[rotate?'go':'aa']" :src="'http://imgcache.qq.com/music/photo/album_300/'+ (albumid%100) +'/300_albumpic_'+ albumid +'_0.jpg'" alt="">
                <span  :class="[rotate?'msk go':'msk aa']"></span>
            </div>
            <div class="operate">
                <i class="icon icon-xin1"></i>
                <i class="icon icon-download"></i>
                <i class="icon icon-pinglun"></i>
                <i class="icon icon-gengduo"></i>
            </div>
            <div class="mt-audio">
                <mt-range
                        v-model="songRange"
                        :value="songRange"
                        :min="0"
                        :max="songMaxRange "
                        :bar-height="1">
                    <div slot="start" class="start-time">{{startTime}}</div>
                    <div slot="end" class="end-time">{{endTime}}</div>
                </mt-range>
            </div>
            <div class="play-btn">
                <div class="mt-switch">
                    <i class="icon icon-xunhuanbofang" v-if="isShow"></i>
                    <i class="icon icon-danquxunhuan" v-else-if="isShow"></i>
                    <i class="icon icon-suijibofang" v-else-if="isShow"></i>
                    <i class="icon icon-shangyige"></i>
                    <i class="icon icon-play1" v-if="isPlay" @click="play()"></i>
                    <i class="icon icon-zanting" v-else="isPlay" @click="pause()"></i>
                    <i class="icon icon-xiayige"></i>
                    <i class="icon icon-play-list"></i>
                </div>
                <audio id="player" autoplay  :src="'http://ws.stream.qqmusic.qq.com/C100'+songmid+'.m4a?fromtag=0&guid=126548448'"></audio>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        //name: 'Play',
        props:{
            songmid:{
                type:String,
                default:''
            },
            songname:{
                type:String,
                default:''
            },
            albumid:{
                type:Number,
                default:''
            },
            currentTime:{
                type:Number,
                default:''
            }
        },
        data() {
            return {
                rotate:false,
                name:'',
                songs:'',
                singer:'',
                isPlay:true,
                isShow:true,
                songRange:0,
                songMaxRange :1,
                startTime:'',
                endTime:'',
                startPlay:'',
            }
        },
        computed:{

        },
        created() {
            let audioItem = document.getElementById('player');
            audioItem.currentTime = this.currentTime;
            this.play();
        },
        methods:{
            back:function (isShow) {
              this.$emit('clickItem',isShow);
            },
            play:function () {
                this.rotate=!this.rotate;
                let audioItem = document.getElementById('player');
                this.isPlay = false;
                player.play();
                clearInterval(this.startPlay);
                this.startPlay = setInterval(() => {
                    this.songRange = Math.floor(audioItem.currentTime * 10 );
                    this.songMaxRange = Math.floor(audioItem.duration * 10 );
                    this.startTime = this.getNewTime(this.songRange / 10);
                    this.endTime = this.getNewTime(this.songMaxRange / 10);
                })
            },
            pause:function () {
                this.isPlay = true;
                player.pause();
                clearInterval(this.startPlay);
            },
            getNewTime(str){
                let minutes = Math.floor(str / 60);
                let seconds = Math.floor(str - 60 * minutes);
                if(minutes < 10){
                    minutes = '0' + minutes;
                }
                if(seconds < 10){
                    seconds = '0' + seconds;
                }
                let time = minutes+':'+seconds;
                return time;
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
    .aa{
        transition: all 10s;
        transform-origin:50% 50%;
        -webkit-animation: rotate 3s linear infinite;
        transform:rotate(0deg);
    }
    .go{
        -webkit-transition-property: -webkit-transform;
        -webkit-transition-duration: 10s;
        -moz-transition-property: -moz-transform;
        -moz-transition-duration: 10s;
        -webkit-animation: rotate 10s linear infinite;
        -moz-animation: rotate 10s linear infinite;
        -o-animation: rotate 10s linear infinite;
        animation: rotate 10s linear infinite;
    }
    @-webkit-keyframes rotate{from{-webkit-transform: rotate(0deg)}
        to{-webkit-transform: rotate(360deg)}
    }
    @-moz-keyframes rotate{from{-moz-transform: rotate(0deg)}
        to{-moz-transform: rotate(359deg)}
    }
    @-o-keyframes rotate{from{-o-transform: rotate(0deg)}
        to{-o-transform: rotate(359deg)}
    }
    @keyframes rotate{from{transform: rotate(0deg)}
        to{transform: rotate(359deg)}
    }
    .operate{
        padding: 15vh 5vw 0;
    }
    i.fa{
        width: 23%;
        text-align: center;
        color: #FFF;
        font-size: 20px;
    }
    i.fa-heart{
        color: #C20C0C;
    }
    .play{
        background: url("../../static/img/bj.jpg");
    }
    .record{
        position: relative;
        padding-top: 30vh;
        margin: -8vh auto 0 auto;
        width: 206px;
        height: 205px;
    }
    .record .msk{
        position: absolute;
        top: 30vh;
        left: 0;
        width: 206px;
        height: 205px;
        background: url("../../static/img/coverall.png") -140px -580px;
    }
    .record img{
        width: 130px;
        height: 130px;
        margin: 38px
    }
    .mint-cell-value span{
        position: absolute;
        left: 0;
        display: inline-block;
        padding: 0 4px;
        width: 30px;
        text-align: center;
        font-size: 14px;
    }
    .mint-tab-item-label img{
        height: 7vh;
        border-radius: 50%;
    }
    .mint-tabbar{
        text-align: left;
    }
    .mint-tab-item .mint-cell{
        background: #eaeaea;
    }
    .mint-tab-item .mint-cell-value span{
        padding: 0 8px;
    }
    .mt-audio,.mt-switch{
        padding: 18px 5px;
        display: inline-block;
        vertical-align: middle;
        width: 97%;
    }
    .mt-audio{
        color: #FFF;
    }
    .mt-switch i.icon{
        width: 18%;
        vertical-align: middle;
    }
    .mt-switch i.icon-play1,.mt-switch i.icon-zanting{
        font-size: 7vh;
    }
    .start-time,.end-time{
        padding: 0 5px;
        display: inline-block;
        font-size: 12px;
    }
    @keyframes bounce-in {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1.5);
        }
        100% {
            transform: scale(1);
        }
    }
</style>
