window.wx_sdk = 
{
    config:{
        user_info_btn:
        {
            x:0.4,
            y:0.45,
            w:0.2,
            h:0.1
        }
    },

    //成功获取微信用户数据回调
    get_user_info_callback:function(user_info){
        console.log('get_user_info_callback:',JSON.stringify(user_info));
    }, 

    //微信用户登录成功回调
    login_callback:function(res){
        console.log('login_callback:',JSON.stringify(res));
    },  
    
    //微信登陆未获取用户信息权限回调
    first_time_get_user_info:function(res){
        console.log('first_time_get_user_info:',JSON.stringify(res));
    },    

    //加载本地账户数据成功回调
    load_account_success_callback:function(res){
        console.log('load_account_success_callback:',JSON.stringify(res));
    },  

    //加载本地账户数据失败回调
    load_account_fail_callback:function(res){
        console.log('load_account_fail_callback:',JSON.stringify(res));
    },

    //激励视频正常结束关闭回调s
    close_video_callback:function(res){
        console.log('close_video_callback:',JSON.stringify(res));
    },   

    //激励视频中断关闭回调
    interrupt_video_callback:function(res){
        console.log('interrupt_video_callback:',JSON.stringify(res));
    },   
}