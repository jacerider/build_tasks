# Instructions

## Ash Theme

### Remove from existing site

```
/themes/ash/config/dev/
/themes/ash/node_modules
/themes/ash/package.json
/themes/ash/package-lock.json
```

### Add from repo to existing site

Merge in all files from this repo contained in the /themes/ash directory.

Edit /themes/ash/config/dev/config.json to make sure paths are pointing
correctly to aeon.

## eXo Theme

### Remove from existing module

```
/modules/custom/CLIENTCODE/.eslintrc
/modules/custom/CLIENTCODE/config.json
/modules/custom/CLIENTCODE/example.config.local.json
/modules/custom/CLIENTCODE/node_modules
/modules/custom/CLIENTCODE/package.json
/modules/custom/CLIENTCODE/package-lock.json
```

### Add from repo to existing site

Merge in all files from this repo contained in the /modules/custom/CLIENTCODE
directory.

Edit /modules/custom/CLIENTCODE/gulpfile.js and update EXOTHEMENAME to the
name of the folder found within /modules/custom/CLIENTCODE/css/.

# Building

## Local

Single build: `gulp`
Watch: `gulp watch`

## DDEV

Single build: `gulp ddev`
Watch: `gulp ddevWatch`
