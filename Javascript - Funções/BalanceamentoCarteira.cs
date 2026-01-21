using System;

namespace BalanceamentoCarteiraApp
{
    public class Portfolio
    {
        public double Oportunidade { get; set; }
        public double FundoImobiliario { get; set; }
        public double Acoes { get; set; }
        public double Risco { get; set; }

        public Portfolio() { }

        public Portfolio(double oportunidade, double fundoImobiliario, double acoes, double risco)
        {
            Oportunidade = oportunidade;
            FundoImobiliario = fundoImobiliario;
            Acoes = acoes;
            Risco = risco;
        }

        public double Total()
        {
            return Oportunidade + FundoImobiliario + Acoes + Risco;
        }

        public Portfolio Clone()
        {
            return new Portfolio(Oportunidade, FundoImobiliario, Acoes, Risco);
        }
    }

    public class PercentualComposicao
    {
        public double Oportunidade { get; set; }
        public double FundoImobiliario { get; set; }
        public double Acoes { get; set; }
        public double Risco { get; set; }
    }

    public class Composicao
    {
        public PercentualComposicao Percentual { get; set; }
        public Portfolio Saldo { get; set; }
    }

    public class BalanceamentoCarteira
    {
        public Portfolio CarteiraAtual { get; }
        public PercentualComposicao PercentualComposicao { get; }
        public double Aporte { get; }

        public Portfolio NovaCarteiraSemAporte { get; private set; }
        public Portfolio NovaCarteiraComAporte { get; private set; }
        public Portfolio CarteiraBalanceada { get; private set; }
        public Portfolio AporteDistribuido { get; private set; }

        public BalanceamentoCarteira(Composicao composicao, double aporte)
        {
            if (composicao == null) throw new ArgumentNullException(nameof(composicao));
            CarteiraAtual = composicao.Saldo.Clone();
            PercentualComposicao = composicao.Percentual;
            Aporte = aporte;
        }

        public void Execute()
        {
            AporteDistribuido = DistribuiAporte(Aporte);

            double carteiraTotalSemAporte = CarteiraAtual.Total();
            double carteiraTotalComAporte = carteiraTotalSemAporte + Aporte;

            NovaCarteiraSemAporte = CalculaPosicaoSemAporte(carteiraTotalSemAporte);
            NovaCarteiraComAporte = CalculaPosicaoComAporte(carteiraTotalComAporte);

            CarteiraBalanceada = Balanceia();
        }

        private Portfolio DistribuiAporte(double aporte)
        {
            return new Portfolio
            {
                Oportunidade = aporte * (PercentualComposicao.Oportunidade / 100.0),
                FundoImobiliario = aporte * (PercentualComposicao.FundoImobiliario / 100.0),
                Acoes = aporte * (PercentualComposicao.Acoes / 100.0),
                Risco = aporte * (PercentualComposicao.Risco / 100.0)
            };
        }

        private Portfolio CalculaPosicaoSemAporte(double carteiraTotalSemAporte)
        {
            return new Portfolio
            {
                Oportunidade = carteiraTotalSemAporte * (PercentualComposicao.Oportunidade / 100.0),
                FundoImobiliario = carteiraTotalSemAporte * (PercentualComposicao.FundoImobiliario / 100.0),
                Acoes = carteiraTotalSemAporte * (PercentualComposicao.Acoes / 100.0),
                Risco = carteiraTotalSemAporte * (PercentualComposicao.Risco / 100.0)
            };
        }

        private Portfolio CalculaPosicaoComAporte(double carteiraTotalComAporte)
        {
            return new Portfolio
            {
                Oportunidade = carteiraTotalComAporte * (PercentualComposicao.Oportunidade / 100.0),
                FundoImobiliario = carteiraTotalComAporte * (PercentualComposicao.FundoImobiliario / 100.0),
                Acoes = carteiraTotalComAporte * (PercentualComposicao.Acoes / 100.0),
                Risco = carteiraTotalComAporte * (PercentualComposicao.Risco / 100.0)
            };
        }

