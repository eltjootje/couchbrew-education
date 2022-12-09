import {loadTemplate} from "./templates.js";
import {SampleBox} from "./sound-effects.js";
import {Word} from "../model/model.js";

const LuisterApp = class extends HTMLElement {
    constructor() {
        super();
        let template = document.getElementById('lp-luister-app-template');
        let templateContent = template.content;

        this.shadow = this.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {
        const $container = $(this.shadowRoot).find('.lp-luister-container');
        const $canvas = $(this.shadowRoot).find('.lp-luister-canvas');
        const fabricCanvas = new fabric.Canvas($canvas.get(0));
        fabricCanvas.selection = false;

        window.addEventListener('resize', resizeCanvas, false);

        function resizeCanvas() {
            console.log($container);
            fabricCanvas.setHeight($container.innerHeight());
            fabricCanvas.setWidth($container.innerWidth());
            fabricCanvas.renderAll();
        }

        const $player = $(this.shadowRoot).find('.lp-luister-player');
        const samples = new SampleBox($player.get(0));
        samples.load({
            "blurp": "blurp.m4a",
            "ijsje": "ijsje.m4a",
            "pling": "pling.m4a",
            "t-rex": "t-rex-roar.mp3"
        });

        const bag = new Word("tas", "boodschappentas.png", {presentation: "image"});
        const ijs1 = new Word("ijsje", "ijs.png", {presentation: "image"});
        const ijs2 = new Word("ijsje", "ijs.png", {presentation: "text"});

        this.prepare([bag, ijs1, ijs2]).then(() => {
            bag.paint(fabricCanvas);

            ijs1.paint(fabricCanvas);
            ijs1.on("match", (event, options) => {samples.play("pling")});
            ijs2.paint(fabricCanvas);
            ijs2.on("match", (event, options) => {samples.play("ijsje")});
        });

        fabricCanvas.on({
            'object:moving': onChange,
            'object:scaling': onChange,
            'object:rotating': onChange,
        });

        const intersections = {}

        function onChange(options) {
            options.target.setCoords();
            let intersects = intersections[options.target] !== undefined ? intersections[options.target] : [];

            fabricCanvas.forEachObject(function(obj) {
                if (obj === options.target) return;
                const index = intersects.indexOf(obj);

                if (options.target.intersectsWithObject(obj)) {
                     if (index === -1) {
                        intersects.push(obj);
                        obj.fire("lp:intersected:enter", {by: options.target});
                        options.target.fire("lp:intersecting:enter", {on: obj});
                    }
                } else {
                    if (index !== -1) {
                        intersects.splice(index, 1);
                        obj.fire("lp:intersected:exit", {by: options.target});
                        options.target.fire("lp:intersecting:exit", {on: obj});
                    }
                }

                if (intersects.length) {
                    intersections[options.target] = intersects;
                } else {
                    intersections[options.target] = undefined;
                }

                options.target.set('opacity' ,options.target.intersectsWithObject(obj) ? 0.5 : 1);
            });
        }

        resizeCanvas();
    }

    async prepare(words) {
        for (const word of words) {
            await word.prepare();
        }
    }
};

loadTemplate('./components/lp-luister-app.html', () => {
    customElements.define('lp-luister-app', LuisterApp);
});


