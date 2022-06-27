import express from "express";
import * as cheerio from "cheerio";
import axios from "axios";

const app = express();
const url = "https://github.com/qnblackcat/CercubePlus/releases/latest";

app.get("/", async (_, res) => {
  const html = await axios.get(url);
  const $ = cheerio.load(html.data);
  let downloadURL = "";
  $("body")
    .find("a")
    .each(function (i, link) {
      if (/^.*.ipa$/.test($(link).attr("href"))) {
        downloadURL = "https://github.com" + $(link).attr("href");
      }
    });
  const time = $("relative-time").attr("datetime");
  return res.status(200).json({
    apps: [
      {
        beta: false,
        bundleIdentifier: "com.google.ios.youtube",
        developerName: "Alfhaily & Qn_",
        downloadURL,
        iconURL:
          "https://raw.githubusercontent.com/qnblackcat/My-AltStore-repo/main/ScreenShot/youtube-512.png",
        localizedDescription:
          "Unfortunately, AltStore can not handle two applications that have the same bundle ID (uYou+ and Cercube+). I have no other choice except to modify CercubePlus's bundle ID. As a result, you won't be able to install CercubePlus directly through AltStore. You still can download the IPA like normal though.\n\nFull infomation about CercubePlus (Cercube+) is available on my Github: https://github.com/qnblackcat/CercubePlus/\n\nCredits: Please keep the Credits if you re-up CercubePlus! \n- Alfhaily for Cercube.\n- Galactic-Dev for the original iSponsorBlock, @Luewii for his fork of iSponsorBlock (which works in jailed mode).\n- PoomSmart for YouRememberCaption, YTClassicVideoQuality, YTNoCheckLocalNetwork, YTSystemAppearance, YTUHD, YouPiP and Return YouTube Dislike.\n- level3tjg for YTNoHoverCards.\n\nKnown issues:\n- Hide Cast button may not work.\n- YTUHD: Stuttering on 2K/4K videos.\n- YouPiP (iOS 14.0 - 14.4.2): due to Apple's fault, you may encounter the speedup-bug as described here. The bug also happens when you try to play multi-sources of sound at the same time. Enable Legacy PiP is a workaround. Note that Legacy PiP removes UHD quality and breaks the default video quality feature of uYou. Use it at your own risk!",
        name: "CercubePlus (Cercube+)",
        screenshotURLs: [
          "https://raw.githubusercontent.com/qnblackcat/My-AltStore-repo/main/ScreenShot/IMG_1521.PNG",
          "https://raw.githubusercontent.com/qnblackcat/My-AltStore-repo/main/ScreenShot/IMG_1522.PNG",
          "https://raw.githubusercontent.com/qnblackcat/My-AltStore-repo/main/ScreenShot/IMG_2394.PNG",
          "https://raw.githubusercontent.com/qnblackcat/My-AltStore-repo/main/ScreenShot/IMG_1523.PNG",
          "https://raw.githubusercontent.com/qnblackcat/My-AltStore-repo/main/ScreenShot/IMG_2395.PNG",
        ],
        size: 101187584,
        subtitle: "Cercube with extra features! Requires iOS 13.0 and later.",
        tintColor: "e22a41",
        version: downloadURL
          .split("/")
          .reverse()[1]
          .split("-")[0]
          .replace("v", ""),
        versionDate: time,
        versionDescription: `${
          downloadURL.split("/").reverse()[1].split("-")[0]
        } (${
          downloadURL.split("/").reverse()[1].split("-")[1]
        }): The changelog can be found at\nhttps://github.com/qnblackcat/CercubePlus/releases/latest`,
      },
    ],
    identifier: "com.qn.altstorerepo",
    name: "Qn_'s AltStore Repo",
    news: [],
    userInfo: {},
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("listening on port 8080");
});
