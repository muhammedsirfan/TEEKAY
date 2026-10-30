# TEEKAY HARDWARE & PLYWOOD – Website

Static website (HTML + CSS + JS). No build step needed.
Shop: South Bazar, Kannur, Kerala.

## Files
```
index.html
style.css
script.js
logo.jpg
.nojekyll
images/
  storefront.jpg
  showroom.jpg
  owner.jpg
```
Upload everything, **including the `images` folder and `logo.jpg`**, to the repository root.

## Easy edits
- **Phone / WhatsApp numbers:** search `index.html` for `9847606446` and `8129034945` (and `script.js` reads the numbers from the form dropdown).
- **Map:** the map in the "Visit" section searches for "TEEKAY HARDWARE & PLYWOOD South Bazar Kannur". If the pin isn't exact, open your shop on Google Maps → Share → Embed a map → copy the `src="..."` link and paste it into the `<iframe src="...">` in `index.html`.
- **Photos:** replace the files in `images/` with the same names.

## Publish on GitHub Pages
1. Create a new repository on GitHub (e.g. `teekay-website`).
2. Upload all files and the `images` folder to the repository root.
3. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, select branch `main` and folder `/ (root)`, then **Save**.
4. Wait a minute – your site goes live at `https://<username>.github.io/<repo>/`.

## Connect your custom domain
1. In **Settings → Pages → Custom domain**, enter your domain (e.g. `www.yourdomain.com`) and Save. GitHub creates a `CNAME` file automatically.
2. At your domain registrar's DNS settings:
   - For `www`: add a **CNAME** record pointing to `<username>.github.io`
   - For the root domain: add **A** records pointing to
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. After DNS updates (a few minutes up to 24 hours), tick **Enforce HTTPS** in the Pages settings.
