# Filtro Adaptativo

## 1. Introdução à proposta

A microinterface propõe a construção de um filtro adaptativo interativo para análise de crédito, permitindo visualizar como diferentes variáveis financeiras impactam diretamente na decisão da liberação do limite do cartão pré-aprovado.

A aplicação foi desenvolvida utilizando HTML, CSS, JavaScript e a biblioteca p5.js, com foco em fornecer uma interface visual simples e dinâmica para exploração dos parâmetros da função objetivo.

O sistema permite alterar em tempo real:

* **t** → prazo do empréstimo (anos)
* **ū** → taxa média de juros
* **LGD** → perda dado default
* **L_k** → valor do empréstimo por segmento

Cada alteração atualiza instantaneamente:

* o retorno unitário do segmento (**c_k**)
* a contribuição financeira de cada grupo
* o valor total da função objetivo da carteira

A proposta busca transformar um modelo matemático abstrato em uma ferramenta visual e intuitiva para apoio à tomada de decisão financeira.

---

## 2. Rascunhos iniciais

<img src="esboco.jpg" width=80%>

Durante o desenvolvimento, a ideia inicial era criar uma interface minimalista que destacasse apenas os elementos essenciais da análise:

* seleção da variável ativa
* controle por slider interativo

Mas, após a conversa com você percebi alguns erros e adicionei:

* visualização em tempo real da função objetivo
* tabela comparativa dos segmentos


A estrutura foi dividida em três partes principais:

1. **Painel de controle**

   * seleção da variável analisada

2. **Slider interativo**

   * ajuste visual dos parâmetros usando p5.js

3. **Tabela dinâmica**

   * atualização automática dos impactos financeiros


---

## 3. Registro do resultado obtido

<img src="image.png" width=80% >

--- 

O resultado final foi uma mini interface interativa capaz de simular diferentes cenários de crédito.

Entre os principais resultados alcançados:

* Interface responsiva e limpa
* Atualização instantânea dos cálculos
* Destaque visual da variável ativa
* Representação gráfica intuitiva
* Visualização simultânea de todos os segmentos da carteira



O slider implementado com p5.js oferece uma forma visual de compreender o impacto de pequenas alterações nos parâmetros financeiros da carteira.

Além disso, o sistema facilita a identificação de cenários viáveis, como:

* combinações de juros e prazo que mantêm retorno positivo
* limites de empréstimo sustentáveis
* segmentos com maior impacto no resultado final
