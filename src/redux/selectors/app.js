import { createSelector } from 'reselect'
import { getMoleculesById } from './molecules'

export const getSelectedMoleculeId = (state) => state.app.selectedMoleculeId;


export const getSelectedMolecule = createSelector(
    getSelectedMoleculeId, getMoleculesById,
    (id, molecules) => {
      if (id != null) {
        if (id in molecules) {
          return molecules[id];
        }
      }

      return null;
    }
  )

