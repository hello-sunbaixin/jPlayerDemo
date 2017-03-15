

function VideoPlayer(b) {
    this.op = $.extend({
        videoPath: "http://www.zhangxinxu.com/study/media/cat.mp4",
        // supplied: "webmv, ogv, m4v",
           supplied: "webmv,m4v",
        size: {
            width: "100%",
            height: "350px"
        },
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: true,
        toggleDuration: true
    }, b);
    this.dom = {
            videoBox: $(this.op.container),
            videoWin: $(".jp-jplayer"),
            playBtn: $(".jp-play"),
            stopBtn: $(".jp-stop"),
            repeatBtn: $(".jp-repeat"),
            toggleBtn: $("[toggle]"),
            volumnMax: $(".jp-volume-max"),
            volumnBar: $(".jp-volume-bar"),
            stateDialog: $(".jp-state-dialog"),
            networkDialog: $(".jp-networkError-dialog"),
            closeBtn: $(".jp-btn-close"),
            reloadBtn: $(".jp-btn-reload"),
            tipsTitle: $(".jp-state-text"),
            tipsBtn: $(".jp-state-button")
        },
        this.state = {
            waiting: undefined,
            reloadTimes: 0,
            errored: false,
            stalled: false,
            finished: false
        };
    this.tips = {
        errored: {
            title: "视频信息获取失败，请刷新重试",
            btn: "刷新"
        },
        stalled: {
            title: "视频加载中…",
            btn: false
        },
        finished: {
            title: "视频播放完毕",
            btn: "重新播放"
        }
    };
    this.init();
    this.acts()
}
VideoPlayer.prototype = {
    init: function() {
        var b = this;
        b.dom.videoWin.jPlayer({
            ready: function() {
                $(this).jPlayer("setMedia", {
                    m4v: b.op.videoPath
                     // m4v:"http://www.zhangxinxu.com/study/media/cat.mp4"
                     // webmv: "http://www.jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm"
                     // mp4: b.op.videoPath
                })
            },
            error: function(c) {
                b.handleError(c)
            },
            swfPath: b.op.swfPath,
            supplied: b.op.supplied,
            solution: b.op.solution,
            size: b.op.size,
            preload: "none",
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true
        })
    },
    acts: function() {
        var b = this;
        b.dom.volumnMax.click(function(c) {
            $(this).addClass("active")
        });
        b.dom.repeatBtn.click(function() {
            $(this).toggleClass("active")
        });
        b.dom.volumnBar.click(function() {
            b.dom.volumnMax.removeClass("active")
        });
        b.dom.videoWin.on($.jPlayer.event.waiting, function(c) {
            b.state.stalled = true;
            b.state.waiting = setTimeout(function() {
                if (b.state.stalled && !b.state.errored) {
                    b.showTips(b.tips.stalled)
                }
            }, 3000)
        });
        b.dom.videoWin.on($.jPlayer.event.playing, function(c) {
            b.state.finished = false;
            b.state.errored = false;
            b.state.stalled = false;
            clearTimeout(b.state.waiting);
            b.hideTips()
        });
        b.dom.videoWin.on($.jPlayer.event.ended, function(c) {
            b.state.finished = true;
            b.showTips(b.tips.finished)
        });
        b.dom.videoWin.on($.jPlayer.event.error, function(c) {
            b.state.errored = true;
            b.showTips(b.tips.errored)
        });
        b.dom.closeBtn.click(function() {
            b.dom.stateDialog.hide()
        });
        b.dom.reloadBtn.click(function() {
            if (b.state.errored) {
                if (++b.state.reloadTimes >= 5) {
                    location.reload()
                } else {
                    b.play()
                }
            } else {
                if (b.state.finished) {
                    b.hideTips();
                    b.play()
                }
            }
        })
    },
    show: function(b) {
        var c = this;
        b ? c.dom.videoBox.show() : c.dom.videoBox.hide()
    },
    showTips: function(e) {
        var c = this;
        var d = e.title;
        var b = e.btn;
        if (d) {
            c.dom.tipsTitle.html(d)
        }
        if (b) {
            c.dom.tipsBtn.show();
            c.dom.tipsBtn.html(b)
        }
        if (b === false) {
            c.dom.tipsBtn.hide()
        }
        c.dom.networkDialog.show()
    },
    hideTips: function(c, b) {
        this.dom.networkDialog.hide()
    },
    play: function(c) {
        var b = this;
        switch (c) {
            case "play":
                b.dom.videoWin.jPlayer("play");
                break;
            case "stop":
                b.dom.videoWin.jPlayer("stop");
                break;
            case "repeat":
                b.dom.repeatBtn.trigger("click");
                break;
            default:
                b.dom.videoWin.jPlayer("play")
        }
    },
    handleError: function(b) {}
}
$(document).ready(function() {
    window.videoPlayerEnter = new VideoPlayer({
        container: '#jp_container_1',
        // videoPath: "http://kaleido-10011010.anjukestatic.com/kaleido/828478446521839616.MP4.f30.mp4?sign=g93oKpxiypUg1U5BT8U94in1VJJhPTEwMDExMDEwJms9QUtJRDV4UDhscUtoSVd4eUpHbnJXd3NiY0xTRzJZRmJ2Zlp4JmU9MTQ4NzEzMDg3NCZ0PTE0ODcxMzAyNzQmcj0xNjU5NTM2NjY2JmY9JmI9a2FsZWlkbw==",
        // videoPath:"http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v",
        videoPath: "http://www.zhangxinxu.com/study/media/cat.mp4",
        swfPath: './jplayer',
        solution: "html,flash",
        size: {
            width: "640px",
            height: "360px",
            cssClass: "jp-video-360p"
        }
    });
    function videoToggle(h) {
            var g = this;
            //       videoPlayerEnter.show(true);
            // setTimeout(function() {
            //     videoPlayerEnter.play("play")
            // }, 200)

            if (!window.videoPlayerEnter) {
                return
            }
            if (h == "on") {
                // g.item.videoImg.find("").hide();

                videoPlayerEnter.show(true);
                setTimeout(function() {
                    videoPlayerEnter.play("play")
                }, 200)
            } else {
                setTimeout(function() {
                    // g.item.videoImg.find("img,.video-player").show();
                    // $('#jPlayerBtn').hide();
                    videoPlayerEnter.show(false);//控制播放资源的隐藏或者显示
                    videoPlayerEnter.play("stop")
                }, 200)
            }

        }
    $('.testPlayBtn').on("click", function() {
       videoToggle('on');
    })
    $('.testPauseBtn').on("click", function() {
       videoToggle();
    })

});
