## Gomoku Calculator V0.30

### FAQ

+ What can this app do?

  It can be used as a gomoku board, or used to analyze gomoku positions with the help of AI. You can also play against the AI.

+ There are already many gomoku software on mobile platform, does this app have anything special?

  Most gomoku apps on mobile platform do not provide detailed analysis, meanwhile other apps providing analysis support limited platforms. As this app is fundamentally a web page, it can be run on almost every devices with an appropriate browser, which is more convenient.

+ When using in mobile browser, the address bar takes a lot of screen space. Is there any way to using the app in fullscreen mode?

  For Safari browser on IOS and Chrome browser on Android, it is recommended to choose the "**Add to home screen**" option to gain use experience similar to a native app.

+ What gomoku AI is used?

  This app uses Rapfi engine, which participated in Gomocup 2021. With the use of web-assembly technology, rapfi can achieve performance close to native app, and doesn't need to communicate with the server when thinking.

+ Which rules are supported?

  Currently supported rules include "Freestyle Gomoku", "Standard Gomoku", "Free Renju" and "Freestyle Gomoku - SWAP1".

+ How to make the AI move automatically?

  Select "**AI plays Black**" or "**AI plays White**" in setting page, then when it is time for AI to move, click anywhere on the board and AI will start to think.

+ What is the meaning of "+M" and "-M" in evaluation?

  If "+M" or "-M" is shown in evaluation, it means AI have found a forced win or loss, and the number after that is the max step to end the game.

+ What is the difference of analysis mode besides infinite time?

  In analysis mode, AI does not stop thinking when found a force win or loss, because continuing the thinking is more likely to find a better solution with less steps.

+ How to let AI analyze the N best lines?

  Set the "**Multi PV**" option to N, the AI will give the N best principal variations after thinking. Note: When you do not need this feature, leave it at 1 for best performance.

+ How to reduce the difficulty of AI / increase the diversity of AI moves?

  The "**Handicap**" option can increase the randomness of the AI's moves and significantly reduce the AI's strength. Greater value implies more reduction of strength (0 means no limitation of strength, 100 means maximum limitation of strength). In addition, reducing calculation time/nodes will also reduce the AI's strength, but it will not increase the randomness of AI's move.

+ What is a **balanced move**? What is the use of calculating a balanced move?

  The one-step/two-step **balanced moves** can make the position evaluation tend to zero. After completing the one/two moves, black and white players will get a (approximately) balanced opening. The estimated value obtained by search represents the evaluation of the balanced move, and the closer the value is to 0, the more balanced is the position. Similar to normal calculations, the credibility of the value increases as the search depth increases. Balanced move calculation is very useful under some rules (such as SWAP2).

+ How should I set the **number of threads**? What is the use of **pondering**?

  Multi-threading allows AI to use multiple CPU cores for calculations, which can significantly improve search speed and thinking skills. If you want to use all the computing power to get the best playing strength, it is recommended to set "**Thread Num**" to the maximum. If you turn on **Pondering**, AI will use the opponent's time to think.

  Note: If you do not see this option, your browser does not support multi-threaded computing. Currently, only some browsers support multi-threading. You can check browsers support in [here](https://caniuse.com/sharedarraybuffer).

+ What is "engine model"? Which engine model should I choose?

  Engine model provides information such as evaluation used by AI when thinking, and will have a certain impact on the playing strength and playing style of the AI. In general, the "latest" model has the best strength per unit time, thus it is recommended to use the "latest" model.

+ How should I set the "**Hash Table Size**"?

  If you need to analyze for a long time, or use multiple threads, you will need a larger hash table. For fast calculations, use the default hash table size.

+ My screen is small, how to avoid clicking the wrong position?

  Select the click manner to "**Secondary Confirmation**" or "**Slide to Move**". "Secondary Confirmation" needs you to click twice to confirm a move, while "Slide to Move" makes move according to the selection box when pressed.

+ How to get/set position code?

  The "current pos" field in "game" page“ is the current position code, which you can copy or modify freely.

+ How to share a position to others?

  You can click "Shot" button in the button bar to get a picture of current position, then you can long press to save the pic. Besides, you can just copy the link in browser, and open it on other places to get the position.

+ How can I save a position?

  Currently, it needs you to save the position code or link manually.

+ How to preview bestline calcuated by AI?

  Hover on one bestline move to preview bestlines calcuated by AI currently. On desktop client you can set current position to bestline by double-clicking bestline move.

+ Can keyboard shortcuts be used?

  You can use the left/right arrow keys on the keyboard to move backward/forward through the board states, the HOME/END keys to jump to the start/end of the board states, the spacebar to start or stop calculations, and the "b/B" key to calculate one/two equilibrium points.

+ I found a bug? I want to make a suggestion?

  Welcome to submit an issue [here](https://github.com/gomocalc/gomocalc.github.io/issues) to feedback the bug or suggestion.



### Update Record

+ 0.30
  + engine update，add mix9lite model
  + more language support
  + add some keyboard shortcuts
+ 0.26
  + fix performance issue for multi-threading
  + engine weight update
+ 0.25
  + add option for adjusting candidate range
  + add winrate display
+ 0.24
  + fix bug on move generation
  + update engine weights
+ 0.23
  + add option for strength handicap and pondering
+ 0.22
  + engine update, support for multi-threading
  + support for balanced move calculation
+ 0.21
  + fix wrong forbidden point judgement
+ 0.20
  + update engine to Rapfi2021, new support for Standard and Renju rule
+ 0.17
  + add option for transposition table size
+ 0.16
  + optimize landscape layout
  + bestline preview
+ 0.15
  + board color is changeable now
  + support for exporting high-res JPEG and GIF
  + realtime evaluation display of multi-PV analysis
+ 0.14
  + add display for multi pv mode
  + settings can be automatically saved now
+ 0.13
  + fix position error after going backward when AI is thinking
  + fix display of pv line field



### About the App

App websites: [Main Site](https://gomocalc.com)

This is an open-source application. Source code is available at: [Github](https://github.com/dhbloo/gomoku-calculator)

Join our user community groups: [QQ Group](https://qm.qq.com/q/xj9OHByFTG), [Discord](https://discord.gg/7kEpFCGdb5)
