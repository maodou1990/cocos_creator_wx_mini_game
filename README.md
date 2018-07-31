# cocos_creator_wx_mini_game
cocos creator 中调用 微信小游戏 接口

使用时将文件拖入cocos creator工程
代码中加入
window.wx_all = require('wx_all');
就可以调用接口
登陆流程基本完善，游戏启动时调用 
wx_all.update_game() 
即可，已经实现了 更新游戏->（请求用户信息权限getUserInfo）->登陆->加载本地账号数据的流程功能。

wx_callback中的回调接口自己实现不同的逻辑/表现即可

开放接口：
登陆：
login

存储/加载账号：
save_account/load_account

游戏更新：
update_game

banner广告：
show_banner_ad

激励视频：
show_video_ad

主域：
post_message //向开放数据域发送数据
set_open_data  //向开放数据域提交数据，用于开放数据域显示好友排行榜

之后会加入：
分享、开放数据域内容
