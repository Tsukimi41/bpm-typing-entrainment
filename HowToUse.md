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
