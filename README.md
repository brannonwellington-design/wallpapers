# Listen Labs Wallpapers

A minimal wallpaper gallery for coworkers to browse and download Listen Labs desktop wallpapers.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run dev` automatically generates thumbnails, previews, and the manifest before starting the server. The first run may take a minute while images are processed.

If port 3000 is already in use:

```bash
npm run dev -- -p 3001
```

## Adding wallpapers

1. Drop new PNG files into `public/wallpapers/paper/` or `public/wallpapers/blue/`
2. Run `npm run generate` to rebuild thumbnails, previews, and the manifest
3. Redeploy

## Deploy to Vercel

1. Push this repo to [github.com/brannonwellington-design/wallpapers](https://github.com/brannonwellington-design/wallpapers)
2. Import the repo in Vercel
3. Use the default Next.js build settings (`npm run build`)

The build step automatically generates thumbnails and previews from the source PNGs.
