NODE=node
if [[ ${OSTYPE} =~ linux ]] ; then
  NODE=nodejs
fi

for name in home stats grades import ; do
  ${NODE} ./node_modules/browserify/bin/cmd.js web/static/${name}View.js -o web/static/${name}.js
done


