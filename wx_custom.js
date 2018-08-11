window.wx_sdk = 
{
    config:{
        user_info_btn:
        {
            x:{type:cc.Float,default:0.4},
            y:{type:cc.Float,default:0.45},
            w:{type:cc.Float,default:0.2},
            h:{type:cc.Float,default:0.1}
        }
    },

    get_user_info_callback:function(user_info){}, //成功获取微信用户数据回调
    
    login_callback:function(res){},  //微信用户登录成功回调
    
    authorize_callback:function(res){},    //微信登陆未获取用户信息权限回调

    load_account_success_callback:function(res){},  //加载本地账户数据成功回调

    load_account_fail_callback:function(res){}, //加载本地账户数据失败回调

    close_video_callback:function(res){},   //激励视频正常结束关闭回调

    interrupt_video_callback:function(res){},   //激励视频中断关闭回调
}