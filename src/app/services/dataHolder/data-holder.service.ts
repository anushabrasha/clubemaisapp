import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataHolderService {

  constructor() { }

  urlHolder = {
    'politica': 'https://www.sky.com.br/politica-de-privacidade',
  };

  appRatingInfo = {
    title: "Você se importaria de avaliar %@?",
    message: "SUA OPINIÃO FAZ UM CLUBE MELHOR Ajude-nos a melhorar cada vez mais o Clube SKY. É super rápido!",
    cancelButtonLabel: "Não, obrigado",
    laterButtonLabel: "Lembre-me mais tarde",
    rateButtonLabel: "Avalie-o agora",
    yesButtonLabel: "Sim!",
    noButtonLabel: "Na verdade",
    appRatePromptTitle: 'Você gosta de usar %@',
    feedbackPromptTitle: 'Se importe em nos dar algum feedback?',
  };

  endPoints = {
    'registerUser': 'scit/v1/user',
    'apiRating': 'scit/v1/user/app/rating',
    'updateUser': 'scit/v1/user/update',
    'accessPageStep1': 'scit/v1/validate/user',
    'login': 'scit/app/v1/login',
    'vantagens': 'scit/v1/vantagens/list',
    'redirectVantagens': 'scit/v1/vantagens/redirect',
    'forgetPassword': 'scit/app/v1/forget-password/',
    'notification': "scit/v1/notification/list",
    'notificationRead': 'scit/v1/notification/update',
    'setting': 'scit/v1/app/settings',
    'regulamento': 'scit/v1/app/regulamento',
    'regulamentoAccept': 'scit/v1/user/lgpd/rules',
    'performance': 'scit/v1/reports/dash',
    'performanceConstelacao': 'scit/v1/reports/dash/constelacao',
    'news': 'scit/v1/news/list',
    'like': 'scit/v1/post/emoji',
    'missionList': 'scit/v1/mission/list',
    'missionUpdate': 'scit/v1/post/achievement',
    'featuredProduct': 'scit/v1/products/featured',
    'category': 'scit/v1/categories',
    'order': 'scit/v1/order',
    'product': 'scit/v1/product',
    'productList': 'scit/v1/products',
    'orderList': 'scit/v1/orders',
    'productAvalibility': 'scit/v1/check/product/availability',
    'aprendaCategory': 'v1/sfwd-courses',
    'checkBarcode': 'scit/v1/site/check/barcode',
    'barcodeCreate': 'scit/v1/site/account/create',
    'recharge': 'scit/v1/site/recharge',
    'extrato': 'scit/v1/extrato',
    'history': 'scit/v1/contact/history',
    'faleConosco': 'contact-form-7/v1/contact-forms/5/feedback',
    'gifftyFrete': 'scit/v1/giftty/cart',
    'cnovaFrete': 'scit/v1/cnova/cart',
    'faq': 'scit/v1/faq',
    'playerId': 'scit/v1/user/playerid',
    'periodList': 'scit/v1/reports/filter/periodo/',
    'defaltPeriodList': 'scit/v1/reports/filter/default-periodo/',
    'achievement': 'scit/v1/post/achievement',
    'achievementAdmin': 'scit/v1/post/achievement/admin',
    'comment': 'scit/v1/post/comment',
    'emoji': 'scit/v1/post/emoji',
    'commentLike': 'scit/v1/post/comment/emoji',
    'deleteComment': "scit/v1/post/comment",
    'seloes': 'scit/v1/selos/list',
    'extraUserInfo': 'scit/v1/post/timeline/userinfo',
    'missionStatus': 'scit/v1/mission/dashboard/stage',
    'selosCount': 'scit/v1/reports/dash/selos_count',
    'courseCount': 'scit/v1/reports/dash/course_count',
    'program': 'scit/v1/app/oprograma',
    'removeAccount': 'scit/app/v1/remove/account',
    'getOtpProfile': 'scit/v1/user/confirmation',
    'getOtpCheckout': 'scit/v1/user/order/confirmation',
    'newsRead': 'scit/v1/post/read-status',
  };

  principalRoleList = [
    'VENDEDOR',
    'VENDEDOR INTERNO',
    'OPERADOR DE TELEVENDAS',
    'SUPERVISOR DE VENDAS',
    'SUPERVISOR DE TELEVENDAS',
    'TÉCNICO',
    'SUPERVISOR TÉCNICO',
    'TORRE, ALMOXARIFE',
    'SUPERVISOR DE VENDAS DISTRIBUIDOR',
    'GERENTE DISTRIBUIDOR',
    'TORRE DISTRIBUIDOR',
    'ALMOXARIFE DISTRIBUIDOR'
  ]

  gerenteRoleList = [
    'GERENTE REGIONAL SERVIÇOS SKY',
    'GERENTE REGIONAL VENDAS SKY',
    'GERENTE CANAL REMOTO SKY'
  ]

  monthArray = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  fullMonths = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  regulamentoTheory =
    "<h2 class='has-text-align-left has-text-align-center title-white'>REGULAMENTO GERAL</h2>" +
    "<h3 class='has-text-align-center'> <strong>PROGRAMA DE RELACIONAMENTO CLUBE SKY</strong></h3>" +
    "<p> <strong>CLUBE SKY </strong>é um Programa de Relacionamento realizado pela <strong>SKY SERVIÇOS DE BANDA LARGA LTDA. (“SKY”)</strong>, sediada na Avenida das Nações Unidas, 12901, Torre Norte, 14º andar, Brooklin, CEP 04578-000, São Paulo/SP, inscrita no CNPJ nº. 00.497.373/0001-10.</p>" +
    "<p></p>" +
    "<h3> <strong>PARTICIPANTES ELEGÍVEIS</strong></h3>" +
    "<p> 1.1. Poderão participar do Programa <strong>CLUBE SKY</strong> todos os colaboradores vinculados aos Parceiros Comerciais <strong>CREDENCIADOS</strong>, cuja atividade predominante seja de:</p>" +
    "<p> <strong>1.1.1</strong>. VENDEDOR</p>" +
    "<p> <strong>1.1.2.</strong> TELEVENDAS</p>" +
    "<p> <strong>1.1.3.</strong> SUPERVISOR DE VENDAS</p>" +
    "<p> <strong>1.1.4.</strong> SUPERVISOR DE TELEVENDAS</p>" +
    "<p> <strong>1.1.5.</strong> TÉCNICO</p>" +
    "<p> <strong>1.1.6.</strong> SUPERVISOR TÉCNICO</p>" +
    "<p> <strong>1.1.7.</strong> TORRE</p>" +
    "<p> <strong>1.1.8.</strong> ALMOXARIFE</p>" +
    "<p> <strong>1.1.9.</strong> RETIRADOR</p>" +
    "<p> <strong>1.1.10.</strong> PROPRIETÁRIO</p>" +
    "<p> <strong>TERMOS DO PROGRAMA DE </strong><strong>PONTOS </strong>– Denominação dos <strong>PONTOS </strong>acumulados/obtidos no Programa;</p>" +
    '<p> <strong>PRÊMIO(S) </strong>– Produtos e/ou Serviços disponibilizados para o resgate de <strong>PONTOS </strong>no <strong>CLUBE SKY </strong>por meio do App ou dosite <a href="http://www._______________.com.br/">www._______________.com.br</a>;</p>' +
    "<p> <strong>CREDENCIADO(S) – </strong>Parceiro(s) comercial(is) atuante(s) na comercialização e representação dos produtos e serviços produzidos, fornecidos e distribuídos pela <strong>SKY</strong>;</p>" +
    "<p> <strong>MISSÕES</strong> – iniciativas pontuais, que serão divulgadas ocasionalmente no site e no App, na área logada, em que os<strong>PARTICIPANTES ELEGÍVEIS</strong> poderão ter pontuação extra; e,</p>" +
    "<p> <strong>APRENDA + </strong>– pílulas de treinamento, que poderão ter pontuação extra.</p>" +
    "<h3>2. <strong>DO PRAZO DE DURAÇÃO DO PROGRAMA E DO INÍCIO DA CONTAGEM DOS PONTOS</strong> </h3>" +
    "<p><strong>2.1.</strong> O programa <strong>CLUBE SKY </strong>se iniciará em __de ____de 2020 e terá vigência até ___de ______de 20__, sendo certo que o resgate de <strong>PONTOS </strong>poderá ser feito até 30 (trinta) dias após o seu encerramento. </p>" +
    "<p><strong>2.2.</strong> As inscrições poderão ser feitas, pelo público elegível a qualquer momento, sendo certo que a contagem dos <strong>PONTOS </strong>será contabilizada apenas após a confirmação do cadastro pelo <strong>PARTICIPANTE ELEGÍVEL</strong>. </p>" +
    "<h3>3. <strong>OBJETIVOS DO PROGRAMA CLUBE SKY</strong> </h3>" +
    "<p> <strong>3.1.</strong> Reconhecer e valorizar o desempenho da Rede Credenciada da SKY, por meio de incentivos e concessão de recompensas.</p>" +
    "<p> <strong>3.2.</strong> O incentivo se dará não apenas pela disponibilização de novos métodos de ampliação do conhecimento, como também por meio de premiação dos <strong>PARTICIPANTES ELEGÍVEIS</strong> das Empresas Credenciadas, que atenderem os requisitos e critérios de participação do <strong>CLUBE SKY </strong>com <strong>PONTOS</strong> que são cumulativos por período determinado e podem ser resgatados por <strong>PRÊMIOS</strong> durante o prazo de vigência do programa <strong>CLUBE SKY</strong>.</p>" +
    "<p> <strong>3.3.</strong> As empresas credenciadas serão elegíveis enquanto mantiverem vínculo contratual com a <strong>SKY</strong>, perdendo direito aos <strong>PONTOS</strong> e acesso a plataforma imediatamente na forma deste Regulamento em caso de descredenciamento por qualquer motivo.</p>" +
    "<p><strong> 3.4.</strong> Após o término do contrato de trabalho com as empresas Credenciadas, o <strong>PARTICIPANTE </strong>terá o prazo de 30 (trinta) dias para resgatar seus <strong>PONTOS</strong>, ao final do qual, se não utilizado, sua conta será encerrada e os <strong>PONTOS </strong>retirados.</p>" +
    "<p> <strong>3.5.</strong> O PROGRAMA tem por meta o incentivo da Rede Credenciada da SKY mediante recompensa no acúmulo de <strong>PONTOS</strong>, sem qualquer relação de subordinação e/ou ingerência entre a <strong>SKY</strong> e os <strong>PARTICIPANTES</strong>, sendo certo que o presente Programa não vincula qualquer relação trabalhista entre os colaboradores dos <strong>CREDENCIADOS</strong> envolvidos e a <strong>SKY</strong>, constituindo as premiações tão somente um incentivo para comercialização de seus produtos e integração com a Rede Credenciada. </p>" +
    "<h3>4. <strong>DA INSCRIÇÃO</strong> </h3>" +
    "<p><strong>4.1.</strong>  Ao participar do programa <strong>CLUBE SKY</strong>,os <strong>PARTICIPANTES ELEGÍVEIS </strong>declaram expressamente de forma irretratável e irrevogável que conhecem e estão de acordo com todas as cláusulas e condições deste Regulamento e seu Anexo. </p>" +
    "<p><strong>4.2.</strong>  A participação poderá ser realizada da seguinte maneira: </p>" +
    "<p><strong>4.3.</strong>  <strong>Inscrição realizada pelo PARTICIPANTES ELEGÍVEIS</strong> – o <strong>PARTICIPANTE </strong>deverá acessar o App <strong>CLUBE SKY</strong> ou o site <a href='http://www.__________________.com.br/'>www.__________________.com.br</a>, e no primeiro acesso informar seu CPF e ID, que, se confirmado, carregará automaticamente seus dados. O <strong>PARTICIPANTE </strong>poderá editar e-mail e celular, optando ainda por receber o link de criação de sua senha via e-mail, celular, ou através de ambos os meios para finalizar seu cadastro. </p>" +
    "<p><strong>4.4</strong>  Os <strong>PARTICIPANTES </strong>asseguram a veracidade das informações prestadas no momento do cadastro e se responsabilizam, em qualquer hipótese, por eventual preenchimento indevido. </p>" +
    "<p><strong>4.5</strong>  A <strong>SKY</strong> não poderá ser responsabilizada por quaisquer problemas técnicos comuns em ambiente de internet, incluindo, mas não se limitando, ao mau funcionamento do sistema, decorrentes de conexão ou de limitação de provedores/servidores, que possam prejudicar temporariamente o acesso à inscrição ou culminem em divergências de informações no registro/verificação de pontuação e cadastro, informando a <strong>SKY</strong>, oportunamente, através de seu site e/ou do aplicativo do Programa, a eventual ocorrência de tais erros, bem como as informações eventualmente afetadas que deverão ser retificadas.  </p>" +
    "<h3>5.  <strong>DA ELEGIBILIDADE</strong> </h3>" +
    "<p><strong>5.1.</strong>  Participam deste Programa todos os colaboradores descritos no item 1.1.1 a 1.1.10, acima. Outros <strong>PARTICIPANTES ELEGÍVEIS</strong> poderão ser incluídos oportunamente, mediante termo aditivo ao presente regulamento. </p>" +
    "<p><strong>5.2.</strong>  Não poderão participar deste Programa: <strong>PARTICIPANTES </strong>parentes em primeiro grau ou cônjuges dos sócios das Empresas Credenciadas em que atuam. </p>" +
    "<h3>6.  <strong>DA PARTICIPAÇÃO</strong> </h3>" +
    "<p> Como acumular pontuação:</p>" +
    "<p><strong>6.1. </strong> Os <strong>PONTOS</strong> serão somados individualmente na conta de cada <strong>PARTICIPANTE </strong>de acordo com sua produtividade no desenvolvimento das tarefas inerentes a sua função junto ao <strong>CREDENCIADO</strong>. </p>" +
    "<p><strong>6.2.</strong>  A quantificação dos <strong>PONTOS </strong>está prevista no Anexo I integrante deste Regulamento, denominado “Indicadores de Premiação”, onde haverá a conversão de acordo com a função desempenhada por cada <strong>PARTICIPANTE</strong>. </p>" +
    "<p><strong>6.3.</strong>  Os perfis <strong>PARTICIPANTES </strong>serão avaliados de acordo com indicadores contidos no Anexo “Indicadores de Premiação” e serão premiados com <strong>PONTOS </strong>na plataforma os perfis descritos nos Itens 1.1.1 a 1.1.10. </p>" +
    "<p><strong>6.4.</strong>  Serviços realizados em desacordo com a política de atendimento ao consumidor da <strong>SKY</strong> poderão ter sua pontuação não lançada ou descontada. </p>" +
    "<p><strong>6.5.</strong>  Poderá haver o lançamento de <strong>MISSÕES </strong>e pílulas de treinamento na área do<strong> APRENDA+</strong> com o estabelecimento de metas, que se cumpridas, oferecerão pontuação extra.  </p>" +
    "<h3>7.  <strong>DOS PRÊMIOS E DAS CONDIÇÕES DE RESGATE</strong>  </h3>" +
    "<p><strong>7.1.</strong>  As descrições detalhadas dos <strong>PRÊMIOS</strong> disponíveis, bem como a quantidade de <strong>PONTOS</strong> necessária para o resgate de cada <strong>PRÊMIO </strong>estarão disponíveis para consulta no App e publicadas no site <a href='http://www.______________.com.br/'>www.______________.com.br</a> em área específica para consulta denominada extrato e resgate. </p>" +
    "<p><strong>7.2. </strong> O <strong>PARTICIPANTE ELEGÍVEL </strong>deverá fazer o pedido de resgate pelo App ou pelo site <a href='http://www._____________.com.br/'>www._____________.com.br</a>, no qual receberá a mensagem de confirmação e a informação de situação de seu saldo de <strong>PONTOS</strong>. O prazo de entrega dessa premiação varia de acordo com a condição comercial de cada produto, com prazo limite de 45 (quarenta e cinco) dias. </p>" +
    "<p><strong>7.3.</strong>  O <strong>PARTICIPANTE </strong>poderá efetuar as trocas de <strong>PONTOS</strong> pelos <strong>PRÊMIOS</strong>, nas condições definidas neste regulamento, sendo observada sempre a disponibilidade dos <strong>PRÊMIOS</strong> e prazo de entrega no momento do resgate (dia, hora e minuto). </p>" +
    "<p> <strong>7.3.1.</strong> O valor do resgate dos <strong>PRÊMIOS</strong> poderá ser alterado a qualquer momento, sempre  a critério exclusivo da SKY.</p>" +
    "<p> <strong>7.3.2.</strong> Será permitida a troca dos <strong>PONTOS</strong> por produtos, com a complementação do pagamento, em caso de insuficiência de <strong>PONTOS</strong>, com dinheiro, caso em que, será exigível em cada transação o valor mínimo de 10% (dez por cento) em <strong>PONTOS</strong>.</p>" +
    "<p><strong>7.4.</strong>  Caso o <strong>PRÊMIO </strong>escolhido não esteja mais disponível por ter ocorrido simultaneidade de resgates, o <strong>PARTICIPANTE ELEGÍVEL </strong>não terá seus <strong>PONTOS </strong>debitados e o resgate não será considerado realizado. </p>" +
    "<p><strong>7.5.</strong>  A entrega dos <strong>PRÊMIOS</strong> e serviços escolhidos quando do resgate dos <strong>PONTOS</strong>, será de total e exclusiva responsabilidade do Fornecedor, ficando a <strong>SKY </strong>e suas Parceiras isentas de qualquer tipo de responsabilidade por vícios e defeitos de qualidade e/ou quantidade do produto, bem como do prazo de entrega e/ou fruição. </p>" +
    "<p><strong>7.6.</strong>  Eventual dúvida ou problema decorrente da entrega e/ou qualidade dos <strong>PRÊMIOS</strong> e benefícios deverão ser sanados pelo <strong>PARTICIPANTE </strong>diretamente junto ao Fornecedor escolhido, ficando a Realizadora isenta de qualquer responsabilidade neste sentido. </p>" +
    "<p><strong>7.7.</strong>  Em caso de constatação de quaisquer irregularidades ou defeitos nos <strong>PRÊMIOS</strong> que não tenham sido sanadas pelos Fornecedores escolhidos pelo <strong>PARTICIPANTE </strong>na forma prevista no item 7.6, a reclamação deverá ser dirigida à <strong>MM12</strong>,  através dos seguintes canais: _____________, que poderá, após o recebimento do produto e constatação de defeito insanável, deliberar sobre a devolução dos <strong>PONTOS</strong>. </p>" +
    "<p><strong>7.8. </strong> O resgate dos <strong>PRÊMIOS</strong> se dará por ordem de chegada dos pedidos, conforme dia, hora e minuto do registro. </p>" +
    "<h3>8.  <strong>DAS INFORMAÇÕES DE SALDOS DE PONTOS E DISPONIBILIDADE DOS PRÊMIOS NO SITE SKY</strong> </h3>" +
    "<p><strong>8.1. </strong> Todas as informações referentes à relação de <strong>PRÊMIOS</strong>, disponibilidade, alteração ou substituição dos <strong>PRÊMIOS</strong>, quantidades de <strong>PONTOS </strong>acumulados, extrato dos <strong>PONTOS </strong>concedidos a cada <strong>PARTICIPANTE ELEGÍVEL</strong>, expiração de <strong>PONTOS</strong>, e demais informações estarão disponíveis no site <a href='http://www.___________.com.br/'>www.___________.com.br</a>. </p>" +
    "<p><strong>8.2.</strong>  Os <strong>PONTOS </strong>serão disponibilizados na plataforma após o período de fechamento Comercial, que ocorre, aproximadamente entre os dias 10 e 15 do mês subsequente. Ex: Pontuação referente às vendas do mês de MAIO serão disponibilizadas entre os dias 10 e 15 de JUNHO. Fica reservado à SKY o direito de, a qualquer momento e por qualquer motivo, estender esse período, nesse caso incluindo uma comunicação nas plataformas digitais do Programa. </p>" +
    "<h3>9. <strong>DO PRAZO DE RESGATE DOS PRÊMIOS</strong> </h3>" +
    "<p><strong>9.1.</strong>  No caso de cancelamento do <strong>CLUBE SKY </strong>por caso fortuito, força maior ou término da vigência do<strong> Programa</strong>, o <strong>PARTICIPANTE ELEGÍVEL </strong>poderá resgatar <strong>PRÊMIOS</strong> com seus <strong>PONTOS </strong>acumulados, até 30 (trinta) dias após o comunicado de encerramento do Programa<strong>.</strong> </p>" +
    "<h3>10. <strong>DA DIVULGAÇÃO E DA COMUNICAÇÃO AO PÚBLICO ELEGÍVEL</strong> </h3>" +
    "<p><strong>10.1.</strong>  A comunicação do <strong>CLUBE SKY </strong>será realizada por meio dos seguintes meios: App, cujo download poderá ser realizado nas lojas próprias mantidas pelos fabricantes das tecnologias disponíveis, no site <a href='http://www.__________.com.br/'>www.__________.com.br</a>, ou ainda, via e-mail cadastrado, SMS ou outra forma utilizada pela SKY. </p>" +
    "<h3>11.  <strong>DA CESSÃO DE DIREITO DE IMAGEM</strong> </h3>" +
    "<p><strong>11.1.</strong> O<strong> PARTICIPANTE ELEGÍVEL</strong> contemplado com os <strong>PONTOS </strong>e com o resgate ao(s) <strong>PRÊMIO(S</strong> autoriza e cede à <strong>SKY</strong>, gratuitamente, o direito de uso de seu nome, voz e imagem para a utilização em todas as mídias: impressas; redes sociais; e eletrônica (cartazes, folhetos, fotos, filmes, spots, peças promocionais, etc.), para a divulgação interna do <strong>CLUBE SKY</strong>, sem nenhum ônus e por todo o tempo de vigência do <strong>CLUBE SKY</strong>, e até 24 (vinte e quatro) meses após o encerramento do programa. </p>" +
    "<h3>12. <strong>DAS SITUAÇÕES ESPECIAIS</strong> </h3>" +
    "<p><strong>12.1.</strong>  Os <strong>PONTOS </strong>acumulados pelo <strong>PARTICIPANTE ELEGÍVEL </strong>são pessoais e intransferíveis.  </p>" +
    "<p><strong>12.2. </strong> Entende-se por utilização do programa o resgate, ou seja, a troca de <strong>PONTOS </strong>por qualquer <strong>PRÊMIO </strong>ou serviço no <strong>CLUBE SKY</strong>. </p>" +
    "<p><strong>12.3. </strong> Todas as dúvidas, divergências ou situações, que não estejam previstas no Regulamento do <strong>CLUBE SKY</strong>, serão julgadas e decididas de forma soberana e irrevogável, pela Comissão Julgadora do Programa. </p>" +
    "<p><strong>12.4.</strong>  A <strong>SKY </strong>poderá alterar quaisquer cláusulas, requisitos e condições deste Regulamento do <strong>CLUBE SKY </strong>e seu Anexo, a qualquer momento e o Público elegível será devidamente informado com no mínimo 30 (trinta) dias de antecedência, na forma prevista no item 10.1. </p>" +
    "<h3>13. <strong>DA VALIDADE DO PROGRAMA</strong> </h3>" +
    "<p><strong>13.1.</strong>  O Programa terá validade durante o prazo lançado na Cláusula 2, acima. </p>" +
    "<p><strong>13.2</strong>.  A SKY reserva-se o direito de, a qualquer momento, encerrar o Programa, mediante prévio aviso, com antecedência de 60 (sessenta) dias, garantindo ao <strong>PARTICIPANTE ELEGÍVEL</strong> o direito de resgatar seus <strong>PONTOS</strong> acumulados, por <strong>PRÊMIOS</strong> constantes na última vitrine de <strong>PRÊMIOS</strong> vigente na data do comunicado de encerramento. Após este prazo todos os <strong>PONTOS</strong> acumulados e não utilizados perderão a validade. </p>" +
    "<h3>14. <strong>DAS CONDIÇÕES GERAIS</strong> </h3>" +
    "<p><strong>14.1.</strong>  Os <strong>PONTOS</strong> não poderão ser convertidos em dinheiro. </p>" +
    "<p><strong>14.2. </strong> Os <strong>PONTOS</strong> terão validade de 06 (seis) meses para resgate. Se não utilizados, expiram automaticamente. </p>" +
    "<p><strong>14.3. </strong> Havendo interrupção do programa por problemas de acesso à rede de Internet, intervenção de hackers, vírus, manutenção, queda de energia, falhas de software ou hardware, bem como por caso fortuito ou força maior, não será devida qualquer indenização. </p>" +
    "<p><strong>14.4.</strong>  Na hipótese de força maior ou caso fortuito poderão ser alteradas as datas e regras do presente programa. </p>" +
    "<p><strong>14.5.</strong>  Serão automaticamente excluídos os <strong>PARTICIPANTES ELEGÍVEIS</strong> que tentarem burlar ou fraudar as regras estabelecidas neste Regulamento, ou regras de trabalho SKY, ou ainda ajam a qualquer tempo, com violência, física ou verbal, falta de decoro, falta de urbanidade, ou, ainda, que cometerem qualquer tipo de suspeita de fraude, incluindo, mas não se limitando a, à criação, benefício e utilização de ferramentas automatizadas, ficando, ainda, sujeitos à responsabilização penal e civil. </p>" +
    "<p><strong>14.6</strong>.  A simples participação, com a efetivação da inscrição neste programa de <strong>PRÊMIOS</strong> <strong>CLUBE SKY</strong>, implica na aceitação e no inteiro conhecimento de todas as condições de direitos e de obrigações deste Regulamento.  </p>" +
    "<p><strong>14.7</strong>.  A Realizadora assume o compromisso de sigilo sob as informações prestadas, utilizando-as exclusivamente para crédito de pontuação aos <strong>PARTICIPANTES ELEGÍVEIS</strong> da presente ação e para relatórios gerenciais do Programa, limitando a manipulação e uso desses dados somente a colaboradores diretamente envolvidos com as atividades do Programa, sejam eles direta ou indiretamente ligados a <strong>SKY</strong>, sob pena de aplicação das leis vigentes no que tange o sigilo de informações. </p>" +
    "<p><strong>14.8. </strong> A <strong>SKY</strong> não se responsabilizará por eventuais prejuízos que os <strong>PARTICIPANTES </strong>possam ter, oriundos da participação na Campanha, da aceitação do <strong>PRÊMIO</strong>, ou ainda, de situações que estejam fora do seu controle. </p>" +
    "<p><strong>14.9</strong>.  O presente Regulamento estará disponível para consulta nas plataformas digitais do Programa, substituindo e revogando os eventuais regulamentos anteriormente registrados, para todos os fins e direitos que se fizerem necessários. </p>" +
    "<br><br>" +
    "<p> São Paulo, ___de fevereiro de 2020.</p>" +
    "<p>    <strong>SKY SERVIÇOS DE BANDA LARGA LTDA.</strong></p>";

  state = {
    "AC": "Acre",
    "AL": "Alagoas",
    "AM": "Amazonas",
    "AP": "Amapá",
    "BA": "Bahia",
    "CE": "Ceará",
    "DF": "Distrito Federal",
    "ES": "Espírito Santo",
    "GO": "Goiás",
    "MA": "Maranhão",
    "MG": "Minas Gerais",
    "MS": "Mato Grosso do Sul",
    "MT": "Mato Grosso",
    "PA": "Pará",
    "PB": "Paraíba",
    "PE": "Pernambuco",
    "PI": "Piauí",
    "PR": "Paraná",
    "RJ": "Rio de Janeiro",
    "RN": "Rio Grande do Norte",
    "RO": "Rondônia",
    "RR": "Roraima",
    "RS": "Rio Grande do Sul",
    "SC": "Santa Catarina",
    "SE": "Sergipe",
    "SP": "São Paulo",
    "TO": "Tocantins",
  };

  stateReversed = {
    "Acre": "AC",
    "Alagoas": "AL",
    "Amazonas": "AM",
    "Amapá": "AP",
    "Bahia": "BA",
    "Ceará": "CE",
    "Distrito Federal": "DF",
    "Espírito Santo": "ES",
    "Goiás": "GO",
    "Maranhão": "MA",
    "Minas Gerais": "MG",
    "Mato Grosso do Sul": "MS",
    "Mato Grosso": "MT",
    "Pará": "PA",
    "Paraíba": "PB",
    "Pernambuco": "PE",
    "Piauí": "PI",
    "Paraná": "PR",
    "Rio de Janeiro": "RJ",
    "Rio Grande do Norte": "RN",
    "Rondônia": "RO",
    "Roraima": "RR",
    "Rio Grande do Sul": "RS",
    "Santa Catarina": "SC",
    "Sergipe": "SE",
    "São Paulo": "SP",
    "Tocantins": "TO",
  };

  userRoles = {
    'almoxarife': 'Almoxarife',
    "customer": 'Customer',
    "vendedor": 'Vendedor',
    "televendas": 'Operador De Televendas',
    "supervisor_de_vendas": 'Supervisor De vendas',
    "supervisor_de_televendas": 'Supervisor De Televendas',
    "supervisor_tcnico": 'Supervisor Técnico',
    "torre": 'Torre',
    "retirador": 'Retirador',
    "proprietrio": 'Proprietário',
    "tecnico": 'Técnico',
    'vendedor_interno': 'Vendedor Interno',

    "vendedor_isp": "Vendedor ISP",
    "administrator": "ADMINISTRADOR",
    "admin_bo": "ADMIN BO",
    "tecnico_independente": "Técnico Independente",
    "tecnico_distribuidor": "Técnico - Distribuidor",
  };

  pageTitleHolder = {
    'game':
    {
      title: 'games',
      subTitle: 'mais aprendizado e diversão para você!',
      img: 'assets/images/background/new-game-banner.jpg'
    },
    'aprenda': {
      title: 'treinamentos',
      subTitle: 'conteúdo para fazer a diferença!',
      img: 'assets/images/background/new-aprenda-banner.jpg'
    },
    'mission': {
      title: 'DESAFIOS',
      subTitle: 'ainda mais chances de ganhar',
      img: 'assets/images/background/new-mission-banner.jpg'
    },
    'news': {
      title: 'fique por dentro',
      subTitle: 'acompanhe as novidades por aqui!',
      img: 'assets/images/background/new-news-banner.jpg'
    },
    'profile': {
      title: '<span>FAÇA </span>PARTE',
      subTitle: '',
      img: 'assets/images/background/new-minha-conta-banner.jpg'
    },
    'conta': {
      title: '<span>MINHA </span>CONTA',
      subTitle: '',
      img: 'assets/images/background/new-minha-conta-banner.jpg'
    },
    'selos': {
      title: 'selos',
      subTitle: 'colecione recompensas!',
      img: 'assets/images/background/new-selos–banner.jpg'
    },
    'regulamento': {
      title: 'regulamento',
      subTitle: '',
      img: 'assets/images/background/new-regulamento–banner.jpg'
    },
    'constelacao': {
      title: '<span>modelo de </span>remuneração',
      subTitle: '',
      img: 'assets/images/background/new-constellation-banner.jpg'
    },
    'extrato': {
      title: '<span>seu</span> extrato',
      subTitle: '',
      img: 'assets/images/background/new-extrato–banner.jpg'
    },
    'vantages': {
      title: 'clube de vantagens',
      subTitle: '',
      img: 'assets/images/background/new-clube-de-vantagens–banner.jpg'
    },
    'shop': {
      title: '<span>troque</span> seus pontos',
      subTitle: 'transformando performance em prêmios',
      img: 'assets/images/background/new-product-banner.jpg'
    },
    'fale-conoso': {
      title: '<span> fale </span>conosco',
      subTitle: '',
      img: 'assets/images/background/new-contact-banner.jpg'
    },
    'performance': {
      title: 'perfomance',
      subTitle: 'incentivos para toda a equipe!',
      img: 'assets/images/background/new-performance–banner.jpg'
    },
    'programas-de-reconhecimento': {
      title: '<span>programas de </span>  reconhecimento',
      img: 'assets/images/background/new-performance–banner.jpg'
    },
    'cart': {
      title: '<span>meu</span> carrinho',
      img: 'assets/images/background/new-product-banner.jpg'
    },
    'checkout': {
      title: 'troque seus pontos',
      img: 'assets/images/background/new-product-banner.jpg'
    },
    'orderList': {
      title: '<span>meus</span> pedidos',
      img: 'assets/images/background/new-product-banner.jpg'
    },
    'faq': {
      title: '<span>tire suas </span>dúvidas',
      subTitle: '',
      img: 'assets/images/background/new-faq-banner.jpg'
    },
  };

  // user based pages removed

  public defaultGamePages = [
    {
      title: 'Troque seus pontos',
      url: '/shop',
    },
    {
      title: 'Desafios',
      url: '/mission-page',
    },
    {
      title: 'Games',
      url: '/game-mission-page'
    },
    {
      title: 'Treinamentos',
      url: '/training-page',
    },
    {
      title: 'O Programa',
      url: '/program-page',
    },
    {
      title: 'Fique por Dentro',
      url: '/news-page',
    },
    {
      title: 'Fale Conosco',
      url: '/contact-page',
    },
    {
      title: 'Regulamento',
      url: '/regulamento-page',
    },
    {
      title: 'Política de Privacidade',
      url: '/',
      onClick: 'openPolitica'
    },
  ];


  public defaultPages = [
    {
      title: 'Troque seus pontos',
      url: '/shop',
    },
    {
      title: 'Desafios',
      url: '/mission-page',
    },
    {
      title: 'Fique por Dentro',
      url: '/news-page',
    },
    {
      title: 'Treinamentos',
      url: '/training-page',
    },
    {
      title: 'O Programa',
      url: '/program-page',
    },
    {
      title: 'Fale Conosco',
      url: '/contact-page',
    },
    {
      title: 'Regulamento',
      url: '/regulamento-page',
    },
    {
      title: 'Política de Privacidade',
      url: '/',
      onClick: 'openPolitica'
    },
  ];

  public errorAppPages = [];
  public errorUserPages = [
    {
      title: 'Sair',
      url: '/login-page',
      onClick: 'logOut'
    },
  ];
  // properito user pages removed
  // distributor user pages removed
  // resgate user pages removed

  // default matrix,retirator user pages removed

  public defaultUserPages = [
    {
      title: 'Minha conta',
      url: '/register-page/profile',
    },
    {
      title: 'Meus Pedidos',
      url: '/order-list',
    },
    {
      title: 'Extrato',
      url: '/extrato-page',
    },
    {
      title: 'Sair',
      url: '/login-page',
      onClick: 'logOut'
    },
  ];

}
