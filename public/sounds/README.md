# Notification Sounds

This folder should contain MP3 notification sound files.

## Required Sound Files:

Place the following sound files in this directory:

- `bell.mp3` - Classic notification bell
- `chime.mp3` - Soft melodic chime
- `ding.mp3` - Quick attention sound
- `alert.mp3` - Urgent alert tone
- `notify.mp3` - Gentle notification
- `ping.mp3` - Quick ping sound

## Where to Get Sounds:

You can:
1. **Record your own** using Audacity or similar
2. **Download free sounds** from:
   - https://freesound.org/ (Creative Commons)
   - https://mixkit.co/free-sound-effects/ (Free for commercial use)
   - https://www.zapsplat.com/ (Free with attribution)

3. **Use system sounds** from Windows:
   - Located in: `C:\Windows\Media\`
   - Copy and rename to match the filenames above

## Format:

- Format: MP3
- Recommended length: 0.5-2 seconds
- Sample rate: 44.1 kHz or 48 kHz
- Bitrate: 128-192 kbps

## Testing:

The SoundPicker component has preview buttons - click Play to test each sound!

## Fallback:

If sound files are missing, the app will:
1. Log an error to console
2. Continue working without sound (graceful degradation)
