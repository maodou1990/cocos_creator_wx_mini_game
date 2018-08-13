// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        _isShow:false,
        display:cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    start () {
        this.tex = new cc.Texture2D();
    },

    onRankClick () {
        this._isShow = !this._isShow;
        console.log('rank_page:',this._isShow);
        this.display.active = this._isShow;
        // 发消息给子域
        wx_all.post_message({
            message: this._isShow ? 'Show' : 'Hide'
        })
    },

    _updateSubCanvas:function() {
        if (!this.tex) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },

    update:function(dt) {
        this._updateSubCanvas();
    },
});
