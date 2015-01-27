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

(replace `facebook` with `ldsconnect` for lds connect)

/auth/facebook (/auth/ldsconnect)
--------------

This will set some options and redirect to

  * (facebook) https://www.facebook.com/dialog/oauth
  * (ldsconnect) https://ldsconnect.org/dialog/authorize

/auth/facebook/callback
-----------------------

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

FIY: Server-Side vs Client-Only OAuth2
==============

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
