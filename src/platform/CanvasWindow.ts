import { assert } from "../utils";

type CanvasWindowEvent = 'resize';
type ResizeHandler = () => void;

export class CanvasWindow {

    public readonly canvas: HTMLCanvasElement;

    get width() { return this.canvas.width; }
    get height() { return this.canvas.height; }

    constructor(public readonly container: HTMLElement) {
        assert(container, 'Container must be defined.');

        this.canvas = document.createElement('canvas');
        this.onResize();

        window.addEventListener('resize', () => this.onResize());
        container.appendChild(this.canvas);
    }

    private onResize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    }

}
