# NWB Vending — deploy gate

**Everything is local until Kelly_NWB says otherwise.**

## Default

- All edits stay on disk under `D:\GrokBuild\nwb-vending`
- Agent does **not** `git push`
- Kelly reviews when ready

## Kelly's go-live codes (building slowly)

| Signal | Meaning |
|--------|---------|
| Message ends with **`28`** | OK to **ask** about pushing to GitHub. Not auto-push. |
| **`push28`** / **`liv28`** | Stronger deploy intent — confirm, then push if Kelly confirms |
| **`push`**, **`go live`**, **`publish`** | Push when Kelly says so plainly |

No `28` = local only. No ask about deploy.

## Not deploy approval

- "lets try it", "yes", "do it", design approval → **local build only**

## Agent reports (no 28)

"Done locally. Open `path`."