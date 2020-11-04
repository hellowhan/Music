(function($, player) {
    function MusicPlayer(dom) {
        this.wrap = dom; //播放器的容器(用于加载listControl模块)
        this.dataList = [] //存储请求到的数据
        this.indexObj = null; // 索引值对象(用于切歌)
        this.rotateTimer = null //旋转唱片的定时器
        this.curIndex = 0; //当前播放歌曲的索引值
        this.list = null; //列表切歌对象(在listPlay)

    }

    MusicPlayer.prototype = {
        init() { //初始化
            this.getDom() //获取元素
            this.getData("../mock/data.json") //请求数据

        },
        getDom() { //获取页面里的元素
            this.record = document.querySelector('.songImg img') //旋转图片
            this.controlBtns = document.querySelectorAll('.control li') //底部导航里的按钮

        },
        getData(url) {
            var This = this;
            $.ajax({
                url: url,
                method: 'get',
                success: function(data) {
                    This.dataList = data // 存储过来 的数据

                    This.listPlay(); //

                    This.indexObj = new player.controlIndex(data.length) //给索引值对象赋值
                    This.loadMusic(This.indexObj.index); // 加载音乐
                    This.musicControl() // 添加音乐操作功能

                },
                error: function() {
                    console.log('数据请求失败');
                }
            })
        },
        loadMusic(index) { //加载音乐
            player.render(this.dataList[index]); //渲染图片，歌曲信息

            player.music.load(this.dataList[index].audioSrc)



            //播放音乐(状态为play才播放)
            if (player.music.status == 'play') {
                player.music.play()
                this.controlBtns[2].className = 'playing'; //按钮变为播放状态
                this.imgRotate(0); //切歌旋转
            }

            //改变列表的歌曲的选中状态
            this.list.changeSelect(index);

            this.curIndex = index;

        },

        musicControl() { //控制音乐
            var This = this
                //上一首
            this.controlBtns[1].addEventListener('touchend', function() {
                player.music.status = 'play';

                console.log(player.music.status);
                //This.now--;
                This.loadMusic(This.indexObj.prev());
            });

            //播放、暂停
            this.controlBtns[2].addEventListener('touchend', function() {
                if (player.music.status == 'play') { //状态为播放
                    player.music.pause();
                    this.className = ''; //按钮变成暂停状态
                    This.imgStop(); //停止旋转

                } else {
                    player.music.play();
                    this.className = 'playing';

                    //第二次播放的时候需要加上上一次选择的角度，但是第一次的时候是没有的，取不到，所以做了一个容错的处理
                    var deg = This.record.dataset.rotate || 0;
                    This.imgRotate(deg); //旋转图片
                }
            })


            //下一首
            this.controlBtns[3].addEventListener('touchend', function() {
                player.music.status = 'play';



                // This.now--
                This.loadMusic(This.indexObj.next());
            });

        },

        imgRotate(deg) { //旋转唱片
            var This = this
            clearInterval(this.rotateTimer)

            this.rotateTimer = setInterval(function() {
                deg = +deg + 0.2; //前面的家伙是把字符串转数字

                This.record.style.transform = 'rotate(' + deg + 'deg)'
                This.record.dataset.rotate = deg; // 把旋转的角度存到标签身上，为了暂停后继续播放能取到
            }, 1000 / 60)

        },
        imgStop() { // 停止图片旋转
            clearInterval(this.rotateTimer)
        },
        listPlay() { //列表切歌
            var This = this;
            this.list = player.listControl(this.dataList, this.wrap) //把listControl 对象赋值给this.list


            //列表按钮添加点击事件
            this.controlBtns[4].addEventListener('touchend', function() {
                This.list.slideUp()
            });

            //歌曲列表添加事件
            this.list.musicList.forEach(function(item, index) {
                item.addEventListener('touchend', function() {
                    //如果点击的是当前的那首歌，不管它是播放还是暂停都无效
                    if (This.curIndex == index) {
                        return;
                    }

                    player.music.status = 'play'; //歌曲要变成播放状态
                    This.indexObj.index = index; //索引值对象身上的当前索引值要更新
                    This.loadMusic(index); //加载点击对应的索引值的那首歌曲
                    This.list.slideDown(); //列表消失
                })
            })
        }



    }

    var musicPlayer = new MusicPlayer(document.getElementById('wrap'));
    musicPlayer.init()



})(window.Zepto, window.player)