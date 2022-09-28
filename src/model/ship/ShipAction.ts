import { Action } from "../../utils/FutureAction";
import { Container } from "../../utils/Inventory";
import { Ship } from "./Ship";

export interface ShipAction extends Action {
    readonly ship: Ship;
}
export class ShipGotoAction implements ShipAction {

    constructor(
        readonly ship: Ship,
        readonly target: Container<Ship>,
    ) { }

    do() {
        if (this.target.availableSpace < this.ship.itemSize) {
            return true;
        }

        this.target.put(this.ship);
    }
}

