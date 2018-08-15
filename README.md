# cocos_creator_wx_mini_game 模板工程


cocos_creator请使用2.0以上版本，优化了性能的同时，针对微信小游戏开放了分包功能，同时动态加载的方式也有所不同


##组织结构

 1. MainProject:主域工程 
 2. SubProject:开放域工程 
 3. tools：工具 
 4. Server：服务端（未完成）

##主域工程MainProject：

登陆流程基本完善，游戏启动时调用 


    wx_all.update_game() 


即可，已经实现了 更新游戏->（请求用户信息权限getUserInfo）->登陆->加载本地账号数据的流程功能。

wx_sdk中的回调接口自己实现不同的逻辑/表现即可

开放接口：

 1. 登陆：
login

 2. 存储/加载账号：
save_account/load_account

 3. 游戏更新：
update_game

 4. banner广告：
show_banner_ad

 5. 激励视频：
show_video_ad

 6. 主域：
post_message   向开放数据域发送数据
set_open_data  向开放数据域提交数据，用于开放数据域显示好友排行榜

 7. 提示：
show_toast
show_modal

 8. 分享：
on_share_app_message
share_app_message
show_share_menu
get_share_info

 9. 点击分享链接
on_show
get_launch_options_sync

 10. 离开小游戏
exit_game

*data.js 中动态加载了json数据表，详见tools部分

##开放域工程SubProject：
（注：该工程打包类型为WechatGameOpenDataContext，CC_WECHATGAME == false）

 - wx_open_data 开放域接口
get_friend_storage_success //获取好友排行榜数据成功的回调函数
 - wx_sdk
message_process 在游戏启动时注册 主域消息的回调 参照launch.js的start

*launch.js中_drawRankList 动态加载resources下prefab的方式

##工具tools：

 1. 表格 table下 table.xlsx 每个sheet是一张表
 2. 使用开源的xlsx2json工具转换成json资源文件放到主域工程的resources文件夹下

*这里我做了点改动，DataType为ID时 该字段作为key时为string，作为value时作为Number

##Server：（未实现）

小游戏服务端，Nodejs实现，准备使用WebSocket，mongodb做数据库



##参考资料:

 - onfire.js:https://github.com/hustcc/onfire.js
 - xlsx2json:https://github.com/koalaylj/xlsx2json

