var MyLayer = cc.LayerColor.extend({
    plane: null,//飞机
    _bullets: [],//子弹
    _targets: [],//目标(苹果）
    /**
     * 在构造方法中为布局添加触摸监听事件，这样才可以实现对屏幕的触摸操作
     */
    ctor: function () {
        this._super();
        var touchListener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        };
        cc.eventManager.addListener(touchListener, this);
        this.m_touchListener = touchListener;


    },
    /**
     * 初始化
     * @returns {boolean}
     */
    init: function () {
        // 1. super init first
        // 必须调用父类init()方法，很多bug都是由于没有调用父类init()方法造成的
        this._super();
        var size = cc.director.getWinSize();//获取画布的大小，是一个对象，可通过size.width和size.hight分别获得或不得宽高

        ////创建一个文字标签，下面三个参数分别是 需要显示的文字，字体样式，字体大小
        //this.helloLabel = new cc.LabelTTF("Hello World!!", "Impact", 58);
        ////设置文字位置
        //this.helloLabel.setPosition(size.width / 2, size.height - 40);
        //
        //this.addChild(this.helloLabel, 5);
        //
        //this.chinese = new cc.LabelTTF("你好","Impact",48);
        ////console.log(cc.color);
        //this.chinese.setFontFillColor(cc.color(176,224,230)); //注意color要小写
        //this.chinese.setPosition((size.width/2)+80,(size.height/2)+80);//注意，这里的坐标方向是向上为y轴正方向，向右为x轴正方向
        //this.addChild(this.chinese,6);
        //
        //背景图片
        this.sprite = new cc.Sprite(s_BackgroundImage);
        this.sprite.setAnchorPoint(0.5, 0.5);//设置背景图定位点的坐标，0,0为画布左上角，默认为0.5,0.5,是画布的几何中心
        this.sprite.setPosition(size.width / 2, (size.height / 2));//设定背景图的位置，根据定位点坐标
        //this.sprite.setScale(size.height / this.sprite.getContentSize().height);//将背景缩放至画布的大小
        this.sprite.setScale(1);//将背景图拉伸铺满画布
        this.addChild(this.sprite, 0);//将元素添加进入场景中，其中第一个参数为要添加的元素，第二个参数是元素所在的图层，即z轴

        // 获取屏幕坐标原点
        var origin = cc.director.getVisibleOrigin();

        // 创建一个飞机，游戏中大部分物体都能使用cc.Sprite表示
        this.plane = new cc.Sprite(s_Plane);

        this.plane.setAnchorPoint(0, 0);//设置背景图定位点的坐标，0,0为画布左上角，默认为0.5,0.5,是画布的几何中心

        this.plane.setScale(1);//将背景缩放至画布的大小

        // 将飞机设置在屏幕底部，居中的位置
        this.plane.setPosition((size.width / 2) - 100, 0);
        this.plane.count = 0;

        // 图片的锚点在矩形的中心点，设置的就是这个点的位置
        //this.plane.setPosition(cc.p(origin.x + size/2 , origin.y + this.plane.getContentSize().height/2));

        this.addChild(this.plane, 9);


        //开始游戏
        this.startGame();

        //console.log(this);
        // 将层设置为可触摸
        //this.plane.setTouchEnabled(true);
        //console.log(this);
        //this.plane.moveTo.create(4, cc.p(this.plane.x,-30));
        //console.log(this.plane);

        return true;


    },
    /**
     * 游戏开始
     */
    startGame: function () {

        this.score = 0;
        this.score4pre = 5;

        this.showScore(this.score);

        this.removeChild(this.gameover);
        this.removeChild(this.restart);

        // 设置定时器，定时器每隔0.2秒调用一次addBullet方法
        this.bulletSchedule = this.schedule(this.addBullet, 0.2);
        // 添加增加敌机的定时器
        this.targetSchudle = this.schedule(this.addTarget, 0.4);
        // 添加碰撞检测，不加第二个参数，默认为每帧执行一次
        this.updateGameSchedule = this.schedule(this.updateGame, 0.1);

    },
    /**
     * 结束游戏
     */
    stopGame: function () {

        var _this = this;
        var winSize = cc.director.getWinSize();
        //清除定时器
        this.unschedule(this.addBullet);
        this.unschedule(this.addTarget);
        this.unschedule(this.updateGame);

        this._bullets = [];
        this._targets = [];

        //创建游戏结束提示语
        this.gameover = new cc.LabelTTF("GAME OVER!!!!", "Impact", 58);
        this.gameover.setAnchorPoint(0, 0);//设置背景图定位点的坐标，0,0为画布左下角，默认为0.5,0.5,是画布的几何中心
        this.gameover.setFontFillColor(cc.color(255, 99, 71));
        this.restart = new cc.Sprite(s_restart);
        this.restart.setAnchorPoint(0, 0);//设置背景图定位点的坐标，0,0为画布左下角，默认为0.5,0.5,是画布的几何中心

        var restartListener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function () {
                _this.startGame();
            }
        };
        cc.eventManager.addListener(restartListener, this.restart);

        //显示游戏结束结束语
        var actionTo = cc.MoveTo.create(1, cc.p((winSize.width - this.gameover.width) / 2, (winSize.height - this.gameover.height) / 2));
        this.gameover.runAction(actionTo);
        var actionTo2 = cc.MoveTo.create(1, cc.p((winSize.width - this.restart.width) / 2, ((winSize.height - this.restart.height) / 2) - (this.restart.height + 20)));
        this.restart.runAction(actionTo2);
        //将游戏结束提示语添加进场景中
        this.addChild(this.gameover, 99);
        this.addChild(this.restart, 99);
    },
    /**
     * 显示分数
     * @param score
     */
    showScore: function (score) {
        var winSize = cc.director.getWinSize();
        if (this.scoreLabel) {
            this.scoreLabel.setString(score + "分");
        } else {
            this.scoreLabel = new cc.LabelTTF(score + "分", "Impact", 20);
            this.scoreLabel.setAnchorPoint(0, 0);//设置背景图定位点的坐标，0,0为画布左下角，默认为0.5,0.5,是画布的几何中心
            this.scoreLabel.setFontFillColor(cc.color(255, 255, 255));
            this.scoreLabel.setPosition((winSize.width - this.scoreLabel.width) - 30, (winSize.height - this.scoreLabel.height - 20));
            this.addChild(this.scoreLabel, 99);
        }
    },
    /**
     * 新增敌机
     */
    addTarget: function () {
        //获取屏幕尺寸
        var winSize = cc.director.getWinSize();
        //创建敌机
        var target = new cc.Sprite(s_target);
        //为敌机设置标签方便之后用于判断对象是否为敌机
        target.setTag(1);


        // 设置敌机随机出现的X轴的值
        var minX = target.getContentSize().width / 2;
        var maxX = winSize.width - target.getContentSize().width / 2;
        var rangeX = maxX - minX;
        var actualX = Math.random() * rangeX + minX;
        // 在一定范围内随机敌机的速度
        var minDuration = 2.5;
        var maxDuration = 4;
        var rangeDuration = maxDuration - minDuration;
        var actualDuration = Math.random() * rangeDuration + minDuration;

        //设置敌机坐标
        target.setPosition(cc.p(actualX, winSize.height + target.getContentSize().height / 2));

        //为敌机添加动画效果，其中actualDuration为运动到目标所需要的时间，第二个参数为目标点坐标
        var actionMove = cc.MoveTo.create(actualDuration, cc.p(actualX, 0 - target.getContentSize().height));

        //当敌机与飞机碰撞时执行
        var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinished, this);

        //运行动画
        target.runAction(cc.Sequence.create(actionMove, actionMoveDone));

        this.addChild(target, 1);
        //将敌机加入敌机数组中，方便之后的删除等操作
        this._targets.push(target);
    },
    /**
     * 发射子弹
     */
    addBullet: function () {

        //获取飞机对象
        var plane = this.plane;

        var winSize = cc.director.getWinSize();
        var origin = cc.director.getVisibleOrigin();
        // 获得飞机的位置
        var planePosition = plane.getPosition();
        // 子弹穿越屏幕要花费的秒数
        var bulletDuration = 1;

        // 创建一个子弹
        var bullet = new cc.Sprite(s_bullet);

        // 根据飞机的位置，初始化子弹的位置
        bullet.setPosition(cc.p(planePosition.x + plane.width / 2, planePosition.y + bullet.getContentSize().height + plane.height / 2));

        // 一个移动的动作
        // 第一个参数为移动到目标所需要花费的秒数，为了保持速度不变，需要按移动的距离与屏幕高度按比例计算出花费的秒数
        var actionMove = cc.MoveTo.create(bulletDuration * ((winSize.height - planePosition.y - bullet.getContentSize().height / 2) / winSize.height),
            cc.p(planePosition.x + plane.width / 2,
                origin.y + winSize.height + bullet.getContentSize().height / 2));
        // 设置一个回调函数，移动完毕后回调spriteMoveFinished（）方法。
        var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinished, this);
        // 让子弹执行动作
        bullet.runAction(cc.Sequence.create(actionMove, actionMoveDone));
        // 为子弹设置标签，以后可以根据这个标签判断是否这个元素为子弹
        bullet.setTag(6);

        this._bullets.push(bullet);
        this.addChild(bullet, 0);
    },
    /**
     * 触摸监听事件:手指移动
     * @param touch
     * @param event
     * @returns {boolean}
     */
    onTouchMoved: function (touch, event) {
        //获取画布信息
        var can = event._currentTarget;
        //获取飞机对象
        var plane = can.plane;
        //获取当前坐标
        var location = touch.getLocation();
        //console.log(plane.width);
        //设置飞机左边与触摸点坐标重合
        location.x = location.x - (plane.width / 2);
        location.y = location.y - (plane.height / 2);
        //console.log(size);
        //边界检测
        if (location.x < 0) {
            location.x = 0;
        } else if (location.x > can.width - plane.width) {
            location.x = can.width - plane.width;
        }
        if (location.y < 0) {
            location.y = 0;
        } else if (location.y > can.height - plane.height) {
            location.y = can.height - plane.height;
        }
        plane.setPosition(location);
    },

    /**
     * 触摸监听事件:结束触摸
     * @param touch
     * @param event
     * @returns {boolean}
     */
    onTouchEnded: function (touch, event) {

    },
    /**
     * 触摸监听事件:开始触摸
     * @param touch
     * @param event
     * @returns {boolean}
     */
    onTouchBegan: function (touch, event) {
        //console.log(event._currentTarget);
        return true;//注意，此处必须返回true才能继续执行onTouchMoved，onTouchEndeds事件
    },
    /**
     * 精灵移动结束回调
     * @param sprite
     */
    spriteMoveFinished: function (sprite) {
        // 将元素移除出Layer
        this.removeChild(sprite, true);
        if (sprite.getTag() == 1) {
            // 把目标从数组中移除
            var index = this._targets.indexOf(sprite);
            if (index > -1) {
                this._targets.splice(index, 1);
            }
        } else if (sprite.getTag() == 6) {
            // 把子弹从数组中移除
            var index = this._bullets.indexOf(sprite);
            if (index > -1) {
                this._targets.splice(index, 1);
                this._bullets.splice(index, 1);
            }
        }
    },
    /**
     * 碰撞检测工具
     */
    CollisionHelper: {
        isCollided: function (ccA, ccB) {
            var ax = ccA.x, ay = ccA.y, bx = ccB.x, by = ccB.y;
            /*if (Math.abs(ax - bx) > 5|| Math.abs(ay - by) >5) {
             return false;
             }*/
            var aRect = this.MakeCollideRect(ccA, ccA.width, ccA.height);
            var bRect = this.MakeCollideRect(ccB, ccB.width, ccB.height);
            return cc.rectIntersectsRect(aRect, bRect);
        },
        MakeCollideRect: function (ccA, w, h) {
            //console.log(w + "  ->  " + h);
            return cc.rect(ccA.x - 3, ccA.y - 3, w + 20, h + 20);
        }
    },
    /**
     * 碰撞检测，更新游戏
     */
    updateGame: function () {

        var _target2Deletes = [];

        for (var i = 0; i < this._targets.length; i++) {

            var target = this._targets[i];

            var _bullet2Deletes = [];

            if (this.CollisionHelper.isCollided(target, this.plane)) {
                this.stopGame();
                this.plane.count++;
                console.log(('被击中啦,总共被击中:' + this.plane.count + '次'));
            }

            for (var j = 0; j < this._bullets.length; j++) {

                var bullet = this._bullets[j];


                if (this.CollisionHelper.isCollided(target, bullet)) {

                    _bullet2Deletes.push(bullet);
                    _target2Deletes.push(target);

                }

            }

            for (var j = 0; j < _bullet2Deletes.length; j++) {

                var bullet = _bullet2Deletes[j];
                var index = this._bullets.indexOf(bullet);

                if (index > -1) {

                    this._bullets.splice(index, 1);

                }
                //this.removeChild(bullet);

            }
            _bullet2Deletes = [];

        }

        this.score += this.score4pre*_target2Deletes.length;
        this.showScore(this.score);

        if (_target2Deletes.length > 0) {
            for (var j = 0; j < _target2Deletes.length; j++) {

                var target = _target2Deletes[j];
                var index = this._bullets.indexOf(target);

                if (index > -1) {

                    this._targets.splice(index, 1);

                }
                this.removeChild(target, true);

            }
        }
        _target2Deletes = [];

    }
});

/**
 * 创建场景
 * @type {Function}
 */
var MyScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
