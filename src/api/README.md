# X 岛匿名版 API 文档

> 来源: [TransparentLC/xdcmd](https://github.com/TransparentLC/xdcmd/wiki/%E8%87%AA%E5%B7%B1%E6%95%B4%E7%90%86%E7%9A%84-X-%E5%B2%9B%E5%8C%BF%E5%90%8D%E7%89%88-API-%E6%96%87%E6%A1%A3)

参考的公开资料：

- 三酱提供的 [原版 API 文档](https://www.zybuluo.com/ovear/note/151481) 。
- 紫岛源代码中 [构建 URL](https://github.com/seven332/Nimingban/blob/master/app/src/main/java/com/hippo/nimingban/client/ac/ACUrl.java) 和 [调用 API](https://github.com/seven332/Nimingban/blob/master/app/src/main/java/com/hippo/nimingban/client/ac/ACEngine.java) 的相关代码。

因为原版 API 文档更新于 2017 年，部分内容已经过时，所以就自己整理了一份 (=ﾟ ω ﾟ)=

一些通用的说明：

- 目前的 JSON API 地址为 `https://api.nmb.best/api/` ，匿名版主站域名为 `nmbxd.com` 。
- 请求方法为 `POST` 的 API，载荷使用 `application/x-www-form-urlencoded` （不涉及文件的话）或 `multipart/form-data` 发送都是可以的。
- 部分 API 请求需要使用饼干，此时需要将饼干写入 Cookie，key 为 `userhash` ，示例： `userhash=Y%85m%E5J5%F4%7D%98%DB%98%0Cm%08%11%9DV%1EIi%956W%10` 。
- URL 参数除了可以使用常规的写法 `https://example.com/?foo=bar&baz=qux` ，在 X 岛的 API 中也可以使用另一种写法 `https://example.com/foo/bar/baz/qux` 。URL 不区分大小写。
- 为了指明返回的 JSON 数据中各字段的位置，“名称”的语法和 [jq](https://stedolan.github.io/jq/) 的 Filter 一致，但是省略了开头的 `.` 并且不会写出具体的数组下标值。
- 部分响应内容的说明为猜测，可能与实际情况不同。
- ~~所有的 API 调用都应该有一个 `appid` 跟在最后~~ 原版 API 文档所述，实际上不写也没关系。
- ~~User-Agent 必须为 `HavfunClient-平台`~~ 原版 API 文档所述，实际上不设定也没关系。

## 获取图片 CDN 地址

`GET /getCDNPath`

### 返回的数据

#### 请求成功

| 名称      | 类型   | 说明                  |
| --------- | ------ | --------------------- |
| `[].url`  | String | 图片 CDN 地址         |
| `[].rate` | Number | 各个 CDN 地址的权重？ |

JSON 响应内容示例

```json
[
  {
    "url": "https://image.nmb.best/",
    "rate": 0.05
  },
  {
    "url": "https://image.nmb.best/",
    "rate": 0.95
  }
]
```

## 版面列表

`GET /getForumList`

### 返回的数据

#### 请求成功

| 名称                           | 类型   | 说明                                                                          |
| ------------------------------ | ------ | ----------------------------------------------------------------------------- |
| `[].id`                        | String | 版面分类的 ID                                                                 |
| `[].sort`                      | String | 版面分类的排序值，升序                                                        |
| `[].name`                      | String | 版面分类的名称                                                                |
| `[].status`                    | String | 原版 API 文档所述：始终为 `n`                                                 |
| `[].forums[].id`               | String | 版面分类下每个版面的 ID                                                       |
| `[].forums[].fgroup`           | String | 版面所属的版面分类 ID                                                         |
| `[].forums[].sort`             | String | 版面在版面分类内的排序值                                                      |
| `[].forums[].name`             | String | 版面名称                                                                      |
| `[].forums[].showName`         | String | 导航栏用的版面名称，使用 HTML                                                 |
| `[].forums[].msg`              | String | 版面说明，使用 HTML                                                           |
| `[].forums[].interval`         | String | 发串的间隔时间，单位为秒                                                      |
| `[].forums[].safe_mode`        | String | ？                                                                            |
| `[].forums[].auto_delete`      | String | 发串后被自动删除的时间，单位为小时，一般用于速报版， `0` 表示没有启用自动删除 |
| `[].forums[].thread_count`     | String | 版面内串的数量                                                                |
| `[].forums[].permission_level` | String | ？                                                                            |
| `[].forums[].forum_fuse_id`    | String | ？                                                                            |
| `[].forums[].createdAt`        | String | ？                                                                            |
| `[].forums[].updateAt`         | String | ？                                                                            |
| `[].forums[].status`           | String | 原版 API 文档所述：始终为 `n`                                                 |

JSON 响应内容示例

```json
[
  {
    "id": "4",
    "sort": "1",
    "name": "综合",
    "status": "n",
    "forums": [
      {
        "id": "-1",
        "name": "时间线",
        "msg": "这里是匿名版最新的串"
      },
      {
        "id": "4",
        "fgroup": "4",
        "sort": "2",
        "name": "综合版1",
        "showName": "",
        "msg": "&bull;  欢迎回来 <br />\r\n&bull;  灾后重建有序进行中，上手前建议您阅读：<strong><a href=\"/t/50000001\">【全岛总版规】</a></strong><br />\r\n&bull;  关于X岛与A岛关系的说明：<strong><a href=\"/t/50000002\">置顶串</a></strong><br />\r\n&bull;  我们建议您开串时抛弃任何【新人】或是【高中生】等非必要的身份标签，直接进入话题<br />\r\n&bull;  综合一为综合性版面，关联性强内容请优先发至各分版<br />\r\n&bull; 调查问卷及操作询问请转<a href=\"/f/询问3\">询问3</a>版，无公众讨论意义的请转<a href=\"/f/日记\">日记</a>版，圈子事和版务请转<a href=\"/f/圈内\">圈内</a>版，APP使用反馈请转<a href=\"/f/技术支持\">技术支持</a>版相关串<br />\r\n&bull;  全岛禁止违法及广义上的现充话题，请尊重他人的同时尊重自己。<br />\r\n&bull;  特殊事务可邮件联系<a href=mailtohelp@nmbxd.com>help@nmbxd.com</a>",
        "interval": "30",
        "safe_mode": "0",
        "auto_delete": "0",
        "thread_count": "26580",
        "permission_level": "0",
        "forum_fuse_id": "0",
        "createdAt": "2011-10-21 15:49:28",
        "updateAt": "2015-06-23 17:26:28",
        "status": "n"
      },
      {
        "id": "98",
        "fgroup": "4",
        "sort": "2",
        "name": "DANGER_U",
        "showName": "DANGER/U/",
        "msg": "<img src=\"https://file.moetu.org/images/2022/06/29/SSDDF7KRYX4RTW9ODAB5da5083d99146290.png\" style=\"float:left\">\r\n&bull; 默认女性视角，请勿以男性身份和视角发串<br />\r\n&bull; 请遵守总版规<a href=\"/t/50000001 \">禁止任何违法及现充话题</a><br /> \r\n&bull; 综合性问题请转<a href=\"/f/综合1\">综合1</a>版，对本版意见及版务讨论请转<a href=\"/f/圈内\">圈内</a>版，无讨论意义请转<a href=\"/f/日记\">日记（树洞）</a>版<br /> \r\n&bull; \r\n<span style=\" color: red \">“我们毕竟不过是群哺乳动物。--甜味，惬意，复古。”</span><br />\r\n&bull; <s>本质女性视角语c版，一切广义规则请遵守VA-11游戏内匿名版</s>",
        "interval": "15",
        "safe_mode": "0",
        "auto_delete": "0",
        "thread_count": "2470",
        "permission_level": "2",
        "forum_fuse_id": "1",
        "createdAt": "2015-06-15 11:55:26",
        "updateAt": "2015-08-06 00:40:34",
        "status": "n"
      }
    ]
  },
  {
    "id": "1",
    "sort": "2",
    "name": "二次元",
    "status": "n",
    "forums": [
      {
        "id": "14",
        "fgroup": "1",
        "sort": "2",
        "name": "动画",
        "showName": "",
        "msg": "\r\n<p><img src=\"https://file.moetu.org/images/2022/06/19/5b90a1e9bb30a61c11ec474e1450f.jpg\" /><br />\r\n&bull;吃饭睡觉看冻鳗，&ldquo;安心做个萌豚，岂不美哉？&rdquo;<br />\r\n&bull;<a href=\"http://bgmlist.com/\" target=\"blank\">每日新番列表</a><br />\r\n&bull;(　ﾟ 3ﾟ)不许出警，你们这帮二次元都给我好好聊冻鳗",
        "interval": "15",
        "safe_mode": "0",
        "auto_delete": "0",
        "thread_count": "569",
        "permission_level": "0",
        "forum_fuse_id": "0",
        "createdAt": "2011-09-24 16:00:20",
        "updateAt": "2015-07-21 21:59:21",
        "status": "n"
      }
    ]
  }
]
```

### 其他的说明

- **这个 API 所有本来应该返回 Number 的字段都被弄成了 String** ，需要注意类型转换问题。
- 请忽略那个版面 ID 为 `-1` 的“时间线”板块。获取时间线相关的信息有其他的 API。
- `[].forums[].showName` 和 `[].forums[].name` 的区别在于侧边的导航栏会优先使用前者作为版面名称，只有前者为空的情况下才会使用后者。例如：技术版在导航栏显示为“技术(码农)”，但进入版面后显示的名称为“技术宅”。

## 时间线列表

`GET /getTimelineList`

### 返回的数据

#### 请求成功

| 名称              | 类型   | 说明                                                                 |
| ----------------- | ------ | -------------------------------------------------------------------- |
| `[].id`           | Number | 时间线的 ID                                                          |
| `[].name`         | String | 时间线名称                                                           |
| `[].display_name` | String | 导航栏用的时间线名称？                                               |
| `[].notice`       | String | 时间线说明，使用 HTML，实际上在网页版也看不到                        |
| `[].max_page`     | Number | 时间线页数上限，查看时间线时如果页数超过上限则只会返回最后一页的数据 |

JSON 响应内容示例

```json
[
  {
    "id": 1,
    "name": "综合线",
    "display_name": "综合线",
    "notice": "主时间线",
    "max_page": 20
  },
  {
    "id": 2,
    "name": "创作线",
    "display_name": "创作线",
    "notice": "<b>包含创作类板块</b>",
    "max_page": 30
  },
  {
    "id": 3,
    "name": "非创作线",
    "display_name": "非创作线",
    "notice": "<b>本时间线不含综合一及部分创作类板块</b>",
    "max_page": 20
  }
]
```

## 查看版面

`GET /showf`

### URL 参数

| 名称   | 类型   | 说明           |
| ------ | ------ | -------------- |
| `id`   | Number | 版面 ID        |
| `page` | Number | 页数，默认为 1 |

### 返回的数据

#### 请求成功

| 名称                      | 类型   | 说明                                                                                            |
| ------------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| `[].id`                   | Number | 串的 ID                                                                                         |
| `[].fid`                  | Number | 串所属的版面 ID                                                                                 |
| `[].ReplyCount`           | Number | 回复数量                                                                                        |
| `[].img`                  | String | 图片的相对地址                                                                                  |
| `[].ext`                  | String | 图片扩展名                                                                                      |
| `[].now`                  | String | 发串时间，格式： `2022-06-18(六)05:10:29`                                                       |
| `[].user_hash`            | String | 发串的饼干或红名名称                                                                            |
| `[].name`                 | String | 一般是“无名氏”的名称                                                                            |
| `[].title`                | String | 一般是“无标题”的标题                                                                            |
| `[].content`              | String | 串的内容，使用 HTML                                                                             |
| `[].sage`                 | Number | 是否被 SAGE，可以当成 Boolean 使用（非 0 则为 true）                                            |
| `[].admin`                | Number | 是否为红名 ~~小会员~~ ，可以当成 Boolean 使用                                                   |
| `[].Hide`                 | Number | ？                                                                                              |
| `[].Replies[].id`         | Number | 参见上面的字段，不再重复                                                                        |
| `[].Replies[].fid`        | Number |                                                                                                 |
| `[].Replies[].ReplyCount` | Number |                                                                                                 |
| `[].Replies[].img`        | String |                                                                                                 |
| `[].Replies[].ext`        | String |                                                                                                 |
| `[].Replies[].now`        | String |                                                                                                 |
| `[].Replies[].user_hash`  | String |                                                                                                 |
| `[].Replies[].name`       | String |                                                                                                 |
| `[].Replies[].title`      | String |                                                                                                 |
| `[].Replies[].content`    | String |                                                                                                 |
| `[].Replies[].sage`       | Number |                                                                                                 |
| `[].Replies[].admin`      | Number |                                                                                                 |
| `[].Replies[].Hide`       | Number |                                                                                                 |
| `[].RemainReplies`        | Number | 网页版除去显示的最近几条回复后剩余的回复数量 “回应有……篇被省略。要阅读所有回应请按下回应链接。” |

JSON 响应内容示例

```json
[
  {
    "id": 50000002,
    "fid": 4,
    "ReplyCount": 258,
    "img": "2022-06-18/62acedc59ef24",
    "ext": ".png",
    "now": "2022-06-18(六)05:10:29",
    "user_hash": "Admin",
    "name": "无名氏",
    "title": "无标题",
    "content": "&bull; 好久不见<br />\r\n&bull; 灾后重建有序进行中，部分板块暂停开放；旧串三酱会开发相关功后能陆续恢复<br />\r\n&bull; 使用逻辑与旧岛相同，禁晒妹及恶臭现充话题，建议点击<strong><a href=\"/t/50000001\">→ 全岛总版规 ←</a></strong>及各分版版规<br />\r\n&bull; 如对某版规存在异议，请点击<a href=\"/t/50286677\" target=\"_blank\">→ 既往公告及补充说明 ←</a>>>No.50286677 如仍有异议请转至圈内\r\n<br />\r\n&bull; 回应长文包含了大部分问题的解释，如对本岛及先前事件好奇请耐心阅读<br />\r\n&bull; 特殊事项请携缘由联系邮箱：<a href=mailtohelp@nmbxd.com>help@nmbxd.com</a><br />\r\n&bull;  原有数据会伴随新系统上线进行恢复，稍安勿躁<br />\r\n&bull; 客户端下载地址：<a href=\"https://app.nmbxd.com\" target=\"_blank\">https://app.nmbxd.com</a><br />\r\n&bull; <span style=\" font-weight: bold \"><font color=\"#CC0000\">不论是敌是友，久等了，欢迎回来。</font><span></h1>",
    "sage": 1,
    "admin": 1,
    "Hide": 0,
    "Replies": [
      {
        "id": 50039112,
        "fid": 4,
        "ReplyCount": 0,
        "img": "",
        "ext": "",
        "now": "2022-06-21(二)08:06:58",
        "user_hash": "JzeObtU",
        "name": "无名氏",
        "title": "无标题",
        "content": "( ´∀\`)回家啦",
        "sage": 0,
        "admin": 0,
        "Hide": 0
      },
      {
        "id": 50043122,
        "fid": 4,
        "ReplyCount": 0,
        "img": "",
        "ext": "",
        "now": "2022-06-21(二)12:02:03",
        "user_hash": "RcX2OX4",
        "name": "无名氏",
        "title": "无标题",
        "content": "三酱你做的好啊ﾟ ∀ﾟ)ノ",
        "sage": 0,
        "admin": 0,
        "Hide": 0
      }
    ],
    "RemainReplies": 253
  },
  {
    "id": 51941400,
    "fid": 4,
    "ReplyCount": 26,
    "img": "2022-09-12/631e66e0cd944",
    "ext": ".jpg",
    "now": "2022-09-12(一)06:53:16",
    "user_hash": "DZMAa87",
    "name": "无名氏",
    "title": "无标题",
    "content": "肥哥們( ・_ゝ・)",
    "sage": 0,
    "admin": 0,
    "Hide": 0,
    "Replies": [
      {
        "id": 51943421,
        "fid": 4,
        "ReplyCount": 0,
        "img": "",
        "ext": "",
        "now": "2022-09-12(一)10:18:34",
        "user_hash": "QPLtOnU",
        "name": "无名氏",
        "title": "无标题",
        "content": "自测的话有因为操作不规范导致假阳性的可能，建议120",
        "sage": 0,
        "admin": 0,
        "Hide": 0
      },
      {
        "id": 51943780,
        "fid": 4,
        "ReplyCount": 0,
        "img": "",
        "ext": "",
        "now": "2022-09-12(一)10:39:19",
        "user_hash": "URk3nGF",
        "name": "无名氏",
        "title": "无标题",
        "content": "im not in danger<br />\nim the danger.jpg<br />\n<br />\n肥哥们再测测啊！说不定是假阳呢",
        "sage": 0,
        "admin": 0,
        "Hide": 0
      }
    ],
    "RemainReplies": 21
  }
]
```

#### 请求错误

JSON 响应内容示例

```json
{
  "success": false,
  "error": "必须登入领取饼干后才可以访问"
}
```

```json
"该板块不存在"
```

### 其他的说明

- 实际的图片地址由 CDN 地址和 `img` 、 `ext` 两个字段组合而成。例如：图片 CDN 地址为 `https://image.nmb.best/` ， `img` 为 `2022-06-18/62acedc59ef24` ， `ext` 为 `.png` ，则图片地址为 `https://image.nmb.best/image/2022-06-18/62acedc59ef24.png` ，缩略图地址为 `https://image.nmb.best/thumb/2022-06-18/62acedc59ef24.png` 。
- 部分版面需要饼干才能查看。

## 查看时间线

`GET /timeline`

### URL 参数

| 名称   | 类型   | 说明           |
| ------ | ------ | -------------- |
| `id`   | Number | 时间线 ID      |
| `page` | Number | 页数，默认为 1 |

### 其他的说明

- 和“查看版面”相同，不再重复。
- 部分时间线需要饼干才能查看。

## 查看串

`GET /thread`

### URL 参数

| 名称   | 类型   | 说明           |
| ------ | ------ | -------------- |
| `id`   | Number | 串的 ID        |
| `page` | Number | 页数，默认为 1 |

### 返回的数据

#### 请求成功

| 名称                  | 类型   | 说明                     |
| --------------------- | ------ | ------------------------ |
| `id`                  | Number | 参见“查看版面”，不再重复 |
| `fid`                 | Number |                          |
| `ReplyCount`          | Number |                          |
| `img`                 | String |                          |
| `ext`                 | String |                          |
| `now`                 | String |                          |
| `user_hash`           | String |                          |
| `name`                | String |                          |
| `title`               | String |                          |
| `content`             | String |                          |
| `sage`                | Number |                          |
| `admin`               | Number |                          |
| `Hide`                | Number |                          |
| `Replies[].id`        | Number |                          |
| `Replies[].user_hash` | String |                          |
| `Replies[].admin`     | Number |                          |
| `Replies[].title`     | String |                          |
| `Replies[].now`       | String |                          |
| `Replies[].content`   | String |                          |
| `Replies[].img`       | String |                          |
| `Replies[].ext`       | String |                          |
| `Replies[].name`      | String |                          |

JSON 响应内容示例

```json
{
  "id": 50000002,
  "fid": 4,
  "ReplyCount": 258,
  "img": "2022-06-18/62acedc59ef24",
  "ext": ".png",
  "now": "2022-06-18(六)05:10:29",
  "user_hash": "Admin",
  "name": "无名氏",
  "title": "无标题",
  "content": "&bull; 好久不见<br />\r\n&bull; 灾后重建有序进行中，部分板块暂停开放；旧串三酱会开发相关功后能陆续恢复<br />\r\n&bull; 使用逻辑与旧岛相同，禁晒妹及恶臭现充话题，建议点击<strong><a href=\"/t/50000001\">→ 全岛总版规 ←</a></strong>及各分版版规<br />\r\n&bull; 如对某版规存在异议，请点击<a href=\"/t/50286677\" target=\"_blank\">→ 既往公告及补充说明 ←</a>>>No.50286677 如仍有异议请转至圈内\r\n<br />\r\n&bull; 回应长文包含了大部分问题的解释，如对本岛及先前事件好奇请耐心阅读<br />\r\n&bull; 特殊事项请携缘由联系邮箱：<a href=mailtohelp@nmbxd.com>help@nmbxd.com</a><br />\r\n&bull;  原有数据会伴随新系统上线进行恢复，稍安勿躁<br />\r\n&bull; 客户端下载地址：<a href=\"https://app.nmbxd.com\" target=\"_blank\">https://app.nmbxd.com</a><br />\r\n&bull; <span style=\" font-weight: bold \"><font color=\"#CC0000\">不论是敌是友，久等了，欢迎回来。</font><span></h1>",
  "sage": 1,
  "admin": 1,
  "Hide": 0,
  "Replies": [
    {
      "id": 9999999,
      "user_hash": "Tips",
      "admin": 1,
      "title": "Tips",
      "now": "2099-01-01 00:00:01",
      "content": "(((　ﾟдﾟ)))球球你卜要",
      "img": "",
      "ext": "",
      "name": "无名氏"
    }
  ]
}
```

#### 请求错误

JSON 响应内容示例

```json
"该串不存在"
```

```json
{
  "success": false,
  "error": "必须登入领取饼干后才可以访问"
}
```

### 其他的说明

- 回复数据中可能会出现 Tips 酱，具体特征可以参见上面的示例。

## 查看串（只看 PO）

`GET /po`

### URL 参数

| 名称   | 类型   | 说明           |
| ------ | ------ | -------------- |
| `id`   | Number | 串的 ID        |
| `page` | Number | 页数，默认为 1 |

### 其他的说明

- 和“查看串”相同，不再重复。
- 同样可能会出现 Tips 酱。

## 查看引用

`GET /ref`

### URL 参数

| 名称 | 类型   | 说明    |
| ---- | ------ | ------- |
| `id` | Number | 串的 ID |

### 返回的数据

#### 请求成功

| 名称        | 类型   | 说明                     |
| ----------- | ------ | ------------------------ |
| `id`        | Number | 参见“查看版面”，不再重复 |
| `img`       | String |                          |
| `ext`       | String |                          |
| `now`       | String |                          |
| `user_hash` | String |                          |
| `name`      | String |                          |
| `title`     | String |                          |
| `content`   | String |                          |
| `sage`      | Number |                          |
| `status`    | String |                          |
| `Hide`      | Number |                          |

JSON 响应内容示例

```json
{
  "id": 50000002,
  "img": "2022-06-18/62acedc59ef24",
  "ext": ".png",
  "now": "2022-06-18(六)05:10:29",
  "user_hash": "Admin",
  "name": "无名氏",
  "title": "无标题",
  "content": "&bull; 好久不见<br />\r\n&bull; 灾后重建有序进行中，部分板块暂停开放；旧串三酱会开发相关功后能陆续恢复<br />\r\n&bull; 使用逻辑与旧岛相同，禁晒妹及恶臭现充话题，建议点击<strong><a href=\"/t/50000001\">→ 全岛总版规 ←</a></strong>及各分版版规<br />\r\n&bull; 如对某版规存在异议，请点击<a href=\"/t/50286677\" target=\"_blank\">→ 既往公告及补充说明 ←</a>>>No.50286677 如仍有异议请转至圈内\r\n<br />\r\n&bull; 回应长文包含了大部分问题的解释，如对本岛及先前事件好奇请耐心阅读<br />\r\n&bull; 特殊事项请携缘由联系邮箱：<a href=mailtohelp@nmbxd.com>help@nmbxd.com</a><br />\r\n&bull;  原有数据会伴随新系统上线进行恢复，稍安勿躁<br />\r\n&bull; 客户端下载地址：<a href=\"https://app.nmbxd.com\" target=\"_blank\">https://app.nmbxd.com</a><br />\r\n&bull; <span style=\" font-weight: bold \"><font color=\"#CC0000\">不论是敌是友，久等了，欢迎回来。</font><span></h1>",
  "sage": 1,
  "status": "n",
  "admin": 1
}
```

#### 请求错误

JSON 响应内容示例

```json
{
  "success": false,
  "error": "该串不存在"
}
```

### 其他的说明

- 可以查看串和回复的内容，但是并没有办法获取回复所属的串号。

## 发串

`POST https://www.nmbxd.com/home/forum/doPostThread.html`

### 载荷内容

| 名称      | 类型    | 说明                                                                                    |
| --------- | ------- | --------------------------------------------------------------------------------------- |
| `name`    | String  | 默认为“无名氏”的发串人名称，可选，当然实际上用这个来自爆身份的话是会被肥肥们 (　^ω^) 的 |
| `title`   | String  | 默认为“无标题”的串标题，可选                                                            |
| `content` | String  | 串的内容                                                                                |
| `fid`     | Number  | 发串的版面 ID                                                                           |
| `image`   | File    | 附加图片，可选                                                                          |
| `water`   | Boolean | 附加图片是否添加水印，可选                                                              |

### 返回的数据

#### 请求成功

HTML 响应内容示例

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>跳转提示</title>
    <style type="text/css">
      /* ... */
    </style>
    <meta name="__hash__" content="..." />
  </head>
  <body>
    <div class="system-message">
      <h1>:(</h1>
      <p class="success">发串成功</p>
      <p class="detail"></p>
      <p class="jump">
        页面自动
        <a id="href" href="https://www.nmbxd.com/home/forum/doPostThread.html"
          >跳转</a
        >
        等待时间： <b id="wait">3</b>
      </p>
    </div>
    <script type="text/javascript">
      (function () {
        var wait = document.getElementById("wait"),
          href = document.getElementById("href").href;
        var interval = setInterval(function () {
          var time = --wait.innerHTML;
          if (time <= 0) {
            location.href = href;
            clearInterval(interval);
          }
        }, 1000);
      })();
    </script>
  </body>
</html>
```

#### 请求错误

HTML 响应内容示例

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>跳转提示</title>
    <style type="text/css">
      /* ... */
    </style>
    <meta name="__hash__" content="..." />
  </head>
  <body>
    <div class="system-message">
      <h1>:(</h1>
      <p class="error">未应用饼干，请在用户中心应用饼干</p>
      <p class="detail"></p>
      <p class="jump">
        页面自动
        <a id="href" href="/Member/User/Cookie/index.html">跳转</a> 等待时间：
        <b id="wait">3</b>
      </p>
    </div>
    <script type="text/javascript">
      (function () {
        var wait = document.getElementById("wait"),
          href = document.getElementById("href").href;
        var interval = setInterval(function () {
          var time = --wait.innerHTML;
          if (time <= 0) {
            location.href = href;
            clearInterval(interval);
          }
        }, 1000);
      })();
    </script>
  </body>
</html>
```

### 其他的说明

- 发串和回复串没有 JSON API，只能使用网页版的 API，域名为匿名版主站的域名。
- 串的内容和附加图片不能同时为空。
- `water` 的值遵从 [PHP 的类型转换到 `bool` 的规则](https://www.php.net/manual/zh/language.types.boolean.php#language.types.boolean.casting) 。例如：不写 `water` 字段或留空或设为 `0` 均不会添加水印，设为 `true` 或 `foobar` 等值则会添加水印。

## 回复串

`POST https://www.nmbxd.com/home/forum/doReplyThread.html`

### 载荷内容

| 名称      | 类型    | 说明                 |
| --------- | ------- | -------------------- |
| `name`    | String  | 参见“发串”，不再重复 |
| `title`   | String  |                      |
| `content` | String  |                      |
| `resto`   | Number  | 回复的串的 ID        |
| `image`   | File    |                      |
| `water`   | Boolean |                      |

### 其他的说明

- 和“发串”相同，不再重复。

## 查看订阅

`GET /feed`

### URL 参数

| 名称   | 类型   | 说明           |
| ------ | ------ | -------------- |
| `uuid` | String | 订阅 ID        |
| `page` | Number | 页数，默认为 1 |

### 返回的数据

#### 请求成功

| 名称                | 类型   | 说明                                                           |
| ------------------- | ------ | -------------------------------------------------------------- |
| `[].id`             | String | 串的 ID                                                        |
| `[].user_id`        | String | 发串的用户 ID？                                                |
| `[].fid`            | String | 串所属的版面 ID                                                |
| `[].reply_count`    | String | 回复数量                                                       |
| `[].recent_replies` | String | 最近几条回复的 ID，使用的是 `[0,1,2,3]` 这样的类似于数组的格式 |
| `[].category`       | String | ？                                                             |
| `[].file_id`        | String | ？                                                             |
| `[].img`            | String | 参见“查看版面”，不再重复                                       |
| `[].ext`            | String |                                                                |
| `[].now`            | String |                                                                |
| `[].user_hash`      | String |                                                                |
| `[].name`           | String |                                                                |
| `[].email`          | String |                                                                |
| `[].title`          | String |                                                                |
| `[].content`        | String |                                                                |
| `[].status`         | String |                                                                |
| `[].admin`          | String |                                                                |
| `[].hide`           | String |                                                                |
| `[].po`             | String | ？                                                             |

JSON 响应内容示例

```json
[
  {
    "id": "50000002",
    "user_id": "1001",
    "fid": "4",
    "reply_count": "258",
    "recent_replies": "[50038591,50038797,50038848,50039112,50043122]",
    "category": "",
    "file_id": "22",
    "img": "2022-06-18/62acedc59ef24",
    "ext": ".png",
    "now": "2022-06-18(六)05:10:29",
    "user_hash": "Admin",
    "name": "",
    "email": "",
    "title": "",
    "content": "&bull; 好久不见<br />\r\n&bull; 灾后重建有序进行中，部分板块暂停开放；旧串三酱会开发相关功后能陆续恢复<br />\r\n&bull; 使用逻辑与旧岛相同，禁晒妹及恶臭现充话题，建议点击<strong><a href=\"/t/50000001\">→ 全岛总版规 ←</a></strong>及各分版版规<br />\r\n&bull; 如对某版规存在异议，请点击<a href=\"/t/50286677\" target=\"_blank\">→ 既往公告及补充说明 ←</a>>>No.50286677 如仍有异议请转至圈内\r\n<br />\r\n&bull; 回应长文包含了大部分问题的解释，如对本岛及先前事件好奇请耐心阅读<br />\r\n&bull; 特殊事项请携缘由联系邮箱：<a href=mailtohelp@nmbxd.com>help@nmbxd.com</a><br />\r\n&bull;  原有数据会伴随新系统上线进行恢复，稍安勿躁<br />\r\n&bull; 客户端下载地址：<a href=\"https://app.nmbxd.com\" target=\"_blank\">https://app.nmbxd.com</a><br />\r\n&bull; <span style=\" font-weight: bold \"><font color=\"#CC0000\">不论是敌是友，久等了，欢迎回来。</font><span></h1>",
    "status": "n",
    "admin": "1",
    "hide": "0",
    "po": ""
  },
  {
    "id": "50000169",
    "user_id": "1105",
    "fid": "20",
    "reply_count": "1135",
    "recent_replies": "[51935318,51936163,51939274,51941772,51942390]",
    "category": "",
    "file_id": "36",
    "img": "2022-06-19/62af2ec8136e9",
    "ext": ".jpg",
    "now": "2022-06-19(日)22:12:23",
    "user_hash": "7JRS3ze",
    "name": "",
    "email": "",
    "title": "",
    "content": "地狱笑话串重新建立！<br />\n(σﾟ∀ﾟ)σ",
    "status": "n",
    "admin": "0",
    "hide": "0",
    "po": ""
  }
]
```

### 其他的说明

- 订阅 ID 的字段虽然名为 `uuid` ，但是实际上并不需要遵守 UUID 的格式。 **包括空字符串在内的** 任意长度的字符串都可以作为订阅 ID 使用。
- **这个 API 同样把所有本来应该返回 Number 的字段弄成了 String** ，需要注意类型转换问题。

## 添加订阅

`POST /addFeed`

### URL 参数

| 名称   | 类型   | 说明    |
| ------ | ------ | ------- |
| `uuid` | String | 订阅 ID |

### 载荷内容

| 名称  | 类型   | 说明    |
| ----- | ------ | ------- |
| `tid` | Number | 串的 ID |

### 返回的数据

#### 请求成功

JSON 响应内容示例

```json
"订阅大成功→_→"
```

#### 请求错误

JSON 响应内容示例

```json
"该串不存在"
```

### 其他的说明

- 即使已经使用这个订阅 ID 订阅过某个串，再次订阅时仍然会提示订阅成功。并没有办法获取某个串是否已经订阅过。
- 把 `uuid` 和 `tid` 写到 URL 参数或者载荷里都可以，如果都写到 URL 参数的话使用 GET 也可以。

## 取消订阅

`POST /delFeed`

### URL 参数

| 名称   | 类型   | 说明    |
| ------ | ------ | ------- |
| `uuid` | String | 订阅 ID |

### 载荷内容

| 名称  | 类型   | 说明    |
| ----- | ------ | ------- |
| `tid` | Number | 串的 ID |

### 返回的数据

#### 请求成功

JSON 响应内容示例

```json
"取消订阅成功!"
```

### 其他的说明

- 即使并没有使用这个订阅 ID 订阅过某个串或串本身不存在，取消订阅时仍然会提示取消订阅成功。

## 获取最近发的串

`GET /getLastPost`

### 返回的数据

#### 请求成功

| 名称        | 类型   | 说明                                |
| ----------- | ------ | ----------------------------------- |
| `id`        | Number | 串的 ID                             |
| `resto`     | Number | 回复的串的 ID，如果是发新的串则为 0 |
| `now`       | String | 参见“查看版面”，不再重复            |
| `user_hash` | String |                                     |
| `email`     | String |                                     |
| `title`     | String |                                     |
| `content`   | String |                                     |
| `sage`      | Number |                                     |
| `admin`     | Number |                                     |

JSON 响应内容示例

```json
{
  "id": 64599685,
  "resto": 64596190,
  "now": "2024-12-05(四)17:17:07",
  "user_hash": "bRRnPeX",
  "name": "无名氏",
  "email": "",
  "title": "无标题",
  "content": "test",
  "sage": 0,
  "admin": 0
}
```

### 其他的说明

- 只能在发串/回复后的大约 3 秒内从这个 API 查到数据，否则会返回 `[]` 。

## 查看匿名版公告

`GET https://nmb.ovear.info/nmb-notice.json`

### 返回的数据

#### 请求成功

| 名称      | 类型    | 说明                                   |
| --------- | ------- | -------------------------------------- |
| `content` | String  | 公告内容，使用 HTML                    |
| `date`    | Number  | 公告发布时间，可以据此判断是否为新公告 |
| `enable`  | Boolean | ？                                     |

JSON 响应内容示例

```json
{
  "content": "【小说板块】于圈内开设官方完结小说申请串；<br>>>No.51854427<br>持续更新小说亦可按格式提交申请<br>【跑团板块】版规已更新<br><br>其他版块集中串请等待后续跟进完善",
  "date": 2022090900001,
  "enable": true
}
```

## 随机封面图

`GET https://nmb.ovear.info/h.php`

### 返回的数据

使用 302 跳转到一张随机的封面图。

```json
HTTP/2 302 Found
server: nginx
date: Mon, 12 Sep 2022 05:57:54 GMT
content-type: text/html; charset=UTF-8
content-length: 0
x-powered-by: PHP/8.0.1
cache-control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0
expires: Sat, 26 Jul 1997 05:00:00 GMT
location: /h/61dc5a5e22268.jpg
x-backend-server: noname
```
