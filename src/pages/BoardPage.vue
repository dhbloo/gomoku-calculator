<template>
  <q-page class="board-page">
    <div class="board-box">
      <GameBoard v-bind="boardProps" @click-move="onClickMove"></GameBoard>

      <q-scroll-area class="button-scroll" :thumb-style="{ height: '5px' }">
        <div class="button-bar">
          <span v-for="button in Buttons" :key="button.id">
            <span v-if="button.id === undefined" class="button-separator"></span>
            <q-btn v-else-if="button.menu && button.noDropdown" v-bind="getToolBtnProps(button)">
              <q-tooltip :offset="[0, 6]" :delay="500" v-if="getToolBtnTip(button).length > 0">
                <span class="text-caption">{{ getToolBtnTip(button) }}</span>
              </q-tooltip>
              <q-menu auto-close>
                <q-list>
                  <q-item v-for="subbtn in button.menu" :key="subbtn.id" v-bind="getToolBtnProps(subbtn, true)">
                    <q-item-section avatar style="min-width: 40px;">
                      <q-icon :name="subbtn.icon" v-bind="subbtn.iconProps || {}" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ getToolBtnTip(subbtn) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn-dropdown v-else-if="button.menu" v-bind="getToolBtnProps(button)">
              <q-list>
                <q-item v-close-popup v-for="subbtn in button.menu" :key="subbtn.id"
                  v-bind="getToolBtnProps(subbtn, true)">
                  <q-item-section avatar style="min-width: 40px;">
                    <q-icon :name="subbtn.icon" v-bind="subbtn.iconProps || {}" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ getToolBtnTip(subbtn) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn v-else v-bind="getToolBtnProps(button)">
              <q-tooltip :offset="[0, 6]" :delay="500" v-if="getToolBtnTip(button).length > 0">
                <span class="text-caption">{{ getToolBtnTip(button) }}</span>
              </q-tooltip>
            </q-btn>
          </span>
        </div>
      </q-scroll-area>
    </div>

    <q-separator spaced></q-separator>

    <div class="info-box">
      <div style="width: 600px; background-color: cadetblue;">Hello World!</div>
    </div>

    <q-dialog v-model="showScreenshotDialog" position="bottom">
      <q-card class="full-width">
        <div v-if="screenshotCallback">
          <q-card-section>
            <div class="text-h6">{{ t('board.dialog.screenshot.custom.title') }}</div>
          </q-card-section>
          <q-card-section>
            <q-input filled v-model="screenshotTitle" :label="t('board.dialog.screenshot.custom.caption')"
              :placeholder="t('board.dialog.screenshot.custom.default_caption')" />
            <q-checkbox v-model="screenshotDisplayRule" :label="t('board.dialog.screenshot.custom.showrule')" />
            <div class="q-pa-sm">
              <span class="q-mr-md">{{ t('board.dialog.screenshot.custom.resolution') }}</span>
              <q-btn-toggle unelevated v-model.number="screenshotScaleRatio" toggle-color="primary" :options="[
                { label: '1x', value: 1 },
                { label: '2x', value: 2 },
                { label: '3x', value: 3 },
                { label: '4x', value: 4 },
                { label: '5x', value: 5 },
              ]" />
            </div>
            <div v-if="screenshotType == 'gif'">
              <q-input filled type="number" v-model.number="screenshotStartIndex"
                :label="t('board.dialog.screenshot.custom.index')" />
              <q-input filled type="number" v-model.number="screenshotDelayms"
                :label="t('board.dialog.screenshot.custom.delay')" />
              <q-input filled type="number" v-model.number="screenshotDelaymsFinal"
                :label="t('board.dialog.screenshot.custom.delay_final')" />
            </div>
          </q-card-section>
        </div>
        <div v-else-if="!screenshotImgData" class="full-width">
          <div class="q-mx-auto" style="max-width: fit-content;">
            <q-spinner size="100px" class="q-pa-sm" />
            <div class="text-subtitle1 text-center">
              {{ t('board.dialog.screenshot.generating') }}
            </div>
          </div>
        </div>
        <q-img v-else :src="screenshotImgData.url" />

        <q-card-actions vertical>
          <q-btn v-if="screenshotImgData" class="platform-ios-hide" unelevated no-caps color="positive"
            :label="t('board.dialog.screenshot.download')"
            @click="downloadScreenshot(screenshotImgData, screenshotType)" />
          <q-btn v-if="screenshotImgData" class="platform-ios-only" unelevated no-caps disabled color="positive"
            :label="t('board.dialog.screenshot.manual')" />
          <q-btn v-if="screenshotCallback" unelevated no-caps color="primary" :label="t('board.dialog.screenshot.ok')"
            @click="screenshotCallback()"></q-btn>
          <q-btn unelevated no-caps :label="t('board.dialog.screenshot.close')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar, QImg, date } from 'quasar';
