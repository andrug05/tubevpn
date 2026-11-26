# RideTube

[English](README.md) · [简体中文](README.zh-CN.md)

RideTube shows in English, French, Dutch, German, Spanish, Italian, Portuguese, Russian or Simplified Chinese
(Language setting). Chinese translation by 小白151
(JackieZ123430). The [Chinese guide](README.zh-CN.md) includes setup, playback settings, and font coverage.

> **Experimental and unofficial.** RideTube is an unofficial client for YouTube. It is not affiliated with,
> endorsed by or sponsored by Google or YouTube. Use it at your own risk. You are responsible for following
> YouTube's Terms of Service and the laws of your country, and for using it safely: by default the picture
> shows only while the car is parked.

| | |
|---|---|
| ![Home](docs/media/home.png) | ![Player](docs/media/player.png) |
| Home: your shelves, Continue watching first | The player, with chapters on the progress bar |
| ![Podcast mode while driving](docs/media/driving.png) | ![Sign in](docs/media/signin.png) |
| While driving: the sound plays on, no picture | Sign in with a code on your phone |

Rendered on a computer with demo data (Blender open movie titles), not photographed in a car.

RideTube plays videos on the BMW iDrive 7 head unit (MGU), installed from the MGU Store. It also includes an
optional VLESS + REALITY proxy for RideTube's own YouTube traffic. Everything runs on the car, over the car's
internet connection:

- **Home**, **Subscriptions**, **Watch later**, **History** and your **Playlists**, once you sign in on the car
  with the TV device sign-in (a code to enter on your phone; RideTube never sees your password).
- When a list runs out, the first related video plays after a 5 s countdown. The steering wheel's next button
  skips a segment, a video or a chapter, or goes to a related video.
