#! /bin/bash
components="@openchemistry/molecule-moljs
@openchemistry/vibrational-spectrum
split-me
"


components_dir=public/components

if [ -d "$components_dir" ]; then
  rm -rf $components_dir
fi
mkdir $components_dir

for component in ${components}; do
  from_dir=node_modules/${component}/dist
  to_dir=${components_dir}/${component}
  if [ -d "$from_dir" ]; then
    mkdir -p ${to_dir}
    cp -R ${from_dir}/* ${to_dir}/.
  fi
done;

