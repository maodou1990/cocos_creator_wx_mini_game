var show_toast = function(title,success=undefined,fail=undefined)
{
    if(typeof(wx) === 'undefined')
        return;

    wx.showToast({
        title:title,
        mask:true,
        success:success,
        fail:fail
    });
}

var show_modal = function(title,content,confirmText,showCancel,success)
{
    if(typeof(wx) === 'undefined')
        return;

    wx.showModal({
        title: title,
        content: content,
        confirmText: confirmText,
        showCancel: showCancel,
        success:success
    });
}

/*
*  wx_banner.js
**/
function create_banner_impl(adUnitId,style)
{
    if(typeof(wx) === 'undefined')
        return;
    let bannerAd = wx.createBannerAd({
        adUnitId:adUnitId,
        style:style
    });

    bannerAd.onError(err=>{
        console.log(err);
        //bannerAd.destroy();
    });
    bannerAd.show().catch(err=>{
        console.log(err);
        bannerAd.destroy();
    }).then(()=>{
        console.log('banner 广告显示！');
    });
    bannerAd.onLoad(()=>{
        console.log('banner 加载成功！');
    });
}

var show_banner_ad = function(adUnitId,left,top,width,height)
{
    var style = {
        left:left,
        top:top,
        width:width,
        height:height
    };
    create_banner_impl(adUnitId,style);
}
exports.show_banner_ad = show_banner_ad;

/*
*   login
*/

var get_user_info = function(){
    if(typeof(wx) === 'undefined')
        return;
    let sysInfo = wx.getSystemInfoSync();
    let sdkVersion = sysInfo.SDKVersion;

    let width = sysInfo.screenWidth;
	let height = sysInfo.screenHeight;

    if (sdkVersion >= "2.0.1") {
        var button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: width*wx_sdk.config.user_info_btn.x,
                top: height*wx_sdk.config.user_info_btn.y,
                width: width*wx_sdk.config.user_info_btn.w,
                height: height*wx_sdk.config.user_info_btn.h,
            }
        });
        button.onTap((res) => {
            if(res.userInfo){
                console.log("用户授权:", res);
                var userInfo = res.userInfo;
                button.destroy();
                wx.sdk.get_user_info_callback(userInfo);
                wx_login();
            }else{
                console.log("拒绝授权");
            }
        });
    }
    else 
    {
        wx.getUserInfo({
            withCredentials: true,
            success: res => {
                var userInfo = res.userInfo;
                wx.sdk.get_user_info_callback(userInfo);
                wx_login();
            },
            fail: res => {
                show_modal('友情提醒',
                '请允许微信获得授权!',
                "授权",
                false,
                function(res) {console.log('未获得微信授权！')});
            }
        });
    }
}

var wx_login = function()
{
    if(typeof(wx) === 'undefined')
        return;
    wx.login({
        success: function (res) 
        {
            load_account();
            wx_sdk.login_callback(res);
        }
    });
};

var wx_authorize = function(field)
{
    if(typeof(wx) === 'undefined')
        return;
    var field_str = 'scope.'+field;
    wx.authorize({
        scope: field_str,
        fail: function (res) 
        {
            // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
            if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1 ) 
            {
                // 处理用户拒绝授权的情况
                console.log('用户拒绝了'+field+'的授权！');
            }    
        }
    });
};

var login = function()
{
    if(typeof(wx) === "undefined")
    {
        console.log('wx type is undefined');
        return;
    }
    wx.getSetting({
        success: function (res) 
        {
            var authSetting = res.authSetting
            if (authSetting['scope.userInfo'] === true) 
            {
                // 用户已授权，可以直接调用相关 API
                wx_login();
            } 
            else if (authSetting['scope.userInfo'] === false)
            {
                // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
                console.log("用户拒绝了获取信息的授权！");
            } 
            else 
            {
                // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
                wx_sdk.authorize_callback(res);
                get_user_info();
            }
        },
        fail:function(res)
        {
            console.log('wx getSetting fail:'+res);
        }
    });
}
exports.login = login;

/*
*   open_data
*/

var post_message = function(msg)
{
    if(typeof(wx) === 'undefined')
    {
        return;
    }
    var open_data = wx.getOpenDataContext();
    open_data.postMessage(msg);
}
exports.post_message = post_message;

var set_open_data = function(kvdata)
{
    if(typeof(wx) === 'undefined')
    {
        return;
    }
    wx.setUserCloudStorage({
        KVDataList:kvdata,
        success:function(){
            console.log('setUserCloudStorage success!');
        },
        fail:function(res){
            console.log('setUserCloudStorage fail! msg:'+res.errMsg);
        }

    });
}
exports.set_open_data = set_open_data;

/*
*   wx_save
*/

var save_account = function(){
    if(typeof(wx) === 'undefined')
        return;
    
    wx.setStorage({
        key:'account',
        data:account,
        success:function()
        {
            console.log('save account success!');
        },
        fail:function(err)
        {
            console.log('save account fail! res:'+JSON.stringify(err));
        }
    });
}
exports.save_account = save_account;

var load_account = function(){
    if(typeof(wx) === 'undefined')
        return;
    
    wx.getStorage({
        key:'account',
        success:function(res)
        {
            wx_sdk.load_account_success_callback(res);
        },
        fail:function(res)
        {
            wx_sdk.load_account_fail_callback(res);
            save_account();
        }
    });
}
exports.load_account = load_account;

/*
*   update_game
*/

var update_game = function()
{
    if(typeof(wx) == 'undefined')
        return;
    if (typeof wx.getUpdateManager === 'function') 
    {
        const updateManager = wx.getUpdateManager();
      
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          //console.log("hasUpdate:"+res.hasUpdate);
          if(!res.hasUpdate)
          {
            login();
          }
        });
      
        updateManager.onUpdateReady(function () {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        });
      
        updateManager.onUpdateFailed(function () {
          // 新的版本下载失败
          console.log('onUpdateFail! ');
        });
      }
}
exports.update_game = update_game;

/*
*
*/

function create_video_ad_impl(adUnitId)
{
    if( typeof(wx) === 'undefined')
        return;
    let videoAd = wx.createRewardedVideoAd({
        adUnitId:adUnitId
    });

    videoAd.onError(err=>{
        console.log(err);
        videoAd.destroy();
    });
    videoAd.show().catch(err=>{
        console.log(err);
        //videoAd.destroy();
    }).then(()=>{
        console.log('激励视频 广告显示！');
    });
    videoAd.onLoad(()=>{
        console.log('激励视频 加载成功！');
    });
    videoAd.onClose(res=>{
        // 用户点击了【关闭广告】按钮
        // 小于 2.1.0 的基础库版本，res 是一个 undefined
        if (res && res.isEnded || res === undefined) 
        {
            // 正常播放结束，可以下发游戏奖励
            wx_sdk.close_video_callback();
        }
        else 
        {
            // 播放中途退出，不下发游戏奖励
            wx_sdk.interrupt_video_callback();
        }
    });
}



var show_video_ad = function(adUnitId)
{
    create_video_ad_impl(adUnitId);
}
exports.show_banner_ad = show_banner_ad;



