import { get } from 'lodash-es';

export function has3dCoords(molecule) {
  const coords = get(molecule, 'cjson.atoms.coords.3d')
  return coords !== undefined && coords.length > 0
}
