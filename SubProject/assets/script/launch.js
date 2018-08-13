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
        display: cc.Node,
        content: cc.Node,
        items:[cc.Node],
        grid:cc.Layout,
        timestamp:0
    },

    start:function () {
        var self = this;
        wx_sdk.message_process['Show'] = function()
        {
            console.log('_Show');
            self._init_data();
            self._show();
        };
        wx_sdk.message_process['Hide'] = function()
        {
            console.log('_Hide');
            self._hide();
        };

        wx_sdk.get_friend_storage_success = function(data)
        {
            console.log('get_friend_storage_success:',data);
            self._drawRankList(data);
        };
        console.log('on_message');
        wx_open_data.on_message();
    },

    _drawRankList:function(data) {
        var self = this;
        console.log('friend:'+JSON.stringify(data)+",data.length:"+data.length);
        cc.loader.loadRes('prefabs/rank_item',cc.Prefab,function(err,prefab){
            if(err)
            {
                console.log(err);
                return;
            }
            let max = Math.max(data.length,self.items.length);
            for(var i = 0;i<max;++i)
            {
                if(i<data.length && i<self.items.length)
                {
                    let target = self.items[i];
                    let rank_item = target.getComponent('rank_item');
                    //console.log("rank_item:"+rank_item);
                    rank_item._init_data(data[i].nickname,0);
                }
                else if(i>= data.length && i<self.item.length) 
                {
                    let target = self.items[i];
                    target.destroy();
                }
                else if(i>= self.items.length && i < data.length)
                {
                    let target = cc.instantiate(prefab);
                    self.content.addChild(target);
                    self.items.push(target);
                    let rank_item = target.getComponent('rank_item');
                    //console.log("rank_item:"+rank_item);
                    rank_item._init_data(data[i].nickname,0);
                }
            }
            self.grid.updateLayout();
        });
        
    },

    _init_data:function(){
        var self = this;
        var now = new Date().getTime();
        if(now - self.timestamp < 900000)
            return;
        self.timestamp = now;
        wx_open_data.get_friend_storage();
    },

    _show:function () {
        console.log('dis.pos:',this.display.position);
        this.display.active = true;
        //let moveTo = cc.moveTo(0.5, 0, 0);
        //this.display.runAction(moveTo);
    },

    _hide:function () {
        this.display.active = false;
        //let moveTo = cc.moveTo(0.5, 0, -1000);
        //this.display.runAction(moveTo);
    }
});
