
window.onload = function(){
    cc.game.onStart = function(){
        //load resources
        cc.LoaderScene.preload(["HelloWorld.png"], function () {

            cc.director.runScene(new MyScene());
        }, this);
        var designSize = cc.size(480, 800);
        var screenSize = cc.view.getFrameSize();

        if(!cc.sys.isNative && screenSize.height < 800){
            designSize = cc.size(320, 480);
            cc.loader.resPath = "res/Normal";
        }else{
            cc.loader.resPath = "res/HD";
        }
        cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);
        cc.LoaderScene.preload(g_resources, function () {
            cc.director.runScene(new MyScene());
        }, this);
    };
    cc.game.run("gameCanvas");
};

//}