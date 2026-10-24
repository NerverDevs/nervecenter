# NerveCenter

NerveCenter (https://nvcenter.cc) brings the accounts you hold on new-api and sub2api relay panels (中转站) into one place: balances, API keys, usage, group ratios and alerts in a single console.

## Why it exists

Anyone running a relay site usually holds a string of upstream accounts, each on its own panel, each with its own sign-in. Checking balances means opening them one at a time. Keys are scattered. A ratio changes and nobody notices. A balance runs dry and you hear about it from a user's error report.

NerveCenter was built so you can look after those upstream accounts in one place. Once an account is connected, its balance, keys, call records and group ratios are synced on a schedule, and the usual jobs — creating a key, disabling one — happen here too. If you simply hold accounts on several relay sites, the same thing applies.

## What it does

### Connecting channels

An account you hold on a panel is called a **channel** here. Paste the panel address when you add one and NerveCenter works out whether it runs new-api or sub2api; if it cannot tell, you pick it yourself.

The hard part of connecting is that a panel only recognises a sign-in made in a browser, and that sign-in often has a captcha. So you always sign in yourself, in one of three ways. The add-channel page lists whichever ways are currently open — that is up to whoever runs the site. On nvcenter.cc all three are open, and the first is the default.

**1. Copy the sign-in from your browser (F12, recommended)**

Sign in to the panel in your own browser, captcha included, then copy the sign-in over step by step. Nothing to install, and every step has an illustrated guide.

- new-api offers three routes:
  - One console command plus your panel password (recommended): run one line in the panel tab's console, type the password once, and an access token is created and copied for you. Your browser stays signed in; the token expires after 180 days, when you re-authorise.
  - Copy the cookie: no password needed, but clear the site data straight afterwards.
  - Create an access token by hand in the panel: no developer tools; tick the permissions the guide shows and paste it in.
- sub2api: run one line in the panel tab's console to copy the sign-in, clear the site data straight away, then paste it back here.

**2. Browser extension**

Sign in to the panel in your own browser and the NerveCenter Connector extension hands the sign-in over.

It is a Chrome / Edge extension (MV3). Download the zip from the site, unzip it, and load it from your browser's extensions page with "Load unpacked" — it is not in the Chrome Web Store. Once installed, pair it to your account with a one-time code; after that you never type a server address or a code again. Good if you connect several panels and would rather not open developer tools each time.

**3. Cloud browser**

The panel's own sign-in page opens in a throwaway browser on our server. You sign in as usual, captcha included, and we keep only the session that results.

Because the browser runs on our side, there is nothing to install locally and no console to open. That browser is disposable and discarded after use; only a few run at once, so occasionally you wait a moment. One thing to note: third-party sign-in ("continue with Google" and the like) does not work inside the cloud browser — for such an account, use one of the first two ways.

When you add a channel you choose **just me** or **shared with the team**. The first sync usually takes a minute or two, and it also backfills a stretch of past usage.

### Balances at a glance

The **dashboard** sums up the current workspace's channels: total balance, spend today and over the last 7 days, a 14-day spend curve, a 30-day balance trend, and the top models of the last 7 days. You can also split the view by platform.

A **needs attention** list gathers the channels that want re-authorisation, are low on balance, have credentials about to expire, failed to sync, or sit behind an upstream fault — click through and deal with it.

### Managing keys

You can look after upstream keys without signing in to the panel:

- Create: name, group, quota (in dollars, or unlimited), expiry, and an optional IP allow-list.
- Edit, disable, re-enable.
- Reveal the plaintext: some sites limit how often you may, and you are told how many reveals are left and when the count resets.
- Delete: removes the key upstream, so anything using it stops working immediately.

The **API keys** page gathers every key you can see, filterable and searchable by channel, platform, status and group, and it shows the ratio of each key's group. Keys that already existed on the panel appear by themselves at the next sync.

Where a panel reports no usage for a key — sub2api counts a key's spend only when that key carries a quota limit — the figure is summed from our own records instead and labelled as ours, with the date its period begins.

### Usage and logs

The **usage** page counts requests and cost by day and by model, with the individual calls below: time, model, key, group, input and output tokens, cost, latency.

Filter by date (UTC), channel, model, key name or group, and export what you filtered as CSV or NDJSON. Call records sync about every 10 minutes.

### Ratios and prices

Every channel has a **prices and ratios** page.

- Group ratios: only the groups you can actually use, at the ratio that applies to you. If the site's operator set a ratio specifically for you, that is the one shown.
- Model prices: converted to a price per 1M input and output tokens, or a per-call price where billing is per call. Pick a group and you see that group's real prices.

Every site is presented the same way, which is what makes them comparable.

### Channel briefing and health

Panels keep no history of their own ratio and model changes, so by default we compare group ratios every 10 minutes and model lists every 30, and keep the record ourselves. A platform administrator can change that under platform settings → sync; on panels where models must be read group by group, models are read at most every 6 hours.

- **Briefing**: a timeline over the last 7, 30 and 90 days. Which group went up or down, which groups appeared or were withdrawn, which models were added or removed.
- **Health**: the panel's own statistics per model — success rate, average latency, time to first token, output speed. On sub2api we read the panel's channel monitoring, such as availability and success rate. The figures describe the whole panel, not only your requests. We never send test requests with your keys, so this costs nothing.

> Sample briefing entries: today · price up · group `default` ratio raised ×1 → ×1.2; yesterday · new group · group `vip` added; yesterday · models added · 3 models added to `vip`.

### Comparing models

The console's **model comparison** page puts one model's price and stability on each of your channels side by side, so you can see which route to use.

- Price: the site's published model price × your own group ratio on that channel, converted to a price per 1M input and output tokens, the same way the prices-and-ratios page does it.
- Stability: from the panel's own health statistics, such as success rate and average latency. A channel with no health data is marked as such, not scored as zero.
- Picks: for each family of models, the cheapest, the steadiest and the best value. The model list can be sorted, filtered by channel, and exported as CSV.

It counts only the channels you can use in the current workspace, and you can narrow it to the ones you connected yourself. Each channel uses its own group and ratio, never someone else's. No test requests with your keys.

### Alerts

- **Inbox**: the bell in the top right. Balance warnings, channel faults, ratio and model changes, security notices and platform announcements all arrive here, are kept for 180 days, and can be filtered or marked read.
- **Delivery**: Telegram and webhooks. A webhook posts JSON signed with HMAC-SHA256 to an https address of your own. Each Telegram chat and each webhook can carry its own selection of categories. Email is coming.
- **Notification settings**: "rules" decide what you are told about, "channels" decide where it goes. Every item can be switched on or off separately for the inbox, Telegram and webhooks. Search at the top (try "key", "balance", "sign-in"), filter by what is on or off, or restore the defaults in one click.
- **Balance alerts**: set a threshold in dollars under the balance group, and any channel you can see that falls below it tells you. With no threshold set, no balance alerts are sent.
- **Security alerts**: only about your own account — a sign-in from a new device, a password change, two-step verification turned on or off, a recovery code used, and changes to API tokens, keys, channels and delivery channels. Each carries the time, IP, device and method, and each can be turned off on its own.
- **Promptness**: ratio, group and model changes go out within seconds of being detected; a low balance or a channel needing re-authorisation arrives within a minute of the check.

> A sample balance alert: "hub.example.net" balance $4.20, below your $5.00 threshold.

### Telegram bot

The official bot is [@NerverCenter_bot](https://t.me/NerverCenter_bot).

- **Connect**: under notification settings → channels, click "connect Telegram", scan the code or follow the link on your phone, and press Start. The code lasts 10 minutes and works once.
- **Menu**: send `/menu` and use the buttons for balances, your channels, today's usage, ratio changes, key management and delivery settings.
- **Keys**: create one step by step (name, group, quota, lifetime). Disabling, deleting and viewing a full key each need a confirmation; a full key is sent in a way that resists forwarding and is deleted again after a short while.
- **Delivery settings**: six switches — balance warnings, channel faults, ratios and groups, new models, security notices, platform announcements.
- The bot answers only in private chats, and it can do exactly what you can do on the site. After a password change, a change to two-step verification, or signing out other devices, reconnect on the site before using it again; notifications keep arriving meanwhile.

### Working as a team

- **Workspaces**: channels and members live in a workspace. The first one is created when you sign up; add more later and switch at the top whenever you like.
- **Invitations**: enter the person's email, pick a role (admin, operator, read-only member) and generate an invitation link. The link is shown once and you pass it on yourself; they accept after signing in or signing up with that address.
- **Visibility**: a **just me** channel is yours alone to use (keys, usage, sync, re-authorisation), and the owner and admins see only its name, platform, status and balance. On a **shared** channel every member sees the key list and usage, and the owner and admins can manage it fully.
- **Grants**: another member needs an explicit grant to create or edit keys, or to reveal plaintext. The grantable permissions are manage keys, reveal keys, and rename the channel.
- When a member leaves, their private channels move to their personal workspace along with the credentials and data; shared channels stay where they are.
- The owner and admins can read the audit log: connecting a channel, revealing or changing a key, all of it leaves a record.

### Account security

- **Two-step verification**: scan the code with an authenticator to turn it on, and you also get 10 single-use recovery codes to download and keep.
- **No phone?** When turning it on you can show the secret instead, then open https://nvcenter.cc/tools/2fa and paste it to see the current 6-digit code. The code is computed entirely in your browser; the secret is never sent anywhere and never stored. The sign-in code page links there too.
- **Devices**: see every signed-in device, sign out one of them, or sign out all the others. The latter also revokes all your API tokens and disconnects Telegram chats from acting on your behalf.
- **Security activity**: sign-ins, two-step verification, password changes and the like, with whether each succeeded.
- When you change your password, "also revoke all API tokens" is ticked by default and other devices are signed out.

### Personal API tokens

For scripts and automation, created under personal settings → API tokens.

- Tick the scopes you need: read-only, manage keys, reveal keys, trigger a sync, rename a channel.
- A token can be tied to a single workspace. It lasts 1 to 365 days, or never expires; the default is 90 days.
- Tokens begin with `nct_` and are shown once, at creation. Send one as `Authorization: Bearer nct_…`, and add `X-Tenant-ID` for endpoints inside a workspace.
- A token can never do more than you can. No token may connect, re-authorise or delete a channel, manage members and invitations, or change your password, two-step verification or devices.

## Getting started in three steps

1. **Sign up** at https://nvcenter.cc with your email, a display name, a password of at least 10 characters, and a workspace name, plus the 5 digits shown in the image. You land straight in your workspace.
2. **Add your first channel**: channels → add channel, paste the panel address, click "identify site", follow the steps on the page to copy the sign-in, and click connect.
3. **Watch the dashboard**: a minute or two later the balances, keys and usage appear. While you are there, set a balance threshold, connect Telegram, and turn on two-step verification — then keep the recovery codes somewhere safe.

## Supported panels and limits

- new-api (including modified builds we can recognise) and sub2api. Anything else reports "no supported panel found at that address".
- nvcenter.cc currently offers three ways to connect: F12 copy (the default), the browser extension, and the cloud browser. Sites with a captcha or a human check are fine, because you always sign in yourself.
- Third-party sign-in ("continue with Google") does not work in the cloud browser; use F12 copy or the extension for such an account.
- The browser extension is loaded unpacked and is not in the Chrome Web Store. Chromium browsers (Chrome, Edge) only.
- We cannot complete a passkey check for you. A new-api account that can only sign in with a passkey cannot use the one-line command; copy the cookie or create an access token by hand instead. The one-line command also needs the account to have a password, and where the panel encrypts passwords, the page must be https.
- Some sub2api sites tie a sign-in to an IP and a browser, so a sign-in copied from your browser may be revoked by the site. Re-authorise when that happens.
- When a sign-in lapses or an access token expires, the channel is marked "needs re-authorisation" and syncing pauses; it resumes by itself once you re-authorise.
- Where a panel lacks a feature, you are told why rather than shown a puzzling error. Each channel is checked feature by feature when connected and re-checked daily; you can also re-check by hand. The rules were written against the original panels, so an unusual modified build may be judged wrongly.
- Health data exists only on newer new-api versions, or on sub2api with channel monitoring enabled.
- Some panels limit how wide a log query may be, so older history may not backfill completely. The page says so when that happens.
- A usage export covers at most 100,000 rows at a time; anything beyond that is not exported, so shorten the date range and export in parts.
- Email is not enabled on this site: you cannot recover a password or turn off two-step verification by email.

## Security and privacy

What we store:

- Your NerveCenter account: email and display name, with the password kept only as an argon2id hash.
- Each channel's sign-in credential. Of what you paste in, only the few items the site needs are kept; the rest is discarded.
- What syncing brings: balances, key lists, call records, and ratio and model changes.

How we protect it:

- Upstream credentials and any key plaintext you revealed are sealed under a master key before they are stored. Each upstream credential has its own data key, encrypted with AES-256-GCM.
- Platform administrators cannot see your upstream credentials. An administrator who needs a key's plaintext can reveal only one at a time, after passing two-step verification, and every reveal is audited.
- Sensitive actions — connecting a channel, revealing plaintext, changing permissions — are written to the audit log before their result goes out. The audit log records no tokens and no passwords.
- Revealing key plaintext is rate-limited, and by default it also sends you a security alert.

What never passes through us:

- The panel password in the one-line command goes only to the panel itself.
- sub2api's copy command reads the sign-in from the page you are on into your clipboard; it sends nothing anywhere.
- The two-step verification secret in /tools/2fa is computed in your browser alone, never sent, never stored.

A sign-in copied out of a panel does what you yourself can do. Only ever paste it into a NerveCenter you trust.

## Questions people ask

**Do I have to hand you my panel password?**
No. The password in the one-line command goes only to the panel. What we keep is an access token or a sign-in credential, not a password.

**Which of the three ways should I use?**
For one or two panels, the default F12 copy is the least trouble and installs nothing. If you are connecting several panels and would rather not open a console each time, install the browser extension. If installing an extension is awkward and you would rather not touch developer tools, use the cloud browser — but remember third-party sign-in does not work there. All three store the same thing, and a channel behaves the same once connected.

**Is the browser extension safe? What can it see?**
It takes the sign-in credential only from the panel page you opened, and hands it to the one NerveCenter account it is paired with. It does not read your other sites and does not run by itself in the background. Pairing uses a one-time code, after which you never type a server address again. The extension is distributed publicly as a zip — unzip it and you can read all of its code.

**Can the cloud browser see my password?**
It passes through it. You are typing into a browser on our server, so that browser handles your input. It is disposable and destroyed when the session ends, and we keep only the resulting session credential, not the password. If you would rather not, use F12 copy, where the password goes only to the panel itself.

**Why clear the site data afterwards instead of signing out?**
Because we refresh that sign-in on a schedule from then on. If the same one is still live in your browser, whichever side refreshes last invalidates the other. Clearing removes only local data and tells the panel nothing; signing out makes the panel void that sign-in. The access-token routes need no clearing.

**A channel says "needs re-authorisation" — now what?**
Click re-authorise on the channel page and copy the sign-in once more from the same upstream account. Syncing picks up again by itself.

**How often do balances and usage update?**
By default balances sync every 5 minutes, call records about every 10, group ratios are compared every 10 minutes and model lists every 30; the exact cadence is set by the platform administrator. In a hurry, use "sync now" on the channel page, at most twice a minute per channel.

**A key's used figure is labelled "our count" — what does that mean?**
Some panels count a key's spend only when that key carries a quota limit; for an unlimited key the figure they report stays at zero forever. In that case we show what our own records say instead, labelled as ours, and hovering tells you the date it starts from. It covers only usage since the channel was connected — we do not have what came before. Where the panel does report a figure, the panel's figure is used.

**Can platform administrators see my keys and credentials?**
Not your upstream sign-in credentials. An administrator can reveal a key's plaintext, but only one key at a time, only after two-step verification, and every reveal is written to the audit log. You also get a security alert.

**Does the health page cost me money?**
No. The numbers come from the panel's own statistics; we never send test requests with your keys.

**I forgot my password, or lost both my authenticator and my recovery codes.**
Email is not enabled on this site, so there is no self-service recovery — contact whoever runs the site. Once two-step verification is on, keep the recovery codes somewhere safe.

**Does deleting a channel affect my account on the panel?**
No, it removes only the credential and synced data on our side. If you connected with an access token, that token is still valid on the panel — revoke the one named NerveCenter under the panel's security → access tokens.

---

© NerveCenter. All rights reserved. See [LICENSE](../LICENSE). This document describes the hosted service at https://nvcenter.cc.
