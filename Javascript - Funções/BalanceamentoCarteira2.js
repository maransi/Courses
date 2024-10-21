function BalanceamentoCarteira(composicao, aporte) {
    this.carteiraAtual = composicao.saldo;
    this.percentualComposicao = composicao.percentual
    this.aporte = aporte;
    this.novaCarteiraSemAporte = null;
    this.novaCarteiraComAporte = null;
    this.carteiraBalanceada = null;
    this.aporteDistribuido = null;

    this.execute = function () {

        this.aporteDistribuido = this.distribuiAporte(this.aporte);


        let carteiraTotalSemAporte = this.carteiraAtual.oportunidade +
            this.carteiraAtual.fundoImobiliario +
            this.carteiraAtual.acoes +
            this.carteiraAtual.risco;

        let carteiraTotalComAporte = this.carteiraAtual.oportunidade +
            this.carteiraAtual.fundoImobiliario +
            this.carteiraAtual.acoes +
            this.carteiraAtual.risco +
            aporte;

        this.novaCarteiraSemAporte = this.calculaPosicaoSemAporte(carteiraTotalSemAporte);

        this.novaCarteiraComAporte = this.calculaPosicaoComAporte(carteiraTotalComAporte);

        this.carteiraBalanceada = this.balanceia();

    };

    this.distribuiAporte = function (carteiraTotalSemAporte) {
        let distribuicaoAporte = {
            oportunidade: this.aporte * (this.percentualComposicao.oportunidade / 100),
            fundoImobiliario: this.aporte * (this.percentualComposicao.fundoImobiliario / 100),
            acoes: this.aporte * (this.percentualComposicao.acoes / 100),
            risco: this.aporte * (this.percentualComposicao.risco / 100)
        };

        return distribuicaoAporte;
    }

    this.calculaPosicaoSemAporte = function (carteiraTotalSemAporte) {
        let novaCarteiraSemAporte = {
            oportunidade: carteiraTotalSemAporte * (this.percentualComposicao.oportunidade / 100),
            fundoImobiliario: carteiraTotalSemAporte * (this.percentualComposicao.fundoImobiliario / 100),
            acoes: carteiraTotalSemAporte * (this.percentualComposicao.acoes / 100),
            risco: carteiraTotalSemAporte * (this.percentualComposicao.risco / 100)
        }

        return novaCarteiraSemAporte;

    }

    this.calculaPosicaoComAporte = function (carteiraTotalComAporte) {
        let novaCarteiraComAporte = {
            oportunidade: carteiraTotalComAporte * (this.percentualComposicao.oportunidade / 100),
            fundoImobiliario: carteiraTotalComAporte * (this.percentualComposicao.fundoImobiliario / 100),
            acoes: carteiraTotalComAporte * (this.percentualComposicao.acoes / 100),
            risco: carteiraTotalComAporte * (this.percentualComposicao.risco / 100)
        }

        return novaCarteiraComAporte;
    }

    this.balanceia = function () {
        let saldoAporte = this.aporte;
        let qtdSaldoCalculado = 0;
        let faixaCalculada = new Array();

        let carteiraBalanceada = {
            oportunidade: this.carteiraAtual.oportunidade,
            fundoImobiliario: this.carteiraAtual.fundoImobiliario,
            acoes: this.carteiraAtual.acoes,
            risco: this.carteiraAtual.risco
        };

        for (let index = 0; index < 4; index++) {
            if (index == 0) {
                if (carteiraBalanceada.oportunidade + this.aporteDistribuido.oportunidade < this.novaCarteiraComAporte.oportunidade) {
                    carteiraBalanceada.oportunidade = this.carteiraAtual.oportunidade + this.aporteDistribuido.oportunidade;

                    saldoAporte -= this.aporteDistribuido.oportunidade;
                    qtdSaldoCalculado += 1;
                    faixaCalculada.push("oportunidade");
                } else if (this.novaCarteiraComAporte.oportunidade > carteiraBalanceada.oportunidade) {
                    let saldoCalculado = this.novaCarteiraComAporte.oportunidade - carteiraBalanceada.oportunidade;

                    carteiraBalanceada.oportunidade = this.carteiraAtual.oportunidade + saldoCalculado;
                    saldoAporte -= saldoCalculado;
                    qtdSaldoCalculado += 1;
                    faixaCalculada.push("oportunidade");
                }
            } else if (index == 1) {
                if (carteiraBalanceada.fundoImobiliario + this.aporteDistribuido.fundoImobiliario < this.novaCarteiraComAporte.fundoImobiliario) {
                    carteiraBalanceada.fundoImobiliario = this.carteiraAtual.fundoImobiliario + this.aporteDistribuido.fundoImobiliario;

                    saldoAporte -= this.aporteDistribuido.fundoImobiliario;
                    qtdSaldoCalculado += 1;
                    faixaCalculada.push("fundoImobiliario");
                } else if (this.novaCarteiraComAporte.fundoImobiliario > carteiraBalanceada.fundoImobiliario) {
                    let saldoCalculado = this.novaCarteiraComAporte.fundoImobiliario - carteiraBalanceada.fundoImobiliario;

                    carteiraBalanceada.fundoImobiliario = this.carteiraAtual.fundoImobiliario + saldoCalculado;
                    saldoAporte -= saldoCalculado;
                    qtdSaldoCalculado += 1;
                    faixaCalculada.push("fundoImobiliario");
                }
            } else if (index == 2) {
                if (carteiraBalanceada.acoes + this.aporteDistribuido.acoes < this.novaCarteiraComAporte.acoes) {
                    carteiraBalanceada.acoes = this.carteiraAtual.acoes + this.aporteDistribuido.acoes;

                    saldoAporte -= this.aporteDistribuido.acoes;
                    qtdSaldoCalculado += 1;
                    faixaCalculada.push("acoes");
                } else if (this.novaCarteiraComAporte.acoes > carteiraBalanceada.acoes) {
                    let saldoCalculado = this.novaCarteiraComAporte.acoes - carteiraBalanceada.acoes;

                    carteiraBalanceada.acoes = this.carteiraAtual.acoes + saldoCalculado;
                    saldoAporte -= saldoCalculado;
                    qtdSaldoCalculado += 1;
                    faixaCalculada.push("acoes");
                }
            } else if (index == 3) {
                if (carteiraBalanceada.risco + this.aporteDistribuido.risco < this.novaCarteiraComAporte.risco) {
                    carteiraBalanceada.risco = this.carteiraAtual.risco + this.aporteDistribuido.risco;

                    saldoAporte -= this.aporteDistribuido.risco;
                    qtdSaldoCalculado += 1;
                    faixaCalculada.push("risco");
                } else if (this.novaCarteiraComAporte.risco > carteiraBalanceada.risco) {
                    let saldoCalculado = this.novaCarteiraComAporte.risco - carteiraBalanceada.risco;

                    carteiraBalanceada.risco = this.carteiraAtual.risco + saldoCalculado;

                    saldoAporte -= saldoCalculado;
                    qtdSaldoCalculado += 1;
                    faixaCalculada.push("risco");
                }
            }

        }

        return carteiraBalanceada;
    }
}

