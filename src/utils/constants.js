import {Enum} from 'enumify';


export class CalculationState extends Enum {}
CalculationState.initEnum(['initializing', 'queued', 'running', 'terminated',
                   'terminating', 'unexpectederror', 'error', 'complete',
                   'uploading']);
