
describe("pow.1", function () {
    it("2^3, 3^4", function () {
        assert.equal(pow(2, 3), 8);
        assert.equal(pow(3, 4), 81);
    });
    it("2^8", function () {
        assert.equal(pow(2, 8), 256);
    });
});

// nested testing
describe("pow.2", function () {
    describe("case 1", function () {
        before(() => console.log("testing starts"));
        after(() => console.log("testing ends"));
    
        beforeEach(() => console.log("each starts"));
        afterEach(() => console.log("each ends"));

        it("10^10", function () {
            assert.equal(pow(10, 10), 10000000000);
        });
        it("10^5", function () {
            assert.equal(pow(10, 6), 1000000);
        });
    })
})