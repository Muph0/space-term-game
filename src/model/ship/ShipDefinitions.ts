import { once } from "../../utils";
import { MODULES } from "./module/ShipModule";
import { PreDressedShip, ShipBodyType } from "./Ship";


export type SHIP_BODY = typeof SHIP_BODY;
export const SHIP_BODY = once(() => ({
    drone1: new ShipBodyType('Drone I', { hp: 60, size: 1, speed: 1, modcap: 2 }),
    drone2: new ShipBodyType('Drone II', { hp: 160, size: 2, speed: 1, modcap: 3 }),
    drone3: new ShipBodyType('Drone III', { hp: 260, size: 3, speed: 1, modcap: 4 }),
}));

export type SHIPS = typeof SHIPS;
export const SHIPS = once(() => ({
    miningDrone: new PreDressedShip(SHIP_BODY().drone1, [MODULES.miningLaser.prep(1)], 'Mining'),
    explorerDrone: new PreDressedShip(SHIP_BODY().drone1, [MODULES.miningLaser.prep(1)], 'Explorer'),
}));
