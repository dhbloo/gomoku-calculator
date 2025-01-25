<template>
  <div id="app" style="height: 100%">
    <drawer :show.sync="drawerOpen" show-mode="overlay" placement="right" :drawer-style="{
      'background-color': 'rgba(255,255,255,1.0)',
      width: 'min(75%, 600px)',
      height: '100%',
    }">
      <!-- drawer content -->
      <div ref="drawer" slot="drawer" class="drawer">
        <div style="padding: 10px">
          <p v-for="(msg, index) in messages" :key="index">{{ msg }}<br /></p>
        </div>
      </div>

      <view-box ref="viewBox" :body-padding-top="showHeader ? '46px' : '0'" body-padding-bottom="50px">
        <!-- header content -->
        <x-header v-if="showHeader" slot="header" class="header-bar" :left-options="{ showBack: false }"
          :right-options="{ showMore: false }" @on-click-more="showMessages">
          {{ $t('appName') }}
          <a v-if="route.path !== '/settings' && route.path !== '/about'" slot="right" class="needsclick"
            @click="showMessages">
            <i class="fa fa-list fa-lg" aria-hidden="true" style="color: #d6eaf8"></i>
          </a>
        </x-header>

        <!-- main content -->
        <keep-alive>
          <router-view class="router-view"></router-view>
        </keep-alive>

        <!-- tabbar content -->
        <tabbar class="app-tabber" slot="bottom" style="position: fixed">
          <tabbar-item link="/" :selected="route.path !== '/settings' && route.path !== '/about'">
            <x-icon slot="icon" type="ios-grid-view-outline"></x-icon>
            <x-icon slot="icon-active" type="ios-grid-view-outline" class="tabber-icon-active"></x-icon>
            <span slot="label">{{ $t('tabbar.game') }}</span>
          </tabbar-item>
          <tabbar-item link="/settings" :selected="route.path === '/settings'">
            <x-icon slot="icon" type="ios-cog-outline"></x-icon>
            <x-icon slot="icon-active" type="ios-cog-outline" class="tabber-icon-active"></x-icon>
            <span slot="label">{{ $t('tabbar.settings') }}</span>
          </tabbar-item>
          <tabbar-item link="/about" :selected="route.path === '/about'">
            <x-icon slot="icon" type="ios-information-outline"></x-icon>
            <x-icon slot="icon-active" type="ios-information-outline" class="tabber-icon-active"></x-icon>
            <span slot="label">{{ $t('tabbar.about') }}</span>
          </tabbar-item>
        </tabbar>
      </view-box>
    </drawer>
  </div>
</template>

<script>
import { ViewBox, XHeader, Tabbar, TabbarItem, Drawer } from 'vux'
import { mapState, mapMutations, mapActions } from 'vuex'
import { register } from 'register-service-worker'

function canShowInstallPrompt() {
  const installData = JSON.parse(localStorage.getItem('pwaInstallPromptData'));
  if (!installData)
    return true;

  const { lastShown, count } = installData;
  const today = new Date().toDateString();

  if (count >= 5) {
    // 已经显示超过5次
    return false;
  }

  if (lastShown === today) {
    // 今天已经显示过
    return false;
  }

  return true;
}

function updateInstallPromptData() {
  const today = new Date().toDateString();
  const installData = JSON.parse(localStorage.getItem('pwaInstallPromptData')) || { lastShown: null, count: 0 };

  if (installData.lastShown !== today) {
    installData.lastShown = today;
    installData.count += 1;
    localStorage.setItem('pwaInstallPromptData', JSON.stringify(installData));
  }
}

export default {
  components: {
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Drawer,
  },
  data: function () {
    return {
      showHeader: true,
      drawerOpen: false,
    }
  },
  computed: {
    ...mapState('settings', ['language']),
    ...mapState('ai', ['messages']),
    route() {
      return this.$route
    },
  },
  methods: {
    ...mapMutations('settings', ['setValue']),
    ...mapActions('settings', ['readCookies']),
    ...mapActions(['getBrowserCapabilities']),
    showMessages: function () {
      this.drawerOpen = !this.drawerOpen
    },
  },
  watch: {
    language(newValue) {
      this.$i18n.locale = newValue
    },
  },
  created() {
    this.getBrowserCapabilities()
    this.readCookies()
    if (!this.language) {
      this.setValue({ key: 'language', value: this.$i18n.locale })
    } else {
      this.$i18n.locale = this.language
    }
  },
  mounted() {
    const _this = this
    // 加入 i18n 版本的 $vux.alert, $vux.confirm
    this.$vux.alert.show_i18n = function (options) {
      options.buttonText = _this.$t('common.ok')
      _this.$vux.alert.show(options)
    }
    this.$vux.confirm.show_i18n = function (options) {
      options.confirmText = _this.$t('common.confirm')
      options.cancelText = _this.$t('common.cancel')
      _this.$vux.confirm.show(options)
    }
    this.$vux.confirm.prompt_i18n = function (value, options) {
      options.confirmText = _this.$t('common.confirm')
      options.cancelText = _this.$t('common.cancel')
      _this.$vux.confirm.prompt(value, options)
    }

    window.onresize = function () {
      // 定义窗口大小变更通知事件
      _this.$store.commit('setScreenSize', {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      })
    }

    // 注册 Service Worker
    if (process.env.NODE_ENV === 'production') {
      register(`${process.env.BASE_URL}service-worker.js`, {
        ready() {
          console.log(
            'App is being served from cache by a service worker.\n' +
            'For more details, visit https://goo.gl/AFskqB'
          )
        },
        updated() {
          _this.$vux.confirm.show_i18n({
            title: _this.$t('update.title'),
            content: _this.$t('update.msg'),
            onConfirm() {
              location.reload()
            },
            onCancel() { }
          })
        },
        error(error) {
          console.error('Error during service worker registration:', error)
        }
      })

      window.addEventListener('beforeinstallprompt', (e) => {
        if (!canShowInstallPrompt()) {
          // 不符合显示条件，不阻止默认行为也不显示自定义弹窗
          return;
        }

        // 阻止默认的迷你信息栏或安装对话框在移动设备上出现
        e.preventDefault();
        // 保存事件，稍后需要触发它
        const deferredPrompt = e;

        _this.$vux.confirm.show_i18n({
          title: _this.$t('install.title'),
          content: _this.$t('install.msg'),
          onConfirm() {
            // 更新弹窗显示数据
            updateInstallPromptData();
            // 显示安装提示
            deferredPrompt.prompt();
          },
          onCancel() {
            updateInstallPromptData();
          }
        });
      });
    }
  },
}
</script>

<style lang="less">
@import '~vux/src/styles/index.less';

html,
body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  margin: 0px;
}

body {
  background-color: @background-color;
  // 文字均不可选
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.header-bar {
  width: 100%;
  position: fixed !important;
  top: 0;
  z-index: 100;
}

.tabber-icon-active {
  fill: @tabber-icon-active-color;
}

.drawer {
  height: 100%;
  -webkit-user-select: text;
  -khtml-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  word-wrap: break-word;
  overflow-y: auto;
}

.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  top: 46px;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}

.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
