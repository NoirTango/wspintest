for name in home stats grades import ; do
  nodejs ./node_modules/browserify/bin/cmd.js web/static/${name}View.js > web/static/${name}.js
done