import { BoardProps, exportGIF, exportJPG } from 'components/GameBoard';
import { usePositionStore } from 'stores/position';
import { useSettingsStore } from 'stores/settings';
import { Coord, Move, Symmetry, Direction, getRuleName } from 'src/services/game-types';
import GameBoard from 'components/GameBoard.vue';

defineOptions({
  name: 'BoardPage'
});

const $q = useQuasar();
const { t } = useI18n();
const route = useRoute();
const position = usePositionStore();
const settings = useSettingsStore();

const isThinking = ref(false);

type ScreenshotType = 'jpg' | 'gif';
const showScreenshotDialog = ref(false);
const screenshotType = ref<ScreenshotType>('jpg');
const screenshotImgData = ref<{ blob: Blob, url: string }>();
const screenshotTitle = ref<string>('');
const screenshotDisplayRule = ref<boolean>(false);
const screenshotScaleRatio = ref<number>(3);
const screenshotStartIndex = ref<number>(1);
const screenshotDelayms = ref<number>(1000);
const screenshotDelaymsFinal = ref<number>(2500);
const screenshotCallback = ref<() => void>();

const boardProps = computed(() => {
  return {
    boardSize: position.size,
    settings: settings.boardSettings,
    history: position.history,
    nextMove: position.nextMove,
    winline: position.winline,
    forbids: [] as Coord[],
  } as BoardProps;
});

function onClickMove(move: Move, button: number) {
  if (isThinking.value) return

  if (button == 0) {
    if (move != 'pass' && !position.isEmpty(move)) return
    if (position.finished) return
    position.makeMove(move);
  } else if (button == 2) {
    position.backward();
  }
}

const btnProps = computed(() => {
  return {
    unelevated: true,
    size: 'md',
    padding: 'sm',
    color: $q.dark.isActive ? 'btn--dark' : 'btn--light',
    textColor: $q.dark.isActive ? 'btn--dark' : 'btn--light',
    style: 'margin: 0px 0.25px;',
    noCaps: true,
  };
});

interface ToolBarButton {
  id: string;
  icon: string;
  props?: object;
  iconProps?: object;
  loadingProps?: object;
  disabledProps?: object;
  loading?: Ref<boolean>;
  disabled?: Ref<boolean>;
  clicked?: () => void;
  menu?: ToolBarButton[];
  noDropdown?: boolean;
}

function getToolBtnProps(button: ToolBarButton, isMenu = false) {
  let props = {
    ...(isMenu ? { clickable: true } : btnProps.value),
    icon: button.icon,
    loading: button.loading ? button.loading.value : undefined,
    disabled: button.disabled ? button.disabled.value : undefined,
    onClick: button.clicked,
  };
  if (button.props) Object.assign(props, button.props);
  return props;
}

function getToolBtnTip(button: ToolBarButton) {
  if (button.id === undefined) return '';
  const suffix = button.loading?.value ? '_loading' : '';
  return t(`board.toolbar.${button.id}${suffix}`)
}

