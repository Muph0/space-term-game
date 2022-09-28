import { once } from '../../utils';
import { FACILITIES } from '../facility';
import { SHIPS } from '../ship/ShipDefinitions';
import { StationType } from './Station';


export type STATIONS = typeof STATIONS;
export const STATIONS = once(() => ({
    auruclus: new StationType('Auruclus',
        [FACILITIES().fusion_1, FACILITIES().radar_1, FACILITIES().ringDrive_1], 5,
        [
            SHIPS().miningDrone,
            SHIPS().miningDrone,
            SHIPS().explorerDrone,
        ], 8),
    navier: new StationType('Navier', [FACILITIES().fusion_1], 6, [], 6),
}));
