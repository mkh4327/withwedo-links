# WithWeDo shared links

Static public landing pages for links shared by the WithWeDo app.
Only this directory is published; the application source remains private.

The pages contain generic branding and content-type metadata only. Item and group identifiers stay in the URL fragment, which is not sent in HTTP requests. No private content, analytics, remote API calls, or credentials are included. Opening the app requires an explicit tap and the app checks the viewer's existing access.

Group invitations use invite/#invite_code=CODE with exactly one fragment parameter. The code is 8-32 ASCII letters or digits and opens the app's existing invitation form; it never joins a group automatically. Invitation metadata contains no group name, code, or expiry.

Copied URLs use the receiving app's own link preview. A custom Kakao Share template and its button layout are separate from an ordinary URL preview and are not promised by these pages.

Source and regeneration: TodoApp/scripts/build_share_site.py.