function checkIdle(fn: () => void, cancel = () => { ; }) {
  return () => {
    if (isThinking.value) {
      $q.dialog({
        title: t('board.dialog.checkidle.title'),
        message: t('board.dialog.checkidle.message'),
        cancel: true,
      }).onOk(() => {
        // TODO: Stop thinking
        fn();
      }).onCancel(cancel).onDismiss(cancel);
    } else {
      fn();
    }
  }
}

function takeScreenshot(type: ScreenshotType, custom: boolean) {
  showScreenshotDialog.value = true;
  screenshotType.value = type;
  screenshotImgData.value = undefined;
  const blobCallback = (b: unknown) => {
    screenshotImgData.value = { blob: b as Blob, url: URL.createObjectURL(b as Blob) };
  };

  if (type == 'jpg') {
    if (custom) {
      screenshotCallback.value = () => {
        let title = screenshotTitle.value ? screenshotTitle.value
          : t('board.dialog.screenshot.custom.default_caption')
        if (screenshotDisplayRule.value)
          title += ' - ' + getRuleName(settings.rule);
        screenshotCallback.value = undefined;
        exportJPG(boardProps.value, title, screenshotScaleRatio.value)?.then(blobCallback);
      }
    } else {
      screenshotCallback.value = undefined;
      exportJPG(boardProps.value, null)?.then(blobCallback);
    }
  }
  else if (type == 'gif') {
    if (custom) {
      screenshotCallback.value = () => {
        let title = screenshotTitle.value ? screenshotTitle.value
          : t('board.dialog.screenshot.custom.default_caption')
        if (screenshotDisplayRule.value)
          title += ' - ' + getRuleName(settings.rule);
        screenshotCallback.value = undefined;
        exportGIF(boardProps.value,
          title,
          screenshotStartIndex.value,
          screenshotDelayms.value,
          screenshotDelaymsFinal.value,
          screenshotScaleRatio.value)?.then(blobCallback);
      }
    } else {
      screenshotCallback.value = undefined;
      exportGIF(boardProps.value, null, 1, 1000, 2500)?.then(blobCallback);
    }

  }
}

function downloadScreenshot(imgData: { url: string }, imgType: ScreenshotType) {
  // Create a link element
  const link = document.createElement('a')

  // Set link's href to point to the Blob URL
  link.href = imgData.url
  link.download = `gomocalc-${date.formatDate(new Date(), 'YYYY-MM-DD_HH_mm_ss')}.${imgType}`

  // Append link to the body
  document.body.appendChild(link)

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  )

  // Remove link from body
  document.body.removeChild(link)
}

