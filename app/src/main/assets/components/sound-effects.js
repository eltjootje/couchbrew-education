const SampleBox = class {
    #player
    #samples

    constructor(audioElement) {
        this.#player = audioElement;
        this.#samples = {}
    }

    load(samples) {
        Object.keys(samples).forEach((key) => {
            this.#samples[key] = this.getAudioUrl(samples[key]);
            console.log("loaded", key, this.#samples[key]);
        });
    }

    play(tag) {
        if (this.#samples[tag] === undefined) {
            console.log("Unknown sample", tag);
            return;
        }

        this.#player.src = this.#samples[tag];
        this.#player.load();

        const playPromise = this.#player.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("playing", tag);
            }).catch((error) => {
                console.log("error: can not play", tag, error.message);
            });
        } else {
            console.log("can not play", tag);
        }
    }

    getAudioUrl(sample) {
        if (sample.startsWith("./audio/")) {
            return sample;
        }

        return `./audio/${sample}`;
    }
}

export {
    SampleBox
};