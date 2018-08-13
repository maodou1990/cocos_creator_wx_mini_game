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
        name_label:cc.LabelOutline,
        score_label:cc.LabelOutline
    },

    _init_data:function(name,score){
        console.log('position: x:'+this.node.x+",y:"+this.node.y);
        console.log('name:'+name);
        var nl = this.name_label.getComponent(cc.Label);
        nl.string = name;
        var sl = this.score_label.getComponent(cc.Label);
        console.log(sl.string);
        sl.string = "分数："+score;
    }
});
