import { Game } from '../Game';
import { Drawable, Updatable } from '../Update';
import { SelectStationScreen } from './SelectStation';

export interface GameScreen extends Updatable, Drawable {
    readonly name?: string;
    onShow(): void;
}
