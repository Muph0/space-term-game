// import { Describable } from '../../Update';
// import { Rng } from '../../utils';
// import { Container } from '../../utils/Inventory';
// import { RESOURCES, ResourceHarvestInfo, ResourceRanges } from '../Resource';
// import { Ship } from '../ship/Ship';

// export class SpaceLocation implements Describable {
//     readonly ships = new Container<Ship, SpaceLocation>(this, Infinity);

//     constructor(
//         public readonly name: string,
//         public readonly difficulty: number,
//         public readonly resources: ResourceHarvestInfo[]
//     ) { }

//     get description() { return this.name; }
// }

// type LocationOptions = {
//     /** Distance from star, should roughly translate to (minutes until discovery) / sqrt(size) */
//     diff: Rng;
//     /** Size increases capacity and decreases discovery time */
//     size: Rng;
// };
// export class LocationType {

//     constructor(
//         public readonly name: string,
//         public readonly opt: LocationOptions,
//         public readonly resources: ResourceRanges
//     ) { }

//     create(diffMultiplier: number) {
//         const harvestParams = [];
//         var k: keyof RESOURCES;
//         for (k in this.resources) {
//             const range = this.resources[k]!;
//             const material = RESOURCES[k];
//             const abundance = range.sample();
//             harvestParams.push(material.resInfo(abundance));
//         }

//         return new SpaceLocation(this.name, this.opt.diff.sample() * diffMultiplier, harvestParams);
//     }
// }


