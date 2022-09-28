import { RecursiveMenu } from '../display/RecursiveMenu';
import { CHAR } from '../display/Terminal';
import { DEBUG } from '../env';
import { Game } from '../Game';
import { AstroObject, SpaceObject } from '../model/objects/SpaceObject';
import { generateNewSystem, StarSystem } from '../model/objects/StarSystem';
import { Color } from '../platform/Color';
import { Keys } from '../platform/Keys';
import { DrawContext, UpdateContext } from '../Update';
import { Mathx, Random, SeededRandomSource } from '../utils';
import { lazy } from '../utils/lazy';
import { Vec2, Vec3 } from '../utils/Vec';
import { GameScreen } from './GameScreen';

function byX(a: SpaceObject, b: SpaceObject) {
    return a.position.x - b.position.x;
}

export class SystemOverviewScreen implements GameScreen {

    readonly name = 'System';
    private get system(): StarSystem { return this.game.simulation.system; }

    constructor(private game: Game) {
    }

    private menu: RecursiveMenu<SpaceObject> = new RecursiveMenu(
        () => [this.system, ...this.system.children].sort(byX), {
        next: Keys.ArrowRight,
        prev: Keys.ArrowLeft,
        enter: Keys.ArrowDown,
        exit: Keys.ArrowUp,
        recurse: o => {
            if (o instanceof AstroObject && o !== this.menu.top(1)?.selected) {
                if (o === this.system) {
                    return [o].sort(byX);
                }
                return [o, ...o.children].sort(byX);
            }
        },
        onLevelChange: () => this.ema = 0,
    });

    onShow(): void {
        console.log('showing', this);
    }

    update(ctx: UpdateContext): void {
        const { kbs } = ctx;
        this.menu.update(ctx);
        //this.menu.top(0)!.items.sort((a, b) => a.position.x - b.position.x);

        if (kbs.isPressed(Keys.KeyR)) {
            this.game.simulation.newSystem(generateNewSystem());
        }
    }

    private center = new Vec2(0, 0);
    private cameraZ = -1;
    private ema = 1;
    private rng = new SeededRandomSource()

    draw(ctx: DrawContext): void {
        const { term } = ctx;
        const vec = new Vec3(0, 0, 0);

        const W = term.width;
        const H = term.height;
        const L = 0, T = 0;
        const selected = this.menu.selected;
        const topMenu = this.menu.top(0)!;
        const center = this.menu.top(1)?.selected ?? selected.parent ?? this.system;
        const systemRadius = this.system.viewRadius()
        const furthest = lazy(topMenu.items).max((a, b) => a.distanceTo(center) - b.distanceTo(center))!
        const cameraZ = Math.max(
            furthest.distanceTo(center),
            center instanceof AstroObject ? center.radius : 10,
        );

        this.ema = Math.min(1.0, Mathx.lerp(this.ema, 2, 0.014))
        this.center.mix(center.position, this.ema);
        this.cameraZ = this.cameraZ < 0 ? cameraZ : Mathx.lerp(this.cameraZ, cameraZ, 0.1);

        const project = (vec: Vec3) => {
            vec.sub(this.center.x, this.center.y, 0);
            vec.x *= 1 / vec.z;
            vec.y *= 1 / vec.z;
            vec.scale(0.4 * W).scaleY(1 / 4).add(W / 2, H / 2 + T, 0);
            return vec;
        }

        this.rng.seed = 123;
        const starCount = 500;
        for (let i = 0; i < starCount; i++) {

            const starsAway = 1e13;
            vec.x = (this.rng.unif01() * 2 - 1) * systemRadius * starsAway / 1e11;
            vec.y = (this.rng.unif01() * 2 - 1) * systemRadius * starsAway / 1e11;
            vec.z = (i / starCount + 1) * starsAway;

            const intensity = Math.pow(this.rng.unif01(), 2) * 150 + 50;
            const n = Math.abs(this.rng.randint());
            vec.z += this.cameraZ;

            project(vec);

            let x = Math.round(vec.x);
            let y = Math.round(vec.y);

            if (x < 0 || x >= W) continue;
            if (y < 0 || y >= H) continue;

            x = Math.abs(x) % W
            y = Math.abs(y) % H

            const color = Color.fromRgb(intensity, intensity, intensity);
            if (term.grid[y][x].charCode === '.'.charCodeAt(0)) {
                term.drawString(x, y, ':', color);
            } else {
                term.drawString(x, y, ['.', "'", '`', ','][n % 4], color);
            }
        }

        const objects = [this.system, ...this.system.findAllChildren()];
        objects.sort((a, b) => a.position.y - b.position.y);

        for (let obj of objects) {
            const { x, y } = project(vec.set(obj.position.x, obj.position.y, this.cameraZ));
            const showLabel = obj === center || obj.parent == center;

            if (showLabel) term.drawCenteredString(x, y - 1, obj.name);
            if (obj === selected) {
                term.drawCenteredString(x, y - 1, `${CHAR.arrowLeft} ${obj.name} ${CHAR.arrowRight}`, Color.DarkGreen);
                term.drawCenteredString(x, y, '[ ]', Color.fromRgb(0, 255, 0));
            }

            term.drawCenteredString(x, y, String.fromCharCode(7), Color.White);
        }

        term.print('Current system: ');
        term.println(`${this.system.name}`, this.system.star.color);

        if (DEBUG) term.withFormat(() => {
            term.foreground = Color.White;
            term.background = Color.DarkRed;
            term.println(`ema: ${this.ema}`);
            term.println(`center: ${center.name}`);
            term.println(`furthest: ${furthest.name} ${cameraZ.toFixed(0)}`);
            term.println(`zoom: ${this.cameraZ.toFixed(0)}`);
            term.cursorY++;
            term.println(`menu:\n${this.menu.menus.map(m => lazy(m.items).map(i => i.name).toArray().toString()).join('\n')}`);
            term.cursorY++;
            for (let item of topMenu.items) {
                term.println(`${center.name} - ${item.name} = ${item.distanceTo(center).toFixed(0)}`);
            }
        })

    }
}

