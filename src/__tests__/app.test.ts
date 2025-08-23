function soma(x: number, y: number): number {
    return x + y;
}

function somaDoisMaisTres(func: (x: number, y: number) => number): number {
    const z = func(2, 3);
    return z;
}

describe('funcao soma', () => {
    it('should return 5 when sum 2 + 3', async () => {
        const resposta = soma(2, 3);
        expect(resposta).toBe(5);
    });
});
describe('funcao somaDoisMaisTres', () => {
    it('should return 5', async () => {
        function simulaSoma(x: number, y: number): number {
            return 5;
        }
        const resposta = somaDoisMaisTres(simulaSoma);
        expect(resposta).toBe(5);
    });

});

// supertest