const Buttons = [
  {
    id: 'new', icon: 'eva-file-outline',
    clicked: checkIdle(() => position.newGame(settings.boardSize))
  },
  {
    id: 'backall', icon: 'eva-arrowhead-left-outline',
    disabled: computed(() => position.history.length == 0),
    clicked: checkIdle(() => position.backward(true))
  },
  {
    id: 'back', icon: 'eva-arrow-ios-back-outline',
    disabled: computed(() => position.history.length == 0),
    clicked: checkIdle(() => position.backward())
  },
  {
    id: 'forward', icon: 'eva-arrow-ios-forward-outline',
    disabled: computed(() => position.lastHistory.length <= position.history.length),
    clicked: checkIdle(() => position.forward())
  },
  {
    id: 'forwardall', icon: 'eva-arrowhead-right-outline',
    disabled: computed(() => position.lastHistory.length <= position.history.length),
    clicked: checkIdle(() => position.forward(true))
  },
  {
    id: 'think', icon: 'eva-play-circle-outline',
    loading: isThinking,
    props: { textColor: 'positive' },
    clicked: () => isThinking.value = !isThinking.value
  },
  {
    id: 'stop', icon: 'eva-stop-circle-outline',
    disabled: computed(() => !isThinking.value),
    props: { textColor: 'negative' },
    clicked: () => isThinking.value = false
  },
  {
    id: 'more', icon: undefined,
    props: { textColor: 'primary' },
    menu: [
      { id: 'balance1', icon: 'eva-radio-button-off-outline', clicked: () => console.log(1) },
      { id: 'balance2', icon: 'eva-radio-button-on-outline', clicked: () => console.log(2) },
      { id: 'nbestall', icon: 'eva-shield-outline', clicked: () => console.log(3) },
      { id: 'clearhash', icon: 'eva-trash-outline', clicked: () => console.log(4) },
    ] as ToolBarButton[]
  },
  {},
  {
    id: 'snapshot', icon: 'eva-image-outline',
    menu: [
      { id: 'snapshot_jpg', icon: 'eva-image-outline', clicked: () => takeScreenshot('jpg', false) },
      { id: 'snapshot_jpg_custom', icon: 'eva-image-outline', clicked: () => takeScreenshot('jpg', true) },
      { id: 'snapshot_gif', icon: 'eva-video-outline', clicked: () => takeScreenshot('gif', false) },
      { id: 'snapshot_gif_custom', icon: 'eva-video-outline', clicked: () => takeScreenshot('gif', true) },
    ] as ToolBarButton[],
    noDropdown: true
  },
  { id: 'index', icon: 'eva-pricetags-outline' },
  {},
  {
    id: 'rotate', icon: 'eva-sync-outline',
    clicked: checkIdle(() => position.applySymmetry(Symmetry.Rotate90)),
  },
  {
    id: 'flip', icon: 'eva-swap-outline',
    menu: [
      {
        id: 'flipy', icon: 'eva-swap-outline',
        clicked: checkIdle(() => position.applySymmetry(Symmetry.FlipY)),
      },
      {
        id: 'flipx', icon: 'eva-swap-outline',
        iconProps: { class: 'rotate-90' },
        clicked: checkIdle(() => position.applySymmetry(Symmetry.FlipX)),
      },
      {
        id: 'flipyx', icon: 'eva-swap-outline',
        iconProps: { class: 'rotate-135' },
        clicked: checkIdle(() => position.applySymmetry(Symmetry.FlipYX)),
      },
      {
        id: 'flipxy', icon: 'eva-swap-outline',
        iconProps: { class: 'rotate-45' },
        clicked: checkIdle(() => position.applySymmetry(Symmetry.FlipXY)),
      },
    ],
    noDropdown: true
  },
  {
    id: 'translate', icon: 'eva-move-outline',
    menu: [
      {
        id: 'translate_up', icon: 'eva-arrow-upward-outline',
        clicked: checkIdle(() => position.applyTranslation(Direction.Down)),
      },
      {
        id: 'translate_down', icon: 'eva-arrow-downward-outline',
        clicked: checkIdle(() => position.applyTranslation(Direction.Up)),
      },
      {
        id: 'translate_left', icon: 'eva-arrow-back-outline',
        clicked: checkIdle(() => position.applyTranslation(Direction.Left)),
      },
      {
        id: 'translate_right', icon: 'eva-arrow-forward-outline',
        clicked: checkIdle(() => position.applyTranslation(Direction.Right)),
      },
    ],
    noDropdown: true
  },
] as ToolBarButton[];

</script>

<style lang="scss" scoped>
// Vertical layout
.board-page {
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

// Horizontal layout
@media (min-aspect-ratio: 1) and (min-width: 1024px) {
  .board-page {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    align-items: stretch;
  }

  .board-box {
    margin: 20px 10px;
  }

  .seperator {
    display: none !important;
  }

  $infobox-margin-x: min(20px, max(30vw - 350px, 0px));

  .info-box {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    margin-top: 20px;
    margin-left: $infobox-margin-x;
    margin-right: calc(10px + $infobox-margin-x);
    padding-top: 10px;
    max-width: 600px;
  }
}

.button-bar {
  white-space: nowrap;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.button-scroll {
  height: 40px;
  width: 100%;
}

.button-separator {
  width: 10px;
  display: inline-block;
}
</style>
