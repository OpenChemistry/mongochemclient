import { get } from 'lodash-es';

export function has3dCoords(molecule) {
  const coords = get(molecule, 'cjson.atoms.coords.3d')
  return coords !== undefined && coords.length > 0
}

export function uploadCalculation(file) {
  let fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = (e) => {
      const body = e.target.result;
      const data = {
        body,
        'name': file.name,
        'size': file.size
      }
      resolve({data})
    }
    fileReader.readAsText(file);
  });
}
