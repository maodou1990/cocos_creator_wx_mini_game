// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var Data = cc.Class({
    extends:cc.Component,
    statics:{
        Instance:null
    },

    properties: {
    },

    // LIFE-CYCLE CALLBACKS

    onLoad:function()
    {
        var self = this;
        Data.Instance = self;
        cc.game.addPersistRootNode(self.node);

        //console.log('data onload');
        //console.log("url:"+url_path);
        cc.loader.loadRes('table/map',cc.JsonAsset,function(err,res){
            if(err)
            {
                console.log(err);
            }
            //console.log("map loaded!data:"+JSON.stringify(res.json));     
        });

        //console.log("url:"+url_path);
        cc.loader.loadRes('table/building',cc.JsonAsset,function(err,res){
            if(err)
            {
                console.log(err);
            }
            //console.log("building loaded!data:"+JSON.stringify(res));    
        });

        //console.log("url:"+url_path);
        cc.loader.loadRes('table/plane',cc.JsonAsset,function(err,res){
            if(err)
            {
                console.log(err);
            }
            //console.log("plane loaded!data:"+JSON.stringify(res));    
        });

        //console.log("url:"+url_path);
        cc.loader.loadRes('table/level',function(err,res){
            if(err)
            {
                console.log(err);
            }
            //console.log("level loaded!data:"+JSON.stringify(res));    
        });

        wx_all.update_game();
        wx_all.set_open_data([{
            key:"friend",
            value:JSON.stringify({
                "wxgame": {
                    "score":16,
                    "update_time": 1513080573
                },
                "cost_ms":36500
            })
        }]);
    }
});



