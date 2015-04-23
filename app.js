$(function () {
  'use strict';

  var Oauth3 = window.OAUTH3;
  var LdsApi = window.jqLdsIo;

  //
  // LDS Account
  //

  $('.js-open-ldsconnect-implicit-grant').click('body', function () {
    LdsApi.session.login({
      popup: true
    , scope: 'directories'
    }).then(function () {
      // get default account
      console.log('[lds implicit grant]');
      testLdsAccess();
    }, function () {
      window.alert('Implicit Grant Login Failed');
    });
  });

  $('.js-open-ldsconnect-authorization-redirect').click('body', function () {
    LdsApi.session.login({
      popup: true
    , authorizationRedirect: true
    , scope: 'directories'
    }).then(function () {
      testLdsAccess();
    }, function () {
      window.alert('Authorization Redirect Login Failed');
    });
  });

  $('.js-logout').click('body', function (ev) {
    ev.stopPropagation();
    ev.preventDefault();

    // TODO needs directive
    // Oauth3.logout('https://facebook.com');
    LdsApi.session.logout().then(function () {
      init();
    });
  });

  function testLdsAccess() {
    // TODO get account list
    var account = LdsApi.session.selectAccount();
    LdsApi.request.profile(account).then(function (profile) {
      setLogin(profile);
    });
  }

  function setLogin(data) {
    $('.js-login').hide();
    $('.js-logout').show();
    $('.js-login-dialog').modal('hide');
    $('.js-profile').html(JSON.stringify(data, null, '  '));
    $('.js-profile-container').fadeIn();

    if (data.user && data.user.photos.length) {
      $('img.js-headshot').attr('src', data.user.photos[0].value);
      $('img.js-headshot').show();
    }
  }

  function init() {
    $('.js-login').show();
    $('.js-logout').hide();
    $('img.js-headshot').hide();
    $('.js-profile-container').hide();

    // checking to see if we're already logged in
    //var token = localStorage.getItem('lds.io.token');
    //var expiresAt = localStorage.getItem('tokenExpiresAt');

    LdsApi.init({
      appId: 'TEST_ID_beba4219ee9e9edac8a75237'
    }).then(function () {
      console.log("LdsApi initialized");

      /*
      LdsApi.session.backgroundLogin(function () {
      });
      */
      LdsApi.session.checkSession().then(function () {
        testLdsAccess();
      }, function () {
        console.log("There is no LDS session right now");
      });
    });
  }

  init();

  //
  // Facebook
  //

  // TODO needs failover to oauth3.org for sites that don't support oauth3 yet
  // Oauth3.discover("https://facebook.com").then(function () {
  //   console.log("I'm ready to handle login click events for https://facebook.com");
  // }, function () {
  //   window.alert("https://facebook.com does not support oauth3 or is currently unavailable");
  // });
  //
  // Also:
  // In the next version I'll enabled discovery automatically when .login()
  // is called, but for now you should call it manually and it should complete
  // **before** you handle the click event that opens the login dialog
  // (otherwise the browser security policy will prevent the popup)
  //
  // Background Login
  //
  // You could also perform a background login which will
  // invoke the discovery and is not inhibited by it.
  //
  /*
  Oauth3.backgroundLogin(
    "https://facebook.com"
  , { authorizationRedirect: true, scope: 'directories' }
  ).then(function (params) {
    console.log("The user is logged in to ldsconnect.org and has already accepted permissions");
    testAccess(params.access_token);
  }, function (err) {
    console.warn(err);
    console.log("The user is either not logged in to ldsconnect.org or has not granted the desired scope");
  });
  */
  var fbDirectives = {
    "authorization_dialog": {
      "method": "GET"
    , "url": "https://www.facebook.com/dialog/oauth"
    }
  , "access_token": {
      "method": "POST"
    , "url": "https://graph.facebook.com/oauth/access_token"
    }
  , "profile": {
      "method": "GET"
    , "url": "https://graph.facebook.com/me"
    }
  , "authn_scope": ""
  };

  $('.js-open-facebook-implicit-grant').click('body', function () {
    login(
      'https://facebook.com'
    , { appId: '1592518370979179', directives: fbDirectives }
    ).then(function (/*params*/) {
      window.alert('Implicit Grant fb login success');
    }, function () {
      window.alert('FAIL: Implicit Grant fb login failure');
    });
  });
  $('.js-open-facebook-authorization-redirect').click('body', function () {
    login('https://facebook.com', { authorizationRedirect: true, directives: fbDirectives }).then(function () {
      window.alert('Authorization Redirect fb login success');
    }, function () {
      window.alert('FAIL: Authorization Redirect fb login failure');
    });
  });

  //
  // Login Click Handler
  //
  // The call to login must be attached to click handler otherwise
  // the browser security policy will block window.open from creating a popup.
  // Also, the chain leading up to window.open must be synchronous
  // (I think setTimeout / setImmediate is okay, but ajax and other events
  // will cause the click to lose its ability to open popups)
  //
  // Note: In a future version I will support iframes, but I have to implement
  //       an anti-click-jacking security measure first.
  //
  function login(providerUri, opts) {
    opts.type = 'popup';
    return Oauth3.login(providerUri, opts).then(function (params) {
      console.log(providerUri, 'token:', params.access_token, params);
      return params;
    });
  }
});
