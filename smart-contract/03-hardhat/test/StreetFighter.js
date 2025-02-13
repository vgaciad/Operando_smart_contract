const { assert, expect } = require("chai");

describe("StreetFighter", function () {

    before(async function () {

        const [owner, w1, w2] = await ethers.getSigners();

        this.deployer = owner;
        this.wallet1 = w1;
        this.wallet2 = w2;

        this.StreetFighter = await ethers.getContractFactory("StreetFighter");
    });

    beforeEach(async function () {

        this.streetFighter = await this.StreetFighter.connect(this.deployer).deploy();
    });

    it("Is Deployed", async function () {

        assert.isTrue(this.streetFighter !== undefined);
    });

    it("Testing getLife", async function () {

        const lifeOfSomebody = await this.streetFighter.getLife(this.wallet1);
        assert.equal(lifeOfSomebody, 0n, "Should have 0 because he never fought!")
    });

    it("Testing Start cannot be called by somebody but the Deployer", async function () {

        await expect(
            this.streetFighter.connect(this.wallet1).start(this.wallet1, this.wallet2)
        ).to.be.revertedWith("INVALID_SENDER");
    });

    it("Testing Start works when it is called by somebody the Deployer", async function () {

        await this.streetFighter.connect(this.deployer).start(this.wallet1, this.wallet2);

        let lifeOfSomebody1 = await this.streetFighter.getLife(this.wallet1);
        assert.equal(lifeOfSomebody1, 100n, "Should have 0 because he never fought!")

        let lifeOfSomebody2 = await this.streetFighter.getLife(this.wallet2);
        assert.equal(lifeOfSomebody2, 100n, "Should have 0 because he never fought!")
    });

    it("Testing Hit cannot be called by somebody but the first parameter wallet", async function () {

        await expect(
            this.streetFighter.connect(this.wallet2).hit(this.wallet1, this.wallet2, 50)
        ).to.be.revertedWith("INVALID_SENDER");
    });

    it("Testing Hit works when it is called by the first parameter wallet", async function () {

        await this.streetFighter.connect(this.deployer).start(this.wallet1, this.wallet2);
        await this.streetFighter.connect(this.wallet1).hit(this.wallet1, this.wallet2, 25);

        lifeOfSomebody1 = await this.streetFighter.getLife(this.wallet1);
        assert.equal(lifeOfSomebody1, 100n, "Should have 100 because he fought!")

        lifeOfSomebody2 = await this.streetFighter.getLife(this.wallet2);
        assert.equal(lifeOfSomebody2, 75n, "Should have 75 because he was hit!")
    });

    it("Testing Hit exceeds 100", async function () {

        await this.streetFighter.connect(this.deployer).start(this.wallet1, this.wallet2);
        await this.streetFighter.connect(this.wallet1).hit(this.wallet1, this.wallet2, 110);

        lifeOfSomebody1 = await this.streetFighter.getLife(this.wallet1);
        assert.equal(lifeOfSomebody1, 100n, "Should have 100 because he fought!")

        lifeOfSomebody2 = await this.streetFighter.getLife(this.wallet2);
        assert.equal(lifeOfSomebody2, 0n, "Should have 0 because he was hit!")
    });

    it("Testing Started and Hit events at the player", async function () {

        await expect(
            this.streetFighter.connect(this.deployer).start(this.wallet1, this.wallet2)
        ).to.emit(this.streetFighter, "Started");

        await expect(
            this.streetFighter.connect(this.wallet1).hit(this.wallet1, this.wallet2, 110)
        ).to.emit(this.streetFighter, "Hit");
    });

    it("Testing Dead event at the player", async function () {

        await this.streetFighter.connect(this.deployer).start(this.wallet1, this.wallet2);

        const tx = this.streetFighter.connect(this.wallet1).hit(this.wallet1, this.wallet2, 110);

        await expect(tx).to.emit(this.streetFighter, "Hit");
        await expect(tx).to.emit(this.streetFighter, "Dead");
    });

    it("Testing Hit when dead", async function () {

        await this.streetFighter.connect(this.deployer).start(this.wallet1, this.wallet2);
        await this.streetFighter.connect(this.wallet1).hit(this.wallet1, this.wallet2, 110);

        await expect(
            this.streetFighter.connect(this.wallet2).hit(this.wallet2, this.wallet1, 50)
        ).to.be.revertedWith("USER_IS_DEAD");
    });

    it("Testing Hit when dead", async function () {

        await this.streetFighter.connect(this.deployer).start(this.wallet1, this.wallet2);
        await this.streetFighter.connect(this.wallet1).hit(this.wallet1, this.wallet2, 50);
        await this.streetFighter.connect(this.wallet1).hit(this.wallet1, this.wallet2, 55);

        await expect(
            this.streetFighter.connect(this.wallet2).hit(this.wallet2, this.wallet1, 50)
        ).to.be.revertedWith("USER_IS_DEAD");
    });
});