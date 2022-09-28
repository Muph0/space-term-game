import { FacilityType } from "./Facility";
import { ProdictionFacilityType } from "./Production";
import { ExploreFacilityType } from "./Explore";
import { DriveFacilityType } from "./DriveFacility";
import { TEXT } from "../../env";
import { once } from "../../utils";

export type FACILITIES = {
    fusion_1: ProdictionFacilityType,
    fusion_2: ProdictionFacilityType,
    radar_1: FacilityType,
    ringDrive_1: DriveFacilityType,
}

export const FACILITIES: () => FACILITIES = once(() => ({
    fusion_1: new ProdictionFacilityType('Fusion reactor', 'Power', { tier: 1, maxPower: 1, out: { energy: 2_100, }, capacity: { energy: 500 }, upgrade: { to: 'fusion_2', cost: { steel: 20_000 } } }),
    fusion_2: new ProdictionFacilityType('Fusion reactor', 'Power', { tier: 2, maxPower: 1, out: { energy: 5_100, }, capacity: { energy: 500 }, }),
    radar_1: new ExploreFacilityType('Radar array', { tier: 1, maxPower: 5, startPower: 1, explore: 10, in: { energy: 2_000 } }),
    ringDrive_1: new DriveFacilityType('Alcubierre mass driver', { tier: 1, maxPower: 5, startPower: 0, in: { energy: 2_000 }, desc: TEXT.facility.ringDrive }),
}));
