# 天宫背景视频 (Tiān Gōng background video)

把全屏背景视频文件放到本目录并命名为 **`ominode-tiangong.mp4`**，前端即自动启用：

```
web/default/public/media/ominode-tiangong.mp4
```

未提供该文件时页面优雅降级：视频层隐藏，露出底下的暮光夜空渐变画布，外观与当前一致。

## 素材建议

- 格式：MP4（H.264 / H.265），移动端 + 桌面端 `object-cover` 全屏铺满，超出部分自动裁剪；
- 时长：15–60 秒为宜，自动循环（loop）、静音（muted）播放；
- 内容：东方仙侠・国风幻境 / 云端天宫 CG 素材，暖金色晨昏柔光、低饱和度电影质感；
- 体积：建议 ≤ 10MB（高清视频会拖慢首屏加载，可考虑 WebM 备选）。

部署后文件位于站点 `/media/ominode-tiangong.mp4`。改动本目录内容后重新构建前端即可生效。
