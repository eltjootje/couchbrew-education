
const Image = class {
    #image
    #fImage
    #scale

    constructor(image, scale = 0.5) {
        this.#image = image;
        this.#fImage = null;
        this.#scale = scale;
    }

    async prepare() {
        const p = new Promise((resolve, reject) => {
            fabric.Image.fromURL(this.getImageUrl(), (fImage) => {
                console.log("preparing: "+fImage);
                this.#fImage = fImage;
                fImage.hasControls = false;
                fImage.hasBorders = false;
                fImage.scale(this.#scale);
                resolve(fImage);
            });
        });

        this.#fImage = await p;

        return this.#fImage;
    }

    paint(fabricCanvas) {
        if (this.#fImage !== null) {
            fabricCanvas.add(this.#fImage);
        }
    }

    getImageUrl() {
        if (this.#image.startsWith("./images/")) {
            return this.#image;
        }

        return `./images/${this.#image}`;
    }
};

const Text = class {
    #text
    #fText

    constructor(text) {
        this.#text = text;
        this.#fText = null;
    }

    get text() {
        return this.#text;
    }

    async prepare() {
        this.#fText = new fabric.Text(this.#text, {
          fontFamily: 'Comic Sans',
          left: 64,
          top: 120,
          originX: 'center'
        });
        this.#fText.hasControls = false;
        this.#fText.hasBorders = false;

        return this.#fText;
    }

    paint(fabricCanvas) {
        if (this.#fText !== null) {
            fabricCanvas.add(this.#fText);
        }
    }
};

const Word = class {
    #text
    #image
    #config

    #fGroup
    #eventListeners

    constructor(text, image, config = {presentation: "both"}) {
        this.#text = typeof text === Text ? text : new Text(text);
        this.#image = typeof image === Image ? image : new Image(image);
        this.#config = config;
        this.#eventListeners = {"match": []};
    }

    async prepare() {
        const fText = await this.#text.prepare();
        fText.lpLink = this;

        const fImage = await this.#image.prepare();
        fImage.lpLink = this;

        fText.on("lp:intersected:enter", (options) => {
            if (options.by.lpLink !== this && options.by.lpLink.#text.text === this.#text.text) {
               console.log(`match for ${this.#text.text}`);
               this.fire("match", {by: this})
            }
        });
        fText.on("lp:intersected:exit", (options) => {
            console.log("text lp:interesected:exit");
        });
        fImage.on("lp:intersected:enter", (options) => {
            if (options.by.lpLink !== this && options.by.lpLink.#text.text === this.#text.text) {
               console.log(`match for ${this.#text.text}`);
               this.fire("match", {by: this})
            }
        });
        fImage.on("lp:intersected:exit", (options) => {
            console.log("image lp:interesected:exit");
        });

        fText.on("lp:intersecting:enter", (options) => {
        });
        fText.on("lp:intersecting:exit", (options) => {
            console.log("text lp:interesecting:exit");
        });
        fImage.on("lp:intersecting:enter", (options) => {
            console.log("image lp:interesecting:enter");
        });
        fImage.on("lp:intersecting:exit", (options) => {
            console.log("image lp:interesecting:exit");
        });

        this.#fGroup = new fabric.Group([fText, fImage]);
        this.#fGroup.hasControls = false;
        this.#fGroup.hasBorders = false;

        return this.#fGroup;
    }

    on(event, listener) {
        const index = this.#eventListeners[event].indexOf(listener);

        if(index === -1) {
            this.#eventListeners[event].push(listener);
        } else {
            this.#eventListeners[event][index] = listener;
        }
    }

    fire(event, options) {
        this.#eventListeners[event].forEach((listener) => listener(event, options));
    }

    paint(fabricCanvas) {
        if (this.#config.presentation === "both" && this.#fGroup !== null) {
            fabricCanvas.add(this.#fGroup);
        }

        if (this.#config.presentation === "image") {
            this.#image.paint(fabricCanvas);
        }

        if (this.#config.presentation === "text") {
            this.#text.paint(fabricCanvas);
        }
    }
};


export {
    Image,
    Text,
    Word
 };


