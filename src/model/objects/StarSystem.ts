import { Color } from '../../platform/Color';
import { Rng } from '../../utils';
import { lazy } from '../../utils/lazy';
import { Ship } from '../ship/Ship';
import { OrbitsParentFeature } from './ObjectFeatures';
import { AstroObject } from './SpaceObject';


type StarOptions = {
    name: string;
    description?: string;
    radius: number,
    mass: number,
    power?: number;
    color: Color;
};

export class StarSystem extends AstroObject {

    readonly ships: Ship[] = [];

    constructor(
        readonly star: Readonly<StarOptions>,
    ) {
        super(star.name, star.radius, star.mass, star.description);
    }

    private explored_ = 0;
    private exploring_ = false;
    doExploration(amount: number) {
        this.explored_ += amount;
        this.exploring_ = true;
    }

    maxRadius() {
        const children = this.findAllChildren();
        return lazy(children).map(o => o.position.length()).max() ?? this.star.radius;
    }
}


export function generateNewSystem() {

    const unif = Rng.uniform;
    const gaus = Rng.gaussian;

    const sol = new StarSystem({
        name: 'Sol',
        radius: 695.7e6,
        mass: 1.989e30,
        color: Color.fromRgb(255, 250, 230),
    });

    const angle = unif(0, 2 * Math.PI);

    const mercury = new AstroObject('Mercury', 2.439e6, 3.3e23);
    mercury.features.addNew(OrbitsParentFeature, 57.9e9, angle.sample());

    const venus = new AstroObject('Venus', 6.05e6, 4.86e24);
    venus.features.addNew(OrbitsParentFeature, 108e9, angle.sample());

    const earth = new AstroObject('Earth', 6.378e6, 5.97e24);
    earth.features.addNew(OrbitsParentFeature, 149e9, angle.sample());
    {
        const moon = new AstroObject('Moon', 1.737e6, 7.34e22);
        moon.features.addNew(OrbitsParentFeature, 384e6);
        earth.addChild(moon);
    }

    const mars = new AstroObject('Mars', 3.389e6, 0.64e24);
    mars.features.addNew(OrbitsParentFeature, 227e9, angle.sample());
    {
        const phobos = new AstroObject('Phobos', 11e3, 1e16);
        phobos.features.addNew(OrbitsParentFeature, 9.37e6);
        const deimos = new AstroObject('Deimos', 6.2e3, 1.4e15);
        deimos.features.addNew(OrbitsParentFeature, 23e6);
        mars.addChild(phobos, deimos);
    }

    sol.addChild(mercury, venus, earth, mars);
    return sol;
}


// type TextColors = { readonly fg?: Color; readonly bg?: Color; };
// export class SystemType {
//     constructor(
//         public readonly name: string,
//         public readonly opt: SystemOptions,
//         public readonly locations: LocationType[]
//     ) { }
//     create() {
//         return new StarSystem(this, this.opt.starPower.sample(), { ...this.opt });
//     }
//     newLocation(diffMultiplier = 1): SpaceLocation {
//         const locType = Random.select(this.locations);
//         return locType.create(diffMultiplier);
//     }
// }
// export type SYSTEMS = typeof SYSTEMS;
// export const SYSTEMS = once(() => ({
//     redDwarf: new SystemType('Red Dwarf', { starPower: 1, count: gaus(5, 1), fg: Color.DarkRed }, Object.values(LOCATIONS)),
//     blackHole: new SystemType('Black Hole', { starPower: 0, count: unif(1, 10), fg: Color.Black, bg: Color.DarkBlue }, Object.values(LOCATIONS)),
//     redGiant: new SystemType('Red Giant', { starPower: 3, count: unif(1, 10), fg: Color.LightRed }, Object.values(LOCATIONS)),
// }));