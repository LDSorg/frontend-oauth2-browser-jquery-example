$(function () {
  'use strict';

  var Oauth3 = window.OAUTH3;

  //
  // IMPORTANT Discovering OAuth3 Service
  //
  // In the next version I'll enabled discovery automatically when .login()
  // is called, but for now you should call it manually and it should complete
  // **before** you handle the click event that opens the login dialog
  // (otherwise the browser security policy will prevent the popup)
  //
  Oauth3.discover("https://ldsconnect.org").then(function () {
    console.log("I'm ready to handle login click events for https://ldsconnect.org");
  }, function () {
    window.alert("https://ldsconnect.org does not support oauth3 or is currently unavailable");
  });
  // TODO needs failover to oauth3.org for sites that don't support oauth3 yet
  // Oauth3.discover("https://facebook.com")

  //
  // Background Login
  //
  // You could also perform a background login which will
  // invoke the discovery and is not inhibited by it.
  //
  /*
  Oauth3.backgroundLogin(
    "https://ldsconnect.org"
  , { authorizationRedirect: true, scope: 'directories' }
  ).then(function (params) {
    console.log("The user is logged in to ldsconnect.org and has already accepted permissions");
    testLdsAccess(params.access_token);
  }, function (err) {
    console.warn(err);
    console.log("The user is either not logged in to ldsconnect.org or has not granted the desired scope");
  });
  */

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
    return Oauth3.login(providerUri, opts);
  }

  //
  // LDS Account
  //
  $('.js-open-ldsconnect-implicit-grant').click('body', function () {
    login(
      'https://ldsconnect.org'
    , { appId: 'TEST_ID_beba4219ee9e9edac8a75237', scope: 'directories' }
    ).then(function (params) {
      console.log('[lds implicit grant]', params);
      testLdsAccess(params.access_token);
    }, function () {
      window.alert('Implicit Grant Login Failed');
    });
  });
  $('.js-open-ldsconnect-authorization-redirect').click('body', function () {
    login(
      'https://ldsconnect.org'
    , { authorizationRedirect: true, scope: 'directories' }
    ).then(function (params) {
      testLdsAccess(params.access_token);
    }, function () {
      window.alert('Authorization Redirect Login Failed');
    });
  });

  //
  // Facebook
  //
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
    login('https://facebook.com', { appId: '1592518370979179', directives: fbDirectives }).then(function () {
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

  function testLdsAccess(token) {
    // TODO get account list
    $.ajax({
      url: "https://lds.io/api/ldsio/accounts"
    , headers: {
        Authorization: 'Bearer ' + token
      }
    , dataType: 'json'
    }).then(function (data) {
      console.info('testLdsAccess response');
      console.log(data);

      if (!data || !data.accounts) {
        return;
      }

      $.ajax({
        url: 'https://lds.io/api/ldsio/' + data.accounts[0].app_scoped_id + '/me'
      , headers: {
          Authorization: 'Bearer ' + token
        }
      , dataType: 'json'
      }).then(function (data) {
        console.info('testLdsAccess profile response');
        console.log(data);

        // Saving the session in the client so we know we're already logged in
        localStorage.setItem('token', token);
        setLogin(data);
      });
    });
  }

  $('.js-logout').click('body', function (ev) {
    ev.stopPropagation();
    ev.preventDefault();

    // TODO needs directive
    // Oauth3.logout('https://facebook.com');
    Oauth3.logout('https://ldsconnect.org').then(function () {
      localStorage.clear();
      init();
    });
  });

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
    var token = localStorage.getItem('lds.io.token');
    //var expiresAt = localStorage.getItem('tokenExpiresAt');

    if (token) {
      testLdsAccess(token);
    }
  }

  init();
});
