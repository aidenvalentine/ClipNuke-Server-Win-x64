/**
 * Login to Pornhob. They require a cookie to be saved to the PC.
 * Init a new webdriverio session.
 * @param  {webdriverio}   client   A webdriverio client
 * @param  {Function}      callback err, data
 * @return {Object}                 A webdriverio cookie containing the authenticated PHPSESSID
 */
function auth(credentials, params, callback) {
  console.log(credentials);

  var seconds = new Date() / 1000; // get current eopch time in seconds

  params.client
    .init()
    .url('https://www.pornhub.com/login')
    .setCookie({
        name: 'platform',
        value: 'pc',
        // The below options are optional
        domain: '.pornhub.com', // The domain the cookie is visible to. Defaults to the current browsing context’s active document’s URL domain
        // expiry: seconds+3600 // When the cookie expires, specified in seconds since Unix Epoch
    })
    .waitForVisible('#username', 3000)
    .setValue('body #username', credentials.user)
    .setValue('body #password', credentials.pass)
    .click('body #remember_me')
    .waitForVisible('body.logged-in', 30000)
    .pause(2000)
    // .submitForm('body #signin-form')
    // .setCookie({
    //     name: 'il',
    //     value: 'v1OSYzloq21Oih_yQUyIIo9j6g4lldVHIswYo9qj5-w0ExNTgwNTc3OTkzWWFXN3dvZHlqTG4xcl9FcUl6N2lkQVhfRk8ydDNGN1RSWmVXbEY0Zw..',
    //     // The below options are optional
    //     // path: '/', // The cookie path. Defaults to "/"
    //     domain: '.pornhub.com', // The domain the cookie is visible to. Defaults to the current browsing context’s active document’s URL domain
    //     secure: true, // Whether the cookie is a secure cookie. Defaults to false
    //     httpOnly: true, // Whether the cookie is an HTTP only cookie. Defaults to false
    //     expiry: seconds+3600 // When the cookie expires, specified in seconds since Unix Epoch
    // })
    // .click('#submit')
    // .pause(15000) // Wait in case we need to solve a recaptcha.
/*     .getCookie([{"domain":"admin.clips4sale.com","httpOnly":false,"name":"PHPSESSID","path":"/","secure":false,"value":"jt0p2kiigvqdps9paqn6nqpnm8"}]).then(function(cookie) {
	  var json = JSON.stringify(cookie);
      console.log('Cookie is: ' + json);
	  fs.writeFile('cookie.json', json, 'utf8', callback);
      return cookie;
    }) */
    .next(function (data) {
      console.log(data);
      return callback(null, data);
    }).catch((e) => console.log(e));
};
/**
 * Create New Clip
 * @param  {Integer}  event    The clip data
 * @param  {Object}   params   client, cookie
 * @param  {Function} callback [description]
 * @return {Object}            [description]
 */
function postUpload(event, params, callback) {
  params.client
  // .init()
  /* .setCookie(params.cookie) */
  .url('https://www.pornhub.com/upload')
  .pause(1000)
  .click("#videoUploadLink > span.btnLabel")
  .waitForVisible('#videoDetailBar', 300000).pause(1000)
  // .click('#dropDownColumn_1_0 > div.uploaderDropDownContainer')
  // .click('#dropDownVerify_1_1 > li.alpha')
  // .setValue('#titleTmplField_1', event.name || '').pause(100).click('#submitNewTag_0')
  .setValue('#titleTmplField_0', event.name || '').pause(100)
  .setValue('#tagsList_0', event.tags[0] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[1] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[2] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[3] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[4] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[5] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[6] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[7] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[8] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[9] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[10] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[11] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[12] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[13] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[14] || '').pause(100).click('#submitNewTag_0')
  .setValue('#tagsList_0', event.tags[15] || '').pause(100).click('#submitNewTag_0')
  .waitForVisible('#progressDescription_0 > a', 9000000).pause(1000)
  .end();
}

module.exports = {
  login: auth,
  postUpload: postUpload
};
