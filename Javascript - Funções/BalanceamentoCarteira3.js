class BalanceamentoCarteira {
    constructor(composicao, aporte) {
        this.carteiraAtual = composicao.saldo;
        this.percentualComposicao = composicao.percentual;
        this.aporte = aporte;
        this.novaCarteiraSemAporte = null;
        this.novaCarteiraComAporte = null;
        this.carteiraBalanceada = null;
        this.aporteDistribuido = null;
    }

    execute() {
        this.aporteDistribuido = this.distribuiAporte(this.aporte);

        const carteiraTotalSemAporte = this.calculaTotalCarteira(this.carteiraAtual);
        const carteiraTotalComAporte = carteiraTotalSemAporte + this.aporte;

        this.novaCarteiraSemAporte = this.calculaPosicao(carteiraTotalSemAporte);
        this.novaCarteiraComAporte = this.calculaPosicao(carteiraTotalComAporte);

        this.carteiraBalanceada = this.balanceia();
    }

    distribuiAporte() {
        return {
            oportunidade: this.aporte * (this.percentualComposicao.oportunidade / 100),
            fundoImobiliario: this.aporte * (this.percentualComposicao.fundoImobiliario / 100),
            acoes: this.aporte * (this.percentualComposicao.acoes / 100),
            risco: this.aporte * (this.percentualComposicao.risco / 100)
        };
    }

    calculaTotalCarteira(carteira) {
        return Object.values(carteira).reduce((acc, val) => acc + val, 0);
    }

    calculaPosicao(carteiraTotal) {
        return {
            oportunidade: carteiraTotal * (this.percentualComposicao.oportunidade / 100),
            fundoImobiliario: carteiraTotal * (this.percentualComposicao.fundoImobiliario / 100),
            acoes: carteiraTotal * (this.percentualComposicao.acoes / 100),
            risco: carteiraTotal * (this.percentualComposicao.risco / 100)
        };
    }

    balanceia() {
        let saldoAporte = this.aporte;
        const carteiraBalanceada = { ...this.carteiraAtual };

        const categorias = ['oportunidade', 'fundoImobiliario', 'acoes', 'risco'];

        categorias.forEach(categoria => {
            const aporteDistribuido = this.aporteDistribuido[categoria];
            const novaCarteiraComAporte = this.novaCarteiraComAporte[categoria];
            const carteiraAtual = this.carteiraAtual[categoria];

            if (carteiraBalanceada[categoria] + aporteDistribuido < novaCarteiraComAporte) {
                carteiraBalanceada[categoria] += aporteDistribuido;
                saldoAporte -= aporteDistribuido;
            } else if (novaCarteiraComAporte > carteiraBalanceada[categoria]) {
                const saldoCalculado = novaCarteiraComAporte - carteiraBalanceada[categoria];
                carteiraBalanceada[categoria] += saldoCalculado;
                saldoAporte -= saldoCalculado;
            }
        });

        return carteiraBalanceada;
    }
}

const carteiraAtual = {
    oportunidade: 25365.46,
    fundoImobiliario: 156170.95,
    acoes: 52720,
    risco: 26028.49
};

const carteira = {
    percentual: {
        oportunidade: 10,
        fundoImobiliario: 60,
        acoes: 20,
        risco: 10
    },
    saldo: carteiraAtual
};

let saldoCarteiraInicial = Object.values(carteira.saldo).reduce((acc, val) => acc + val, 0);
let aporte = 322000;

console.log("Aporte");
console.log(aporte);

let balanceamento;
let saldoCarteiraBalanceada;

while (aporte > 0.001) {
    balanceamento = new BalanceamentoCarteira(carteira, aporte);
    balanceamento.execute();

    saldoCarteiraBalanceada = Object.values(balanceamento.carteiraBalanceada).reduce((acc, val) => acc + val, 0);
    aporte -= saldoCarteiraBalanceada - saldoCarteiraInicial;
    saldoCarteiraInicial = saldoCarteiraBalanceada;
    carteira.saldo = balanceamento.carteiraBalanceada;
}

const formatCurrency = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const resultado = {
    totalAportado: aporte,
    carteiraBalanceada: {
        oportunidade: formatCurrency(balanceamento.carteiraBalanceada.oportunidade),
        fundoImobiliario: formatCurrency(balanceamento.carteiraBalanceada.fundoImobiliario),
        acoes: formatCurrency(balanceamento.carteiraBalanceada.acoes),
        risco: formatCurrency(balanceamento.carteiraBalanceada.risco)
    },
    percentualComposicao: {
        oportunidade: (balanceamento.carteiraBalanceada.oportunidade / saldoCarteiraBalanceada * 100).toFixed(2),
        fundoImobiliario: (balanceamento.carteiraBalanceada.fundoImobiliario / saldoCarteiraBalanceada * 100).toFixed(2),
        acoes: (balanceamento.carteiraBalanceada.acoes / saldoCarteiraBalanceada * 100).toFixed(2),
        risco: (balanceamento.carteiraBalanceada.risco / saldoCarteiraBalanceada * 100).toFixed(2)
    },
    novoAporte: {
        oportunidade: formatCurrency(balanceamento.carteiraBalanceada.oportunidade - carteiraAtual.oportunidade),
        fundoImobiliario: formatCurrency(balanceamento.carteiraBalanceada.fundoImobiliario - carteiraAtual.fundoImobiliario),
        acoes: formatCurrency(balanceamento.carteiraBalanceada.acoes - carteiraAtual.acoes),
        risco: formatCurrency(balanceamento.carteiraBalanceada.risco - carteiraAtual.risco)
    }
};

console.log("Carteira Atual");
console.table(carteiraAtual);
console.log("Saldo da Carteira " + formatCurrency(saldoCarteiraInicial));

console.log("Resultado da Simulação");
console.table(resultado);
