//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.typerEffect = function (obj, content, interval) {
        if (content === void 0) { content = ""; }
        if (interval === void 0) { interval = 200; }
        var strArr = content.split("");
        var len = strArr.length;
        for (var i = 0; i < len; i++) {
            egret.setTimeout(function () {
                obj.appendText(strArr[Number(this)]);
            }, i, interval * i);
        }
    };
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var _this = this;
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        ///P1-P2容器声明，位置赋值
        var p1Container = new egret.DisplayObjectContainer();
        var p2Container = new egret.DisplayObjectContainer();
        this.addChild(p1Container);
        p1Container.width = stageW;
        p1Container.height = stageH;
        this.addChild(p2Container);
        p2Container.width = stageW;
        p2Container.height = stageH;
        p2Container.y = stageH;
        //page1 
        var bg1 = this.createBitmapByName("mbg1_jpg");
        p1Container.addChild(bg1);
        bg1.width = stageW;
        bg1.height = stageH;
        var Mask1 = new egret.Shape();
        Mask1.graphics.beginFill(0x000000, 0.5);
        Mask1.graphics.drawRect(0, 0, stageW, 172);
        Mask1.graphics.endFill();
        Mask1.y = stageH / 2 - 400;
        p1Container.addChild(Mask1);
        var Mask2 = new egret.Shape();
        Mask2.graphics.beginFill(0x000000, 1);
        Mask2.graphics.drawRect(0, 0, stageW, 172);
        Mask2.graphics.endFill();
        Mask2.y = stageH / 2 - 300;
        p1Container.addChild(Mask2);
        var Mask2move = egret.Tween.get(Mask2);
        Mask2move.wait(800);
        Mask2move.to({ "alpha": 0.45 }, 1000);
        var Mask3 = new egret.Shape();
        Mask3.graphics.beginFill(0x000000, 0.5);
        Mask3.graphics.drawRect(0, 0, stageW, 172);
        Mask3.graphics.endFill();
        Mask3.y = stageH / 2 - 200;
        p1Container.addChild(Mask3);
        /*
        var icon:egret.Bitmap = this.createBitmapByName("logo_png");
        var iconrotat = 1;
        p1Container.addChild(icon);
        icon.scaleX = 0.5;
        icon.scaleY = 0.5;
        icon.anchorOffsetX = 300;
        icon.anchorOffsetY = 300;
        icon.x = stageW/2
        icon.y = stageH/1.5+150;
         /// 根据当前模式调整旋转度数或缩放正弦基数形成相应动画
        icon.addEventListener( egret.Event.ENTER_FRAME, ( evt:egret.Event )=>{

               /// 仅旋转
                    icon.rotation += iconrotat;
                
        }, this );
        */
        var icon = this.createBitmapByName("a_png");
        var iconrotat = 1;
        p1Container.addChild(icon);
        icon.scaleX = 0.5;
        icon.scaleY = 0.5;
        icon.anchorOffsetX = 300;
        icon.anchorOffsetY = 300;
        icon.x = stageW / 2;
        icon.y = stageH / 1.5 + 150;
        /// 根据当前模式调整旋转度数或缩放正弦基数形成相应动画
        icon.addEventListener(egret.Event.ENTER_FRAME, function (evt) {
            /// 仅旋转
            icon.rotation += iconrotat * 8;
        }, this);
        var acon = this.createBitmapByName("rrr_png");
        var aconrotat = 1;
        p1Container.addChild(acon);
        acon.scaleX = 0.5;
        acon.scaleY = 0.5;
        acon.anchorOffsetX = 300;
        acon.anchorOffsetY = 300;
        acon.x = stageW / 2;
        acon.y = stageH / 1.5 + 150;
        /// 根据当前模式调整旋转度数或缩放正弦基数形成相应动画
        acon.addEventListener(egret.Event.ENTER_FRAME, function (evt) {
            /// 仅旋转
            acon.rotation += iconrotat / 3;
        }, this);
        var bcon = this.createBitmapByName("abc_png");
        var bconrotat = 1;
        p1Container.addChild(bcon);
        bcon.scaleX = 0.5;
        bcon.scaleY = 0.5;
        bcon.anchorOffsetX = 300;
        bcon.anchorOffsetY = 300;
        bcon.x = stageW / 2;
        bcon.y = stageH / 1.5 + 150;
        var title = new egret.TextField();
        p1Container.addChild(title);
        title.alpha = 0;
        title.textColor = 0xffffff;
        title.width = stageW - 172;
        title.textAlign = "center";
        title.fontFamily = "Microsoft YaHei";
        title.text = "My profile";
        title.size = 48;
        title.strokeColor = 0xdd31fc;
        title.stroke = 1;
        title.x = stageW / 2 - title.width / 2;
        title.y = stageH / 2 - 300;
        var titletw = egret.Tween.get(title);
        titletw.wait(800);
        titletw.to({ "alpha": 1 }, 1000);
        var textfield = new egret.TextField();
        p1Container.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.fontFamily = "Microsoft YaHei";
        textfield.size = 30;
        textfield.textColor = 0xffffff;
        textfield.x = stageW / 2 - textfield.width / 2;
        textfield.y = stageH / 2 - 180;
        this.textfield = textfield;
        //page2  
        var bg2 = this.createBitmapByName("mbg22_jpg");
        p2Container.addChild(bg2);
        bg2.width = stageW;
        bg2.height = stageH;
        this.headSculpture = this.createBitmapByName("r_png");
        this.headSculpture.x = 500;
        this.headSculpture.y = 40;
        p2Container.addChild(this.headSculpture);
        this.headSculpture1 = this.createBitmapByName("r_png");
        this.headSculpture1.x = 500;
        this.headSculpture1.y = 500;
        p2Container.addChild(this.headSculpture1);
        this.headSculptureTween = egret.Tween.get(this.headSculpture, { loop: true });
        this.headSculpture1Tween = egret.Tween.get(this.headSculpture1, { loop: true });
        //每个Tween对象按顺序执行逻辑
        this.headSculptureTween.to({ y: this.headSculpture1.y }, 1500, egret.Ease.sineIn);
        this.headSculpture1Tween.to({ y: this.headSculpture.y }, 1500, egret.Ease.sineIn);
        this.headSculptureTween.to({ "rotation": 90 }, 500, egret.Ease.sineIn);
        this.headSculptureTween.to({ "rotation": 0 }, 500, egret.Ease.sineIn);
        this.headSculpture1Tween.to({ "rotation": 90 }, 500, egret.Ease.sineIn);
        this.headSculpture1Tween.to({ "rotation": 0 }, 500, egret.Ease.sineIn);
        var Mask4 = new egret.Shape();
        Mask4.graphics.beginFill(0x000000, 0.5);
        Mask4.graphics.drawRect(0, 0, stageW - 200, 350);
        Mask4.graphics.endFill();
        Mask4.x = 20;
        Mask4.y = 150;
        p2Container.addChild(Mask4);
        var jianli = new egret.TextField();
        p2Container.addChild(jianli);
        jianli.alpha = 0;
        jianli.textColor = 0xffffff;
        jianli.width = stageW - 230;
        jianli.textAlign = "center";
        jianli.fontFamily = "Microsoft YaHei";
        jianli.textAlign = "left";
        jianli.text = "    我的名字叫袁立力，就读于北京工业大学，专业上主攻数字媒体技术。我的梦想是做一些有用的事，成为一个有用的人。我希望能在游戏开发领域能创造不同，希望得到各位的认可。我的要求并不高，只希望能获得一个追逐和实现理想的机会。再次感谢您的阅读与关注。";
        jianli.size = 30;
        jianli.strokeColor = 0xdd31fc;
        jianli.stroke = 1;
        jianli.x = 40;
        jianli.y = 170;
        var jianlitw = egret.Tween.get(jianli);
        jianlitw.wait(800);
        jianlitw.to({ "alpha": 1 }, 1000);
        var Mask5 = new egret.Shape();
        Mask5.graphics.beginFill(0x000000, 0.7);
        Mask5.graphics.drawRect(0, 0, stageW, 30);
        Mask5.graphics.endFill();
        Mask5.y = 850;
        p2Container.addChild(Mask5);
        var _txInfo = new egret.TextField();
        p2Container.addChild(_txInfo);
        _txInfo.textColor = 0xffffff;
        _txInfo.size = 30;
        _txInfo.fontFamily = "SimHei";
        _txInfo.x = 140;
        _txInfo.y = 850;
        _txInfo.lineSpacing = 60;
        var isComplete = true;
        Mask5.touchEnabled = true;
        Mask5.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            if (isComplete) {
                isComplete = false;
                _this.typerEffect(_txInfo, "有  志  者  事  竟  成 !", 20);
            }
        }, this);
        var end = new egret.TextField();
        p2Container.addChild(jianli);
        end.alpha = 0;
        end.textColor = 0xffffff;
        end.width = stageW - 230;
        end.textAlign = "center";
        end.fontFamily = "Microsoft YaHei";
        end.textAlign = "left";
        end.text = "end";
        end.size = 30;
        end.strokeColor = 0xdd31fc;
        end.stroke = 1;
        end.x = stageW - 10;
        end.y = stageH;
        var endtw = egret.Tween.get(end);
        endtw.wait(800);
        endtw.to({ "alpha": 1 }, 1000);
        var dj = new egret.TextField();
        p2Container.addChild(dj);
        dj.alpha = 0;
        dj.width = stageW - 172;
        dj.textAlign = egret.HorizontalAlign.CENTER;
        dj.fontFamily = "Microsoft YaHei";
        dj.size = 30;
        dj.textColor = 0xffffff;
        dj.x = stageW / 2 - dj.width / 2;
        dj.y = 850;
        this.textfield = textfield;
        //页面滑动功能
        this.scrollRect = new egret.Rectangle(0, 0, this.stage.stageWidth, 2 * stageH);
        this.cacheAsBitmap = true;
        this.touchEnabled = true;
        var init_TouchPointY = 0; //起始触摸点
        var init_StagePointY = 0; //起始Stage点
        var MoveDistance = 0; //移动距离
        var mark = 0;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, startScroll, this); //监听事件1
        function startScroll(e) {
            if ((this.scrollRect.y % stageH) != 0) {
                this.scrollRect.y = init_StagePointY; //每次滑动都卡主一个stage的高度
            }
            mark = e.stageY;
            init_TouchPointY = e.stageY;
            init_StagePointY = this.scrollRect.y;
        }
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, onScroll, this); //实时计算滑动的距离值 监听事件2
        function onScroll(e) {
            var rect = this.scrollRect;
            MoveDistance = init_TouchPointY - e.stageY;
            if (MoveDistance != 0) {
                rect.y = (init_StagePointY + MoveDistance);
                this.scrollRect = rect;
            }
        }
        this.addEventListener(egret.TouchEvent.TOUCH_END, stopScroll, this); //监听事件3
        function stopScroll(e) {
            var rect = this.scrollRect;
            var origin = mark - e.stageY;
            if ((MoveDistance >= (stageH / 4)) && init_StagePointY != stageH && origin != 0) {
                rect.y = init_StagePointY + stageH;
                this.scrollRect = rect;
            }
            else if ((MoveDistance <= (-stageH / 5)) && init_StagePointY != 0 && origin != 0) {
                rect.y = init_StagePointY - stageH;
                this.scrollRect = rect;
            }
            else {
                rect.y = init_StagePointY;
                this.scrollRect = rect;
            }
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, onScroll, this);
        }
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this);
        var sound = RES.getRes("torinouta_mp3");
        var channel = sound.play(0, -2);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    p.startAnimation = function (result) {
        var self = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = [];
        for (var i = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }
        var textfield = self.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];
            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 1000);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 1000);
            tw.call(change, self);
        };
        change();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    p.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
