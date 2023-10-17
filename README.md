

## 介绍

libpag-android 基于[libpag](https://github.com/Tencent/libpag)适配了android x86_64架构。
libpag 是  PAG (Portable Animated Graphics) 动效文件的渲染 SDK，目前已覆盖几乎所有的主流平台，包括：iOS, Android, macOS,
Windows, Linux, 以及 Web 端。

PAG 方案是一套完善的动效工作流。提供从 AE（Adobe After Effects）导出插件，到桌面预览工具 PAGViewer，再到各端的跨平台渲染 SDK。
目标是降低或消除动效研发相关的成本，打通设计师创作到素材交付上线的极简流程，不断输出运行时可编辑的高质量动效内容。

PAG 方案目前已经接入了腾讯系 40 余款应用，包括微信，手机QQ，王者荣耀，腾讯视频，QQ音乐等头部产品，稳定性经过了海量用户的持续验证，可以广泛应用于UI动画、贴纸动画、视频编辑、模板设计等场景。典型应用场景可以参考[官网案例](https://pag.art/case.html)。

详细介绍可以参考相关报道：

- [王者QQ微信都在用的动画神器要开源了：把交付时间缩短90%](https://mp.weixin.qq.com/s/a8-yOp8h5LiFGKSdLE_toA)
- [腾讯推出移动端动画组件PAG，释放设计生产力](https://mp.weixin.qq.com/s/STxOMV2lqGdGu-9mBkAz_A)

## PAG 优势

- **高效的文件格式**

<img src="resources/readme/intro_1.png" alt="intro_1" width="282"/>

采用可扩展的二进制文件格式，可单文件集成图片音频等资源，实现快速交付。导出相同的 AE 动效内容，在文件解码速度和压缩率上均大幅领先于同类型方案。

- **全 AE 特性支持**

<img src="resources/readme/intro_2.png" alt="intro_2" width="282"/>

在纯矢量导出方式上支持更多 AE 特性的同时，还引入了BMP预合成结合矢量的混合导出能力，实现支持所有 AE 特性的同时又能保持动效运行时的可编辑性。

- **性能监测可视化**

<img src="resources/readme/intro_4.png" alt="intro_4" width="282"/>

通过导出插件内置的自动优化策略，以及预览工具集成的性能监测面板，能够直观地看到每个素材的性能状态，以帮助设计师制作效果和性能俱佳的动画特效。

- **运行时可编辑**

<img src="resources/readme/intro_5.png" alt="intro_5" width="282"/>

运行时，可在保留动效效果前提下，动态修改替换文本或替换占位图内容，甚至对任意子图层进行增删改及移动，轻松实现照片和视频模板等素材的批量化生产。

## 系统要求

- Android 4.4 版本及以上



### API 手册：

- [Android API 参考](https://pag.art/api.html#/apis/android/org/libpag/package-summary.html)

更多的其他文档可以访问官网  [pag.art](https://pag.art/docs/mobile-sdk-guide.html) 获得。

## 开发指南

**如果您希望参与到 libpag 项目的源码开发中，请务必严格按照以下步骤先配置完开发环境再进行开发和调试。**

我们推荐使用 CLion 并在 macOS 平台上进行开发。


### 编译环境

- Ubuntu 18.04+
- GCC 7.0 版本及以上
- CMake 3.10.2 版本及以上
- NDK 25.1.8937393



### 编译项目

1. 执行build_linux.sh,编译
```
./build_linux.sh
```
2. 用android studio编译ffavc jni生成arm，arm64，x86_64架构的so
3. 拷贝步骤2的so到android libpag项目中生成libpag.aar
4. 引用libpag.aar即可




## 协议

libpag 基于 [Apache-2.0](./LICENSE.txt) 协议开源.

## 隐私政策

使用 libpag SDK 时请遵守 [PAG SDK个人信息保护规则](https://privacy.qq.com/document/preview/01e79d0cc7a2427ba774b88c6beff0fd).




