OAuth2 jQuery
=============

An example for using OAuth2 (Facebook Connect) with LDS Connect and jQuery

If you want this example + node.js / io.js see
[passport-lds-connect-example](https://github.com/LDSorg/passport-lds-connect-example)

This is a template for gracefully handling the browser component of **server-side** OAuth2.

Although it does rely on a server, you can remove the server redirects so that you
provide your users with a seamless experience that doesn't disrupt their flow in
your application.

API
===

For this example you must create a server that implements the following endpoints:

(replace `{{provider}}` with `facebook` or `ldsconnect` appropriately)

/auth/{{provider}}
--------------

Examples:

* /auth/facebook
* /auth/ldsconnect

The endpoint you create for these may set some options in your OAuth2 library and will then redirect to

  * (facebook) https://www.facebook.com/dialog/oauth
  * (ldsconnect) https://ldsconnect.org/dialog/authorize

/auth/{{provider}}/callback
-----------------------

Examples:

* /auth/facebook/callback
* /auth/ldsconnect/callback


This is the endpoint to which facebook (or lds connect) will respond with your
grant code (`https://example.com/auth/facebook/callback?code=xxxxxxxxxxxx`).

Old school style would be to set this endpoint as any arbitrary string and your server
would redirect to (hopefully) the page that your user was on with everything retemplated.

However, to make for a seamless user experience, you will instead send the contents
of `oauth-close.html` as the response (DO NOT REDIRECT) and jQuery will grab the
session info based on the success or failure indicated in the url
(i.e. it may be
`https://example.com/auth/facebook/callback?error=NOT_AUTHORIZED`
instead of having a code).

API Tokens
----------

For convenience, we provider fully working test API keys that you can test with on localhost. Get your example working first with Facebook, then substite the appropriate strings with LDS Connect.

**Note**: These examples **will not work** with `127.0.0.1:3000` or `localhost:300` (even though they must run locally), you must use the appropriate domain name and port (which point to `127.0.0.1`).

### Facebook Connect

| Param | Value |
|:------|:------|
|Authorization URL | https://www.facebook.com/dialog/oauth         |
| Token URL        | https://graph.facebook.com/oauth/access_token |
| Profile URL      | https://graph.facebook.com/me                 |
| App ID           | 746913342088510                               |
| App Secret       | ad539732cbfbd60169f32336e257b37c              |
| Callback URL     | http://local.foobar3000.com:4080              |

### LDS Connect

OAuth2 URLs and API Keys

 * Authorization URL: https://ldsconnect.org/dialog/authorize
 * Token URL: https://ldsconnect.org/oauth/token
 * Profile URL: https://ldsconnect.org/api/ldsconnect/me
 * App ID: 55c7-test-bd03
 * App Secret: 6b2fc4f5-test-8126-64e0-b9aa0ce9a50d
 * Callback URL: https://local.ldsconnect.org:8043

Your LDS Account will not be able to login to test applications. You must use:

  * username: dumbledore
  * passphrase: secret

You will need to use TLS/SSL with HTTPS in order to register your production app. Start by testing your app with these certificates. Then watch the video to see how to purchase your own.

  * root ca public crt: https://github.com/LDSorg/passport-lds-connect-example/blob/master/certs/server/my-root-ca.crt.pem
  * server public crt: https://github.com/LDSorg/passport-lds-connect-example/blob/master/certs/server/my-server.crt.pem
  * server private key: https://github.com/LDSorg/passport-lds-connect-example/blob/master/certs/server/my-server.key.pem

Screencast: Getting SSL Certs with Name.com (not yet uploaded)

FIY: Server-Side vs Client-Only OAuth2
---------------

Just an FYI for the curious...

Bottom Line: client-only oauth2 is convenient and seamless,
but can't be secured from spoofing by malicious clients
(hacked android apks, rooted iphones, non-standard browsers like curl, mechanize, phantom).

With server-side oauth2, you must provide your App ID and App Secret.
In client-only (browser, android, etc) oauth2, you only provide your App ID
and use some other means of authenticating - such as a username and password
or restricted access to a single TLS/SSL secured HTTPS domain.

With server-side oauth2 you generally get a token that lasts longer
(days instead of hours) and you may be able to request certain scopes
that are not allowed to be requested by client-only oauth2 strategies.
