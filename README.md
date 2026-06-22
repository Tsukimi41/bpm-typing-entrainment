# bpm-typing-entrainment
本アプリケーションは、聴覚的BPM（Beats Per Minute）が人間の無意識なタイピング速度および正確性に与える同調効果を検証する研究のためのデータ収集ツールである。特定の環境下における被験者のCPM（Characters Per Minute）およびエラー率を、PC のハードウェアキーボード入力のみを対象に、純粋な運動反射レベルで正確に計測・記録することを目的とする。

## 実行方法

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

How to use(Japanese)
# 使い方

このアプリは、被験者ごとのタイピング試行を1回ずつ実施し、CPM とエラー率を記録するための画面です。操作は少なく、入力のノイズを減らすことを優先しています。

## 画面の流れ

### 1. 実験準備画面

最初に次の 2 項目を入力します。

- 被験者ID
- BPM条件

入力後、`開始` ボタンを押すと試行画面に進みます。

### 2. タイピング試行画面

画面中央に課題文が表示されます。

- 入力欄はありません。
- キーボードの `keydown` を画面全体で監視します。
- 現在打つべき 1 文字だけが強調表示されます。
- 正しいキーを押すと次の文字に進みます。
- 間違ったキーを押すとエラー数だけが増え、文字位置は戻りません。
- Backspace、Delete、矢印キー、Tab、Enter などの操作キーは無効です。

### 3. 完了画面

最後の文字を正しく入力すると試行が完了します。

- 1 試行分の記録が下部テーブルに追加されます。
- `設定へ戻る` で準備画面に戻れます。

## 記録される項目

試行ごとに次の値が保存されます。

- タイムスタンプ
- 被験者ID
- BPM条件
- テキストID
- CPM
- エラー率
- 経過時間（秒）
- ミス回数

下部のテーブルには過去の試行結果が蓄積されます。

## CSVコピー

`CSVコピー` ボタンを押すと、蓄積された記録が CSV 文字列としてクリップボードに入ります。

提出時は、この CSV をそのまま研究者に渡せます。

## 実験上の注意

- 画面は PC ブラウザで開いてください。
- スマートフォンやタブレットではブロックされます。
- 音声は出ません。BPM の音源は別環境で再生する想定です。
- 入力の修正はできない前提なので、誤入力した場合はそのままエラーとして扱われます。

## 試行の進み方

1. 被験者IDを入力する。
2. BPM条件を選ぶ。
3. `開始` を押す。
4. 画面中央の文字を先頭から順番に入力する。
5. 完了後、結果を確認する。
6. 必要なら `CSVコピー` を使ってデータを保存する。

## よくある勘違い

- `入力欄に文字を打つ` アプリではありません。画面全体のキー入力で進みます。
- 1 文字間違えたら消して直すことはできません。
- 1 文字目の正解でタイマーが始まり、最後の文字の正解で止まります。
- 直近 5 回と同じテキストはできるだけ出にくくなっています。

## 画面が出ないとき

- ウィンドウが小さすぎるとモバイル扱いになる場合があります。
- ブラウザのアドレスバーや検索欄ではなく、アプリ画面にフォーカスを戻してください。
- うまくいかない場合は、ページを再読み込みして最初からやり直してください。


How to use(English)
# Usage

This app is a screen for running one typing trial per participant and recording CPM and error rate. The interaction is intentionally minimal so that input noise is kept as low as possible.

## Screen Flow

### 1. Experiment Setup Screen

First, enter the following two items:

- Participant ID
- BPM condition

After entering them, press `Start` to move to the typing trial screen.

### 2. Typing Trial Screen

The task text is shown in the center of the screen.

- There is no input field.
- The app listens for `keydown` events across the entire screen.
- Only the single character you should type next is highlighted.
- When you press the correct key, the focus moves to the next character.
- When you press the wrong key, only the error count increases and the cursor position does not move back.
- Control keys such as Backspace, Delete, Arrow keys, Tab, and Enter are disabled.

### 3. Completion Screen

When the last character is entered correctly, the trial ends.

- One trial record is added to the table at the bottom.
- Use `Back to Setup` to return to the setup screen.

## Recorded Fields

Each trial stores the following values:

- Timestamp
- Participant ID
- BPM condition
- Text ID
- CPM
- Error rate
- Elapsed time in seconds
- Number of mistakes

Past trial results are accumulated in the table below.

## CSV Copy

Press the `Copy CSV` button to copy the accumulated records as a CSV string to the clipboard.

You can hand this CSV directly to the researcher when submitting data.

## Important Notes

- Open the app in a PC browser.
- Smartphones and tablets will be blocked.
- No audio is played. The BPM sound source is expected to run in a separate environment.
- Input correction is not supported, so any wrong input is treated as an error.

## Trial Progression

1. Enter the participant ID.
2. Select the BPM condition.
3. Press `Start`.
4. Type the characters on the screen from the beginning, one by one.
5. Check the result after completion.
6. Use `Copy CSV` if you need to save the data.

## Common Misunderstandings

- This is not an app where you type into an input box. It advances using global keyboard input.
- If you make a mistake, you cannot delete it and try again.
- The timer starts on the first correct key press and stops on the final correct key press.
- The same text is unlikely to appear again within the most recent 5 trials.

## If the Screen Does Not Appear

- If the window is too small, it may be treated as a mobile device.
- Make sure focus is on the app itself, not the browser address bar or search field.
- If something goes wrong, reload the page and start over.
