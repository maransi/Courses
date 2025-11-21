using System;
using System.Globalization;

namespace BalanceamentoCarteiraApp
{
    class Program
    {
        static void Main(string[] args)
        {
            var carteiraAtual = new Portfolio
            {
                Oportunidade = 54123,
                FundoImobiliario = 255341,
                Acoes = 87163,
                Risco = 49985
            };

            var composicao = new Composicao
            {
                Percentual = new PercentualComposicao
                {
                    Oportunidade = 10,
                    FundoImobiliario = 60,
                    Acoes = 20,
                    Risco = 10
                },
                Saldo = carteiraAtual
            };

            double saldoCarteiraInicial = carteiraAtual.Total();
            double aporte = 328916; // valor do aporte

            Console.WriteLine("Aporte: " + aporte.ToString("C", new CultureInfo("pt-BR")));

            BalanceamentoCarteira balanceamento = null;
            double saldoCarteiraBalanceada = saldoCarteiraInicial;

            // Replicar o loop do JS -- cuidado com loops infinitos em casos extremos
            int safety = 0;
            while (aporte > 0.001 && safety < 1000)
            {
                balanceamento = new BalanceamentoCarteira(composicao, aporte);
                balanceamento.Execute();

                saldoCarteiraBalanceada = balanceamento.CarteiraBalanceada.Total();

                double diferenca = saldoCarteiraBalanceada - saldoCarteiraInicial;
                aporte -= diferenca;

                saldoCarteiraInicial = saldoCarteiraBalanceada;
                composicao.Saldo = balanceamento.CarteiraBalanceada;

                safety++;
            }

            if (balanceamento == null)
            {
                Console.WriteLine("Nenhuma simulação realizada.");
                return;
            }

            var ci = new CultureInfo("pt-BR");

            Console.WriteLine("\nCarteira Atual:");
            Console.WriteLine($"Oportunidade: {composicao.Saldo.Oportunidade.ToString("C", ci)}");
            Console.WriteLine($"Fundo Imobiliário: {composicao.Saldo.FundoImobiliario.ToString("C", ci)}");
            Console.WriteLine($"Ações: {composicao.Saldo.Acoes.ToString("C", ci)}");
            Console.WriteLine($"Risco: {composicao.Saldo.Risco.ToString("C", ci)}");
            Console.WriteLine($"Saldo da Carteira: {saldoCarteiraBalanceada.ToString("C", ci)}");

            Console.WriteLine("\nResultado da Simulação:");
            Console.WriteLine($"Total Aportado Restante (aprox): {aporte.ToString("C", ci)}");
            Console.WriteLine($"Percentual composição (aprox):\n  Oportunidade: {(composicao.Saldo.Oportunidade / saldoCarteiraBalanceada * 100.0).ToString("F2")} %\n  Fundo Imobiliário: {(composicao.Saldo.FundoImobiliario / saldoCarteiraBalanceada * 100.0).ToString("F2")} %\n  Ações: {(composicao.Saldo.Acoes / saldoCarteiraBalanceada * 100.0).ToString("F2")} %\n  Risco: {(composicao.Saldo.Risco / saldoCarteiraBalanceada * 100.0).ToString("F2")} %");

            Console.WriteLine("\nNovo aporte por classe (diferença em relação à carteira inicial):");
            // Note: Utiliza valores do primeiro 'carteiraAtual' inicial usado antes do loop
            // Para simplificar, mostramos a diferença entre carteira balanceada final e carteira inicial definida no topo
            // Se desejar um relatório mais detalhado, podemos armazenar o estado inicial antes do loop.

            Console.WriteLine($"Oportunidade: {(balanceamento.CarteiraBalanceada.Oportunidade - 54123).ToString("C", ci)}");
            Console.WriteLine($"Fundo Imobiliário: {(balanceamento.CarteiraBalanceada.FundoImobiliario - 255341).ToString("C", ci)}");
            Console.WriteLine($"Ações: {(balanceamento.CarteiraBalanceada.Acoes - 87163).ToString("C", ci)}");
            Console.WriteLine($"Risco: {(balanceamento.CarteiraBalanceada.Risco - 49985).ToString("C", ci)}");
        }
    }
}
