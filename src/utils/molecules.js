import { get } from 'lodash-es';

export function has3dCoords(molecule) {
  const coords = get(molecule, 'cjson.atoms.coords.3d')
  if (coords === undefined || coords.length == 0)
    return false

  return true
}