/*
const carteiraAtual = {
    oportunidade: 19182,
    fundoImobiliario: 122885,
    acoes: 52720,
    risco: 25498
}
*/
const carteiraAtual = {
    oportunidade: 23818,             // 9.20
    fundoImobiliario: 154293,        // 60
    acoes: 47337,                       // 20
    risco: 25861                        // 10.8

}
/*
const carteiraAtual = {
    oportunidade: 19815.43,             // 9.74
    fundoImobiliario: 133388.71,        // 59.63
    acoes: 45320.78,                       // 20
    risco: 25861.71                        // 10.63

}
*/
const carteira = {
    percentual: {
        oportunidade: 10,
        fundoImobiliario: 60,
        acoes: 20,
        risco: 10
    },
    saldo: carteiraAtual
}

let saldoCarteiraInicial = carteira.saldo.oportunidade +
    carteira.saldo.fundoImobiliario +
    carteira.saldo.acoes +
    carteira.saldo.risco;

let aporte = 1681;

console.log("Aporte");
console.log(aporte);


// console.log("Aporte Distribuido");
// console.log(aporteDistribuido);
let balanceamento;
let saldoCarteiraBalanceada;

while (aporte > 0.001) {

    balanceamento = new BalanceamentoCarteira(carteira, aporte);  // 9470

    balanceamento.execute();

    saldoCarteiraBalanceada = balanceamento.carteiraBalanceada.oportunidade +
        balanceamento.carteiraBalanceada.fundoImobiliario +
        balanceamento.carteiraBalanceada.acoes +
        balanceamento.carteiraBalanceada.risco;

    aporte -= saldoCarteiraBalanceada - saldoCarteiraInicial;

    saldoCarteiraInicial = saldoCarteiraBalanceada;

    carteira.saldo = balanceamento.carteiraBalanceada;

}

// Construa um objeto que tenha o total aportado e o resultado da carteira balanceada com o percentual de composição de cada um
let resultado = {
    totalAportado: aporte,
    carteiraBalanceada: {
        oportunidade: balanceamento.carteiraBalanceada.oportunidade.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        fundoImobiliario: balanceamento.carteiraBalanceada.fundoImobiliario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        acoes: balanceamento.carteiraBalanceada.acoes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        risco: balanceamento.carteiraBalanceada.risco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },
    percentualComposicao: {
        oportunidade: (balanceamento.carteiraBalanceada.oportunidade / saldoCarteiraBalanceada * 100).toFixed(2),
        fundoImobiliario: (balanceamento.carteiraBalanceada.fundoImobiliario / saldoCarteiraBalanceada * 100).toFixed(2),
        acoes: (balanceamento.carteiraBalanceada.acoes / saldoCarteiraBalanceada * 100).toFixed(2),
        risco: (balanceamento.carteiraBalanceada.risco / saldoCarteiraBalanceada * 100).toFixed(2)
    },
    novoAporte: {
        oportunidade: (balanceamento.carteiraBalanceada.oportunidade - carteiraAtual.oportunidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        fundoImobiliario: (balanceamento.carteiraBalanceada.fundoImobiliario - carteiraAtual.fundoImobiliario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        acoes: (balanceamento.carteiraBalanceada.acoes - carteiraAtual.acoes).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        risco: (balanceamento.carteiraBalanceada.risco - carteiraAtual.risco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }
};


console.log("Carteira Atual           ");
console.table(carteiraAtual);
console.log("Saldo da Carteira " + saldoCarteiraInicial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));



console.log("Resultado da Simulação");
console.table( resultado );
// console.log(resultado);
// console.log("Saldo da Carteira " + saldoCarteiraBalanceada.toLocale


// let formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
// let valorFormatado = formatador.format(valor);