        private Portfolio Balanceia()
        {
            double saldoAporte = Aporte;
            int qtdSaldoCalculado = 0;
            var faixaCalculada = new System.Collections.Generic.List<string>();

            var carteiraBalanceada = CarteiraAtual.Clone();

            // 0: oportunidade
            if (carteiraBalanceada.Oportunidade + AporteDistribuido.Oportunidade < NovaCarteiraComAporte.Oportunidade)
            {
                carteiraBalanceada.Oportunidade = CarteiraAtual.Oportunidade + AporteDistribuido.Oportunidade;
                saldoAporte -= AporteDistribuido.Oportunidade;
                qtdSaldoCalculado++;
                faixaCalculada.Add("oportunidade");
            }
            else if (NovaCarteiraComAporte.Oportunidade > carteiraBalanceada.Oportunidade)
            {
                double saldoCalculado = NovaCarteiraComAporte.Oportunidade - carteiraBalanceada.Oportunidade;
                carteiraBalanceada.Oportunidade = CarteiraAtual.Oportunidade + saldoCalculado;
                saldoAporte -= saldoCalculado;
                qtdSaldoCalculado++;
                faixaCalculada.Add("oportunidade");
            }

            // 1: fundoImobiliario
            if (carteiraBalanceada.FundoImobiliario + AporteDistribuido.FundoImobiliario < NovaCarteiraComAporte.FundoImobiliario)
            {
                carteiraBalanceada.FundoImobiliario = CarteiraAtual.FundoImobiliario + AporteDistribuido.FundoImobiliario;
                saldoAporte -= AporteDistribuido.FundoImobiliario;
                qtdSaldoCalculado++;
                faixaCalculada.Add("fundoImobiliario");
            }
            else if (NovaCarteiraComAporte.FundoImobiliario > carteiraBalanceada.FundoImobiliario)
            {
                double saldoCalculado = NovaCarteiraComAporte.FundoImobiliario - carteiraBalanceada.FundoImobiliario;
                carteiraBalanceada.FundoImobiliario = CarteiraAtual.FundoImobiliario + saldoCalculado;
                saldoAporte -= saldoCalculado;
                qtdSaldoCalculado++;
                faixaCalculada.Add("fundoImobiliario");
            }

            // 2: acoes
            if (carteiraBalanceada.Acoes + AporteDistribuido.Acoes < NovaCarteiraComAporte.Acoes)
            {
                carteiraBalanceada.Acoes = CarteiraAtual.Acoes + AporteDistribuido.Acoes;
                saldoAporte -= AporteDistribuido.Acoes;
                qtdSaldoCalculado++;
                faixaCalculada.Add("acoes");
            }
            else if (NovaCarteiraComAporte.Acoes > carteiraBalanceada.Acoes)
            {
                double saldoCalculado = NovaCarteiraComAporte.Acoes - carteiraBalanceada.Acoes;
                carteiraBalanceada.Acoes = CarteiraAtual.Acoes + saldoCalculado;
                saldoAporte -= saldoCalculado;
                qtdSaldoCalculado++;
                faixaCalculada.Add("acoes");
            }

            // 3: risco
            if (carteiraBalanceada.Risco + AporteDistribuido.Risco < NovaCarteiraComAporte.Risco)
            {
                carteiraBalanceada.Risco = CarteiraAtual.Risco + AporteDistribuido.Risco;
                saldoAporte -= AporteDistribuido.Risco;
                qtdSaldoCalculado++;
                faixaCalculada.Add("risco");
            }
            else if (NovaCarteiraComAporte.Risco > carteiraBalanceada.Risco)
            {
                double saldoCalculado = NovaCarteiraComAporte.Risco - carteiraBalanceada.Risco;
                carteiraBalanceada.Risco = CarteiraAtual.Risco + saldoCalculado;
                saldoAporte -= saldoCalculado;
                qtdSaldoCalculado++;
                faixaCalculada.Add("risco");
            }

            return carteiraBalanceada;
        }
    }
}