- Search, channel pages, chapters, the video quality and fill or fit for the picture.
- Skip segments from [SponsorBlock](https://sponsor.ajay.app) (sponsors, self-promotion, intros and similar).
- The sound plays through the car's own media player.
- While driving, the picture is replaced by a podcast view (title, progress, controls) and the sound plays on.
  The picture comes back when the car is parked again.
- Videos stream. The head unit fetches about 2 minutes ahead of where you are, keeps that part in RAM (a few
  tens of MB at most) and drops what you have watched, so stopping after five minutes uses about five minutes of
  data. A far seek, forward or back, usually starts playing in a second or two.
- **Download** in the player keeps a video on the car until you remove it (press **Downloaded**). Downloads play
  with no internet, from **Library** on the rail or **On this car** on Home, signed in or not. One downloads at a
  time, never while a video plays, and only with at least 4 GB free on the head unit.
- A setting can download the 3, 5 or 10 newest Subscriptions videos by itself, only on Wi-Fi and only signed in.
  It is off by default. Those videos go once watched.
- Signed in, what you watch goes to your YouTube history, as on a TV.
- **Send logs to the developer** (in the menu, and on the error screen when a video fails) sends RideTube's
  recent service log and the health check result once, after you confirm, with the account details and the
  videos you watched removed. The health check lines carry no IP or MAC address, video id or title. You get a
  short code to add to your GitHub issue. Nothing is sent otherwise.
- **Health check** (in the menu) checks the service and its tools, the internet connection, free space and the
  car's audio service, one row per check.
- **VLESS proxy**: import VLESS share links from a phone, save up to 10 profiles on the car, switch profiles
  in RideTube, or turn the proxy off. When enabled, RideTube's YouTube requests use the selected VLESS tunnel.

## VLESS proxy

RideTube has an optional VLESS client powered by the bundled Xray core. It is an **app-level proxy**: it routes
RideTube's YouTube requests through the selected tunnel. It does not create a system-wide VPN and does not change
the network connection used by other BMW apps.

### Add a VLESS profile from your phone

1. Open RideTube's menu and select **Phone remote**.
2. Press **Turn on**. The car displays a QR code.
3. Connect your phone to the car's Wi-Fi hotspot, then scan the QR code with the phone camera.
4. The RideTube remote page opens in the phone browser. In **Add a VLESS profile**, paste the complete
   `vless://` share link and press **Save VLESS profile on the car**.
5. The profile is saved on the head unit and selected automatically. Wait for the status to change to
   **VLESS proxy is ready**.

The phone and the car must be on the car's Wi-Fi hotspot while importing a profile. The remote page is served
by the car itself; it does not require a cloud account or an external website. Turn **Phone remote** off when
finished. It also switches itself off after its inactivity timeout.

### Manage profiles in the car

- Open the RideTube menu and choose **VLESS proxy** to see saved profiles and their connection state.
- Select a profile to connect through it. The active profile is marked with a check.
- Choose **Disable VLESS** to stop the tunnel and return to the normal proxy mode.
- Up to **10 profiles** can be stored. Importing the same profile again updates/reuses that profile.
- Profiles remain on the car after RideTube is closed or the head unit restarts. The active selection is restored
  when the service starts.

You can also select an already saved profile, or choose **VLESS off**, from the profile selector on the phone's
RideTube remote page.

### Supported VLESS links

The current parser supports VLESS share links with this combination:

- **Transport:** TCP
- **Security:** REALITY
- **Flow:** `xtls-rprx-vision`
- **Encryption:** `none`
- Required REALITY parameters: `sni`, `pbk`, `sid` and `fp`
- Optional parameters: `spx` and the supported TCP `fm` fragment configuration

Other transports and security modes — for example WebSocket, gRPC, plain TLS, or non-REALITY VLESS — are not
supported by this build. The link must contain the complete share parameters supplied by your VLESS provider.
If RideTube reports an unsupported or missing parameter, ask the provider for a VLESS REALITY TCP Vision link.

### Routing and privacy

- With a VLESS profile active, the service starts Xray locally and sends RideTube's network requests through
  its local SOCKS5 interface. If Xray is starting or unavailable, RideTube reports the proxy as unavailable
  rather than silently switching to a direct connection.
- With VLESS disabled, RideTube follows its **Use the MGU Store's proxy** setting. If that setting is off,
  RideTube connects directly.
- VLESS credentials are stored locally in the service's protected state directory on the head unit. The app
  receives profile names and opaque profile keys, not the credentials. The VLESS link is not uploaded to this
  GitHub repository.
- The phone remote uses a temporary access code shown in the car's QR code. Anyone who can access that code
  while the remote is enabled may submit a video, search, or VLESS profile. Do not share the QR code; turn the
  remote off after use.

## Requirements

- A BMW with iDrive 7 (MGU, `ID7`) and the [MGU Store](https://github.com/robertnisipeanu/mgu-store) installed.
- The car online through the Store's uplink (`mgu-uplink`).
- Installed for you as requirements, so keep their sources in the Store: from the Store's own source, the
  renderer `mgu-render` 0.6.11 or newer, `mgu-deploy` 0.7.0 and `mgu-python` 1.0.2; from the Store's default
  `cauliflowermossgrape/idrive7-apps` source, the controller gate `mgu-inputgate` 1.0.0.

## Install

In the MGU Store, add the source

```
andrug05/tubevpn
```

Choose **Releases** as the source channel in the Store. Enter only `owner/repo` — do not append `:releases`.
The published `catalog` release contains the app and its matching service packages. Install **RideTube** from
that catalog; the Store resolves the required service and runtime components automatically.

Optional, on iDrive 7: Full-width touch (`mgu-render-id7-touch`, from this source) lets RideTube use the strip
at the screen's left edge where the car's back arrow usually is, for a wider rail and tiles. Without it RideTube
keeps out of that strip. Health check's width row says which one you have.

## Settings

- **Language**: Auto (follows the car's language when RideTube has it, else English), English, Français,
  Nederlands, Deutsch, Español, Italiano, Português, Русский or 中文. YouTube's language and country follow the car's iDrive language setting (on Auto; the
  country always), so feeds and search match what the car is set to.
- **Video while driving**: off by default. Leave it off unless the car is coded for video in motion and only
  passengers can see the screen. Switched on, it first shows a disclaimer and counts only once you press I agree;
  Cancel turns it off again. You use it at your own risk: RideTube's authors are not responsible for any misuse,
  accident, fine or damage. It takes effect only once switched on while the car is parked: pressed while driving,
  the picture stays off until the next stop.
- **Fill the screen**: off by default (black bars); on, the picture is cropped to fill the screen.
- **Video quality**: auto (720p on Wi-Fi, 480p on phone data), 720p, 480p or 360p.
- **Show members-only videos**: off by default. A channel can also be hidden from its page.
- **Show Shorts**: off by default.
- **SponsorBlock**, per category: skip, show a Skip button, or off.
- **Parked: pause when the 12 V battery is under** 60, 65 (default) or 70 %, or never.
- **Sign in** / **Sign out** in the app's menu.

The parked check reads the car's speed. A reading older than 5 seconds counts as driving.

## Tested on

| | |
|---|---|
| Car | BMW X5 xDrive45e (G05), iDrive 7 (MGU, ID7 HMI), firmware P18_23w44.2-1-3 |
| Internet | the Store's uplink over home Wi-Fi and an iPhone hotspot |

One car only so far. Reports from other cars are welcome in the issues.

## Known limits

- yt-dlp breaks now and then when YouTube changes. With "Update yt-dlp by itself" on (the default), the service
  fetches the newest yt-dlp release on the car, checked against the release's sha256 sums, daily and after a play
  fails; off, a fixed RideTube release brings a new yt-dlp (see `native/jap-ridetube-d/README.md`, "Updating
  yt-dlp").
- H.264 or VP9 (profile 0), up to 720p with 30 fps preferred, decoded on the head unit's GPU. Videos offered
  only in other formats (AV1, HDR) do not play.
- Signing in uses the TV device sign-in that YouTube's TV apps use. The client id is read from YouTube's TV
  page when you sign in; RideTube ships none.
- The switch from the first seconds of sound to the full file may be heard as a short break.
- A wrong head unit clock. If the head unit's date is earlier than this release's day, the clock is wrong for
  sure. RideTube then skips one TLS check, the certificate's dates, so videos still play. The certificate must
  still come from a trusted authority and name the right host. The app warns you once, and the menu says "Wrong
  clock" until you set the car's date and time. The risk while it lasts: someone who holds an old, expired
  certificate of YouTube or another host RideTube uses, with its private key, and can reach the car's traffic,
  could pose as that host. Thumbnails do not show while the clock is wrong. See
  `native/jap-ridetube-d/README.md`, "Security notes".
- RideTube's service runs as root. Its control socket is open only to the RideTube app's own user. If the
  service cannot read which user that is on a fresh install, the socket is open to every app until it can; see
  `native/jap-ridetube-d/README.md`, "Security notes".

## Uninstall

1. In RideTube, **Sign out** (or later, remove "YouTube on TV" at https://myaccount.google.com/permissions):
   uninstalling deletes the sign-in from the car, but Google keeps the grant until it is revoked.
2. In the MGU Store, uninstall **RideTube**, then its service `jap-ridetube-d`. A bad update can be undone in the
   Store while the previous version is kept.

## Layout

| Path | |
|---|---|
| `apps/jap_ridetube` | the app (Node 8, the iDrive's own app runtime) |
| `kit/` | the idrive7-apps app kit, trimmed to the modules RideTube uses |
| `native/jap-ridetube-d` | the service on the car: player, fetcher, account, search, thumbnails |
| `native/ytdec` | the H.264 decoder that draws into the renderer's video layer |
| `native/mgu-render-id7-touch` | Full-width touch, the optional Store tool that gives apps the screen's left edge |
| `tools/release.py` | lays out the Store catalog (`catalog.json` and its assets) |

## Build and test on a computer

```sh
node kit/tools/test_runtime.js && node kit/tools/test_life.js && node kit/tools/test_parked.js \
  && node kit/tools/test_qr.js
(cd native/jap-ridetube-d && node test/test_ytd.js && node test/test_thumb.js && python3.12 -I test/test_ytfetch.py)
(cd native/ytdec && make test && make target)     # make target needs Docker
node tools/test_sequences.js --seed 1     # command sequences against the service (stop, quality, pause, seek during a start)
tools/check_node8.sh     # the car runs ytd.js and the app on Node 8: node --check in the node:8 image (Docker)
```

A release needs an `oap-sdk` folder extracted from a BMW app you own (`node kit/tools/extract_sdk.js
<javascript/app.js of a BMW app>`; never commit it), then:

```sh
python3 kit/tools/build.py jap_ridetube && node kit/tools/test_ridetube.js
export MGU_STORE=<a clone of the MGU Store>
(cd native/jap-ridetube-d && ./build.sh)      # jap-node22 is built in github.com/JustAnotherPU/mgu-apps
python3 tools/release.py      # dist/release/ (with mgu-apps' jap-node22, sha256-pinned): upload every file to a GitHub release tagged "catalog"
```

The tests need Node 18 or newer, Python 3.12 and ffmpeg.

## Translations

The app's menus come in English, French, Dutch, German, Spanish, Italian, Portuguese, Russian and Simplified
Chinese. Pull requests that add a language are welcome, and I will merge them. If you would rather not do it
yourself, open an issue that names the language you want.

To add one:

1. Copy `kit/runtime/locales/fr.json` to `kit/runtime/locales/<code>.json`, where `<code>` is the two-letter
   language code (`sv` for Swedish, `pl` for Polish). Keep the keys, which are the English text, and translate
   the values.
2. Keep every `{placeholder}` as it is. A key with `|` in it is a plural: write the singular and the plural form,
   separated by `|`.
3. Keep the rail names (Home, Subs, Later, Playlists, History) short: each has about 90 pixels.
4. Add the language to the Language setting in `apps/jap_ridetube/app.json`: its code and its own name
   (`["sv", "Svenska"]`).
5. Run `node kit/tools/test_runtime.js`. It checks that every string has a row, that the placeholders match and
   that the fonts have every letter.

Auto and the car's menu for RideTube pick up the new language by themselves. A language that needs more than
two plural forms, or letters outside the Latin fonts, takes a little more work in the code: say so in the pull
request and I will help.

## Contributors

Thanks to everyone whose code is in RideTube:

- @cars-done: your playlists on the rail, Cyrillic text, touch seeking, the video's title and picture on the
  cluster and the media screen, and the steering wheel's next and previous buttons.
- @alexarghir98: Romanian ș ț, and accented letters the fonts lack drawn as their base letter.
- @marilykinson-glitch: the History and Liked feeds, related videos, the Shorts handling, the dropout recovery
  and the command-sequence tests, from their fork.
- @JackieZ123430 (小白151): the Simplified Chinese translation.
- @Asksket: Close ends the video and goes back to the list.
- @istt1899: the HTTP and SOCKS5 tunnels used for the MGU Store's proxy, from their fork.
- @7amoody1985: streaming the playing video in a window that follows playback, and seeks and resumes that start
  where you are, from #20.

## License

GPL-3.0-or-later, Copyright (c) 2026 JustAnotherPU ([LICENSE](LICENSE)). Parts come from others under their
own licences (the app kit: MIT; parts of `native/ytdec`: GPL-3.0-or-later; yt-dlp: Unlicense, fetched at
build time; SponsorBlock data: CC BY-NC-SA 4.0): see [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES).
