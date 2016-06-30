# http://www.mylifeforthecode.com/using-electron-packager-to-package-an-electron-app/
# http://jbavari.github.io/blog/2015/09/09/releasing-electron-for-windows/

rm -rf ./ReQLPro-win32-ia32
rm -rf ./ReQLPro-win32-x64

electron-packager . ReQLPro --platform=win32 --arch=all --icon=./public/reql-icon.ico
# electron-packager . ReQLPro --platform=win32 --arch=all