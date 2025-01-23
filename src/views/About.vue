<template>
  <div class="about markdown-body">
    <div v-if="$i18n.locale === 'zh-CN'">
      <h2 id='五子棋计算器-v030'>五子棋计算器 V0.30</h2>
      <h3 id='faq'>FAQ</h3>
      <ul>
        <li>
          <p>这个应用可以干什么？</p>
          <p>可以用来摆谱、借助AI分析五子棋局面，或是与AI对弈。</p>
        </li>
        <li>
          <p>手机端已经有许多五子棋软件了，该应用有什么不同之处吗？</p>
          <p>大部分的移动端五子棋软件只能进行娱乐性的对弈，不能给出比较完整的分析功能，而少数带分析功能的软件支持的平台有限。由于该应用本质上是一个网页，因此可以在绝大部分安装了浏览器的设备上运行，使用更加方便。</p>
        </li>
        <li>
          <p>在手机浏览器里使用时总是显示地址栏，有什么方法全屏显示吗？</p>
          <p>对于IOS端Safari浏览器和安卓端Chrome浏览器，推荐在浏览器中选择<strong>“添加到主屏幕”</strong>以获得类似原生应用的使用体验。</p>
        </li>
        <li>
          <p>使用了什么五子棋AI？</p>
          <p>该应用采用了参加2021年Gomocup五子棋AI比赛的Rapfi引擎。借助Web Assembly技术，Rapfi能在网页端取得与原生应用相差不大的性能，并且思考时不需要与服务器通信。</p>
        </li>
        <li>
          <p>目前支持哪些规则？</p>
          <p>目前支持的规则包括“无禁手”、“无禁手长连不胜”、“自由连珠”、“无禁手一手交换”。</p>
        </li>
        <li>
          <p>如何设置成对弈模式？</p>
          <p>在设置中将“<strong>AI执黑</strong>”或“<strong>AI执白</strong>”选中，之后在轮到AI下棋时点击棋盘的任意位置便可以进入对弈模式。</p>
        </li>
        <li>
          <p>估值中的“+M”与“-M”是什么意思？</p>
          <p>如果估值中出现了“+M”或“-M”，说明AI发现了必胜/必败，后面附加的数字为达成连五的最大步数。</p>
        </li>
        <li>
          <p>分析模式除了时间无限外还有什么不同点？</p>
          <p>分析模式下，即使发现必胜/必败也不会停止思考，这样更可能发现步数最优的着法。</p>
        </li>
        <li>
          <p>如何让AI计算同时计算最优的n个点的分数和路线？</p>
          <p>
            将设置中的“<strong>多点分析</strong>”设为需要的n值，AI思考后，会输出相应的最优n个点的分数与路线记录。注：多点分析模式下，AI由于需要计算更多的点，思考速度变慢，综合棋力会有所下降，建议只在必要时开启该功能。
          </p>
        </li>
        <li>
          <p>如何降低AI的难度/增加AI着法的多样性？</p>
          <p>
            “<strong>限制棋力</strong>”选项可以使得AI在着法上增加随机性，且显著降低AI的棋力。值越大棋力限制约显著（0为不限制棋力，100为最大程度限制棋力）。此外，减少计算时间/计算节点数也会使AI的棋力降低，不过并不会增加着法随机性。
          </p>
        </li>
        <li>
          <p>什么是<strong>平衡点</strong>？计算平衡点有什么用？</p>
          <p>
            一步/两步<strong>平衡点</strong>指能够使局面估值趋于0的某一步/两步棋。在完成该一步/两步棋之后，黑白双方会得到一个（近似）平衡开局。此时搜索得到的估值表示平衡点的分数，分数越接近0表示越平衡。与正常计算类似，分数的可信度随着搜索深度的增加而增加。平衡点计算在一些规则（如SWAP2）下十分有用。
          </p>
        </li>
        <li>
          <p>我应该怎样设定<strong>线程数</strong>？<strong>后台思考</strong>有什么用？</p>
          <p>
            多线程能够让AI使用多个CPU核心进行计算，能够显著提升搜索速度与思考棋力。若想要利用所有算力获得最佳的棋力，建议将<strong>线程数</strong>设定为最大值。若开启<strong>后台思考</strong>，AI会利用对手的时间进行思考。
          </p>
          <p>注：如果你没有看见此选项，说明你的浏览器不支持多线程计算。目前仅有部分浏览器支持多线程，可以在<a
              href='https://caniuse.com/sharedarraybuffer'>这里</a>查询支持多线程的浏览器列表。</p>
        </li>
        <li>
          <p>引擎权重是什么？我应该选择什么引擎权重？</p>
          <p>引擎权重提供了AI在思考时所采用的估值等信息，会对引擎的棋力与下棋风格具有一定影响。一般情况下，&quot;最新&quot;权重具有最佳的单位时间棋力，建议使用“最新”权重即可。</p>
        </li>
        <li>
          <p>我应该如何设定<strong>置换表大小</strong>？</p>
          <p>若需要长时间分析，或是使用多线程，就需要更大的置换表。对于快速计算，采用默认的置换表大小即可。</p>
        </li>
        <li>
          <p>屏幕太小落子容易误触怎么办？</p>
          <p>
            在设置中将落子方式设置为“<strong>二次确认</strong>”或“<strong>滑动落子</strong>”。“二次确认”落子方式需要在第一次点击位置附近再点击第二次；“滑动落子”根据按下时出现的选择框确定落子位置。
          </p>
        </li>
        <li>
          <p>如何导出/设置棋谱代码？</p>
          <p>“游戏”页面中的&quot;局面代码&quot;即为当前的棋谱代码，可以任意复制或者修改。</p>
        </li>
        <li>
          <p>怎么给其他人分享局面？</p>
          <p>
            可以通过按钮栏中的“<strong>截图</strong>”按钮截取当前局面图片，再长按保存到移动设备或右键另存到电脑中。另外，如果是在浏览器中打开的页面，可以直接复制浏览器中带局面代码的链接，这样便可以通过链接直接打开相应局面。
          </p>
        </li>
        <li>
          <p>可以保存局面吗？</p>
          <p>目前若要保存局面，需要手动保存复制的局面代码或是保存带有局面代码的网址。</p>
        </li>
        <li>
          <p>预览AI计算的最优路线?</p>
          <p>悬停在AI输出的某个最优路线的着法上即可预览AI当前计算到的最优路线，在桌面端上双击某个最优路线着法可以将局面直接设置到该路线上。</p>
        </li>
        <li>
          <p>可以用键盘按键操作吗？</p>
          <p>可以使用键盘上的左/右方向键进行局面的回退/前进，HOME/END键回到局面的起始/末尾，空格键进行计算或停止计算，b/B键计算一步/两步平衡点。</p>
        </li>
        <li>
          <p>我发现了bug？我想提出建议？</p>
          <p>欢迎<a href='https://github.com/gomocalc/gomocalc.github.io/issues'>在此</a>提交issue反馈相应的bug或建议。</p>
        </li>

      </ul>
      <p>&nbsp;</p>
      <h3 id='更新记录'>更新记录</h3>
      <ul>
        <li>
          <p>0.30</p>
          <ul>
            <li>引擎更新，加入mix9lite权重</li>
            <li>更多语言支持</li>
            <li>新增键盘按键操作</li>

          </ul>
        </li>
        <li>
          <p>0.26</p>
          <ul>
            <li>修复多线程下的速度问题</li>
            <li>权重更新</li>

          </ul>
        </li>
        <li>
          <p>0.25</p>
          <ul>
            <li>支持选点范围调节</li>
            <li>加入胜率显示</li>

          </ul>
        </li>
        <li>
          <p>0.24</p>
          <ul>
            <li>修复着法生成的bug</li>
            <li>更新引擎权重</li>

          </ul>
        </li>
        <li>
          <p>0.23</p>
          <ul>
            <li>加入棋力限制、后台思考功能</li>

          </ul>
        </li>
        <li>
          <p>0.22</p>
          <ul>
            <li>更新引擎，加入多线程支持</li>
            <li>加入计算平衡点的功能</li>

          </ul>
        </li>
        <li>
          <p>0.21</p>
          <ul>
            <li>修复禁手判断的bug</li>

          </ul>
        </li>
        <li>
          <p>0.20</p>
          <ul>
            <li>更新至Rapfi2021引擎，新增支持长连不胜与连珠规则</li>

          </ul>
        </li>
        <li>
          <p>0.17</p>
          <ul>
            <li>加入置换表大小选项</li>

          </ul>
        </li>
        <li>
          <p>0.16</p>
          <ul>
            <li>优化在宽屏下的布局</li>
            <li>加入路线预览</li>

          </ul>
        </li>
        <li>
          <p>0.15</p>
          <ul>
            <li>棋盘颜色可以修改了</li>
            <li>支持导出高清图片与GIF</li>
            <li>多线分析实时分数显示</li>

          </ul>
        </li>
        <li>
          <p>0.14</p>
          <ul>
            <li>加入了多点分析输出的显示</li>
            <li>设置现在能自动保存了</li>

          </ul>
        </li>
        <li>
          <p>0.13</p>
          <ul>
            <li>修复了AI思考时回退产生的局面错误</li>
            <li>修复了路线栏显示不全的问题</li>

          </ul>
        </li>

      </ul>
      <p>&nbsp;</p>
      <h3 id='关于应用'>关于应用</h3>
      <p>应用地址：<a href='https://gomocalc.com'>主站</a></p>
      <p>本界面为开源应用，源代码地址：<a href='https://github.com/dhbloo/gomoku-calculator'>Github</a></p>
      <p>欢迎加入使用交流群组：<a href='https://qm.qq.com/q/xj9OHByFTG'>QQ群</a>, <a
          href='https://discord.gg/7kEpFCGdb5'>Discord</a></p>
    </div>

    <div v-else-if="$i18n.locale === 'zh-TW'">
      <h2 id='五子棋計算器-v030'>五子棋計算器 V0.30</h2>
      <h3 id='faq'>常見問題（FAQ）</h3>
      <ul>
        <li>
          <p>這個應用可以做什麼？</p>
          <p>可以用來擺譜、借助AI分析五子棋局面，或是與AI對弈。</p>
        </li>
        <li>
          <p>手機端已經有許多五子棋軟體了，該應用有什麼不同之處嗎？</p>
          <p>大部分的移動端五子棋軟體只能進行娛樂性的對弈，不能給出比較完整的分析功能，而少數帶分析功能的軟體支援的平台有限。由於該應用本質上是一個網頁，因此可以在絕大部分安裝了瀏覽器的設備上運行，使用更加方便。</p>
        </li>
        <li>
          <p>在手機瀏覽器裡使用時總是顯示地址欄，有什麼方法全螢幕顯示嗎？</p>
          <p>對於IOS端Safari瀏覽器和安卓端Chrome瀏覽器，推薦在瀏覽器中選擇<strong>“添加到主屏幕”</strong>以獲得類似原生應用的使用體驗。</p>
        </li>
        <li>
          <p>使用了什麼五子棋AI？</p>
          <p>該應用採用了參加2021年Gomocup五子棋AI比賽的Rapfi引擎。借助Web Assembly技術，Rapfi能在網頁端取得與原生應用相差不大的效能，並且思考時不需要與伺服器通信。</p>
        </li>
        <li>
          <p>目前支援哪些規則？</p>
          <p>目前支援的規則包括“無禁手”、“無禁手長連不勝”、“自由連珠”、“無禁手一手交換”。</p>
        </li>
        <li>
          <p>如何設置成對弈模式？</p>
          <p>在設置中將“<strong>AI執黑</strong>”或“<strong>AI執白</strong>”選中，之後在輪到AI下棋時點擊棋盤的任意位置便可以進入對弈模式。</p>
        </li>
        <li>
          <p>估值中的“+M”與“-M”是什麼意思？</p>
          <p>如果估值中出現了“+M”或“-M”，說明AI發現了必勝/必敗，後面附加的數字為達成連五的最大步數。</p>
        </li>
        <li>
          <p>分析模式除了時間無限外還有什麼不同點？</p>
          <p>分析模式下，即使發現必勝/必敗也不會停止思考，這樣更可能發現步數最優的著法。</p>
        </li>
        <li>
          <p>如何讓AI同時計算最優的n個點的分數和路線？</p>
          <p>
            將設置中的“<strong>多點分析</strong>”設為需要的n值，AI思考後，會輸出相應的最優n個點的分數與路線記錄。注：多點分析模式下，AI由於需要計算更多的點，思考速度變慢，綜合棋力會有所下降，建議只在必要時開啟該功能。
          </p>
        </li>
        <li>
          <p>如何降低AI的難度/增加AI著法的多樣性？</p>
          <p>
            “<strong>限制棋力</strong>”選項可以使得AI在著法上增加隨機性，且顯著降低AI的棋力。值越大棋力限制越顯著（0為不限制棋力，100為最大程度限制棋力）。此外，減少計算時間/計算節點數也會使AI的棋力降低，不過並不會增加著法隨機性。
          </p>
        </li>
        <li>
          <p>什麼是<strong>平衡點</strong>？計算平衡點有什麼用？</p>
          <p>
            一步/兩步<strong>平衡點</strong>指能夠使局面估值趨於0的某一步/兩步棋。在完成該一步/兩步棋之後，黑白雙方會得到一個（近似）平衡開局。此時搜索得到的估值表示平衡點的分數，分數越接近0表示越平衡。與正常計算類似，分數的可信度隨著搜索深度的增加而增加。平衡點計算在一些規則（如SWAP2）下十分有用。
          </p>
        </li>
        <li>
          <p>我應該怎樣設定<strong>線程數</strong>？<strong>後台思考</strong>有什麼用？</p>
          <p>
            多線程能夠讓AI使用多個CPU核心進行計算，能夠顯著提升搜索速度與思考棋力。若想要利用所有算力獲得最佳的棋力，建議將<strong>線程數</strong>設定為最大值。若開啟<strong>後台思考</strong>，AI會利用對手的時間進行思考。
          </p>
          <p>注：如果你沒有看見此選項，說明你的瀏覽器不支援多線程計算。目前僅有部分瀏覽器支援多線程，可以在<a
              href='https://caniuse.com/sharedarraybuffer'>這裡</a>查詢支援多線程的瀏覽器列表。</p>
        </li>
        <li>
          <p>引擎權重是什麼？我應該選擇什麼引擎權重？</p>
          <p>引擎權重提供了AI在思考時所採用的估值等信息，會對引擎的棋力與下棋風格具有一定影響。一般情況下，“最新”權重具有最佳的單位時間棋力，建議使用“最新”權重即可。</p>
        </li>
        <li>
          <p>我應該如何設定<strong>置換表大小</strong>？</p>
          <p>若需要長時間分析，或是使用多線程，就需要更大的置換表。對於快速計算，採用默認的置換表大小即可。</p>
        </li>
        <li>
          <p>螢幕太小落子容易誤觸怎麼辦？</p>
          <p>
            在設置中將落子方式設置為“<strong>二次確認</strong>”或“<strong>滑動落子</strong>”。“二次確認”落子方式需要在第一次點擊位置附近再點擊第二次；“滑動落子”根據按下時出現的選擇框確定落子位置。
          </p>
        </li>
        <li>
          <p>如何導出/設置棋譜代碼？</p>
          <p>“遊戲”頁面中的“局面代碼”即為當前的棋譜代碼，可以任意複製或者修改。</p>
        </li>
        <li>
          <p>怎麼給其他人分享局面？</p>
          <p>
            可以通過按鈕欄中的“<strong>截圖</strong>”按鈕截取當前局面圖片，再長按保存到移動設備或右鍵另存到電腦中。另外，如果是在瀏覽器中打開的頁面，可以直接複製瀏覽器中帶局面代碼的連結，這樣便可以通過連結直接打開相應局面。
          </p>
        </li>
        <li>
          <p>可以保存局面嗎？</p>
          <p>目前若要保存局面，需要手動保存複製的局面代碼或是保存帶有局面代碼的網址。</p>
        </li>
        <li>
          <p>預覽AI計算的最優路線？</p>
          <p>懸停在AI輸出的某個最優路線的著法上即可預覽AI當前計算到的最優路線，在桌面端上雙擊某個最優路線著法可以將局面直接設置到該路線上。</p>
        </li>
        <li>
          <p>可以用鍵盤按鍵操作嗎？</p>
          <p>可以使用鍵盤上的左/右方向鍵進行局面的回退/前進，HOME/END鍵回到局面的起始/末尾，空格鍵進行計算或停止計算，b/B鍵計算一步/兩步平衡點。</p>
        </li>
        <li>
          <p>我發現了bug？我想提出建議？</p>
          <p>歡迎<a href='https://github.com/gomocalc/gomocalc.github.io/issues'>在此</a>提交issue反饋相應的bug或建議。</p>
        </li>
      </ul>
      <p>&nbsp;</p>
      <h3 id='更新記錄'>更新記錄</h3>
      <ul>
        <li>
          <p>0.30</p>
          <ul>
            <li>引擎更新，加入mix9lite權重</li>
            <li>更多語言支持</li>
            <li>新增鍵盤按鍵操作</li>
          </ul>
        </li>
        <li>
          <p>0.26</p>
          <ul>
            <li>修復多線程下的速度問題</li>
            <li>權重更新</li>
          </ul>
        </li>
        <li>
          <p>0.25</p>
          <ul>
            <li>支援選點範圍調節</li>
            <li>加入勝率顯示</li>
          </ul>
        </li>
        <li>
          <p>0.24</p>
          <ul>
            <li>修復著法生成的bug</li>
            <li>更新引擎權重</li>
          </ul>
        </li>
        <li>
          <p>0.23</p>
          <ul>
            <li>加入棋力限制、後台思考功能</li>
          </ul>
        </li>
        <li>
          <p>0.22</p>
          <ul>
            <li>更新引擎，加入多線程支持</li>
            <li>加入計算平衡點的功能</li>
          </ul>
        </li>
        <li>
          <p>0.21</p>
          <ul>
            <li>修復禁手判斷的bug</li>
          </ul>
        </li>
        <li>
          <p>0.20</p>
          <ul>
            <li>更新至Rapfi2021引擎，新增支援長連不勝與連珠規則</li>
          </ul>
        </li>
        <li>
          <p>0.17</p>
          <ul>
            <li>加入置換表大小選項</li>
          </ul>
        </li>
        <li>
          <p>0.16</p>
          <ul>
            <li>優化在寬螢幕下的佈局</li>
            <li>加入路線預覽</li>
          </ul>
        </li>
        <li>
          <p>0.15</p>
          <ul>
            <li>棋盤顏色可以修改了</li>
            <li>支援導出高清圖片與GIF</li>
            <li>多線分析即時分數顯示</li>
          </ul>
        </li>
        <li>
          <p>0.14</p>
          <ul>
            <li>加入了多點分析輸出的顯示</li>
            <li>設置現在能自動保存了</li>
          </ul>
        </li>
        <li>
          <p>0.13</p>
          <ul>
            <li>修復了AI思考時回退產生的局面錯誤</li>
            <li>修復了路線欄顯示不全的問題</li>
          </ul>
        </li>
      </ul>
      <p>&nbsp;</p>
      <h3 id='關於應用'>關於應用</h3>
      <p>應用地址：<a href='https://gomocalc.com'>主站</a></p>
      <p>本界面為開源應用，原始碼地址：<a href='https://github.com/dhbloo/gomoku-calculator'>Github</a></p>
      <p>歡迎加入使用交流群組：<a href='https://qm.qq.com/q/xj9OHByFTG'>QQ群</a>, <a
          href='https://discord.gg/7kEpFCGdb5'>Discord</a></p>
    </div>

    <div v-else-if="$i18n.locale === 'ko'">
      <h2 id='오목 계산기-v030'>오목 계산기 V0.30</h2>
      <h3 id='faq'>FAQ</h3>
      <ul>
        <li>
          <p>이 앱으로 무엇을 할 수 있나요?</p>
          <p>이 앱은 오목 판짜기, AI를 이용한 오목 국면 분석, 또는 AI와의 대국에 사용할 수 있습니다.</p>
        </li>
        <li>
          <p>모바일 오목 앱이 이미 많은데, 이 앱은 어떤 차별점이 있나요?</p>
          <p>대부분의 모바일 오목 앱은 단순한 오락용 대국만 가능하며, 분석 기능이 제한적입니다. 일부 분석 기능이 있는 앱은 지원하는 플랫폼이 제한적입니다. 이 앱은 웹 기반으로 제작되어 브라우저가
            설치된 대부분의 기기에서 실행 가능하므로 사용이 더욱 편리합니다.</p>
        </li>
        <li>
          <p>모바일 브라우저에서 사용할 때 주소 표시줄이 항상 보이는데, 전체 화면으로 표시하는 방법이 있나요?</p>
          <p>IOS Safari 브라우저와 Android Chrome 브라우저에서는 브라우저 메뉴에서<strong>“홈 화면에 추가”</strong>를 선택하면 네이티브 앱과 유사한 사용 경험을 얻을 수
            있습니다.</p>
        </li>
        <li>
          <p>어떤 오목 AI를 사용하나요?</p>
          <p>이 앱은 2021년 Gomocup 오목 AI 대회에 참가한 Rapfi 엔진을 사용합니다. Web Assembly 기술을 활용하여 Rapfi는 웹 환경에서도 네이티브 앱과 비슷한 성능을
            제공하며, 계산 시 서버와 통신하지 않아도 됩니다.</p>
        </li>
        <li>
          <p>현재 어떤 규칙을 지원하나요?</p>
          <p>현재 지원하는 규칙은 “금수 없음”, “금수 없음 장련 무승”, “자유 렌주”, “금수 없음 한 수 교환”을 포함합니다.</p>
        </li>
        <li>
          <p>대국 모드는 어떻게 설정하나요?</p>
          <p>설정에서<strong>“AI 흑돌”</strong> 또는<strong>“AI 백돌”</strong>을 선택한 후, AI 차례에 오목판의 임의의 위치를 클릭하면 대국 모드로 진입합니다.</p>
        </li>
        <li>
          <p>평가 값의 “+M”과 “-M”은 무엇을 의미하나요?</p>
          <p>평가 값에 “+M” 또는 “-M”이 나타나면 AI가 필승/필패를 발견한 것입니다. 뒤에 붙는 숫자는 렌주(오목)을 달성하는 최대 수를 의미합니다.</p>
        </li>
        <li>
          <p>분석 모드에서 무제한 시간 외에 다른 차이점은 무엇인가요?</p>
          <p>분석 모드에서는 필승/필패를 발견하더라도 생각을 멈추지 않고 계속 계산하므로 최적의 수를 발견할 가능성이 높습니다.</p>
        </li>
        <li>
          <p>AI가 동시에 최적의 n개 점의 점수와 경로를 계산하도록 설정하려면 어떻게 하나요?</p>
          <p>설정에서<strong>“다점 분석”</strong>을 원하는 n 값으로 설정하면 AI가 생각한 후 해당 최적의 n개 점수와 경로를 출력합니다. 주의: 다점 분석 모드에서는 AI가 더 많은 점을
            계산하므로 속도가 느려지고, 종합적인 기력은 약간 낮아질 수 있습니다. 필요한 경우에만 이 기능을 활성화하는 것이 좋습니다.</p>
        </li>
        <li>
          <p>AI 난이도를 낮추거나 착수 다양성을 증가시키려면 어떻게 하나요?</p>
          <p><strong>“기력 제한”</strong> 옵션은 AI 착수에 무작위성을 추가하고 AI 기력을 눈에 띄게 낮춥니다. 값이 클수록 기력 제한이 더 강해집니다(0은 제한 없음, 100은 최대
            기력 제한). 또한 계산 시간/노드 수를 줄이면 기력이 낮아지지만 착수 무작위성이 증가하지는 않습니다.</p>
        </li>
        <li>
          <p>균형점이란 무엇인가요? 균형점을 계산하는 데 어떤 이점이 있나요?</p>
          <p>1수/2수<strong>균형점</strong>은 국면 평가 값을 0으로 근접시키는 1수/2수 착점을 의미합니다. 이 착수를 완료하면 흑백 양측은 (근사) 균형 국면을 얻게 됩니다. 이때 검색된
            평가 값은 균형점의 점수를 나타내며, 점수가 0에 가까울수록 균형이 잘 맞습니다. 검색 깊이가 깊어질수록 점수 신뢰도가 높아집니다. 균형점 계산은 SWAP2와 같은 규칙에서 매우 유용합니다.
          </p>
        </li>
        <li>
          <p><strong>스레드 수</strong>를 어떻게 설정해야 하나요? <strong>백그라운드 계산</strong>은 어떤 용도인가요?</p>
          <p>멀티 스레드는 AI가 여러 CPU 코어를 사용하여 계산 속도와 기력을 크게 향상시킵니다. 최상의 기력을 원한다면<strong>스레드 수</strong>를 최대값으로 설정하는 것이 좋습니다.
            <strong>백그라운드 계산</strong>을 활성화하면 AI가 상대방의 시간 동안 계산을 진행합니다.
          </p>
          <p>주의: 이 옵션이 보이지 않는다면, 브라우저가 멀티 스레드 계산을 지원하지 않는 것입니다. 현재 일부 브라우저만 멀티 스레드를 지원하며, <a
              href='https://caniuse.com/sharedarraybuffer'>여기</a>에서 지원 브라우저 목록을 확인할 수 있습니다.</p>
        </li>
        <li>
          <p>엔진 가중치란 무엇인가요? 어떤 엔진 가중치를 선택해야 하나요?</p>
          <p>엔진 가중치는 AI 계산 시 사용하는 평가 정보로, 기력과 플레이 스타일에 영향을 줍니다. 일반적으로<strong>“최신”</strong> 가중치가 단위 시간당 기력이 가장
            좋으므로<strong>“최신”</strong> 가중치를 사용하는 것이 권장됩니다.</p>
        </li>
        <li>
          <p><strong>교환 테이블 크기</strong>를 어떻게 설정해야 하나요?</p>
          <p>장시간 분석이 필요하거나 멀티 스레드를 사용하는 경우 더 큰 교환 테이블이 필요합니다. 빠른 계산을 위해서는 기본 교환 테이블 크기를 사용하는 것이 적합합니다.</p>
        </li>
        <li>
          <p>화면이 너무 작아 착수 실수가 잦다면 어떻게 해야 하나요?</p>
          <p>설정에서 착수 방식을<strong>“이중 확인”</strong> 또는<strong>“슬라이드 착수”</strong>로 설정하세요. “이중 확인” 방식은 첫 번째 클릭 위치 근처에서 두 번째로
            클릭해야 착수가 완료됩니다. “슬라이드 착수”는 선택 상자에서 착수 위치를 확정합니다.</p>
        </li>
        <li>
          <p>기보 코드를 어떻게 내보내거나 설정하나요?</p>
          <p>“게임” 페이지의<strong>“국면 코드”</strong>는 현재 기보 코드입니다. 이를 복사하거나 수정할 수 있습니다.</p>
        </li>
        <li>
          <p>다른 사람에게 국면을 공유하려면 어떻게 하나요?</p>
          <p><strong>“스크린샷”</strong> 버튼을 통해 현재 국면 이미지를 캡처하여 모바일 기기에서는 길게 눌러 저장하거나, 컴퓨터에서는 마우스 오른쪽 버튼으로 저장할 수 있습니다. 또한
            브라우저 페이지를 열어놓은 상태에서 국면 코드가 포함된 URL을 복사하여 공유할 수도 있습니다.</p>
        </li>
        <li>
          <p>국면을 저장할 수 있나요?</p>
          <p>현재 국면을 저장하려면 기보 코드를 수동으로 저장하거나, 국면 코드가 포함된 URL을 저장해야 합니다.</p>
        </li>
        <li>
          <p>AI가 계산한 최적 경로를 미리 볼 수 있나요?</p>
          <p>AI 출력의 특정 최적 경로 착수에 마우스를 올리면 해당 경로를 미리 볼 수 있습니다. 데스크톱에서는 특정 경로 착수를 더블 클릭하여 국면을 해당 경로로 직접 설정할 수 있습니다.</p>
        </li>
        <li>
          <p>키보드로 조작할 수 있나요?</p>
          <p>키보드의 좌/우 화살표 키로 국면을 되돌리거나 진행할 수 있고, HOME/END 키로 국면 시작/끝으로 이동하며, 스페이스 키로 계산을 시작하거나 중지할 수 있습니다. b/B 키로 1수/2수
            균형점을 계산할 수 있습니다.</p>
        </li>
        <li>
          <p>버그를 발견했거나 제안하고 싶다면 어떻게 하나요?</p>
          <p><a href='https://github.com/gomocalc/gomocalc.github.io/issues'>여기</a>에서 이슈를 제출하여 버그 또는 제안을 피드백해 주세요.</p>
        </li>
      </ul>
      <p>&nbsp;</p>
      <h3 id='업데이트-기록'>업데이트 기록</h3>
      <ul>
        <li>
          <p>0.30</p>
          <ul>
            <li>엔진 업데이트, mix9lite 가중치 추가</li>
            <li>다국어 지원 추가</li>
            <li>키보드 조작 기능 추가</li>
          </ul>
        </li>
        <li>
          <p>0.26</p>
          <ul>
            <li>멀티 스레드 속도 문제 수정</li>
            <li>가중치 업데이트</li>
          </ul>
        </li>
        <li>
          <p>0.25</p>
          <ul>
            <li>선택 영역 조정 지원</li>
            <li>승률 표시 추가</li>
          </ul>
        </li>
        <li>
          <p>0.24</p>
          <ul>
            <li>착수 생성 버그 수정</li>
            <li>엔진 가중치 업데이트</li>
          </ul>
        </li>
        <li>
          <p>0.23</p>
          <ul>
            <li>기력 제한, 백그라운드 계산 기능 추가</li>
          </ul>
        </li>
        <li>
          <p>0.22</p>
          <ul>
            <li>엔진 업데이트, 멀티 스레드 지원 추가</li>
            <li>균형점 계산 기능 추가</li>
          </ul>
        </li>
        <li>
          <p>0.21</p>
          <ul>
            <li>금수 판단 버그 수정</li>
          </ul>
        </li>
        <li>
          <p>0.20</p>
          <ul>
            <li>Rapfi2021 엔진 업데이트, 장련 무승 및 렌주 규칙 추가 지원</li>
          </ul>
        </li>
        <li>
          <p>0.17</p>
          <ul>
            <li>교환 테이블 크기 옵션 추가</li>
          </ul>
        </li>
        <li>
          <p>0.16</p>
          <ul>
            <li>와이드 스크린 레이아웃 최적화</li>
            <li>경로 미리 보기 추가</li>
          </ul>
        </li>
        <li>
          <p>0.15</p>
          <ul>
            <li>오목판 색상 수정 가능</li>
            <li>고화질 이미지 및 GIF 내보내기 지원</li>
            <li>다점 분석 실시간 점수 표시</li>
          </ul>
        </li>
        <li>
          <p>0.14</p>
          <ul>
            <li>다점 분석 출력 표시 추가</li>
            <li>설정 자동 저장 기능 추가</li>
          </ul>
        </li>
        <li>
          <p>0.13</p>
          <ul>
            <li>AI 계산 중 국면 되돌리기 오류 수정</li>
            <li>경로 창 표시 문제 수정</li>
          </ul>
        </li>
      </ul>
      <p>&nbsp;</p>
      <h3 id='앱-소개'>앱 소개</h3>
      <p>앱 주소: <a href='https://gomocalc.com'>메인 페이지</a></p>
      <p>이 인터페이스는 오픈 소스 앱입니다. 소스 코드 주소: <a href='https://github.com/dhbloo/gomoku-calculator'>Github</a></p>
      <p>사용자 그룹에 참여하세요: <a href='https://qm.qq.com/q/xj9OHByFTG'>QQ 그룹</a>, <a
          href='https://discord.gg/7kEpFCGdb5'>Discord</a></p>
    </div>

    <div v-else-if="$i18n.locale === 'ja'">
      <h2 id='五子棋计算器-v030'>五目並べ計算機 V0.30</h2>
      <h3 id='faq'>FAQ</h3>
      <ul>
        <li>
          <p>このアプリは何ができますか？</p>
          <p>このアプリは棋譜を並べたり、AIを使って五目並べの局面を分析したり、AIと対戦することができます。</p>
        </li>
        <li>
          <p>スマホ向けの五目並べアプリはすでに多くありますが、このアプリは何が違いますか？</p>
          <p>
            ほとんどのスマホ向け五目並べアプリは娯楽的な対戦に限られ、詳細な分析機能を備えたものは少ないです。また、一部の分析機能付きアプリは対応プラットフォームが限定されています。このアプリはウェブベースであるため、ブラウザがインストールされているほぼすべてのデバイスで使用可能で、利便性が高いです。
          </p>
        </li>
        <li>
          <p>スマホのブラウザで使用すると常にアドレスバーが表示されますが、全画面表示にする方法はありますか？</p>
          <p>iOS版SafariブラウザやAndroid版Chromeブラウザでは、ブラウザの<strong>「ホーム画面に追加」</strong>オプションを選択すると、ネイティブアプリのような使用体験が得られます。</p>
        </li>
        <li>
          <p>どの五目並べAIを使用していますか？</p>
          <p>このアプリは2021年Gomocup五目並べAI大会に参加したRapfiエンジンを採用しています。Web
            Assembly技術を利用することで、Rapfiはネイティブアプリとほぼ変わらない性能をウェブ上で実現し、思考時にサーバーとの通信を必要としません。</p>
        </li>
        <li>
          <p>現在どのルールをサポートしていますか？</p>
          <p>現在サポートしているルールは「禁手なし」、「禁手なし長連勝ちなし」、「自由連珠」、「禁手なし一手交換」です。</p>
        </li>
        <li>
          <p>対戦モードを設定するにはどうすればいいですか？</p>
          <p>設定で<strong>「AI黒番」</strong>または<strong>「AI白番」</strong>を選択します。その後、AIの番になったら盤面の任意の位置をクリックすると対戦モードに入ります。</p>
        </li>
        <li>
          <p>評価値の「+M」と「-M」とは何ですか？</p>
          <p>評価値に「+M」または「-M」が表示された場合、それはAIが必勝/必敗を発見したことを意味します。後に続く数字は五連を達成するまでの最大手数を表します。</p>
        </li>
        <li>
          <p>分析モードには無限時間以外に何か違いがありますか？</p>
          <p>分析モードでは、必勝/必敗を発見しても思考を停止せず、最適な手順を見つける可能性が高まります。</p>
        </li>
        <li>
          <p>AIが同時に最適なn個の点のスコアとルートを計算する方法は？</p>
          <p>
            設定の<strong>「多点分析」</strong>を希望のn値に設定します。AIの思考後、対応する最適なn個の点のスコアとルート記録を出力します。注：多点分析モードでは、AIはより多くの点を計算するため、思考速度が低下し、総合的な棋力がやや下がります。必要な場合にのみこの機能を有効にすることをお勧めします。
          </p>
        </li>
        <li>
          <p>AIの難易度を下げたり手の多様性を増やすにはどうすればいいですか？</p>
          <p>
            「<strong>棋力制限</strong>」オプションを使用すると、AIの手のランダム性が増し、棋力が大幅に低下します。値が大きいほど棋力制限が強くなります（0は制限なし、100は最大限の制限）。また、計算時間や計算ノード数を減らすことでも棋力を下げることができますが、手のランダム性は増えません。
          </p>
        </li>
        <li>
          <p>平衡点とは何ですか？平衡点の計算は何に役立ちますか？</p>
          <p>
            1手/2手の<strong>平衡点</strong>は、局面の評価値を0に近づけることができる手です。この手を行うと、黒白両者は（近似的に）平衡な局面を得ます。このときの評価値は平衡点のスコアを示し、スコアが0に近いほど均衡が取れています。通常の計算と同様に、評価値の信頼性は探索深度が増すにつれて高まります。平衡点計算は、一部のルール（例：SWAP2）で非常に有用です。
          </p>
        </li>
        <li>
          <p><strong>スレッド数</strong>の設定はどうすればいいですか？<strong>バックグラウンド思考</strong>は何に役立ちますか？</p>
          <p>
            マルチスレッドを使用すると、AIが複数のCPUコアを利用して計算でき、探索速度と思考能力が大幅に向上します。最大の棋力を得るためにすべての計算リソースを利用したい場合は、<strong>スレッド数</strong>を最大値に設定することをお勧めします。<strong>バックグラウンド思考</strong>を有効にすると、AIは相手の手番中に思考を続けます。
          </p>
          <p>注：このオプションが表示されない場合、使用しているブラウザがマルチスレッド計算をサポートしていない可能性があります。一部のブラウザのみがマルチスレッドをサポートしており、<a
              href='https://caniuse.com/sharedarraybuffer'>こちら</a>で対応ブラウザのリストを確認できます。</p>
        </li>
        <li>
          <p>エンジンの重みとは何ですか？どのエンジンの重みを選ぶべきですか？</p>
          <p>
            エンジンの重みは、AIの思考時に使用する評価情報を提供し、エンジンの棋力やプレイスタイルに一定の影響を与えます。一般的には<strong>「最新」</strong>の重みが最も優れた棋力を持つため、これを使用することをお勧めします。
          </p>
        </li>
        <li>
          <p><strong>置換表サイズ</strong>はどのように設定すればいいですか？</p>
          <p>長時間の分析やマルチスレッドを使用する場合は、より大きな置換表サイズが必要です。短時間の計算の場合は、デフォルトの置換表サイズで十分です。</p>
        </li>
        <li>
          <p>画面が小さくて誤操作しやすい場合はどうすればいいですか？</p>
          <p>
            設定で手の選択方法を<strong>「二度確認」</strong>または<strong>「スライドで選択」</strong>に変更します。「二度確認」では最初にクリックした位置の近くで再度クリックする必要があります。「スライドで選択」では、押した際に表示される選択枠を利用して落下位置を決定します。
          </p>
        </li>
        <li>
          <p>棋譜コードをエクスポート/設定する方法は？</p>
          <p>「ゲーム」ページに表示される<strong>「局面コード」</strong>が現在の棋譜コードです。自由にコピーまたは編集できます。</p>
        </li>
        <li>
          <p>他の人に局面を共有するにはどうすればいいですか？</p>
          <p>
            ボタンバーの<strong>「スクリーンショット」</strong>ボタンを使って現在の局面の画像を撮影し、モバイルデバイスに保存したり、PCで右クリックして保存することができます。また、ブラウザで開いている場合、局面コードを含むリンクをコピーすることで、そのリンクから直接局面を開くことができます。
          </p>
        </li>
        <li>
          <p>局面を保存できますか？</p>
          <p>現在のところ、局面を保存するには、局面コードを手動で保存するか、局面コードを含むURLを保存する必要があります。</p>
        </li>
        <li>
          <p>AIの最適なルートをプレビューできますか？</p>
          <p>
            AIの出力に表示される最適なルート上の手にカーソルを合わせると、現在計算中の最適ルートをプレビューできます。デスクトップ版では、最適ルート上の手をダブルクリックすることで、局面をそのルートに直接設定することができます。
          </p>
        </li>
        <li>
          <p>キーボードで操作できますか？</p>
          <p>
            キーボードの左/右矢印キーで局面を戻したり進めたり、HOME/ENDキーで局面の最初/最後に移動したり、スペースキーで計算を開始または停止できます。また、b/Bキーを使って1手/2手の平衡点を計算することもできます。
          </p>
        </li>
        <li>
          <p>バグを発見したり、提案をしたい場合は？</p>
          <p><a href='https://github.com/gomocalc/gomocalc.github.io/issues'>こちら</a>でissueを作成し、バグや提案を報告してください。</p>
        </li>
      </ul>
      <p>&nbsp;</p>
      <h3 id='更新记录'>更新履歴</h3>
      <ul>
        <li>
          <p>0.30</p>
          <ul>
            <li>エンジン更新、mix9lite重みを追加</li>
            <li>多言語サポートを追加</li>
            <li>キーボード操作を新たに追加</li>
          </ul>
        </li>
        <li>
          <p>0.26</p>
          <ul>
            <li>マルチスレッドでの速度問題を修正</li>
            <li>重みを更新</li>
          </ul>
        </li>
        <li>
          <p>0.25</p>
          <ul>
            <li>選択範囲の調整をサポート</li>
            <li>勝率表示を追加</li>
          </ul>
        </li>
        <li>
          <p>0.24</p>
          <ul>
            <li>着手生成のバグを修正</li>
            <li>エンジン重みを更新</li>
          </ul>
        </li>
        <li>
          <p>0.23</p>
          <ul>
            <li>棋力制限とバックグラウンド思考機能を追加</li>
          </ul>
        </li>
        <li>
          <p>0.22</p>
          <ul>
            <li>エンジン更新、マルチスレッド対応を追加</li>
            <li>平衡点の計算機能を追加</li>
          </ul>
        </li>
        <li>
          <p>0.21</p>
          <ul>
            <li>禁手判定のバグを修正</li>
          </ul>
        </li>
        <li>
          <p>0.20</p>
          <ul>
            <li>Rapfi2021エンジンにアップデート、長連勝ちなしと連珠ルールを新たにサポート</li>
          </ul>
        </li>
        <li>
          <p>0.17</p>
          <ul>
            <li>置換表サイズのオプションを追加</li>
          </ul>
        </li>
        <li>
          <p>0.16</p>
          <ul>
            <li>ワイドスクリーンでのレイアウトを最適化</li>
            <li>ルートプレビューを追加</li>
          </ul>
        </li>
        <li>
          <p>0.15</p>
          <ul>
            <li>盤面の色を変更可能に</li>
            <li>高解像度画像やGIFのエクスポートをサポート</li>
            <li>多点分析のリアルタイムスコア表示を追加</li>
          </ul>
        </li>
        <li>
          <p>0.14</p>
          <ul>
            <li>多点分析の出力表示を追加</li>
            <li>設定の自動保存をサポート</li>
          </ul>
        </li>
        <li>
          <p>0.13</p>
          <ul>
            <li>AI思考時の巻き戻しで局面エラーが発生する問題を修正</li>
            <li>ルートバーが完全に表示されない問題を修正</li>
          </ul>
        </li>
      </ul>
      <p>&nbsp;</p>
      <h3 id='关于应用'>アプリについて</h3>
      <p>アプリのURL：<a href='https://gomocalc.com'>メインサイト</a></p>
      <p>このインターフェースはオープンソースアプリです。ソースコードはこちら：<a href='https://github.com/dhbloo/gomoku-calculator'>Github</a></p>
      <p>使用者グループへの参加を歓迎します：<a href='https://qm.qq.com/q/xj9OHByFTG'>QQグループ</a>, <a
          href='https://discord.gg/7kEpFCGdb5'>Discord</a></p>
    </div>

    <div v-else-if="$i18n.locale === 'vi'">
      <h2 id='五子棋计算器-v030'>Máy tính Cờ Caro V0.30</h2>
      <h3 id='faq'>Câu hỏi thường gặp (FAQ)</h3>
      <ul>
        <li>
          <p>Ứng dụng này có thể làm gì?</p>
          <p>Có thể dùng để đặt bàn cờ, phân tích tình huống cờ với AI hoặc chơi cờ với AI.</p>
        </li>
        <li>
          <p>Đã có nhiều ứng dụng cờ caro trên điện thoại, ứng dụng này có gì đặc biệt?</p>
          <p>Phần lớn ứng dụng cờ caro trên điện thoại chỉ hỗ trợ chơi giải trí, không cung cấp chức năng phân tích đầy
            đủ. Một số ít ứng dụng có chức năng phân tích lại bị giới hạn trên một số nền tảng. Ứng dụng này là trang
            web, do đó có thể chạy trên hầu hết các thiết bị có trình duyệt, rất tiện lợi.</p>
        </li>
        <li>
          <p>Khi dùng trên trình duyệt điện thoại luôn hiển thị thanh địa chỉ, làm thế nào để hiển thị toàn màn hình?
          </p>
          <p>Đối với trình duyệt Safari trên IOS và Chrome trên Android, bạn có thể chọn <strong>“Thêm vào màn hình
              chính”</strong> để có trải nghiệm giống như ứng dụng gốc.</p>
        </li>
        <li>
          <p>Sử dụng AI cờ caro nào?</p>
          <p>Ứng dụng sử dụng engine Rapfi, từng tham gia cuộc thi AI cờ caro Gomocup 2021. Với công nghệ Web Assembly,
            Rapfi có thể đạt hiệu năng gần như ứng dụng gốc trên nền tảng web mà không cần giao tiếp với máy chủ khi
            tính toán.</p>
        </li>
        <li>
          <p>Hiện tại hỗ trợ các luật chơi nào?</p>
          <p>Hiện hỗ trợ các luật chơi: “Không cấm tay”, “Không cấm tay không thắng chặn dài”, “Tự do liên quân”, và
            “Không cấm tay đổi nước đi”.</p>
        </li>
        <li>
          <p>Làm thế nào để thiết lập chế độ đấu với AI?</p>
          <p>Trong phần cài đặt, chọn “<strong>AI chơi quân đen</strong>” hoặc “<strong>AI chơi quân trắng</strong>”.
            Sau đó, khi đến lượt AI, bạn chỉ cần nhấp vào bàn cờ để vào chế độ đấu với AI.</p>
        </li>
        <li>
          <p>“+M” và “-M” trong giá trị ước lượng có ý nghĩa gì?</p>
          <p>Khi giá trị ước lượng xuất hiện “+M” hoặc “-M”, điều đó có nghĩa AI đã phát hiện nước đi tất thắng hoặc tất
            bại. Số kèm theo là số bước tối đa để đạt đến chiến thắng liên tiếp năm quân.</p>
        </li>
        <li>
          <p>Chế độ phân tích khác gì ngoài thời gian vô hạn?</p>
          <p>Trong chế độ phân tích, ngay cả khi phát hiện tất thắng/tất bại, AI vẫn tiếp tục suy nghĩ để tìm nước đi
            tối ưu nhất.</p>
        </li>
        <li>
          <p>Làm thế nào để AI tính điểm và lộ trình tối ưu cho n điểm đồng thời?</p>
          <p>Thiết lập “<strong>Phân tích nhiều điểm</strong>” trong cài đặt với giá trị n. Sau khi suy nghĩ, AI sẽ xuất
            ra điểm và lộ trình tối ưu cho n điểm. Lưu ý: Chế độ phân tích nhiều điểm sẽ làm AI chậm hơn và giảm khả
            năng chơi cờ.</p>
        </li>
        <li>
          <p>Làm thế nào để giảm độ khó của AI hoặc tăng tính đa dạng của nước đi?</p>
          <p>Chọn “<strong>Giới hạn khả năng chơi</strong>” để tăng tính ngẫu nhiên trong nước đi và giảm đáng kể sức
            mạnh của AI. Giá trị càng cao thì giới hạn càng nhiều (0 là không giới hạn, 100 là giới hạn tối đa). Giảm
            thời gian/điểm tính toán cũng sẽ giảm khả năng của AI, nhưng không tăng tính ngẫu nhiên.</p>
        </li>
        <li>
          <p>Điểm cân bằng là gì? Tính điểm cân bằng để làm gì?</p>
          <p>Điểm cân bằng một bước/hai bước là nước đi giúp giá trị ước lượng của tình huống gần bằng 0. Sau khi thực
            hiện nước đi này, tình huống sẽ trở về trạng thái cân bằng. Tính điểm cân bằng rất hữu ích trong một số luật
            chơi (ví dụ: SWAP2).</p>
        </li>
        <li>
          <p>Tôi nên thiết lập <strong>số luồng</strong> như thế nào? Chức năng <strong>suy nghĩ nền</strong> để làm gì?
          </p>
          <p>Sử dụng nhiều luồng cho phép AI sử dụng nhiều lõi CPU, tăng tốc độ tính toán. Để đạt hiệu năng tối ưu, hãy
            đặt số luồng bằng số lõi CPU. Nếu bật “<strong>Suy nghĩ nền</strong>”, AI sẽ tính toán trong thời gian đối
            thủ đi nước.</p>
          <p>Lưu ý: Nếu không thấy tùy chọn này, trình duyệt của bạn không hỗ trợ tính toán đa luồng. Hãy xem danh sách
            trình duyệt hỗ trợ <a href='https://caniuse.com/sharedarraybuffer'>tại đây</a>.</p>
        </li>
        <li>
          <p>Trọng số của engine là gì? Tôi nên chọn trọng số nào?</p>
          <p>Trọng số cung cấp thông tin đánh giá cho AI khi suy nghĩ, ảnh hưởng đến khả năng và phong cách chơi. Trọng
            số “mới nhất” thường có khả năng tốt nhất trong một đơn vị thời gian, nên sử dụng trọng số này.</p>
        </li>
        <li>
          <p>Tôi nên đặt <strong>kích thước bảng thay thế</strong> như thế nào?</p>
          <p>Nếu muốn phân tích lâu hoặc dùng nhiều luồng, hãy sử dụng bảng thay thế lớn hơn. Với tính toán nhanh, kích
            thước mặc định là đủ.</p>
        </li>
        <li>
          <p>Màn hình quá nhỏ dễ bị chạm nhầm, tôi phải làm sao?</p>
          <p>Trong cài đặt, chọn “<strong>Xác nhận hai lần</strong>” hoặc “<strong>Vuốt để đặt quân</strong>”. “Xác nhận
            hai lần” yêu cầu nhấp vào cùng vị trí hai lần, “Vuốt để đặt quân” hiển thị khung chọn.</p>
        </li>
        <li>
          <p>Làm thế nào để xuất hoặc thiết lập mã bàn cờ?</p>
          <p>Mã bàn cờ hiện trong mục “Trò chơi” có thể sao chép hoặc chỉnh sửa tuỳ ý.</p>
        </li>
        <li>
          <p>Làm sao để chia sẻ bàn cờ với người khác?</p>
          <p>Sử dụng nút “<strong>Chụp màn hình</strong>” để lưu ảnh cờ hiện tại hoặc sao chép liên kết trang web có mã
            bàn cờ để chia sẻ.</p>
        </li>
        <li>
          <p>Có thể lưu bàn cờ không?</p>
          <p>Hiện tại, để lưu bàn cờ, bạn cần tự sao chép mã bàn cờ hoặc liên kết trang web chứa mã đó.</p>
        </li>
        <li>
          <p>Xem trước lộ trình tối ưu của AI?</p>
          <p>Di chuột vào lộ trình tối ưu AI để xem trước. Trên máy tính, nhấp đúp chuột vào lộ trình để thiết lập bàn
            cờ theo lộ trình đó.</p>
        </li>
        <li>
          <p>Có thể dùng bàn phím không?</p>
          <p>Sử dụng phím mũi tên trái/phải để quay lại/tiến tới, phím HOME/END để về đầu/cuối, phím Space để tính hoặc
            dừng tính, phím b/B để tính điểm cân bằng một/hai bước.</p>
        </li>
        <li>
          <p>Tôi phát hiện lỗi? Tôi muốn góp ý?</p>
          <p>Vui lòng gửi issue tại <a href='https://github.com/gomocalc/gomocalc.github.io/issues'>đây</a>.</p>
        </li>
      </ul>
      <p>&nbsp;</p>
      <h3 id='更新记录'>Lịch sử cập nhật</h3>
      <ul>
        <li>
          <p>0.30</p>
          <ul>
            <li>Cập nhật engine, thêm trọng số mix9lite</li>
            <li>Hỗ trợ thêm nhiều ngôn ngữ</li>
            <li>Thêm phím tắt trên bàn phím</li>
          </ul>
        </li>
        <li>
          <p>0.26</p>
          <ul>
            <li>Sửa lỗi tốc độ trong chế độ đa luồng</li>
            <li>Cập nhật trọng số</li>
          </ul>
        </li>
        <li>
          <p>0.25</p>
          <ul>
            <li>Hỗ trợ điều chỉnh phạm vi chọn điểm</li>
            <li>Thêm hiển thị tỷ lệ thắng</li>
          </ul>
        </li>
        <li>
          <p>0.24</p>
          <ul>
            <li>Sửa lỗi tạo nước đi</li>
            <li>Cập nhật trọng số engine</li>
          </ul>
        </li>
        <li>
          <p>0.23</p>
          <ul>
            <li>Thêm chức năng giới hạn khả năng chơi và suy nghĩ nền</li>
          </ul>
        </li>
        <li>
          <p>0.22</p>
          <ul>
            <li>Cập nhật engine, thêm hỗ trợ đa luồng</li>
            <li>Thêm chức năng tính điểm cân bằng</li>
          </ul>
        </li>
        <li>
          <p>0.21</p>
          <ul>
            <li>Sửa lỗi đánh giá cấm tay</li>
          </ul>
        </li>
        <li>
          <p>0.20</p>
          <ul>
            <li>Cập nhật lên Rapfi2021, thêm hỗ trợ luật không thắng chặn dài và liên quân</li>
          </ul>
        </li>
        <li>
          <p>0.17</p>
          <ul>
            <li>Thêm tuỳ chọn kích thước bảng thay thế</li>
          </ul>
        </li>
        <li>
          <p>0.16</p>
          <ul>
            <li>Tối ưu giao diện cho màn hình rộng</li>
            <li>Thêm xem trước lộ trình</li>
          </ul>
        </li>
        <li>
          <p>0.15</p>
          <ul>
            <li>Có thể thay đổi màu bàn cờ</li>
            <li>Hỗ trợ xuất ảnh HD và GIF</li>
            <li>Hiển thị điểm trong phân tích nhiều điểm</li>
          </ul>
        </li>
        <li>
          <p>0.14</p>
          <ul>
            <li>Thêm hiển thị kết quả phân tích nhiều điểm</li>
            <li>Cài đặt tự động lưu</li>
          </ul>
        </li>
        <li>
          <p>0.13</p>
          <ul>
            <li>Sửa lỗi sai lệnh khi quay lại trong lúc AI suy nghĩ</li>
            <li>Sửa lỗi không hiển thị đầy đủ lộ trình</li>
          </ul>
        </li>
      </ul>
      <p>&nbsp;</p>
      <h3 id='关于应用'>Thông tin ứng dụng</h3>
      <p>Trang ứng dụng: <a href='https://gomocalc.com'>Trang chính</a></p>
      <p>Ứng dụng mã nguồn mở, mã nguồn tại: <a href='https://github.com/dhbloo/gomoku-calculator'>Github</a></p>
      <p>Tham gia nhóm người dùng: <a href='https://qm.qq.com/q/xj9OHByFTG'>Nhóm QQ</a>, <a
          href='https://discord.gg/7kEpFCGdb5'>Discord</a></p>
    </div>

    <div v-else-if="$i18n.locale === 'ru'">
      <h2 id='пятнашки-калькулятор-v030'>Калькулятор Гомоку V0.30</h2>
      <h3 id='faq'>Часто задаваемые вопросы (FAQ)</h3>
      <ul>
        <li>
          <p>Что может делать это приложение?</p>
          <p>Его можно использовать для составления диаграмм, анализа позиций Гомоку с помощью ИИ или игры против ИИ.
          </p>
        </li>
        <li>
          <p>На мобильных устройствах уже есть много приложений для Гомоку. Чем это приложение отличается?</p>
          <p>Большинство мобильных приложений для Гомоку предлагают только развлекательные партии, без полной аналитики.
            Немногие приложения с функцией анализа поддерживаются только на ограниченном количестве платформ. Так как
            это приложение является веб-приложением, оно может работать на большинстве устройств с браузером, что делает
            его более удобным в использовании.</p>
        </li>
        <li>
          <p>На мобильном браузере всегда отображается строка адреса. Как включить полноэкранный режим?</p>
          <p>Для браузера Safari на iOS и Chrome на Android рекомендуется выбрать в меню браузера <strong>«Добавить на
              главный экран»</strong>, чтобы получить опыт, похожий на использование нативного приложения.</p>
        </li>
        <li>
          <p>Какой ИИ используется для Гомоку?</p>
          <p>В этом приложении используется движок Rapfi, который участвовал в соревновании Gomocup 2021. Благодаря
            технологии Web Assembly Rapfi обеспечивает производительность, близкую к нативным приложениям, и не требует
            подключения к серверу для вычислений.</p>
        </li>
        <li>
          <p>Какие правила поддерживаются?</p>
          <p>Поддерживаются следующие правила: «Без запретных ходов», «Без запретных ходов, но длинная линия не
            выигрывает», «Свободное Гомоку», «Без запретных ходов с одним обменом». </p>
        </li>
        <li>
          <p>Как настроить режим игры?</p>
          <p>В настройках выберите <strong>«ИИ играет черными»</strong> или <strong>«ИИ играет белыми»</strong>. Затем,
            когда придет очередь ИИ, нажмите на любое место на доске, чтобы начать партию с ИИ.</p>
        </li>
        <li>
          <p>Что означают «+M» и «-M» в оценке?</p>
          <p>Если в оценке появляется «+M» или «-M», это означает, что ИИ обнаружил гарантированную победу или
            поражение. Число после обозначения указывает максимальное количество ходов до достижения пяти в ряд.</p>
        </li>
        <li>
          <p>Чем режим анализа отличается от режима с неограниченным временем?</p>
          <p>В режиме анализа ИИ продолжает вычисления даже после обнаружения гарантированной победы или поражения, что
            позволяет находить оптимальные ходы.</p>
        </li>
        <li>
          <p>Как заставить ИИ рассчитывать оптимальные ходы для нескольких точек?</p>
          <p>
            В настройках установите значение для <strong>«Многоточечный анализ»</strong>. После расчета ИИ покажет
            оценки и пути для соответствующего количества лучших ходов. Замечание: в этом режиме скорость вычислений
            снижается, а общий уровень игры ИИ может ухудшиться. Рекомендуется использовать этот режим только при
            необходимости.
          </p>
        </li>
        <li>
          <p>Как снизить уровень сложности ИИ или увеличить разнообразие ходов?</p>
          <p>
            Опция <strong>«Ограничить уровень игры»</strong> добавляет случайности в ходы ИИ и заметно снижает его
            уровень игры. Чем выше значение, тем сильнее ограничение (0 — без ограничений, 100 — максимальное
            ограничение). Также снижение времени расчета или количества узлов снижает уровень игры ИИ, но не увеличивает
            случайность ходов.
          </p>
        </li>
        <li>
          <p>Что такое <strong>точка равновесия</strong>? Для чего она нужна?</p>
          <p>
            Одноходовая или двухходовая <strong>точка равновесия</strong> — это ход или последовательность ходов,
            которые делают позицию максимально равной (оценка стремится к 0). После выполнения таких ходов черные и
            белые получают примерно равные шансы. Эта функция полезна в некоторых правилах, например, SWAP2.
          </p>
        </li>
        <li>
          <p>Как настроить <strong>количество потоков</strong>? Зачем нужен <strong>фоновый расчет</strong>?</p>
          <p>
            Многопоточность позволяет ИИ использовать несколько ядер процессора, что значительно увеличивает скорость
            расчета. Для максимальной производительности установите максимальное количество потоков. При включении
            <strong>фонового расчета</strong> ИИ использует время оппонента для вычислений.
          </p>
          <p>Замечание: если эта опция недоступна, ваш браузер не поддерживает многопоточность. Список поддерживаемых
            браузеров можно найти <a href='https://caniuse.com/sharedarraybuffer'>здесь</a>.</p>
        </li>
        <li>
          <p>Что такое вес движка? Какой вес выбрать?</p>
          <p>Вес движка предоставляет ИИ данные для оценки позиций и влияет на стиль игры. Обычно
            <strong>«новейший»</strong> вес обеспечивает наилучший уровень игры за единицу времени. Рекомендуется
            использовать именно его.
          </p>
        </li>
        <li>
          <p>Как настроить <strong>размер таблицы транспозиций</strong>?</p>
          <p>Для длительного анализа или многопоточных расчетов требуется больший размер таблицы. Для быстрых вычислений
            можно оставить значение по умолчанию.</p>
        </li>
        <li>
          <p>Что делать, если из-за маленького экрана случаются ошибки при постановке ходов?</p>
          <p>
            В настройках выберите способ постановки ходов: <strong>«Подтверждение»</strong> или <strong>«Жестовое
              управление»</strong>. Первый способ требует двойного клика, второй — выбор позиции с помощью появляющегося
            меню.
          </p>
        </li>
        <li>
          <p>Как экспортировать или установить код партии?</p>
          <p>На странице «Игра» код текущей партии отображается как «Код позиции». Его можно скопировать или
            отредактировать.</p>
        </li>
        <li>
          <p>Как поделиться позицией с другим человеком?</p>
          <p>
            Нажмите кнопку <strong>«Скриншот»</strong>, чтобы сохранить изображение текущей позиции. На компьютере можно
            щелкнуть правой кнопкой мыши для сохранения. Также можно скопировать ссылку на браузер с кодом позиции.
          </p>
        </li>
        <li>
          <p>Можно ли сохранить позицию?</p>
          <p>Сохранение доступно через копирование кода позиции или сохранение ссылки с кодом.</p>
        </li>
        <li>
          <p>Как просмотреть оптимальный маршрут ИИ?</p>
          <p>Наведите курсор на ход в оптимальном маршруте, чтобы увидеть текущий расчет. Двойной клик на маршруте
            установит позицию по данному пути.</p>
        </li>
        <li>
          <p>Можно ли управлять игрой с помощью клавиатуры?</p>
          <p>Клавиши «влево/вправо» позволяют перемещаться по ходам, «HOME/END» возвращают к началу или концу, пробел
            запускает или останавливает расчет, а «B/b» рассчитывают одну или две точки равновесия.</p>
        </li>
        <li>
          <p>Нашел баг или хочу предложить улучшение?</p>
          <p>Сообщите о баге или предложите идею <a
              href='https://github.com/gomocalc/gomocalc.github.io/issues'>здесь</a>.</p>
        </li>
      </ul>
      <p>&nbsp;</p>
      <h3 id='история-обновлений'>История обновлений</h3>
      <ul>
        <li>
          <p>0.30</p>
          <ul>
            <li>Обновлен движок: добавлен вес mix9lite</li>
            <li>Добавлены новые языки</li>
            <li>Добавлено управление с клавиатуры</li>
          </ul>
        </li>
        <li>
          <p>0.26</p>
          <ul>
            <li>Исправлена проблема скорости в многопоточном режиме</li>
            <li>Обновлен вес движка</li>
          </ul>
        </li>
        <li>
          <p>0.25</p>
          <ul>
            <li>Добавлена настройка области выбора точек</li>
            <li>Добавлен вывод процента побед</li>
          </ul>
        </li>
        <li>
          <p>0.24</p>
          <ul>
            <li>Исправлены баги генерации ходов</li>
            <li>Обновлен вес движка</li>
          </ul>
        </li>
        <li>
          <p>0.23</p>
          <ul>
            <li>Добавлена опция ограничения уровня игры и фоновых расчетов</li>
          </ul>
        </li>
        <li>
          <p>0.22</p>
          <ul>
            <li>Обновлен движок: добавлена поддержка многопоточности</li>
            <li>Добавлена функция расчета точки равновесия</li>
          </ul>
        </li>
        <li>
          <p>0.21</p>
          <ul>
            <li>Исправлены баги определения запретных ходов</li>
          </ul>
        </li>
        <li>
          <p>0.20</p>
          <ul>
            <li>Обновление движка Rapfi2021: поддержка правил длинной линии и Гомоку</li>
          </ul>
        </li>
        <li>
          <p>0.17</p>
          <ul>
            <li>Добавлена настройка размера таблицы транспозиций</li>
          </ul>
        </li>
        <li>
          <p>0.16</p>
          <ul>
            <li>Оптимизация макета для широких экранов</li>
            <li>Добавлено предварительное отображение маршрутов</li>
          </ul>
        </li>
        <li>
          <p>0.15</p>
          <ul>
            <li>Добавлена настройка цвета доски</li>
            <li>Добавлен экспорт изображений и GIF</li>
            <li>Реальное время для вывода многоточечного анализа</li>
          </ul>
        </li>
        <li>
          <p>0.14</p>
          <ul>
            <li>Добавлен вывод для многоточечного анализа</li>
            <li>Настройки теперь сохраняются автоматически</li>
          </ul>
        </li>
        <li>
          <p>0.13</p>
          <ul>
            <li>Исправлены ошибки, возникающие при возврате хода во время расчета</li>
            <li>Исправлено отображение панели маршрутов</li>
          </ul>
        </li>
      </ul>
      <p>&nbsp;</p>
      <h3 id='о-приложении'>О приложении</h3>
      <p>Ссылка на приложение: <a href='https://gomocalc.com'>основной сайт</a></p>
      <p>Код открыт: <a href='https://github.com/dhbloo/gomoku-calculator'>Github</a></p>
      <p>Добро пожаловать в группы пользователей: <a href='https://qm.qq.com/q/xj9OHByFTG'>QQ-группа</a>, <a
          href='https://discord.gg/7kEpFCGdb5'>Discord</a></p>
    </div>

    <div v-else>
      <h2 id='gomoku-calculator-v030'>Gomoku Calculator V0.30</h2>
      <h3 id='faq'>FAQ</h3>
      <ul>
        <li>
          <p>What can this app do?</p>
          <p>It can be used as a gomoku board, or used to analyze gomoku positions with the help of AI. You can also
            play against the AI.</p>
        </li>
        <li>
          <p>There are already many gomoku software on mobile platform, does this app have anything special?</p>
          <p>Most gomoku apps on mobile platform do not provide detailed analysis, meanwhile other apps providing
            analysis support limited platforms. As this app is fundamentally a web page, it can be run on almost every
            devices with an appropriate browser, which is more convenient.</p>
        </li>
        <li>
          <p>When using in mobile browser, the address bar takes a lot of screen space. Is there any way to using the
            app in fullscreen mode?</p>
          <p>For Safari browser on IOS and Chrome browser on Android, it is recommended to choose the &quot;<strong>Add
              to home screen</strong>&quot; option to gain use experience similar to a native app.</p>
        </li>
        <li>
          <p>What gomoku AI is used?</p>
          <p>This app uses Rapfi engine, which participated in Gomocup 2021. With the use of web-assembly technology,
            rapfi can achieve performance close to native app, and doesn&#39;t need to communicate with the server when
            thinking.</p>
        </li>
        <li>
          <p>Which rules are supported?</p>
          <p>Currently supported rules include &quot;Freestyle Gomoku&quot;, &quot;Standard Gomoku&quot;, &quot;Free
            Renju&quot; and &quot;Freestyle Gomoku - SWAP1&quot;.</p>
        </li>
        <li>
          <p>How to make the AI move automatically?</p>
          <p>Select &quot;<strong>AI plays Black</strong>&quot; or &quot;<strong>AI plays White</strong>&quot; in
            setting page, then when it is time for AI to move, click anywhere on the board and AI will start to think.
          </p>
        </li>
        <li>
          <p>What is the meaning of &quot;+M&quot; and &quot;-M&quot; in evaluation?</p>
          <p>If &quot;+M&quot; or &quot;-M&quot; is shown in evaluation, it means AI have found a forced win or loss,
            and the number after that is the max step to end the game.</p>
        </li>
        <li>
          <p>What is the difference of analysis mode besides infinite time?</p>
          <p>In analysis mode, AI does not stop thinking when found a force win or loss, because continuing the thinking
            is more likely to find a better solution with less steps.</p>
        </li>
        <li>
          <p>How to let AI analyze the N best lines?</p>
          <p>Set the &quot;<strong>Multi PV</strong>&quot; option to N, the AI will give the N best principal variations
            after thinking. Note: When you do not need this feature, leave it at 1 for best performance.</p>
        </li>
        <li>
          <p>How to reduce the difficulty of AI / increase the diversity of AI moves?</p>
          <p>The &quot;<strong>Handicap</strong>&quot; option can increase the randomness of the AI&#39;s moves and
            significantly reduce the AI&#39;s strength. Greater value implies more reduction of strength (0 means no
            limitation of strength, 100 means maximum limitation of strength). In addition, reducing calculation
            time/nodes will also reduce the AI&#39;s strength, but it will not increase the randomness of AI&#39;s move.
          </p>
        </li>
        <li>
          <p>What is a <strong>balanced move</strong>? What is the use of calculating a balanced move?</p>
          <p>The one-step/two-step <strong>balanced moves</strong> can make the position evaluation tend to zero. After
            completing the one/two moves, black and white players will get a (approximately) balanced opening. The
            estimated value obtained by search represents the evaluation of the balanced move, and the closer the value
            is to 0, the more balanced is the position. Similar to normal calculations, the credibility of the value
            increases as the search depth increases. Balanced move calculation is very useful under some rules (such as
            SWAP2).</p>
        </li>
        <li>
          <p>How should I set the <strong>number of threads</strong>? What is the use of <strong>pondering</strong>?</p>
          <p>Multi-threading allows AI to use multiple CPU cores for calculations, which can significantly improve
            search speed and thinking skills. If you want to use all the computing power to get the best playing
            strength, it is recommended to set &quot;<strong>Thread Num</strong>&quot; to the maximum. If you turn on
            <strong>Pondering</strong>, AI will use the opponent&#39;s time to think.
          </p>
          <p>Note: If you do not see this option, your browser does not support multi-threaded computing. Currently,
            only some browsers support multi-threading. You can check browsers support in <a
              href='https://caniuse.com/sharedarraybuffer'>here</a>.</p>
        </li>
        <li>
          <p>What is &quot;engine model&quot;? Which engine model should I choose?</p>
          <p>Engine model provides information such as evaluation used by AI when thinking, and will have a certain
            impact on the playing strength and playing style of the AI. In general, the &quot;latest&quot; model has the
            best strength per unit time, thus it is recommended to use the &quot;latest&quot; model.</p>
        </li>
        <li>
          <p>How should I set the &quot;<strong>Hash Table Size</strong>&quot;?</p>
          <p>If you need to analyze for a long time, or use multiple threads, you will need a larger hash table. For
            fast calculations, use the default hash table size.</p>
        </li>
        <li>
          <p>My screen is small, how to avoid clicking the wrong position?</p>
          <p>Select the click manner to &quot;<strong>Secondary Confirmation</strong>&quot; or &quot;<strong>Slide to
              Move</strong>&quot;. &quot;Secondary Confirmation&quot; needs you to click twice to confirm a move, while
            &quot;Slide to Move&quot; makes move according to the selection box when pressed.</p>
        </li>
        <li>
          <p>How to get/set position code?</p>
          <p>The &quot;current pos&quot; field in &quot;game&quot; page“ is the current position code, which you can
            copy or modify freely.</p>
        </li>
        <li>
          <p>How to share a position to others?</p>
          <p>You can click &quot;Shot&quot; button in the button bar to get a picture of current position, then you can
            long press to save the pic. Besides, you can just copy the link in browser, and open it on other places to
            get the position.</p>
        </li>
        <li>
          <p>How can I save a position?</p>
          <p>Currently, it needs you to save the position code or link manually.</p>
        </li>
        <li>
          <p>How to preview bestline calcuated by AI?</p>
          <p>Hover on one bestline move to preview bestlines calcuated by AI currently. On desktop client you can set
            current position to bestline by double-clicking bestline move.</p>
        </li>
        <li>
          <p>Can keyboard shortcuts be used?</p>
          <p>You can use the left/right arrow keys on the keyboard to move backward/forward through the board states,
            the HOME/END keys to jump to the start/end of the board states, the spacebar to start or stop calculations,
            and the &quot;b/B&quot; key to calculate one/two equilibrium points.</p>
        </li>
        <li>
          <p>I found a bug? I want to make a suggestion?</p>
          <p>Welcome to submit an issue <a href='https://github.com/gomocalc/gomocalc.github.io/issues'>here</a> to
            feedback the bug or suggestion.</p>
        </li>

      </ul>
      <p>&nbsp;</p>
      <h3 id='update-record'>Update Record</h3>
      <ul>
        <li>
          <p>0.30</p>
          <ul>
            <li>engine update，add mix9lite model</li>
            <li>more language support</li>
            <li>add some keyboard shortcuts</li>

          </ul>
        </li>
        <li>
          <p>0.26</p>
          <ul>
            <li>fix performance issue for multi-threading</li>
            <li>engine weight update</li>

          </ul>
        </li>
        <li>
          <p>0.25</p>
          <ul>
            <li>add option for adjusting candidate range</li>
            <li>add winrate display</li>

          </ul>
        </li>
        <li>
          <p>0.24</p>
          <ul>
            <li>fix bug on move generation</li>
            <li>update engine weights</li>

          </ul>
        </li>
        <li>
          <p>0.23</p>
          <ul>
            <li>add option for strength handicap and pondering</li>

          </ul>
        </li>
        <li>
          <p>0.22</p>
          <ul>
            <li>engine update, support for multi-threading</li>
            <li>support for balanced move calculation</li>

          </ul>
        </li>
        <li>
          <p>0.21</p>
          <ul>
            <li>fix wrong forbidden point judgement</li>

          </ul>
        </li>
        <li>
          <p>0.20</p>
          <ul>
            <li>update engine to Rapfi2021, new support for Standard and Renju rule</li>

          </ul>
        </li>
        <li>
          <p>0.17</p>
          <ul>
            <li>add option for transposition table size</li>

          </ul>
        </li>
        <li>
          <p>0.16</p>
          <ul>
            <li>optimize landscape layout</li>
            <li>bestline preview</li>

          </ul>
        </li>
        <li>
          <p>0.15</p>
          <ul>
            <li>board color is changeable now</li>
            <li>support for exporting high-res JPEG and GIF</li>
            <li>realtime evaluation display of multi-PV analysis</li>

          </ul>
        </li>
        <li>
          <p>0.14</p>
          <ul>
            <li>add display for multi pv mode</li>
            <li>settings can be automatically saved now</li>

          </ul>
        </li>
        <li>
          <p>0.13</p>
          <ul>
            <li>fix position error after going backward when AI is thinking</li>
            <li>fix display of pv line field</li>

          </ul>
        </li>

      </ul>
      <p>&nbsp;</p>
      <h3 id='about-the-app'>About the App</h3>
      <p>App websites: <a href='https://gomocalc.com'>Main Site</a></p>
      <p>This is an open-source application. Source code is available at: <a
          href='https://github.com/dhbloo/gomoku-calculator'>Github</a></p>
      <p>Join our user community groups: <a href='https://qm.qq.com/q/xj9OHByFTG'>QQ Group</a>, <a
          href='https://discord.gg/7kEpFCGdb5'>Discord</a></p>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '~github-markdown-css/github-markdown.css';

.about {
  padding: 2% 5%;
}
</style>
