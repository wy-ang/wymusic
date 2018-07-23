<template>
    <div>
        <div id="newList" class="new-list" v-if="showChild">
            <mt-header :title="name" fixed>
                <router-link to="/" slot="left">
                    <mt-button icon="back"></mt-button>
                </router-link>
                <mt-button icon="more" slot="right"></mt-button>
            </mt-header>
            <div class="song-list" v-for="(item,index) in songs"  @click="getSongsInfo(index)">
                <mt-cell :title="item.data.songname" :label="item.data.singer[0].name + '-' + item.data.albumdesc">
                    <i class="icon icon-gengduo"></i>
                    <span>{{index+1}}</span>
                </mt-cell>
            </div>
            <transition name="bounce">
                <mt-tabbar v-if="isShow" fixed >
                    <mt-tab-item>
                        <div class="mt-img" @click="toPlay()">
                            <img :src="'http://imgcache.qq.com/music/photo/album_300/'+ (albumid%100) +'/300_albumpic_'+ albumid +'_0.jpg'" alt="">
                        </div>
                        <div class="mt-audio">
                            <div class="mt-songs">{{songname}}-{{singer}}</div>
                            <div class="mt-times">
                                <div slot="start" class="start-time">{{startTime}}/{{endTime}}</div>
                            </div>
                            <mt-range
                                    v-model="songRange"
                                    :value="songRange"
                                    :min="0"
                                    :max="songMaxRange "
                                    :bar-height="1">
                            </mt-range>
                        </div>
                        <div class="mt-switch">
                            <i class="icon icon-play1" v-if="isPlay" @click="play()"></i>
                            <i class="icon icon-zanting" v-else="isPlay" @click="pause()"></i>
                        </div>
                        <div class="mt-list">
                            <i class="icon icon-play-list"></i>
                        </div>
                        <audio id="player" autoplay  :src="'http://ws.stream.qqmusic.qq.com/C100'+songmid+'.m4a?fromtag=0&guid=126548448'"></audio>
                    </mt-tab-item>
                </mt-tabbar>
            </transition>
        </div>
        <Play
            v-else="showChild"
            @clickItem="backList"
            :songmid="songmid"
            :songname="songname"
            :albumid="albumid"
            :currentTime="currentTime"
        ></Play>
    </div>
</template>

<script>
    import Play from './Play'
    export default {
        name: 'NewList',
        components:{
            Play
        },
        data() {
            return {
                name:'',
                songs:'',
                songmid:'',
                songname:'',
                singer:'',
                albumid:'',
                isPlay:true,
                isShow:false,
                showChild:true,
                songRange:0,
                songMaxRange :1,
                startTime:'',
                endTime:'',
                startPlay:'',
                currentTime:''
            }
        },
        computed:{
            /*path :function () {
            //TODO 计算属性不能循环输出？
                this.songs.forEach(function (item,index) {
                    let albumid = item.data.albumid;
                    return 'http://imgcache.qq.com/music/photo/album_300/'+ (albumid%100) +'/300_albumpic_'+ albumid +'_0.jpg'
                })
            }*/
        },
        created() {
            this.$http.get('/apis/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8¬ice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=36&_=1520777874472').then((res) => {
                this.songs = res.data.songlist
                this.name = res.data.topinfo.ListName;
            }).catch((err)=>{
                console.log(err)
            })
        },
        methods:{
            toPlay:function () {
                this.showChild = false;
            },
            backList:function (item) {
                this.showChild = item;
            },
            //获取歌曲信息
            getSongsInfo:function (index) {
                this.isShow = true;
                this.songs.forEach((n,i) => {
                    if(i==index){
                        this.albumid = n.data.albumid;
                        this.songmid = n.data.songmid;
                        this.songname = n.data.songname;
                        this.singer = n.data.singer[0].name;
                    }
                });
                this.$nextTick(()=>{
                    this.play();
                });
            },
            play:function () {
                let audioItem = document.getElementById('player');
                this.isPlay = false;
                player.play();
                clearInterval(this.startPlay);
                this.startPlay = setInterval(() => {
                    this.currentTime = audioItem.currentTime;
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
    .new-list{
        padding: 40px 0 55px;
    }
    .song-list{
        border-bottom: 1px solid #eaeaea;
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
    .mint-tab-item{
        padding: 2px 0;
    }
    .mint-tab-item .mint-cell-value span{
        padding: 0 8px;
    }
    .mt-audio,.mt-img,.mt-switch,.mt-list,.mt-songs,.mt-times{
        padding: 5px;
        display: inline-block;
        vertical-align: middle;
    }
    .mt-songs,.mt-times{
        margin: 0;
        padding: 5px 0;
    }
    .mt-songs{
        padding-right: 1vh;
        width: 17vh;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .mt-audio{
        width: 56%;
    }
    .mint-tab-item-label i.icon{
        color: #C20C0C;
    }
    i.icon-gengduo{
        color: #999;
    }
    .start-time{
        display: inline-block;
    }
    .bounce-enter-active {
        animation: bounce-in .5s;
    }
    .bounce-leave-active {
        animation: bounce-in .5s reverse;
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
