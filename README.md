# Bobby Transfer Command

A no-build, offline-first GitHub Pages PWA for Bobby's Santa Monica College transfer plan to UCI, UCLA, or USC for Fall 2028.

## What is included

- Five-tab mobile interface: Today, Plan, GE, Apply, and Playbook.
- Dynamic deadline countdown and current-term meter.
- Course completion, grade entry, transferable-unit count, and GPA target math.
- Cal-GETC allocation logic, including the Area 4 discipline rule and no double-counting.
- Application timeline, campus preparation checks, TAG/TAP/CCCP tracking, selectivity notes, and rejection workflow.
- Counselor log, editable target GPA, JSON backup/restore, and `.ics` calendar export.
- Local-only state, installable PWA manifest, safe-area support, and offline app-shell caching.

No package manager, command-line build, API key, database, or server is required.

## Publish with GitHub Pages

1. Create a new GitHub repository. A public repository is the simplest option for GitHub Pages.
2. Upload every file from this folder to the repository root. `index.html` must stay at the root.
3. Commit the files to the default branch, normally `main`.
4. Open the repository's **Settings**.
5. Open **Pages** under **Code and automation**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Choose the `main` branch and the `/ (root)` folder, then save.
8. GitHub will show the published address after deployment. Open that address once while online so the service worker can cache the app shell.

All paths are relative, so the app works from a normal project URL such as `https://username.github.io/repository-name/`.

## Add it to an iPhone home screen

1. Open the published GitHub Pages address in Safari.
2. Tap the Share button.
3. Choose **Add to Home Screen**.
4. Keep the displayed name or change it, then tap **Add**.
5. Launch it from the new home-screen icon. It opens in standalone mode without normal Safari browser chrome.

Open the app online at least once before testing airplane mode. The local app shell works offline after the service worker finishes its first installation.

## Data and backups

All user state is stored in the browser under the local-storage namespace `bobby.transferCommand.v1`. It does not sync automatically between devices or browsers.

Use **Settings → Export JSON** before changing phones, clearing Safari data, or moving to another browser. Use **Import JSON** on the new device.

The calendar button downloads `bobby-transfer-command.ics`. Import that file into Apple Calendar to create all stored milestones with reminders two days before each event.

## Updating the app

After changing any app file, update `CACHE_NAME` in `sw.js` to a new version, such as `bobby-transfer-command-v1.0.1`. Commit and publish the changes. The new service worker will replace the old cache.

## Verification rule

The app is static and offline-first. It does not silently fetch new admission requirements. Before every registration or application decision, verify the current catalog year using:

- ASSIST
- Official UC transfer requirements
- UC Transfer by Major
- The current UC TAG rules and matrix
- SMC Scholars and UCLA TAP requirements
- SMC Transfer Center, fairs, representative visits, and event-dependent admission events

Official pages and an SMC counselor's review of the actual transcript override static app copy.

At the August 5, 2026 source review, SMC's official Scholars application page listed the Winter/Spring 2027 application window as October 12 through December 15, 2026. The app flags that date for confirmation before filing.
