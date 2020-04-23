# ClipNuke Server

ClipNuke Server provides adult content creators with a REST API, and framework for full and semi-automatic content distribution. Interfaces with several major clip sites, CMS, and tubes including: Clips4Sale, ManyVids, PornHub/ModelHub, XVideos/XVideos RED, ModelCentro, WooCommerce, AdultEmpire, AEBN, and Hot Movies.

##### Our mission is to provide a set of API endpoints for third-party clip stores.

For producers and content creators, this project can reduce the amount of copy/pasting by posting any given clip/video to all their distributor's sites. We want to use one title, description, images, video files, etc. and cross-post it to every platform we sell content on.

For developers, creating a REST API to third-party clip stores provides the foundation to programmatically accessing these platforms. An application programming interface (API) is a set of protocols for building software apps. It’s important to note from an interface standpoint, an API is software to software – not a UI.

## Download

Clone/download ZIP archive from <https://github.com/aidenvalentine/ClipNuke-Server-Win-x64.git>.

## Screenshots

![Screenshot 1](https://github.com/aidenvalentine/ClipNuke-Server-Win-x64/raw/master/docs/images/clipnuke-screenshot-2.png)
![Screenshot 2](https://github.com/aidenvalentine/ClipNuke-Server-Win-x64/raw/master/docs/images/clipnuke-screenshot-3.png)

## How it Works

You may want to use software like [Postman](https://www.postman.com/downloads/) or [KNIME](https://www.knime.com/downloads/download-knime) to send GET/POST/PUT requests to the Clip Store API server. Alternatively, [clipnuke.com](https://clipnuke.com) is an app built to run alongside ClipNuke Server. ClipNuke.com allows you to create/manage/update your video data, and provides an admin panel for your store to distribute your clips with. **Note**: ClipNuke.com is a paid service which requires a monthly subscription.

When you add a new clip to a platform using the REST API, the software:
1. Opens a new Google Chrome browser window automatically.
1. Prefills the login form.
1. Navigates to the platform's "add clip" page.
1. Prefills the form will all the information you provide.

Some sites, like XVideos support multiple language translations. ClipNuke Server includes a multi-language translator to automatically translate your video titles into any language with a one click. You need to set a Microsoft Azure API Key in the Settings menu to enable this feature.

[![](http://img.youtube.com/vi/z71oRkNRAQU/0.jpg)](http://www.youtube.com/watch?v=z71oRkNRAQU "ClipNuke Auto-Translator")

**Note**: Some platforms may be completely automated, while others may require you to manually populate unsupported form fields. The browser window will stay open, awaiting your input if more information is required to post it.

## Requirements

1.  Node.js installed on your PC. <https://nodejs.org/en/download/>
2.  JAVA installed on your PC. Add the PATH to JAVA"s executables (java.exe) to your system"s PATH environment variable. <https://java.com/en/download/manual.jsp>

### Firewall/Ports

Make sure nothing else is currently running on the following ports, or some services may fail to start.
1. 3000/TCP - For the Clip Store API server
1. 2000-2010/TCP - For the automated Browser Instance nodes
1. 4444/TCP - For the automated Browser hub.

## Installation

1.  Clone this repository to your PC.
2.  Unzip and move/rename the folder to C:/Program Files/ClipNuke
3.  Open command prompt.
4.  Change current directory to the program's installation directory. Use command: `cd %ProgramFiles%/ClipNuke`
5.  Install project dependencies using command: `npm install`.

## Getting Started

1.  Run **clipnuke.exe**
2.  Configure your settings. The config window will open the first time you run ClipNuke, or if the config.json file is empty. Add your credentials for each clip store in the Settings window. You can re-open this page anytime by using the Help > Settings link in the top menu, or by pressing F10 on the keyboard. Config file located in `%APPDATA%/clipnuke/config.json`. **This data is securely saved to a config file on your PC.**
3.  Start required services using the "Help" menu.

    1.  Start hub (Press F3)
    2.  Add at least one Node (Press F4)
    3.  Start Adult Content API Server (Press F6)

# Clip Store API
The core of this software is the Clip Store API, which allows us to communicate with external services like Clips4Sale.
## Clips4Sale - New Clip

Create a new clip on a Clips4Sale store programmatically.

**URL** : `/clips4sale/spawn`

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

## Clips4Sale - Get Clip

Retrieve a clip's info from a Clips4Sale store programmatically.

**URL** : `/clips4sale/clips/:id`

**Method** : `GET`

### Success Responses

```json
{
  "relatedCategories": [
    "POV",
    "MOMMAS BOY",
  ],
  "tags": [
    "stepmom",
    "pov",
    "Latina",
  ],
  "website": "CLIPS4SALE",
  "remoteId": 23061485,
  "description": "<p>You peek through your stepmom's door to find her playing with herself.</p>",
  "name": "Stepmom Caught Masturbating By Spying Step-Son",
  "remoteStudioId": 79949,
  "price": 8.99,
  "category": "LATINA",
  "displayOrder": 13029,
  "filename": "00123-Model-Name-My-Awesome-Movie-Title_hd.mp4",
  "thumbnailFilename": "00123-Model-Name-My-Awesome-Movie-Title.jpg",
  "lengthMinutes": 8,
  "trailerFilename": "prev_23061485.mp4",
  "releaseDate": "2020-04-10T17:01:00.000Z"
}
```

## Clips4Sale - Upload File via FTP

Uploads a file to a Clips4Sale store programmatically.

**URL** : `/clips4sale/ftp`

**Method** : `POST`

**Data example** Most fields must be sent.

```json
{
  "url" : "https://example.com/wp-content/uploads/2020/04/00123-Model-Name-My-Awesome-Movie-Title.jpg",
  "type" : "poster"
}
```

## Clips4Sale - Get Sales

Retrieve sales info from a Clips4Sale store programmatically.

**URL** : `/clips4sale/sales/`

**Method** : `GET`

**Query String** : s_year - Start year (YYYY)

**Query String** : s_month - Start month (MM)

**Query String** : s_day - Start day (DD)

**Query String** : e_year - End year (YYYY)

**Query String** : e_month - End month (MM)

**Query String** : e_day - End day (DD)

**Query String** : report_type - (Default: Detail1; Detail1, sum, categoryGroupingReport, ClipsNeverSoldReport, tributes, refundsChargebacks)

**Query String** : stores - (Default: all; all, clip, video, image)

**Query String** : action - (Default: reports)

**Example** : ```https://localhost:3000/clips4sale/sales?s_year=2019&s_month=1&s_day=1&e_year=2020&e_month=1&e_day=1&report_type=sum&stores=all&action=reports```

### Success Responses

```json
{
  "data": [
    {
      "clipnumber": "<a href=\"http://clips4sale.com/XXXXX/1234567890\" target=\"_blank\">1234567890</a>",
      "comm": "5.39",
      "country": "US",
      "date": "01/01/2019",
      "detailid": "1234567890",
      "discount": "No Discount",
      "name": "A B",
      "price": "8.99",
      "sonumber": "12340403",
      "state": "NV",
      "title": "My Awesome Movie Title - HD 1080p mp4"
    }
  ]
}
```

## ManyVids - Upload Vid

Upload a new vid to a ManyVids store programmatically.

**URL** : `/manyvids/vids`

**Method** : `POST`

**Data example**

```json
{}
```

## ManyVids - Update Vid

Create a new clip on a Clips4Sale store programmatically.

**URL** : `/manyvids/vids/:id`

**Method** : `PUT`

**Data example** Most fields must be sent.

```json
{
  "name": "My Awesome Movie Title",
  "description": "<p>A girl is at home doing her homework for school and masturbates.</p>",
  "price": 12.99,
  "tube" : false,
  "free" : false,
  "categories" : ["123", "34", "456"],
  "intensity" : 0,
  "discountPercentage" : "",
  "exclusive" : false,
  "age" : false,
  "ethnicity" : false,
  "breastSize" : false,
  "custom" : false,
  "streamOnly" : 1,
  "blockPreview" : false,
  "nsfw" : true,
  "releaseDate": "2020-12-31 12:00:00",
}
```

## XVideos - New Clip

Create a new video on an XVideos account programmatically.

**URL** : `/xvideos/spawn`

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

## WooCommerce - New Clip

Create a new product on a WooCommerce site programmatically.

**URL** : `/woo`

**Method** : `POST`

**Data example** Most fields must be sent.

```json
{
  "name": "Quarantine and Chill With My Stepbrother feat. Kitana Kojima",
  "description": "<p>Kitana Kojima is stuck in Coronavirus quarantine with her stepbrother Aiden. She has been pent up with him for a couple of weeks. They haven't left the house except to gather essentials. Aiden's slutty sis suggests they fuck -- but only after he washes his hands! He agrees and they take things to the next level upon his return. Kitana strips off her shorts and Aiden sticks his cock in her shaved pussy. They fuck hard until he busts his big load all over her stomach and pussy. Remember, we're in this together.</p>\n",
  "videoUrl": "",
  "trailerUrl": "https://example.com/wp-content/uploads/2020/04/00123-Model-Name-My-Awesome-Movie-Title_preview.mp4",
  "tags": [
    "aiden valentine",
    "amateur",
    "coronavirus",
    "covid19",
    "fucking",
    "kitana kojima",
    "Latina",
    "missionary",
    "Petite",
    "quarantine",
    "step",
    "stepsister",
    "taboo"
  ],
  "displayOrder": "13025",
  "images": [
    {
      "id": 13026,
      "date_created": "2020-04-01T20:56:35",
      "date_created_gmt": "2020-04-02T05:56:35",
      "date_modified": "2020-04-01T20:56:35",
      "date_modified_gmt": "2020-04-02T05:56:35",
      "src": "https://example.com/wp-content/uploads/2020/04/00123-Model-Name-My-Awesome-Movie-Title.jpg",
      "name": "00123-Model-Name-My-Awesome-Movie-Title",
      "alt": ""
    }
  ],
  "trailerFilename": "Select a File",
  "filename": "00123-Model-Name-My-Awesome-Movie-Title_hd.mp4",
  "category": "TABOO",
  "relatedCategories": [
    "SISTERS",
    "LATINA",
    "FUCKING",
    "MISSIONARY SEX",
    "MASK FETISH"
  ],
  "releaseDate": "2020-04-02 12:01:00"
}
```

## WooCommerce - Get Clip

Retrieve a product's info from a WooCommerce store programmatically.

**URL** : `/woo/:id`

**Method** : `GET`

### Success Responses

```json
{
  "id": 37170,
  "name": "Quarantine and Chill With My Stepbrother",
  "slug": "quarantine-and-chill-with-my-stepbrother",
  "permalink": "https://example.com/product/37170/quarantine-and-chill-with-my-stepbrother/",
  "date_created": "2020-03-29T20:37:44",
  "date_created_gmt": "2020-03-30T01:37:44",
  "date_modified": "2020-03-29T20:38:06",
  "date_modified_gmt": "2020-03-30T01:38:06",
  "type": "variable",
  "status": "publish",
  "featured": false,
  "catalog_visibility": "visible",
  "description": "",
  "short_description": "",
  "sku": "00123-Model-Name-My-Awesome-Movie-Title",
  "price": "1.99",
  "regular_price": "",
  "sale_price": "",
  "date_on_sale_from": null,
  "date_on_sale_from_gmt": null,
  "date_on_sale_to": null,
  "date_on_sale_to_gmt": null,
  "price_html": "<span class=\"woocommerce-Price-amount amount\"><span class=\"woocommerce-Price-currencySymbol\">&#36;</span>1.99</span> &ndash; <span class=\"woocommerce-Price-amount amount\"><span class=\"woocommerce-Price-currencySymbol\">&#36;</span>11.99</span>",
  "on_sale": false,
  "purchasable": true,
  "total_sales": 0,
  "virtual": false,
  "downloadable": false,
  "downloads": [],
  "download_limit": -1,
  "download_expiry": -1,
  "external_url": "",
  "button_text": "",
  "tax_status": "none",
  "tax_class": "Zero Rate",
  "manage_stock": false,
  "stock_quantity": null,
  "stock_status": "instock",
  "backorders": "no",
  "backorders_allowed": false,
  "backordered": false,
  "sold_individually": true,
  "weight": "",
  "dimensions": {
    "length": "",
    "width": "",
    "height": ""
  },
  "shipping_required": true,
  "shipping_taxable": false,
  "shipping_class": "",
  "shipping_class_id": 0,
  "reviews_allowed": true,
  "average_rating": "0.00",
  "rating_count": 0,
  "related_ids": [],
  "upsell_ids": [],
  "cross_sell_ids": [],
  "parent_id": 0,
  "purchase_note": "",
  "categories": [
    {
      "id": 368,
      "name": "Fucking",
      "slug": "fucking"
    },
    {
      "id": 183,
      "name": "Amateur",
      "slug": "amateur"
    },
    {
      "id": 665,
      "name": "Hardcore",
      "slug": "hardcore"
    },
    {
      "id": 419,
      "name": "Latina",
      "slug": "latina"
    }
  ],
  "tags": [],
  "images": [
    {
      "id": 37172,
      "date_created": "2020-03-29T16:33:37",
      "date_created_gmt": "2020-03-30T01:33:37",
      "date_modified": "2020-03-29T16:34:16",
      "date_modified_gmt": "2020-03-30T01:34:16",
      "src": "https://xxxmultimedia.com/wp-content/uploads/2020/03/00123-Model-Name-My-Awesome-Movie-Title.jpg",
      "name": "00123-Model-Name-My-Awesome-Movie-Title",
      "alt": "coronavirus porn"
    }
  ],
  "attributes": [
    {
      "id": 4,
      "name": "File Format",
      "position": 0,
      "visible": true,
      "variation": true,
      "options": [
        "3-Day VOD Rental",
        "HD 1080p MP4"
      ]
    }
  ],
  "default_attributes": [
    {
      "id": 4,
      "name": "File Format",
      "option": "hd-1080p-mp4"
    }
  ],
  "variations": [],
  "grouped_products": [],
  "menu_order": 0,
  "meta_data": []
}
```

## Azure - Translate

Translates a given string into specified languages and returns the translated strings.

**URL** : `/azure/translate`

**Method** : `POST`

**Data example** All fields must be sent.

```json
{
  "text": "another video name goes here",
  "lang": [
    "en", "es", "de"
  ]
}

```
### Success Responses

```json
[
    {
        "detectedLanguage": {
            "language": "en",
            "score": 1
        },
        "translations": [
            {
                "text": "another video name goes here",
                "to": "en"
            },
            {
                "text": "otro nombre de video va aquí",
                "to": "es"
            }
            {
                "text": "ein weiterer Videoname geht hier",
                "to": "de"
            }
        ]
    }
]
```

## Developers

Use ClipNuke Server REST API to power your own custom applications, or to setup a custom workflow for your store(s). The API server is built on the ExpressJS framework. See which RESTful API routes are available by viewing the code in the `{root}/resources/app/resources/app/` folder.

`server.js` is the ExpressJS server.
