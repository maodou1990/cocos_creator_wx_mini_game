var on_message = function()
{
    window.wx.onMessage(function(data){
        var fn = wx_sdk.message_process[data.message];
        if(typeof fn == 'function')
        {
            fn(data);
        }
    });
}
exports.on_message = on_message;

var get_friend_storage = function()
{
    window.wx.getFriendCloudStorage({
        success:res=>{
            wx_sdk.get_friend_storage_success(res.data)
        }
    })
}
exports.get_friend_storage = get_friend_storage;