# ClipNuke Server

ClipNuke Server provides adult content creators with a REST API, and framework for full and semi-automatic content distribution. Interfaces with several major clip sites, CMS, and tubes including: Clips4Sale, ManyVids, PornHub/ModelHub, XVideos/XVideos RED, ModelCentro, WooCommerce, AdultEmpire, AEBN, and Hot Movies.

The philosophy for this project is to allow adult content creators to reduce the amount of copy/pasting by posting any given clip/video to all their distributor"s sites. We want to use ONE title, description, images, video files, etc. and **cross-post** it to every platform you sell content on.

## Download

Clone/download ZIP archive from <https://github.com/aidenvalentine/ClipNuke-Server-Win-x64.git>.

## Screenshots

![Screenshot 1](https://github.com/aidenvalentine/ClipNuke-Server-Win-x64/raw/master/docs/images/clipnuke-screenshot-2.png)
![Screenshot 2](https://github.com/aidenvalentine/ClipNuke-Server-Win-x64/raw/master/docs/images/clipnuke-screenshot-3.png)

## How it Works

You may want to use software like [Postman](https://www.postman.com/downloads/) to send GET/POST/PUT requests to the Clip Store API server. Alternatively, [clipnuke.com](https://clipnuke.com) is an app built to run alongsite ClipNuke Server. ClipNuke.com allows you to create/manage/update your video data, and provides an admin panel for your store to distribute your clips with. **Note**: ClipNuke.com is a paid service which requires a monthly subscription.

When you add a new clip to a platform using the REST API, the software:
1\. Opens a new Google Chrome browser window automatically.
1\. Prefills the login form.
1\. Navigates to the platform"s "add clip" page.
1\. Prefills the form will all the information you provide.

Some sites, like XVideos support multiple language translations. ClipNuke Server includes a multi-language translator to automatically translate your video titles into any language with a one click. You need to set a Microsoft Azure API Key in the Settings menu to enable this feature.

[![](http://img.youtube.com/vi/z71oRkNRAQU/0.jpg)](http://www.youtube.com/watch?v=z71oRkNRAQU "ClipNuke Auto-Translator")

**Note**: Some platforms may be completely automated, while others may require you to manually populate unsupported form fields. The browser window will stay open, awaiting your input if more information is required to post it.

## Requirements

1.  Node.js installed on your PC. <https://nodejs.org/en/download/>
2.  JAVA installed on your PC. Add the PATH to JAVA"s executables (java.exe) to your system"s PATH environment variable. <https://java.com/en/download/manual.jsp>

### Firewall/Ports

Make sure nothing else is currently running on the following ports, or some services may fail to start.
1\. 3000/TCP - For the Clip Store API server
1\. 2000-2010/TCP - For the automated Browser Instance nodes
1\. 4444/TCP - For the automated Browser hub.

## Installation

1.  Clone this repository to your PC.
2.  Unzip and move/rename the folder to C:/Program Files/ClipNuke
3.  Open command prompt.
4.  Change current directory to the program"s installation directory. Use command: `cd %ProgramFiles%/ClipNuke`
5.  Install project dependencies using command: `npm install`.

## Getting Started

1.  Run **clipnuke.exe**
2.  Configure your settings. The config window will open the first time you run ClipNuke, or if the config.json file is empty. Add your credentials for each clip store in the Settings window. You can re-open this page anytime by using the Help > Settings link in the top menu, or by pressing F10 on the keyboard. Config file located in `%APPDATA%/clipnuke/config.json`. **This data is securely saved to a config file on your PC.**
3.  Start required services using the "Help" menu.

    1.  Start hub (Press F3)
    2.  Add at least one Node (Press F4)
    3.  Start Adult Content API Server (Press F6)

# Clips4Sale - New Clip

Create a new clip on a Clips4Sale store programmatically.

**URL** : `/clips4sale/spawn/`

**Method** : `POST`

**Data example** Most fields must be sent.

```json
{
  "name": "My Awesome Movie Title",
  "description": "<p>A girl is at home doing her homework for school and masturbates.</p>",
  "tags": [
    "Masturbation",
    "alt girl",
    "alternative girl"
  ],
  "category": "TRANSFER FETISH",
  "relatedCategories": [
    "BALLOONS",
    "BABYSITTER",
    "BLOOPERS",
    "CHEWING"
  ],
  "price": 12.99,
  "filename": "00123-Model-Name-My-Awesome-Movie-Title_hd.mp4",
  "trailerFilename": "00123-Model-Name-My-Awesome-Movie-Title_preview.mp4",
  "thumbnailFilename": "00123-Model-Name-My-Awesome-Movie-Title.jpg",
  "releaseDate": "2020-12-31 12:00:00",
  "displayOrder": "1"
}
```

# Clips4Sale - Get Clip

Retrieve a clip"s info from a Clips4Sale store programmatically.

**URL** : `/clips4sale/clips/:id`

**Method** : `GET`

## Success Responses

```json
{
  "relatedCategories": [
    "MASTURBATION",
    "POV",
    "LATINA",
    "MOMMAS BOY",
    "JERK OFF INSTRUCTION"
  ],
  "tags": [
    "stepmom",
    "kitana kojima",
    "taboo",
    "Masturbation",
    "pov",
    "Latina",
    "freeuse"
  ],
  "website": "CLIPS4SALE",
  "remoteId": 23061485,
  "description": "<p>You peek through your stepmom"s door to find her playing with herself. Your stepmom Kitana Kojima pulls out a vibrator and strips off her bottoms. She presses the vibrator to her clit and enjoys herself. You can"t keep your eyes off her. Suddenly she catches you peeping and calls for you to come in. She tells you she"s masturbating and to watch her. \"Pull out your cock\" she tells you. Then continues masturbating as you do.</p>",
  "name": "Stepmom Caught Masturbating By Spying Step-Son feat Kitana Kojima",
  "remoteStudioId": 79949,
  "price": 8.99,
  "category": "TABOO",
  "displayOrder": 13029,
  "filename": "00703-Kitana-Kojima-Stepmom-Masturbates-With-Son_hd.mp4",
  "thumbnailFilename": "00703-Kitana-Kojima-Stepmom-Masturbates-With-Son.jpg",
  "lengthMinutes": 8,
  "trailerFilename": "prev_23061485.mp4",
  "releaseDate": "2020-04-10T17:01:00.000Z"
}
```

# XVideos - New Clip

Create a new video on an XVideos account programmatically.

**URL** : `/xvideos/spawn/`

**Method** : `POST`

**Data example** Most fields must be sent.

```json
{
  "name": "Stepmom Caught Masturbating By Son feat Kitana Kojima",
  "networkName": "Mom Masturbates With Son POV",
  "description": "<p>You peek through your stepmom's door to find her playing with herself. Your stepmom Kitana Kojima pulls out a vibrator and strips off her bottoms. She presses the vibrator to her clit and enjoys herself. You can't keep your eyes off her. Suddenly she catches you peeping and calls for you to come in. She tells you she's masturbating and to watch her. 'Pull out your cock' she tells you. Then continues masturbating as you do.</p>\n",
  "tags": [
    "amateur",
    "freeuse",
    "kitana kojima",
    "Latina",
    "Masturbation",
    "pov",
    "stepmom",
    "taboo"
  ],
  "category": "upload_form_category_category_centered_category_straight",
  "video_premium": "upload_form_video_premium_video_premium_centered_zone_all_site",
  "networksites": "upload_form_networksites_networksites_centered_networksites_NO_RESTRICTION",
  "sponsoredLinks": [],
  "translations": [
    {
      "xvideosTitle": "Stepmom Caught Masturbating By Son feat Kitana Kojima",
      "networkTitle": "Mom Masturbates With Son POV",
      "lang": "en"
    },
    {
      "xvideosTitle": "Madrastra atrapada masturbando por hijo feat Kitana Kojima",
      "networkTitle": "Mamá se masturba con el hijo POV",
      "lang": "es"
    },
    {
      "xvideosTitle": "Madrasta pega masturbando por filho feat Kitana Kojima",
      "networkTitle": "Mãe se masturba com filho POV",
      "lang": "pt"
    },
    {
      "xvideosTitle": "Stiefmoeder betrapt masturberen door zoon feat Kitana Kojima",
      "networkTitle": "Moeder masturbeert met zoon POV",
      "lang": "nl"
    },
    {
      "xvideosTitle": "زوجة الأب اشتعلت الاستمناء من قبل الابن الفذ كيتانا كوجيما",
      "networkTitle": "أمي الاستمناء مع سون بوف",
      "lang": "ar"
    },
    {
      "xvideosTitle": "सौतेली मां ने बेटे के करतब से हस्तमैथुन करते हुए पकड़ा किताना कोजिमा",
      "networkTitle": "माँ बेटे पीओवी के साथ हस्तमैथुन करती है",
      "lang": "hi"
    },
    {
      "xvideosTitle": "Stiefmutter gefangen Masturbieren von Sohn feat Kitana Kojima",
      "networkTitle": "Mama masturbiert mit Sohn POV",
      "lang": "de"
    },
    {
      "xvideosTitle": "Stepmom pris masturbation par son feat Kitana Kojima",
      "networkTitle": "Maman se masturbe avec son fils POV",
      "lang": "fr"
    },
    {
      "xvideosTitle": "继母抓住手淫由儿子壮举北田小岛",
      "networkTitle": "妈妈 手淫 与 儿子 POV",
      "lang": "zh"
    },
    {
      "xvideosTitle": "継母は息子の偉業北ナ小島によって自慰行為をキャッチ",
      "networkTitle": "ママは息子POVでマスターベーション",
      "lang": "ja"
    }
  ]
}
```

## Developers

Use ClipNuke Server REST API to power your own custom applications, or to setup a custom workflow for your store(s). The API server is built on the ExpressJS framework. See which RESTful API routes are available by viewing the code in the `{root}/resources/app/resources/app/` folder.

`server.js` is the ExpressJS server.
