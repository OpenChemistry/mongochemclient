// Pure state selection
export const getMolecules = state => state.molecules.molecules;

export const getMoleculesById = state => state.molecules.byId;

export const byInchiKey = state => state.molecules.byInchiKey;

export const error = state => state.molecules.error;
