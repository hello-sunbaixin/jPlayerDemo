### jPlayer插件的使用小结
> jPlayer插件是一个基于jQuery的兼容所有浏览器及所有终端的视频、音频播放插件，根据浏览器自动选取是html5还是flash的播放方式
#### 官网地址：
[官网地址]('http://www.jplayer.cn/')  
这里介绍详尽的api还有各种demo([示例下载地址]('http://www.jplayer.cn/download.html') )

#### 介绍demo的使用
这么多示例，总有一款适合你的需要，那么下面以其中一个demo为例，介绍一下是如何使用的

- 引用jQuery.jPlayer.js,
- 固定的皮肤结构(css可引用固定风格的css文件也可自定义编写)
- 实例化调用，按需配置参数

#### 问题
**1. 兼容性问题**
ie6,7,8下会选取flash播放，经常会出现无法播放的问题，那么可从以下几方面去考虑
1）swfPath的路径是否正确,检查是否上传到服务器， swfPath定义jPlayer 的Jplayer.swf文件的路径，低版本浏览器会使用swf来播放视频，验证方式如下:

 - solution:这个参数默认是"html,flash"调试flash的话 更改成"flash,html",即优先选用flash播放，这样在高级浏览器上就可以方便调试flash
 - 利用$.jPlayer.event.error事件监听错误的说明
 

2）视频格式问题

jPlayer需要区分**音频和视频**。这是因为jPlayer对两种不同的多媒体类型表现稍有不同，如视频必须显示出来。于是，那些容器格式的缩写中包含一个音频缩写和一个视频缩写来使它们对应的资源唯一。例如：

 - MP4文件是一个同时支持音频和视频的容器。M4A是音频MP4, M4V是视频mp4. 
 - webm 文件是一个同时支持音频和视频的容器。webma 是webm 音频格式，webmv是webm视频格式。

如果不做区分,直接像下面这样，将mp4文件的媒体格式定义为mp4，jPlayer无法分别以音频和视频的方式播放它们，最终会出错

 ``
     
     //错误写法
     $(this).jPlayer("setMedia", {
                mp4:"http://www.zhangxinxu.com/study/media/cat.mp4",
               })
     //正确写法
     $(this).jPlayer("setMedia", {
                 m4v:"http://www.zhangxinxu.com/study/media/cat.mp4",
                 webmv: "http://www.jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm"
                     
                })
 ``

3）ie下仍然不好用,尝试在页面引入swfObject.js
HTML插入Flash的全兼容完美解决方案
**2.几个重要的api**

- swfPath: 配置swf文件的路径，兼容低版本时，利用swf文件播放视频
- solution: "html,flash" 定义html和flash解决方案的优先级。默认优先使用html，flash备用
- supplied: 定义提供给jPlayer的视频音频格式。顺序表示优先级，左边的格式优先级最高
- size: 设置媒体的宽高
- verticalVolume:是否竖向展示音量键 默认是横向音量键
- loop: 是否循环播放视频
- preload: "none",
- useStateClassSkin:是否使用默认的皮肤类名，注释后 发现视频不能中途暂停
- autoBlur: false,
- smoothPlayBar: true,平滑过渡播放条。将值设置为false，可以发现进度条是点击时，没有了过渡的过程，是直接到所点位置，体验并不好
- keyEnabled: 是否可以通过键盘控制媒体的操作
- remainingDuration: 是否显示剩余播放时间,如果为false 那么duration 那个dom显示的是【3:07】,如果为true 显示的为【-3:07】
- toggleDuration:允许点击剩余时间的dom 时切换剩余播放时间的方式


**3.几种状态的监听**

$.jPlayer.event.waiting •当多媒体处于等待状态触发
$.jPlayer.event.playing •当多媒体处于播放状态触发
$.jPlayer.event.ended •当多媒体播放结束时触发
$.jPlayer.event.error •当多媒体出错触发
$.jPlayer.event.play •当多媒体被播放时触发。
$.jPlayer.event.pause • 当多媒体被暂停时触发。
