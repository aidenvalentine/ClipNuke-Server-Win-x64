/**
 * @author      Jeremy England
 * @license     MIT
 * @description Adds tabs, views, and controls to specified containers in node.js electron.
 * @requires    electron, jquery, color.js, electron-context-menu, url-regex
 * @see         https://github.com/simply-coded/electron-navigation
 * @tutorial
 *  Add these IDs to your html (containers don't have to be divs).
 *      <div id='nav-body-ctrls'></div>
 *      <div id='nav-body-tabs'></div>
 *      <div id='nav-body-views'></div>
 *  Add these scripts to your html (at the end of the body tag).
 *      <script>
 *          const enav = new (require('electron-navigation'))()
 *      </script>
 *  Add a theme file to your html (at the end of the head tag)(optional).
 *      <link rel="stylesheet" type="text/css" href="location/of/theme.css">
 */
/**
 * DEPENDENCIES
 */
var $ = require('jquery');
var Color = require('color.js');
var urlRegex = require('url-regex');
const contextMenu = require('electron-context-menu')
var globalCloseableTabsOverride;
/**
 * OBJECT
 */
function Navigation(options) {
    /**
     * OPTIONS
     */
    var defaults = {
        showBackButton: true,
        showForwardButton: true,
        showReloadButton: true,
        showUrlBar: true,
        showAddTabButton: true,
        closableTabs: true,
        verticalTabs: false,
        defaultFavicons: false,
        newTabCallback: null,
        changeTabCallback: null,
        newTabParams: null
    };
    options = options ? Object.assign(defaults,options) : defaults;
    /**
     * GLOBALS & ICONS
     */
    globalCloseableTabsOverride = options.closableTabs;
    const NAV = this;
    this.newTabCallback = options.newTabCallback;
    this.changeTabCallback = options.changeTabCallback;
    this.SESSION_ID = 1;
    if (options.defaultFavicons) {
        this.TAB_ICON = "default";
    } else {
        this.TAB_ICON = "clean";
    }
    this.SVG_BACK = '<svg height="100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>';
    this.SVG_FORWARD = '<svg height="100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
    this.SVG_RELOAD = '<svg height="100%" viewBox="0 0 24 24" id="nav-ready"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
    this.SVG_FAVICON = '<svg height="100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>';
    this.SVG_ADD = '<svg height="100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>';
    this.SVG_CLEAR = '<svg height="100%" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
    /**
     * ADD ELEMENTS
     */
    if (options.showBackButton) {
        $('#nav-body-ctrls').append('<i id="nav-ctrls-back" class="nav-icons disabled" title="Go back">' + this.SVG_BACK + '</i>');
    }
    if (options.showForwardButton) {
        $('#nav-body-ctrls').append('<i id="nav-ctrls-forward" class="nav-icons disabled" title="Go forward">' + this.SVG_FORWARD + '</i>');
    }
    if (options.showReloadButton) {
        $('#nav-body-ctrls').append('<i id="nav-ctrls-reload" class="nav-icons disabled" title="Reload page">' + this.SVG_RELOAD + '</i>');
    }
    if (options.showUrlBar) {
        $('#nav-body-ctrls').append('<input id="nav-ctrls-url" type="text" title="Enter an address or search term"/>')
    }
    if (options.showAddTabButton) {
        $('#nav-body-tabs').append('<i id="nav-tabs-add" class="nav-icons" title="Add new tab">' + this.SVG_ADD + '</i>');
    }
    /**
     * ADD CORE STYLE
     */
    if (options.verticalTabs) {
        $('head').append('<style id="nav-core-styles">#nav-body-ctrls,#nav-body-tabs,#nav-body-views,.nav-tabs-tab{display:flex;align-items:center;}#nav-body-tabs{overflow:auto;min-height:32px;flex-direction:column;}#nav-ctrls-url{box-sizing:border-box;}.nav-tabs-tab{min-width:60px;width:100%;min-height:20px;}.nav-icons{fill:#000;width:24px;height:24px}.nav-icons.disabled{pointer-events:none;opacity:.5}#nav-ctrls-url{flex:1;height:24px}.nav-views-view{flex:0 1;width:0;height:0}.nav-views-view.active{flex:1;width:100%;height:100%}.nav-tabs-favicon{align-content:flex-start}.nav-tabs-title{flex:1;cursor:default;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nav-tabs-close{align-content:flex-end}@keyframes nav-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>');
    } else {
        $('head').append('<style id="nav-core-styles">#nav-body-ctrls,#nav-body-tabs,#nav-body-views,.nav-tabs-tab{display:flex;align-items:center}#nav-body-tabs{overflow:auto;min-height:32px;}#nav-ctrls-url{box-sizing:border-box;}.nav-tabs-tab{min-width:60px;width:180px;min-height:20px;}.nav-icons{fill:#000;width:24px;height:24px}.nav-icons.disabled{pointer-events:none;opacity:.5}#nav-ctrls-url{flex:1;height:24px}.nav-views-view{flex:0 1;width:0;height:0}.nav-views-view.active{flex:1;width:100%;height:100%}.nav-tabs-favicon{align-content:flex-start}.nav-tabs-title{flex:1;cursor:default;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nav-tabs-close{align-content:flex-end}@keyframes nav-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>');
    }
    /**
     * EVENTS
     */
    //
    // switch active view and tab on click
    //
    $('#nav-body-tabs').on('click', '.nav-tabs-tab', function () {
        $('.nav-tabs-tab, .nav-views-view').removeClass('active');

        var sessionID = $(this).data('session');
        $('.nav-tabs-tab, .nav-views-view')
            .filter('[data-session="' + sessionID + '"]')
            .addClass('active');

        var session = $('.nav-views-view[data-session="' + sessionID + '"]')[0];
        (NAV.changeTabCallback || (() => {}))(session);
        NAV._updateUrl(session.getURL());
        NAV._updateCtrls();        
        
        //
        // close tab and view
        //
    }).on('click', '.nav-tabs-close', function() {
        var sessionID = $(this).parent('.nav-tabs-tab').data('session');
        var session = $('.nav-tabs-tab, .nav-views-view').filter('[data-session="' + sessionID + '"]');

        if (session.hasClass('active')) {
            if (session.next('.nav-tabs-tab').length) {
                session.next().addClass('active');
                (NAV.changeTabCallback || (() => {}))(session.next()[1]);
            } else {
                session.prev().addClass('active');
                (NAV.changeTabCallback || (() => {}))(session.prev()[1]);
            }
        }
        session.remove();
        NAV._updateUrl();
        NAV._updateCtrls();
        return false;
    });
    //
    // add a tab, default to google.com
    //
    $('#nav-body-tabs').on('click', '#nav-tabs-add', function () {
        let params;
        if(typeof options.newTabParams === "function"){
            params = options.newTabParams();
        }
        else if(options.newTabParams instanceof Array){
            params = options.newTabParams
        } else {
            params = ['http://www.google.com/', {
                close: options.closableTabs,
                icon: NAV.TAB_ICON
            }];
        }
        NAV.newTab(...params);
    });
    //
    // go back
    //
    $('#nav-body-ctrls').on('click', '#nav-ctrls-back', function () {
        NAV.back();
    });
    //
    // go forward
    //
    $('#nav-body-ctrls').on('click', '#nav-ctrls-forward', function () {
        NAV.forward();
    });
    //
    // reload page
    //
    $('#nav-body-ctrls').on('click', '#nav-ctrls-reload', function () {
        if ($(this).find('#nav-ready').length) {
            NAV.reload();
        } else {
            NAV.stop();
        }
    });
    //
    // highlight address input text on first select
    //
    $('#nav-ctrls-url').on('focus', function (e) {
        $(this)
            .one('mouseup', function () {
                $(this).select();
                return false;
            })
            .select();
    });
    //
    // load or search address on enter / shift+enter
    //
    $('#nav-ctrls-url').keyup(function (e) {
        if (e.keyCode == 13) {
            if (e.shiftKey) {
                NAV.newTab(this.value, {
                    close: options.closableTabs,
                    icon: NAV.TAB_ICON
                });
            } else {
                if ($('.nav-tabs-tab').length) {
                    NAV.changeTab(this.value);
                } else {
                    NAV.newTab(this.value, {
                        close: options.closableTabs,
                        icon: NAV.TAB_ICON
                    });
                }
            }
        }
    });
    /**
     * FUNCTIONS
     */
    //
    // update controls like back, forward, etc...
    //
    this._updateCtrls = function () {
        webview = $('.nav-views-view.active')[0];
        if (!webview) {
            $('#nav-ctrls-back').addClass('disabled');
            $('#nav-ctrls-forward').addClass('disabled');
            $('#nav-ctrls-reload').html(this.SVG_RELOAD).addClass('disabled');
            return;
        }
        if (webview.canGoBack()) {
            $('#nav-ctrls-back').removeClass('disabled');
        } else {
            $('#nav-ctrls-back').addClass('disabled');
        }
        if (webview.canGoForward()) {
            $('#nav-ctrls-forward').removeClass('disabled');
        } else {
            $('#nav-ctrls-forward').addClass('disabled');
        }
        if (webview.isLoading()) {
            this._loading();
        } else {
            this._stopLoading();
        }         
        if (webview.getAttribute('data-readonly') == 'true') {
            $('#nav-ctrls-url').attr('readonly', 'readonly');
        } else {
            $('#nav-ctrls-url').removeAttr('readonly');
        }        

    } //:_updateCtrls()
    //
    // start loading animations
    //
    this._loading = function (tab) {
        tab = tab || null;

        if (tab == null) {
            tab = $('.nav-tabs-tab.active');
        }

        tab.find('.nav-tabs-favicon').css('animation', 'nav-spin 2s linear infinite');
        $('#nav-ctrls-reload').html(this.SVG_CLEAR);
    } //:_loading()
    //
    // stop loading animations
    //
    this._stopLoading = function (tab) {
        tab = tab || null;

        if (tab == null) {
            tab = $('.nav-tabs-tab.active');
        }

        tab.find('.nav-tabs-favicon').css('animation', '');
        $('#nav-ctrls-reload').html(this.SVG_RELOAD);
    } //:_stopLoading()
    //
    // auto add http protocol to url input or do a search
    //
    this._purifyUrl = function (url) {
        if (urlRegex({
                strict: false,
                exact: true
            }).test(url)) {
            url = (url.match(/^https?:\/\/.*/)) ? url : 'http://' + url;
        } else {
            url = (!url.match(/^[a-zA-Z]+:\/\//)) ? 'https://www.google.com/search?q=' + url.replace(' ', '+') : url;
        }
        return url;
    } //:_purifyUrl()
    //
    // set the color of the tab based on the favicon
    //
    this._setTabColor = function (url, currtab) {
        const getHexColor = new Color(url, {
            amount: 1,
            format: 'hex'
        });
        getHexColor.mostUsed(result => {
            currtab.find('.nav-tabs-favicon svg').attr('fill', result);
        });
    } //:_setTabColor()
    //
    // add event listeners to current webview
    //
    this._addEvents = function (sessionID, options) {
        let currtab = $('.nav-tabs-tab[data-session="' + sessionID + '"]');
        let webview = $('.nav-views-view[data-session="' + sessionID + '"]');

        webview.on('dom-ready', function () {
            if (options.contextMenu) {
                contextMenu({
                    window: webview[0],
                    labels: {
                        cut: 'Cut',
                        copy: 'Copy',
                        paste: 'Paste',
                        save: 'Save',
                        copyLink: 'Copy Link',
                        inspect: 'Inspect'
                    }
                });
            }
        });
        webview.on('page-title-updated', function () {
            if (options.title == 'default') {
                currtab.find('.nav-tabs-title').text(webview[0].getTitle());
                currtab.find('.nav-tabs-title').attr('title', webview[0].getTitle());
            }
        });
        webview.on('did-start-loading', function () {
            NAV._loading(currtab);
        });
        webview.on('did-stop-loading', function () {
            NAV._stopLoading(currtab);
        });
        webview.on('enter-html-full-screen', function () {
            $('.nav-views-view.active').siblings().not('script').hide();
            $('.nav-views-view.active').parents().not('script').siblings().hide();
        });
        webview.on('leave-html-full-screen', function () {
            $('.nav-views-view.active').siblings().not('script').show();
            $('.nav-views-view.active').parents().siblings().not('script').show();
        });
        webview.on('load-commit', function () {
            NAV._updateCtrls();
        });
        webview[0].addEventListener('did-navigate', (res) => {
            NAV._updateUrl(res.url);
        });
        webview[0].addEventListener('did-fail-load', (res) => {
            NAV._updateUrl(res.validatedUrl);
        });
        webview[0].addEventListener('did-navigate-in-page', (res) => {
            NAV._updateUrl(res.url);
        });
        webview[0].addEventListener("new-window", (res) => {
            if (!(options.newWindowFrameNameBlacklistExpression instanceof RegExp && options.newWindowFrameNameBlacklistExpression.test(res.frameName))) {
                NAV.newTab(res.url, {
                    icon: NAV.TAB_ICON
                });
            }
        });
        webview[0].addEventListener('page-favicon-updated', (res) => {
            if (options.icon == 'clean') {
                NAV._setTabColor(res.favicons[0], currtab);
            } else if (options.icon == 'default') {
                currtab.find('.nav-tabs-favicon').attr('src', res.favicons[0]);
            }
        });
        webview[0].addEventListener('did-fail-load', (res) => {
            if (res.validatedURL == $('#nav-ctrls-url').val() && res.errorCode != -3) {
                this.executeJavaScript('document.body.innerHTML=' +
                    '<div style="background-color:whitesmoke;padding:40px;margin:20px;font-family:consolas;">' +
                    '<h2 align=center>Oops, this page failed to load correctly.</h2>' +
                    '<p align=center><i>ERROR [ ' + res.errorCode + ', ' + res.errorDescription + ' ]</i></p>' +
                    '<br/><hr/>' +
                    '<h4>Try this</h4>' +
                    '<li type=circle>Check your spelling - <b>"' + res.validatedURL + '".</b></li><br/>' +
                    '<li type=circle><a href="javascript:location.reload();">Refresh</a> the page.</li><br/>' +
                    '<li type=circle>Perform a <a href=javascript:location.href="https://www.google.com/search?q=' + res.validatedURL + '">search</a> instead.</li><br/>' +
                    '</div>'
                );
            }
        });
        return webview[0];
    } //:_addEvents()
    //
    // update #nav-ctrls-url to given url or active tab's url
    //
    this._updateUrl = function (url) {
        url = url || null;
        urlInput = $('#nav-ctrls-url');
        if (url == null) {
            if ($('.nav-views-view').length) {
                url = $('.nav-views-view.active')[0].getURL();
            } else {
                url = '';
            }
        }
        urlInput.off('blur');
        if (!urlInput.is(':focus')) {
            urlInput.prop('value', url);
            urlInput.data('last', url);
        } else {
            urlInput.on('blur', function () {
                // if url not edited
                if (urlInput.val() == urlInput.data('last')) {
                    urlInput.prop('value', url);
                    urlInput.data('last', url);
                }
                urlInput.off('blur');
            });
        }
    } //:_updateUrl()
} //:Navigation()
/**
 * PROTOTYPES
 */
//
// create a new tab and view with an url and optional id
//
Navigation.prototype.newTab = function (url, options) {
    var defaults = {
        id: null, // null, 'yourIdHere'
        node: false,
        webviewAttributes: {},
        icon: "clean", // 'default', 'clean', 'c:\location\to\image.png'
        title: "default", // 'default', 'your title here'
        close: true,
        readonlyUrl: false,
        contextMenu: true,
        newTabCallback: this.newTabCallback,
        changeTabCallback: this.changeTabCallback
    }
    options = options ? Object.assign(defaults,options) : defaults;
    if(typeof options.newTabCallback === "function"){
        let result = options.newTabCallback(url, options);
        if(!result){
            return null;
        }
        if(result.url){
            url = result.url;
        }
        if(result.options){
            options = result.options;
        }
        if(typeof result.postTabOpenCallback === "function"){
            options.postTabOpenCallback = result.postTabOpenCallback;
        }
    }

    // validate options.id
    $('.nav-tabs-tab, .nav-views-view').removeClass('active');
    if ($('#' + options.id).length) {
        console.log('ERROR[electron-navigation][func "newTab();"]: The ID "' + options.id + '" already exists. Please use another one.');
        return false;
    }
    if (!(/^[A-Za-z]+[\w\-\:\.]*$/.test(options.id))) {
        console.log('ERROR[electron-navigation][func "newTab();"]: The ID "' + options.id + '" is not valid. Please use another one.');
        return false;
    }
    // build tab
    var tab = '<span class="nav-tabs-tab active" data-session="' + this.SESSION_ID + '">';
    // favicon
    if (options.icon == 'clean') {
        tab += '<i class="nav-tabs-favicon nav-icons">' + this.SVG_FAVICON + '</i>';
    } else if (options.icon === 'default') {
        tab += '<img class="nav-tabs-favicon nav-icons" src=""/>';
    } else {
        tab += '<img class="nav-tabs-favicon nav-icons" src="' + options.icon + '"/>';
    }
    // title
    if (options.title == 'default') {
        tab += '<i class="nav-tabs-title"> . . . </i>';
    } else {
        tab += '<i class="nav-tabs-title">' + options.title + '</i>';
    }
    // close
    if (options.close && globalCloseableTabsOverride) {
        tab += '<i class="nav-tabs-close nav-icons">' + this.SVG_CLEAR + '</i>';
    }
    // finish tab
    tab += '</span>';
    // add tab to correct position
    if ($('#nav-body-tabs').has('#nav-tabs-add').length) {
        $('#nav-tabs-add').before(tab);
    } else {
        $('#nav-body-tabs').append(tab);
    }
    // add webview    
    let composedWebviewTag = `<webview class="nav-views-view active" data-session="${this.SESSION_ID}" src="${this._purifyUrl(url)}"`;
    
    composedWebviewTag += ` data-readonly="${((options.readonlyUrl) ? 'true': 'false')}"`;
    if (options.id) {
        composedWebviewTag += ` id=${options.id}`;
    }
    if (options.node) {
        composedWebviewTag += " nodeintegration";
    }
    if (options.webviewAttributes) {
        Object.keys(options.webviewAttributes).forEach((key) => {
            composedWebviewTag += ` ${key}="${options.webviewAttributes[key]}"`;
        });
    }
    $('#nav-body-views').append(`${composedWebviewTag}></webview>`);    
    // enable reload button
    $('#nav-ctrls-reload').removeClass('disabled');

    // update url and add events
    this._updateUrl(this._purifyUrl(url));
    let newWebview = this._addEvents(this.SESSION_ID++, options);
    if(typeof options.postTabOpenCallback === "function"){
        options.postTabOpenCallback(newWebview)
    }
    (this.changeTabCallback || (() => {}))(newWebview);
    return newWebview;

} //:newTab()
//
// change current or specified tab and view
//
Navigation.prototype.changeTab = function (url, id) {
    id = id || null;
    if (id == null) {
        $('.nav-views-view.active').attr('src', this._purifyUrl(url));
    } else {
        if ($('#' + id).length) {
            $('#' + id).attr('src', this._purifyUrl(url));
        } else {
            console.log('ERROR[electron-navigation][func "changeTab();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:changeTab()
//
// close current or specified tab and view
//
Navigation.prototype.closeTab = function (id) {
    id = id || null;

    var session;
    if (id == null) {
        session = $('.nav-tabs-tab.active, .nav-views-view.active');
    } else {
        if ($('#' + id).length) {
            var sessionID = $('#' + id).data('session');
            session = $('.nav-tabs-tab, .nav-views-view').filter('[data-session="' + sessionID + '"]');
        } else {
            console.log('ERROR[electron-navigation][func "closeTab();"]: Cannot find the ID "' + id + '"');
            return false;
        }
    }
    if (session.next('.nav-tabs-tab').length) {
        session.next().addClass('active');
        (this.changeTabCallback || (() => {}))(session.next()[1]);
    } else {
        session.prev().addClass('active');
        (this.changeTabCallback || (() => {}))(session.prev()[1]);
    }

    session.remove();
    this._updateUrl();
    this._updateCtrls();
} //:closeTab()
//
// go back on current or specified view
//
Navigation.prototype.back = function (id) {
    id = id || null;
    if (id == null) {
        $('.nav-views-view.active')[0].goBack();
    } else {
        if ($('#' + id).length) {
            $('#' + id)[0].goBack();
        } else {
            console.log('ERROR[electron-navigation][func "back();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:back()
//
// go forward on current or specified view
//
Navigation.prototype.forward = function (id) {
    id = id || null;
    if (id == null) {
        $('.nav-views-view.active')[0].goForward();
    } else {
        if ($('#' + id).length) {
            $('#' + id)[0].goForward();
        } else {
            console.log('ERROR[electron-navigation][func "forward();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:forward()
//
// reload current or specified view
//
Navigation.prototype.reload = function (id) {
    id = id || null;
    if (id == null) {
        $('.nav-views-view.active')[0].reload();
    } else {
        if ($('#' + id).length) {
            $('#' + id)[0].reload();
        } else {
            console.log('ERROR[electron-navigation][func "reload();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:reload()
//
// stop loading current or specified view
//
Navigation.prototype.stop = function (id) {
    id = id || null;
    if (id == null) {
        $('.nav-views-view.active')[0].stop();
    } else {
        if ($('#' + id).length) {
            $('#' + id)[0].stop();
        } else {
            console.log('ERROR[electron-navigation][func "stop();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:stop()
//
// listen for a message from webview
//
Navigation.prototype.listen = function (id, callback) {
    let webview = null;

    //check id
    if ($('#' + id).length) {
        webview = document.getElementById(id);
    } else {
        console.log('ERROR[electron-navigation][func "listen();"]: Cannot find the ID "' + id + '"');
    }

    // listen for message
    if (webview != null) {
        try {
            webview.addEventListener('ipc-message', (event) => {
                callback(event.channel, event.args, webview);
            });
        } catch (e) {
            webview.addEventListener("dom-ready", function (event) {
                webview.addEventListener('ipc-message', (event) => {
                    callback(event.channel, event.args, webview);
                });
            });
        }
    }
} //:listen()
//
// send message to webview
//
Navigation.prototype.send = function (id, channel, args) {
    let webview = null;

    // check id
    if ($('#' + id).length) {
        webview = document.getElementById(id);
    } else {
        console.log('ERROR[electron-navigation][func "send();"]: Cannot find the ID "' + id + '"');
    }

    // send a message
    if (webview != null) {
        try {
            webview.send(channel, args);
        } catch (e) {
            webview.addEventListener("dom-ready", function (event) {
                webview.send(channel, args);
            });
        }
    }
} //:send()
//
// open developer tools of current or ID'd webview
//
Navigation.prototype.openDevTools = function (id) {
    id = id || null;
    let webview = null;

    // check id
    if (id == null) {
        webview = $('.nav-views-view.active')[0];
    } else {
        if ($('#' + id).length) {
            webview = document.getElementById(id);
        } else {
            console.log('ERROR[electron-navigation][func "openDevTools();"]: Cannot find the ID "' + id + '"');
        }
    }

    // open dev tools
    if (webview != null) {
        try {
            webview.openDevTools();
        } catch (e) {
            webview.addEventListener("dom-ready", function (event) {
                webview.openDevTools();
            });
        }
    }
} //:openDevTools()
//
// print current or specified tab and view
//
Navigation.prototype.printTab = function (id, opts) {
    id = id || null
    let webview = null

    // check id
    if (id == null) {
        webview = $('.nav-views-view.active')[0]
    } else {
        if ($('#' + id).length) {
            webview = document.getElementById(id)
        } else {
            console.log('ERROR[electron-navigation][func "printTab();"]: Cannot find the ID "' + id + '"')
        }
    }

    // print
    if (webview != null) {
        webview.print(opts || {});
    }
}
//:nextTab()
//
// toggle next available tab
//
Navigation.prototype.nextTab = function () {
    var tabs = $('.nav-tabs-tab').toArray();
    var activeTabIndex = tabs.indexOf($('.nav-tabs-tab.active')[0]);
    var nexti = activeTabIndex + 1;
    if (nexti > tabs.length - 1) nexti = 0;
    $($('.nav-tabs-tab')[nexti]).trigger('click');
    return false
} //:nextTab()
//:prevTab()
//
// toggle previous available tab
//
Navigation.prototype.prevTab = function () {
    var tabs = $('.nav-tabs-tab').toArray();
    var activeTabIndex = tabs.indexOf($('.nav-tabs-tab.active')[0]);
    var nexti = activeTabIndex - 1;
    if (nexti < 0) nexti = tabs.length - 1;
    $($('.nav-tabs-tab')[nexti]).trigger('click');
    return false
} //:prevTab()
// go to a tab by index or keyword
//
Navigation.prototype.goToTab = function (index) {
    $activeTabAndView = $('#nav-body-tabs .nav-tabs-tab.active, #nav-body-views .nav-views-view.active');

    if (index == 'previous') {
        $tabAndViewToActivate = $activeTabAndView.prev('#nav-body-tabs .nav-tabs-tab, #nav-body-views .nav-views-view');
    } else if (index == 'next') {
        $tabAndViewToActivate = $activeTabAndView.next('#nav-body-tabs .nav-tabs-tab, #nav-body-views .nav-views-view');
    } else if (index == 'last') {
        $tabAndViewToActivate = $('#nav-body-tabs .nav-tabs-tab:last-of-type, #nav-body-views .nav-views-view:last-of-type');
    } else {
        $tabAndViewToActivate = $('#nav-body-tabs .nav-tabs-tab:nth-of-type(' + index + '), #nav-body-views .nav-views-view:nth-of-type(' + index + ')');
    }

    if ($tabAndViewToActivate.length) {
        $('#nav-ctrls-url').blur();
        $activeTabAndView.removeClass('active');
        $tabAndViewToActivate.addClass('active');

        this._updateUrl();
        this._updateCtrls();
    }
} //:goToTab()
/**
 * MODULE EXPORTS
 */
module.exports = Navigation;