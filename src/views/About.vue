<template>
  <div class="about markdown-body">
    <div v-if="$i18n.locale === 'zh'">
      <h2 id='五子棋计算器-v026'>五子棋计算器 V0.26</h2>
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
      <p>作者Github：<a href='https://github.com/dhbloo'>@dhbloo</a></p>
    </div>

    <div v-else>
      <h2 id='gomoku-calculator-v026'>Gomoku Calculator V0.26</h2>
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
            <strong>Pondering</strong>, AI will use the opponent&#39;s time to think.</p>
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
          <p>Can keyboard keys be used?</p>
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
      <p>Author&#39;s github homepage: <a href='https://github.com/dhbloo'>@dhbloo</a></p>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '~github-markdown-css/github-markdown.css';

.about {
  padding: 2% 5%;
}
</style>
