var show_toast = function(title,success=undefined,fail=undefined)
{
    if(!CC_WECHATGAME)
        return;

    let obj = {
        title:title,
        mask:true,
    };
    (typeof(success) == 'function') && (obj.success = success);
    (typeof(fail) == 'function') && (obj.fail = fail);
    window.wx.showToast(obj);
}
exports.show_toast = show_toast;

var show_modal = function(title,content,confirmText,showCancel,success=undefined)
{
    if(!CC_WECHATGAME)
        return;

    let obj = {
        title: title,
        content: content,
        confirmText: confirmText,
        showCancel: showCancel,
    };
    (typeof(success) == 'function') && (obj.success = success);
    window.wx.showModal(obj);
}
exports.show_modal = show_modal;

/*
*  wx_banner.js
**/
function create_banner_impl(adUnitId,style)
{
    if(!CC_WECHATGAME)
        return;
    let bannerAd = window.wx.createBannerAd({
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
    if(!CC_WECHATGAME)
        return;
    let sysInfo = window.wx.getSystemInfoSync();
    //console.log('sysInfo:',JSON.stringify(sysInfo));
    let sdkVersion = sysInfo.SDKVersion;

    let width = sysInfo.screenWidth;
	let height = sysInfo.screenHeight;
    
    if (sdkVersion >= "2.0.1") {
        var button = window.wx.createUserInfoButton({
            type: 'text',
            text: '开始游戏',
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
                wx_sdk.get_user_info_callback(userInfo);
                wx_login();
            }else{
                console.log("拒绝授权");
            }
        });
    }
    else 
    {
        window.wx.getUserInfo({
            withCredentials: true,
            success: res => {
                console.log("用户授权:", res);
                var userInfo = res.userInfo;
                wx_sdk.get_user_info_callback(userInfo);
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
    if(!CC_WECHATGAME)
        return;
    window.wx.login({
        success: function (res) 
        {
            load_account();
            wx_sdk.login_callback(res);
        }
    });
};

var wx_authorize = function(field)
{
    if(!CC_WECHATGAME)
        return;
    var field_str = 'scope.'+field;
    window.wx.authorize({
        scope: field_str,
        fail: function (res) 
        {
            // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
            //console.log('authorize failed:',res,errMsg);
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
    if(!CC_WECHATGAME)
        return;

    window.wx.getSetting({
        success: res=>
        {
            var authSetting = res.authSetting;
            if (authSetting['scope.userInfo'] === true) 
            {
                // 用户已授权，可以直接调用相关 API
                //wx_login();
                wx_sdk.first_time_get_user_info(res);
                get_user_info();
            } 
            else if (authSetting['scope.userInfo'] === false)
            {
                // 用户已拒绝授权，再调用相关 API 或者 window.wx.authorize 会失败，需要引导用户到设置页面打开授权开关
                console.log("用户拒绝了获取信息的授权！");
                show_toast('用户拒绝了获取信息的授权！',exit_game);
            } 
            else 
            {
                // 未询问过用户授权，调用相关 API 或者 window.wx.authorize 会弹窗询问用户
                
                wx_sdk.first_time_get_user_info(res);
                get_user_info();
            }
        },
        fail:res=>
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
    if(!CC_WECHATGAME)
        return;

    var open_data = window.wx.getOpenDataContext();
    open_data.postMessage(msg);
}
exports.post_message = post_message;

var set_open_data = function(kvdata)
{
    if(!CC_WECHATGAME)
        return;

    window.wx.setUserCloudStorage({
        KVDataList:kvdata,
        success:function(){
            console.log('setUserCloudStorage success!');
        },
        fail:res=>{
            console.log('setUserCloudStorage fail! msg:'+res.errMsg);
        }

    });
}
exports.set_open_data = set_open_data;

/*
*   wx_save
*/

var save_account = function(){
    if(!CC_WECHATGAME)
        return;
    
    window.wx.setStorage({
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
    if(!CC_WECHATGAME)
        return;
    
    window.wx.getStorage({
        key:'account',
        success:res=>
        {
            wx_sdk.load_account_success_callback(res);
        },
        fail:res=>
        {
            save_account();
            wx_sdk.load_account_fail_callback(res);
        }
    });
}
exports.load_account = load_account;

/*
*   update_game
*/

var update_game = function()
{
    if(!CC_WECHATGAME)
        return;
    console.log('update_game');
    if (typeof window.wx.getUpdateManager === 'function') 
    {
        const updateManager = window.wx.getUpdateManager();
      
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          //console.log("hasUpdate:"+res.hasUpdate);
          if(!res.hasUpdate)
          {
            wx_sdk.no_update_callback();
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
*   激励视频
*/

function create_video_ad_impl(adUnitId)
{
    if(!CC_WECHATGAME)
        return;

    let videoAd = window.wx.createRewardedVideoAd({
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
exports.show_video_ad = show_video_ad;

/*
*   分享
*/

var show_share_menu = function(withShareTicket = true,success = undefined,fail = undefined)
{
    if(!CC_WECHATGAME)
        return;
    
    let obj = {
        withShareTicket:withShareTicket,
    };
    (typeof(success) == 'undefined') && (obj.success = success);
    (typeof(fail) == 'undefined') && (obj.fail = fail);
    window.wx.showShareMenu(obj);
}
exports.show_share_menu = show_share_menu;

var on_share_app_message = function(imageUrl,query,success = undefined,fail = undefined,title = undefined)
{
    if(!CC_WECHATGAME)
        return;
    console.log('onShareAppMessage');
    let succ_func = function(res)
    {
        console.log('res:',res);
        (typeof(success) == 'function') && success(res);
    };

    let fail_func = function(res)
    {
        console.log('resErr分享失败:',res);
        (typeof(fail) == 'function') && fail(res);
    }

    let obj = {
        imageUrl:imageUrl,
        query:query,
        success:succ_func,
        fail:fail_func,
    };
    (typeof(title) == 'string') && (obj.title = title);
    window.wx.onShareAppMessage(function(){
        return obj;
    });
}
exports.on_share_app_message = on_share_app_message;

var share_app_message = function(imageUrl,query,success = undefined,fail = undefined,title = undefined)
{
    if(!CC_WECHATGAME)
        return;
    console.log('shareAppMessage');
    let succ_func = function(res)
    {
        console.log('res:',res);
        (typeof(success) == 'function') && success(res);
    };

    let fail_func = function(res)
    {
        console.log('resErr分享失败:',res);
        (typeof(fail) == 'function') && fail(res);
    }

    let obj = {
        imageUrl:imageUrl,
        query:query,
        success:succ_func,
        fail:fail_func,
    };
    (typeof(title) == 'string') && (obj.title = title);
    window.wx.shareAppMessage(function(){
        return obj;
    });
}
exports.share_app_message = share_app_message;

var get_share_info = function(shareTicket = true)
{
    if(!CC_WECHATGAME)
        return;

    let obj = {
        shareTicket:shareTicket,
        success:res=>{
            wx_sdk.get_share_info_success(res);
        },
        fail:res=>{
            wx_sdk.get_share_info_fail(res);
        }
    };
    window.wx.getShareInfo(obj);
}
exports.get_share_info = get_share_info;

var exit_game = function()
{
    if(!CC_WECHATGAME)
        return;
    
    window.wx.exitMiniProgram({
        success:res=>{
            console.log('exit_mini_game success!');
        },
        fail:res=>{
            console.log('exit_mini_game fail! res:',res);
        }
    });
}
exports.exit_game = exit_game;

var on_show = function(){
    if(!CC_WECHATGAME)
        return;
    
    window.wx.onShow(function(res){
        wx_sdk.on_show_callback(res);
    });
}
exports.on_show = on_show;

var get_launch_options_sync = function(){
    if(!CC_WECHATGAME)
        return;

    var res = window.wx.getLaunchOptionsSync();
    return res;
}
exports.get_launch_options_sync = get_launch_options_sync;

