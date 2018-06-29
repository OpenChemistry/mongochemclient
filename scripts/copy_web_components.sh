#! /bin/bash
components="molecule-moljs
vibrational-spectrum
"


components_dir=public/components

if [ -d "$components_dir" ]; then
  rm -rf $components_dir
fi
mkdir $components_dir

for component in ${components}; do
  from_dir=node_modules/@openchemistry/${component}/dist
  to_dir=${components_dir}/${component}
  if [ -d "$from_dir" ]; then
    cp -R $from_dir $to_dir
  fi
done;

