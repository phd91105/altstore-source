import express from "express";
import { load } from "cheerio";
import axios from "axios";

const app = express();
const url = "https://github.com/qnblackcat/uYouPlus/";

app.get("/", async (_, res) => {
  const response = await axios.get(url + 'releases/latest');
  const latestVersion = response.request.path.split('/').pop();
  const html = await axios.get(url + 'releases/expanded_assets/' + latestVersion);
  const $ = load(html.data);
  let downloadURL = "";
  $("body")
    .find("a")
    .each(function (i, link) {
      if (/^.*.ipa$/.test($(link).attr("href"))) {
        downloadURL = "https://github.com" + $(link).attr("href");
      }
    });
  const head = await axios.head(downloadURL);
  const time = $("relative-time").attr("datetime");
  return res.status(200).json({
    apps: [
      {
        "beta": false,
        "bundleIdentifier": "com.google.ios.youtube",
        "developerName": "MiRO92 & Qn_",
        downloadURL,
        "iconURL":
          "https://github.com/phd91105/altstore-source/raw/master/youtube.jpg",
        "localizedDescription": "uYouPlus is a modified version of uYou with some extra features! (requires iOS 14.0 and later).\n\nFull infomation about uYouPlus (uYou+) is available on my Github: https://github.com/qnblackcat/uYouPlus/\n\nCredits: Please keep the Credits if you re-up uYouPlus! \nhttps://github.com/qnblackcat/uYouPlus#credits\n\nAttention:\n- If you like the app, considering support the developers!\n- YTUHD is not stable atm. You might encounter stuttering, heat, battery drain..., especially when playing at 2160p (4K) quality. However, this should not happen if you use TrollStore.\n- Unless you're using TrollStore, deep-link (aka Open in the YouTube App) simply will not work.\n\nKnown issues:\n- uYou's issues: https://github.com/MiRO92/uYou-for-YouTube/issues\n- uYouPlus's issues: https://github.com/qnblackcat/uYouPlus",
        "name": "uYouPlus (uYou+)",
        "screenshotURLs": [
          "https://raw.githubusercontent.com/qnblackcat/My-AltStore-repo/main/ScreenShot/IMG_2393.PNG",
          "https://raw.githubusercontent.com/qnblackcat/My-AltStore-repo/main/ScreenShot/IMG_1522.PNG",
          "https://raw.githubusercontent.com/qnblackcat/My-AltStore-repo/main/ScreenShot/IMG_2394.PNG",
          "https://raw.githubusercontent.com/qnblackcat/My-AltStore-repo/main/ScreenShot/IMG_1523.PNG",
          "https://raw.githubusercontent.com/qnblackcat/My-AltStore-repo/main/ScreenShot/IMG_2395.PNG"
        ],
        "size": +head.headers['content-length'],
        "subtitle": "A modified version of uYou with extra features! Requires iOS 14.0 and later.",
        "tintColor": "e85567",
        "version": downloadURL
          .split("/")
          .reverse()[1]
          .split("-")[0]
          .replace("v", ""),
        "versionDate": time,
        "versionDescription": latestVersion + ": The changelog can be found at\nhttps://github.com/qnblackcat/uYouPlus/releases/latest"
      }
    ],
    identifier: "com.qn.altstorerepo",
    name: "Qn_'s AltStore Repo",
  });
});

app.listen(process.env.PORT || 8081, () => {
  console.log("listening on port 8081");
});
