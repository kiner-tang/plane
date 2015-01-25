文件夹 PATH 列表
卷序列号为 289C-F4FA
C:\WAMP\WWW\COCOS2D-HTML5TEST\GAME-TEMPLATE		--cocos2d-js游戏模版
│  build.xml
│  READ.MD										--本文档，项目结构描述文档
│  
└─HelloWorld					 				--游戏主体目录
    │  index.html								--游戏引入页，是游戏的入口
    │  project.json								--项目信息，包括是否为debug模式、画布的id等
    │  
    ├─res										--资源库，存放图片等资源
    │  │  favicon.ico							--网站图标
    │  │  
    │  ├─HD										--高清图片资源库
    │  │      009.jpeg
    │  │      bullet.png
    │  │      CloseNormal.png
    │  │      CloseSelected.png
    │  │      HelloWorld.jpg
    │  │      plane.png
    │  │      target.png
    │  │      
    │  └─Normal									--普通图片资源库
    │          009.jpeg
    │          bullet.png
    │          CloseNormal.png
    │          CloseSelected.png
    │          HelloWorld.jpg
    │          plane.png
    │          target.png
    │          
    └─src										--源码库
        ├─app									--存放游戏逻辑
        │      myApp.js
        │      
        └─lib									--支持文件库，包库引擎、和入口js等
                cocos2d-js-v3.2-lite.js			--cocos-2d-js引擎文件
                lib.js							--游戏需加载的js列表
                main.js							--游戏入口文件，配置了一些游戏的基本信息，如高分辨率与低分辨率的具体范围、启动场景等
                resource.js						--资源加载文件，将res文件夹中的资源加载进来，使用时只需使用文件名，程序便可自动根据分辨率选择高清图还是普通图
                
